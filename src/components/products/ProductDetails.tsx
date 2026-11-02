import ProductGallery from "./ProductGallery";
import AddToCartButton from "./AddToCartButton";

import type { Product } from "@/lib/products";

type ProductDetailsProps = {
    product: Product;
};

export default function ProductDetails({
    product,
}: ProductDetailsProps) {
    const formattedPrice = new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
    }).format(product.price);

    const isMadeToOrder =
        product.saleType === "made_to_order" ||
        product.stockQuantity <= 0;

    const isLastUnit =
        product.saleType === "ready_stock" &&
        product.stockQuantity === 1;

    const whatsappMessage = `Olá! Tenho interesse na bolsa ${product.name}. Gostaria de saber mais sobre a encomenda.`;

    const whatsappUrl = `https://wa.me/5516996160058?text=${encodeURIComponent(
        whatsappMessage
    )}`;

    return (
        <section className="product-details">
            <ProductGallery images={product.images} />

            <div className="product-details-info">
                <span className="eyebrow">
                    ROSA MERGER · FEITO À MÃO
                </span>

                <h1>{product.name}</h1>

                <span
                    className={`product-card-availability product-details-availability ${
                        isLastUnit
                            ? "product-card-availability-low"
                            : isMadeToOrder
                            ? "product-card-availaibiltiy-order"
                            : ""
                    }`}
                >
                    {isMadeToOrder
                        ? "Sob encomenda"
                        : isLastUnit
                        ? "Última unidade disponível!"
                        : `${product.stockQuantity} unidades disponíveis`}
                </span>

                <span className="product-details.price">
                    {formattedPrice}
                </span>

                {isMadeToOrder ? (
                    <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="product-details-whatsapp"
                    >
                        Consultar pelo WhatsApp
                    </a>
                ) : (
                    <AddToCartButton product={product} />
                )}

                <p className="product-details-description">
                    Feita artesanalmente com materiais de alta qualidade
                    e impermeabilizada para maior proteção e durabilidade.
                </p>

                <div className="product-details-dimensions">
                    <span>Dimensões</span>
                    <p>
                        {product.dimensions.width} ×{" "}
                        {product.dimensions.height} ×{" "}
                        {product.dimensions.depth} cm
                    </p>
                </div>

                <div className="product-details-features">
                    <span>Características</span>

                    <ul>
                        {product.features.map((feature, index) => (
                            <li key = {index}>{feature}</li>
                        ))}
                    </ul>
                </div>
            </div>
        </section>
    );
}