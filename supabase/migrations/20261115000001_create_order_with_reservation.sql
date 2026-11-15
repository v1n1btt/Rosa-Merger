CREATE OR REPLACE FUNCTION public.create_order_with_reservation(
    p_items JSONB,
    p_address_id BIGINT,
    p_idempotency_key TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    v_user_id UUID;
    v_address RECORD;
    v_item RECORD;
    v_product RECORD;

    v_order_id UUID;
    v_subtotal NUMERIC(10, 2) := 0;
    v_available_quantity INTEGER;
    v_item_count INTEGER;
    v_locked_count INTEGER;
BEGIN
    -- 1. Identificar o cliente autenticado.

    v_user_id := auth.uid();

    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Usuário não autenticado.';
    END IF;

    -- 2. Validar os parâmetros.

    IF p_items IS NULL
        OR jsonb_typeof(p_items) <> 'array'
        OR jsonb_array_length(p_items) = 0
        OR jsonb_array_length(p_items) > 50 THEN
            RAISE EXCEPTION 'Carrinho inválido.';
    END IF;

    IF p_address_id IS NULL THEN
        RAISE EXCEPTION 'Endereço de entrega obrigatório.';
    END IF;

    IF p_idempotency_key IS NULL
        OR length(trim(p_idempotency_key)) = 0
        OR length(p_idempotency_key) > 255 THEN
            RAISE EXCEPTION 'Chave de idempotência inválida.';
    END IF;

    -- 3. Impedir processamento simultâneo da mesma chave.

    PERFORM pg_catalog.pg_advisory_xact_lock(
        pg_catalog.hashtextextended(
            v_user_id::TEXT || ':' || p_idempotency_key,
            0
        )
    );

    -- Se a mesma operação já foi processada,
    -- retornar o pedido existente.

    SELECT id
    INTO v_order_id
    FROM public.orders
    WHERE idempotency_key = p_idempotency_key
    AND user_id = v_user_id;

    IF FOUND THEN
        RETURN jsonb_build_object(
            'success', TRUE,
            'order_id', v_order_id,
            'already_processed', TRUE
        );
    END IF;

    -- 4. Validar a estrutura dos itens.

    IF EXISTS (
        SELECT 1
        FROM jsonb_to_recordset(p_items)
        AS item("productId" BIGINT, quantity INTEGER)
        WHERE item."productId" IS NULL
            OR item."productId" <= 0
            OR item.quantity IS NULL
            OR item.quantity <= 0
    ) THEN
        RAISE EXCEPTION 'Produtos ou quantidades inválidos.';
    END IF;

    SELECT COUNT(*)
    INTO v_item_count
    FROM jsonb_to_recordset(p_items)
    AS item("productId" BIGINT, quantity INTEGER);

    IF EXISTS (
        SELECT 1
        FROM jsonb_to_recordset(p_items)
        AS item("productId" BIGINT, quantity INTEGER)
        GROUP BY item."productId"
        HAVING COUNT(*) > 1
    ) THEN
        RAISE EXCEPTION 'Existem produtos duplicados.';
    END IF;

    -- 5. Verificar se o endereço pertence ao cliente.

    SELECT *
    INTO v_address
    FROM public.addresses
    WHERE id = p_address_id
    AND user_id = v_user_id
    FOR SHARE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Endereço não encontrado.';
    END IF;

    -- 6. Bloquear os produtos em ordem crescente de ID.
    -- Isso reduz o risco de deadlock entre compras simultâneas.

    PERFORM p.id
    FROM public.products AS p
    INNER JOIN (
        SELECT item."productId" AS product_id
        FROM jsonb_to_recordset(p_items)
        AS item("productId" BIGINT, quantity INTEGER)
    ) AS requested
        ON requested.product_id = p.id
    ORDER BY p.id
    FOR UPDATE OF p;

    GET DIAGNOSTICS v_locked_count = ROW_COUNT;

    IF v_locked_count <> v_item_count THEN
        RAISE EXCEPTION 'Um ou mais produtos não foram encontrados.';
    END IF;

    -- 7. Validar estoque e calcular subtotal usando
    -- exclusivamente os dados do banco.

    FOR v_item IN
        SELECT item."productId" AS product_id, quantity
        FROM jsonb_to_recordset(p_items)
        AS item("productId" BIGINT, quantity INTEGER)
        ORDER BY item."productId"
    LOOP
        SELECT
            p.id,
            p.name,
            p.price,
            p.sale_type,
            p.stock_quantity,
            p.reserved_quantity,
            p.is_active
        INTO v_product
        FROM public.products AS p
        WHERE p.id = v_item.product_id;

        IF NOT FOUND OR NOT v_product.is_active THEN
            RAISE EXCEPTION 'Produto % indisponível.',
                v_item.product_id;
        END IF;

        IF v_product.sale_type <> 'ready_stock' THEN
            RAISE EXCEPTION 'Produto % não está disponível para compra direta.',
                v_item.product_id;
        END IF;

        v_available_quantity := v_product.stock_quantity - v_product.reserved_quantity;

        IF v_available_quantity < v_item.quantity THEN
            RAISE EXCEPTION
                'Estoque insuficiente para o produto %. Disponível: %.',
                v_item.product_id,
                v_available_quantity;
        END IF;

        v_subtotal := v_subtotal + (v_product.price * v_item.quantity);

        -- Reservar a quantidade solicitada.

        UPDATE public.products
        SET reserved_quantity = reserved_quantity + v_item.quantity
        WHERE id = v_item.product_id;
    END LOOP;

    -- 8. Criar o pedido.

    INSERT INTO public.orders (
        user_id,
        address_id,
        shipping_address,
        status,
        payment_status,
        inventory_status,
        payment_provider,
        idempotency_key,
        subtotal,
        shipping_cost,
        total
    )
    VALUES (
        v_user_id,
        p_address_id,
        jsonb_build_object(
            'recipient_name', v_address.recipient_name,
            'phone', v_address.phone,
            'postal_code', v_address.postal_code,
            'street', v_address.street,
            'number', v_address.number,
            'complement', v_address.complement,
            'neighborhood', v_address.neighborhood,
            'city', v_address.city,
            'state', v_address.state
        ),
        'pending_payment',
        'pending',
        'reserved',
        'mercado_pago',
        p_idempotency_key,
        v_subtotal,
        0,
        v_subtotal
    )
    RETURNING id INTO v_order_id;

    -- 9. Criar os itens do pedido com o preços oficiais.

    INSERT INTO public.order_items (
        order_id,
        product_id,
        product_name,
        sale_type,
        unit_price,
        quantity
    )
    SELECT
        v_order_id,
        p.id,
        p.name,
        p.sale_type,
        p.price,
        item.quantity
    FROM jsonb_to_recordset(p_items)
    AS item("productId" BIGINT, quantity INTEGER)
    INNER JOIN public.products AS p
        ON p.id = item."productId";

    -- 10. Retornar os dados do pedido.

    RETURN jsonb_build_object(
        'success', TRUE,
        'order_id', v_order_id,
        'subtotal', v_subtotal,
        'total', v_subtotal,
        'inventory_status', 'reserved'
    );
END;
$$;

REVOKE ALL ON FUNCTION public.create_order_with_reservation(
    JSONB,
    BIGINT,
    TEXT
) FROM PUBLIC;

GRANT EXECUTE ON FUNCTION public.create_order_with_reservation(
    JSONB,
    BIGINT,
    TEXT
) TO authenticated;