import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"
import CollectionClient from "@/components/products/CollectionClient";

import { getProducts } from "@/lib/products";

export default async function CollectionPage() {
    const products = await getProducts();

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

                <CollectionClient products={products} />
            </main>

            <Footer />
        </>
    );
}