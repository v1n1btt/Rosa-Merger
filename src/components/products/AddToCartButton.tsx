"use client";

import { useCart } from "@/contexts/CartContext";
import { Product } from "@/lib/products";

type AddToCartButtonProps = {
    product: Product;
};

export default function AddToCartButton({
    product,
}: AddToCartButtonProps) {
    const { addToCart } = useCart();

    function handleAddToCart() {
        addToCart(product.id);
    }

    return (
        <button
            className="product-details-add-to-cart"
            onClick={handleAddToCart}
        >
            Adicionar ao carrinho
        </button>
    );
}