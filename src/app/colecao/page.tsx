import ProductCard from "@/components/products/ProductCard";
import { products } from "@/lib/products"

export default function CollectionPage() {
    return (
        <main className="collection-page">
            <header className="collection-page-header">
                <span className="eyebrow">Rosa Merger</span>
                <h1>Minha coleção</h1>
                <p>
                    Descubra bolsas feitas à mão, com cuidado em cada
                    detalhe e personalidade em cada criação.
                </p>
            </header>

            <section className="collection-page-products">
                <div className="collection-grid">
                    {products.map((product) => (
                        <ProductCard
                            key={product.id}
                            {...product}
                        />
                    ))}
                </div>
            </section>
        </main>
    );
}