"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/contexts/CartContext";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

type ValidatedProduct = {
    id: number;
    name: string;
    price: number;
    image: string | null;
    saleType: string;
    stockQuantity: number;
    reservedQuantity: number;
    availableQuantity: number;
};

type ValidatedCartItem = {
    productId: number;
    quantity: number;
    isAvailable: boolean;
    issues: string[];
    product?: ValidatedProduct;
};

type CartValidationResponse = {
    valid: boolean;
    items: ValidatedCartItem[];
};

export default function CartPage() {
    const { items, removeFromCart, updateQuantity, isInitialized, } = useCart();

    const [validation, setValidation] = useState<CartValidationResponse | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [validationError, setValidationError] = useState<string | null>(null);
    const [retryKey, setRetryKey] = useState(0);

    // Consultar novamente sempre que o carrinho mudar.

    useEffect(() => {
        if(!isInitialized) return;

        if(items.length === 0){
            setValidation(null);
            setValidationError(null);
            setIsLoading(false);
            return;
        }

        const controller = new AbortController();

        async function validateCart() {
            setIsLoading(true);
            setValidation(null);
            setValidationError(null);

            try{
                const response = await fetch("/api/cart/validate", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        items: items.map((item) => ({
                            productId: item.productId,
                            quantity: item.quantity,
                        })),
                    }),
                    signal: controller.signal,
                });

                const data = await response.json();

                if(!response.ok){
                    throw new Error(
                        data.error || "Não foi possível validar o carrinho."
                    );
                }

                setValidation(data as CartValidationResponse);

            } catch(error){
                if(error instanceof Error && error.name === "AbortError") return;

                console.error("Erro ao validar carrinho: ", error);

                setValidationError(
                    error instanceof Error
                        ? error.message
                        : "Ocorreu um erro inesperado."
                );

            } finally{
                if(!controller.signal.aborted){
                    setIsLoading(false);
                }
            }
        }

        validateCart();

        return () => {
            controller.abort();
        };
    }, [items, isInitialized, retryKey]);

    const formatPrice = (price: number) =>
        new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
        }).format(price);

    const validatedItems = items.map((item) => {
        const validatedItem = validation?.items.find(
            (validated) => validated.productId === item.productId
        );

        return {
            ...item,
            validatedItem,
        };
    });

    const hasAllProductData = validatedItems.every(
        (item) => item.validatedItem?.product
    );

    const subtotal = validatedItems.reduce(
        (total, item) => {
            const price = item.validatedItem?.product?.price ?? 0;

            return total + price * item.quantity;
        },
        0
    );

    const canCheckout =
        !isLoading &&
        !validationError &&
        validation?.valid === true &&
        hasAllProductData;

    if(!isInitialized) {
        return (
            <>
                <Header />
                <main className="cart-page">
                    <h1>Meu carrinho</h1>
                    <p>Carregando seu carrinho...</p>
                </main>
                <Footer />
            </>
        );
    }

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

                {isLoading && (
                    <p role="status">
                        Atualizando disponibilidade e preços...
                    </p>
                )}

                {validationError && (
                    <div role="alert">
                        <p>{validationError}</p>

                        <button
                            type="button"
                            onClick={() => setRetryKey((key) => key + 1)}
                        >
                            Tentar novamente
                        </button>
                    </div>
                )}

                <div className="cart-content">
                    <section className="cart-items">
                        {validatedItems.map((item) => {
                            const product = item.validatedItem?.product;
                            const issues = item.validatedItem?.issues ?? [];

                            return(
                                <article key={item.productId} className="cart-item">
                                    <div className="cart-item-image">
                                        {product?.image ? (
                                            <Image
                                                src={product.image}
                                                alt={product.name}
                                                fill
                                                sizes="120px"
                                            />
                                        ) : (
                                            <div>
                                                {isLoading
                                                    ? "Carregando..."
                                                    : "Imagem indisponível"}
                                            </div>
                                        )}
                                    </div>

                                    <div className="cart-item-info">
                                        <h2>
                                            {product?.name ??
                                                `Produto #${item.productId}`}
                                        </h2>

                                        {product && (
                                            <p>{formatPrice(product.price)}</p>
                                        )}

                                        {product && (
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
                                                    disabled={item.quantity >= product.stockQuantity}
                                                    aria-label="Aumentar quantidade"
                                                >
                                                    +
                                                </button>
                                            </div>
                                        )}

                                        {product && (
                                            <p>
                                                {product.availableQuantity}{" "}
                                                unidade(s) disponível(is)
                                            </p>
                                        )}

                                        {issues.length > 0 && (
                                            <ul role="alert">
                                                {issues.map((issue, index) => (
                                                    <li key={index}>
                                                        {issue}
                                                    </li>
                                                ))}
                                            </ul>
                                        )}

                                        {!isLoading && !validationError &&
                                            validation &&
                                            !item.validatedItem && (
                                                <p role="alert">
                                                    Não foi possível validar este produto.
                                                </p>
                                            )
                                        }

                                        <button type="button" onClick={() => removeFromCart(item.productId)}>
                                            Remover
                                        </button>
                                    </div>

                                    {product && (
                                        <p className="cart-item-total">
                                            {formatPrice(product.price * item.quantity)}
                                        </p>
                                    )}
                                </article>
                            );
                        })}
                    </section>

                    <aside className="cart-summary">
                        <h2>Resumo do pedido</h2>

                        <div>
                            <span>Subtotal</span>
                            <strong>
                                {validation && hasAllProductData
                                    ? formatPrice(subtotal)
                                    : "—"}
                            </strong>
                        </div>

                        <p>O frete será calculado na próxima etapa.</p>

                        {canCheckout ? (
                            <Link href="/checkout" className="cart-checkout-button">
                                Finalizar compra
                            </Link>
                        ) : (
                            <button
                                type="button"
                                className="cart-checkout-button"
                                disabled
                            >
                                {isLoading
                                    ? "Validando carrinho..."
                                    : "Corrija os itens para continuar."}
                            </button>
                        )}
                    </aside>
                </div>

                <Link href="/colecao">Continuar comprando</Link>
            </main>
            <Footer />
        </>
    );
}