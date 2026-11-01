import { notFound } from "next/navigation";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ProductDetails from "@/components/products/ProductDetails";
import { products } from "@/lib/products";

type ProductPageProps = {
    params: Promise<{
        id: string;
    }>;
};

export default async function ProductPage({
    params,
}: ProductPageProps) {
    const { id } = await params;
    const productId = Number(id);

    if(!Number.isInteger(productId) || productId <= 0){
        notFound();
    }

    const product = products.find(
        (item) => item.id === productId
    );

    if(!product){
        notFound();
    }

    return (
        <>
            <Header />

            <main className="product-page">
                <ProductDetails product={product} />
            </main>

            <Footer />
        </>
    )
}