import Image from "next/image";

type ProductCardProps = {
    name: string;
    price: number;
    imageSrc: string;
    imageAlt: string;
    saleType: "ready_stock" | "made_to_order";
    stockQuantity: number;
};

export default function ProductCard({
    name,
    price,
    imageSrc,
    imageAlt,
    saleType,
    stockQuantity,
}: ProductCardProps) {
    const formattedPrice = new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
    }).format(price);

    const isReadyStock = saleType === "ready_stock" && stockQuantity > 0;

    return (
        <article className="product-card">
            <div className="product-card-image">
                <Image
                    src={imageSrc}
                    alt={imageAlt}
                    fill
                    sizes="(max-width: 700px) 100vw, 33vw"
                />
            </div>

            <div className="product-card-info">
                <h3>{name}</h3>
                <span className="product-card-price">
                    {formattedPrice}
                </span>

                <span className="product-card-availability">
                    {saleType === "made_to_order"
                        ? "Sob encomenda"
                        : stockQuantity === 1
                        ? "Última unidade disponível!"
                        : `${stockQuantity} unidades disponíveis`
                    }
                </span>
            </div>
        </article>
    );
}