
-- ==========================================
-- 1. HABILITAR RLS
-- ==========================================

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- 2. PRODUCTS
-- ==========================================

CREATE POLICY "Anyone can view active products"
ON public.products
FOR SELECT
TO anon, authenticated
USING (
  is_active = TRUE OR public.is_admin()
);

CREATE POLICY "Admins can insert products"
ON public.products
FOR INSERT
TO authenticated
WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update products"
ON public.products
FOR UPDATE
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

CREATE POLICY "Admins can delete products"
ON public.products
FOR DELETE
TO authenticated
USING (public.is_admin());

-- ==========================================
-- 3. PROFILES
-- ==========================================

CREATE POLICY "Users can view their own profile"
ON public.profiles
FOR SELECT
TO authenticated
USING (
  user_id = (SELECT auth.uid())
  OR public.is_admin()
);

CREATE POLICY "Users can update their own profile"
ON public.profiles
FOR UPDATE
TO authenticated
USING (
  user_id = (SELECT auth.uid())
  OR public.is_admin()
)
WITH CHECK (
  user_id = (SELECT auth.uid())
  OR public.is_admin()
);

-- ==========================================
-- 4. ADDRESSES
-- ==========================================

CREATE POLICY "Users can view their own addresses"
ON public.addresses
FOR SELECT
TO authenticated
USING (
  user_id = (SELECT auth.uid())
  OR public.is_admin()
);

CREATE POLICY "Users can insert their own addresses"
ON public.addresses
FOR INSERT
TO authenticated
WITH CHECK (
  user_id = (SELECT auth.uid())
  OR public.is_admin()
);

CREATE POLICY "Users can update their own addresses"
ON public.addresses
FOR UPDATE
TO authenticated
USING (
  user_id = (SELECT auth.uid())
  OR public.is_admin()
)
WITH CHECK (
  user_id = (SELECT auth.uid())
  OR public.is_admin()
);

CREATE POLICY "Users can delete their own addresses"
ON public.addresses
FOR DELETE
TO authenticated
USING (
  user_id = (SELECT auth.uid())
  OR public.is_admin()
);

-- ==========================================
-- 5. PRODUCT_IMAGES
-- ==========================================

CREATE POLICY "Anyone can view images of active products"
ON public.product_images
FOR SELECT
TO anon, authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.products
    WHERE products.id = product_images.product_id
      AND products.is_active = TRUE
  )
  OR public.is_admin()
);

CREATE POLICY "Admins can insert product images"
ON public.product_images
FOR INSERT
TO authenticated
WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update product images"
ON public.product_images
FOR UPDATE
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

CREATE POLICY "Admins can delete product images"
ON public.product_images
FOR DELETE
TO authenticated
USING (public.is_admin());

-- ==========================================
-- 6. ORDERS
-- ==========================================

CREATE POLICY "Users can view their own orders"
ON public.orders
FOR SELECT
TO authenticated
USING (
  user_id = (SELECT auth.uid())
  OR public.is_admin()
);

-- Não criamos políticas de INSERT, UPDATE ou DELETE.
-- Essas operações serão feitas pelo backend confiável.

-- ==========================================
-- 7. ORDER_ITEMS
-- ==========================================

CREATE POLICY "Users can view their own order items"
ON public.order_items
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.orders
    WHERE orders.id = order_items.order_id
      AND (
        orders.user_id = (SELECT auth.uid())
        OR public.is_admin()
      )
  )
);

-- Não criamos políticas de escrita para clientes.

-- ==========================================
-- 8. ADMINS
-- ==========================================

-- Sem políticas para acesso direto.
-- A tabela será administrada pelo SQL Editor
-- ou por operações confiáveis no servidor.
