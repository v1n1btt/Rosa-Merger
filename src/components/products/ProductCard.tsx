import Image from "next/image";
import Link from "next/link";

type ProductCardProps = {
    id: number;
    name: string;
    price: number;
    imageSrc: string;
    imageAlt: string;
    saleType: "ready_stock" | "made_to_order";
    stockQuantity: number;
};

export default function ProductCard({
    id,
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

    const isLastUnit = saleType === "ready_stock" && stockQuantity === 1;
    const isMadeToOrder = saleType === "made_to_order" || stockQuantity === 0;

    return (
        <Link href={`/colecao/${id}`} className="product-card">
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

                <span
                    className={`product-card-availability ${
                        isLastUnit
                            ? "product-card-availability-low"
                            : isMadeToOrder
                            ? "product-card-availability-order"
                            : ""
                    }`}
                >
                    {isMadeToOrder
                        ? "Sob encomenda"
                        : isLastUnit
                        ? "Última unidade disponível!"
                        : `${stockQuantity} unidades disponíveis`
                    }
                </span>
            </div>
        </Link>
    );
}