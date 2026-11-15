
-- ==========================================
-- 1. AJUSTES NA TABELA PRODUCTS
-- ==========================================

ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS reserved_quantity INTEGER
NOT NULL DEFAULT 0
CHECK (
  reserved_quantity >= 0
  AND reserved_quantity <= stock_quantity
);

-- ==========================================
-- 2. PROFILES
-- ==========================================

CREATE TABLE public.profiles (
  user_id UUID PRIMARY KEY
    REFERENCES auth.users(id) ON DELETE CASCADE,

  full_name TEXT,
  phone TEXT,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Cria automaticamente o perfil após cadastro no Auth.

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, phone)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data ->> 'full_name',
    NEW.raw_user_meta_data ->> 'phone'
  )
  ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();

-- ==========================================
-- 3. ADDRESSES
-- ==========================================

CREATE TABLE public.addresses (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

  user_id UUID NOT NULL
    REFERENCES public.profiles(user_id) ON DELETE CASCADE,

  recipient_name TEXT NOT NULL,
  phone TEXT NOT NULL,

  postal_code VARCHAR(8) NOT NULL,
  street TEXT NOT NULL,
  number TEXT NOT NULL,
  complement TEXT,
  neighborhood TEXT NOT NULL,
  city TEXT NOT NULL,
  state CHAR(2) NOT NULL,

  is_default BOOLEAN NOT NULL DEFAULT FALSE,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Apenas um endereço padrão por cliente.

CREATE UNIQUE INDEX one_default_address_per_user
ON public.addresses(user_id)
WHERE is_default = TRUE;

-- ==========================================
-- 4. PRODUCT_IMAGES
-- ==========================================

CREATE TABLE public.product_images (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

  product_id BIGINT NOT NULL
    REFERENCES public.products(id) ON DELETE CASCADE,

  storage_path TEXT NOT NULL UNIQUE,
  alt_text TEXT,
  position INTEGER NOT NULL DEFAULT 0,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CHECK (position >= 0)
);

CREATE INDEX product_images_product_idx
ON public.product_images(product_id, position);

-- ==========================================
-- 5. ADMINS
-- ==========================================

CREATE TABLE public.admins (
  user_id UUID PRIMARY KEY
    REFERENCES auth.users(id) ON DELETE CASCADE,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Função para verificar se o usuário é administrador.

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.admins
    WHERE user_id = (SELECT auth.uid())
  );
$$;

GRANT EXECUTE ON FUNCTION public.is_admin()
TO anon, authenticated;

-- ==========================================
-- 6. ORDERS
-- ==========================================

CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  user_id UUID NOT NULL
    REFERENCES public.profiles(user_id),

  address_id BIGINT
    REFERENCES public.addresses(id) ON DELETE SET NULL,

  -- Cópia do endereço no momento da compra.
  shipping_address JSONB NOT NULL,

  status TEXT NOT NULL DEFAULT 'pending_payment'
    CHECK (status IN (
      'pending_payment',
      'paid',
      'processing',
      'shipped',
      'delivered',
      'cancelled'
    )),

  payment_status TEXT NOT NULL DEFAULT 'pending'
    CHECK (payment_status IN (
      'pending',
      'in_process',
      'approved',
      'rejected',
      'cancelled',
      'refunded'
    )),

  inventory_status TEXT NOT NULL DEFAULT 'none'
    CHECK (inventory_status IN (
      'none',
      'reserved',
      'committed',
      'released'
    )),

  payment_provider TEXT NOT NULL DEFAULT 'mercado_pago'
    CHECK (payment_provider IN ('mercado_pago')),

  payment_id TEXT UNIQUE,
  preference_id TEXT,

  external_reference UUID NOT NULL DEFAULT gen_random_uuid()
    UNIQUE,

  idempotency_key TEXT UNIQUE,

  subtotal NUMERIC(10, 2) NOT NULL CHECK (subtotal >= 0),
  shipping_cost NUMERIC(10, 2) NOT NULL DEFAULT 0
    CHECK (shipping_cost >= 0),
  total NUMERIC(10, 2) NOT NULL CHECK (total >= 0),

  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CHECK (jsonb_typeof(shipping_address) = 'object'),
  CHECK (total = subtotal + shipping_cost)
);

CREATE INDEX orders_user_idx
ON public.orders(user_id, created_at DESC);

CREATE INDEX orders_status_idx
ON public.orders(status, created_at DESC);

-- ==========================================
-- 7. ORDER_ITEMS
-- ==========================================

CREATE TABLE public.order_items (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

  order_id UUID NOT NULL
    REFERENCES public.orders(id) ON DELETE CASCADE,

  product_id BIGINT
    REFERENCES public.products(id) ON DELETE SET NULL,

  -- Dados históricos do produto.
  product_name TEXT NOT NULL,
  sale_type TEXT NOT NULL
    CHECK (sale_type IN ('ready_stock', 'made_to_order')),

  unit_price NUMERIC(10, 2) NOT NULL
    CHECK (unit_price >= 0),

  quantity INTEGER NOT NULL
    CHECK (quantity > 0),

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX order_items_order_idx
ON public.order_items(order_id);
