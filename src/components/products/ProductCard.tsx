import Image from "next/image";
import Link from "next/link";

type ProductCardProps = {
    id: number;
    name: string;
    price: number;
    images: {
        src: string;
        alt: string;
    }[];
    saleType: "ready_stock" | "made_to_order";
    stockQuantity: number;
};

export default function ProductCard({
    id,
    name,
    price,
    images,
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
                {images.length > 0 ? (
                    <Image
                        src={images[0].src}
                        alt={images[0].alt}
                        fill
                        sizes="(max-width: 700px) 100vw, 33vw"
                    />   
                ) : (
                    <div className="product-image-placeholder">
                        Imagem indisponível
                    </div>
                )}
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