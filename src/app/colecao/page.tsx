"use client";

import { useState } from "react";

import ProductCard from "@/components/products/ProductCard";
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"
import { products } from "@/lib/products"

type ProductFilter = "all" | "ready_stock" | "made_to_order";
type ProductSort = "default" | "price-asc" | "price-desc";

export default function CollectionPage() {
    const [filter, setFilter] = useState<ProductFilter>("all");
    const [sort, setSort] = useState<ProductSort>("default");

    const filteredProducts = products.filter((product) => {
        if(filter === "all") return true;

        if(filter === "ready_stock"){
            return product.saleType === "ready_stock" && product.stockQuantity > 0;
        }

        return product.saleType === "made_to_order";
    });

    const sortedProducts = [...filteredProducts].sort((a, b) => {
        const aIsMadeToOrder = a.saleType === "made_to_order";
        const bIsMadeToOrder = b.saleType === "made_to_order";

        if(aIsMadeToOrder !== bIsMadeToOrder){
            return aIsMadeToOrder ? 1 : -1;
        }

        if(sort === "price-asc"){
            return a.price - b.price;
        }

        if(sort === "price-desc"){
            return b.price - a.price;
        }

        return a.id - b.id;
    })

    return (
        <>
            <Header />

            <main className="collection-page">
                <header className="collection-page-header">
                    <span className="eyebrow">ROSA MERGER · FEITO À MÃO</span>
                    <h1>Minha coleção</h1>
                    <p>
                        Bolsas artesanais criadas com carinho,
                        cuidado em cada detalhe e personalidade
                        em cada ponto.
                    </p>
                </header>

                <section className="collection-page-products">
                    <nav className="collection-filters" aria-label="Filtrar produtos">
                        <button
                            className={filter === "all" ? "active" : ""}
                            onClick={() => setFilter("all")}
                        >
                            Todas
                        </button>

                        <button
                            className={filter === "ready_stock" ? "active" : ""}
                            onClick={() => setFilter("ready_stock")}
                        >
                            À pronta entrega
                        </button>

                        <button
                            className={filter === "made_to_order" ? "active" : ""}
                            onClick={() => setFilter("made_to_order")}
                        >
                            Sob encomenda
                        </button>
                    </nav>

                    <div className="collection-toolbar">
                        <span>
                            {sortedProducts.length === 1
                                ? "Exibindo 1 produto"
                                : `Exibindo ${sortedProducts.length} produtos`
                            }
                        </span>

                        <label>
                            Ordenar por:

                            <select
                                value={sort}
                                onChange={(event) =>
                                    setSort(event.target.value as ProductSort)
                                }
                            >
                                <option value="default">Padrão</option>
                                <option value="price-asc">Menor preço</option>
                                <option value="price-desc">Maior preço</option>
                            </select>
                        </label>
                    </div>

                    <div className="collection-grid">
                        {sortedProducts.map((product) => (
                            <ProductCard
                                key={product.id}
                                {...product}
                            />
                        ))}
                    </div>

                    {filteredProducts.length === 0 && (
                        <p className="collection-empty">
                            Nenhum produto encontrado nesta categoria.
                        </p>
                    )}
                </section>
            </main>

            <Footer />
        </>
    );
}