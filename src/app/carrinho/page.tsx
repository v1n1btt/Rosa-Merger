"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/contexts/CartContext";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function CartPage() {
    const { items, removeFromCart, updateQuantity } = useCart();

    const subtotal = items.reduce(
        (total, item) => total + item.price * item.quantity,
        0
    );

    const formatPrice = (price: number) =>
        new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
        }).format(price);

    if(items.length === 0){
        return (
            <>
                <Header />
                <main className="cart-page">
                    <h1>Meu carrinho</h1>
                    <p>Seu carrinho está vazio.</p>
                    <Link href="/colecao">Explorar coleção</Link>
                </main>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Header />
            <main className="cart-page">
                <h1>Meu carrinho</h1>

                <div className="cart-content">
                    <section className="cart-items">
                        {items.map((item) => (
                            <article key={item.productId} className="cart-item">
                                <div className="cart-item-image">
                                    <Image
                                        src={item.image}
                                        alt={item.name}
                                        fill
                                        sizes="120px"
                                    />
                                </div>

                                <div className="cart-item-info">
                                    <h2>{item.name}</h2>
                                    <p>{formatPrice(item.price)}</p>
                                    <div className="cart-item-quantity">
                                        <button
                                            type="button"
                                            onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                                            disabled={item.quantity <= 1}
                                            aria-label="Diminuir quantidade"
                                        >
                                            −
                                        </button>

                                        <span>{item.quantity}</span>

                                        <button
                                            type="button"
                                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                                            disabled={item.quantity >= item.stockQuantity}
                                            aria-label="Aumentar quantidade"
                                        >
                                            +
                                        </button>
                                    </div>

                                    <button onClick={() => removeFromCart(item.productId)}>
                                        Remover
                                    </button>
                                </div>

                                <p className="cart-item-total">
                                    {formatPrice(item.price * item.quantity)}
                                </p>
                            </article>
                        ))}
                    </section>

                    <aside className="cart-summary">
                        <h2>Resumo do pedido</h2>

                        <div>
                            <span>Subtotal</span>
                            <strong>{formatPrice(subtotal)}</strong>
                        </div>

                        <p>O frete será calculado na próxima etapa.</p>
                    </aside>
                </div>

                <Link href="/colecao">Continuar comprando</Link>
            </main>
            <Footer />
        </>
    )
}