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
        addToCart({
            productId: product.id,
            name: product.name,
            price: product.price,
            image: product.images[0].src,
        });
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