export type Product = {
    id: number;
    name: string;
    price: number;
    imageSrc: string;
    imageAlt: string;
    saleType: "ready_stock" | "made_to_order";
    stockQuantity: number;
};

export const products: Product[] = [
    {
        id: 1,
        name: "Bolsa Aurora",
        price: 189.90,
        imageSrc: "/images/products/bolsa-aurora.jpg",
        imageAlt: "Bolsa artesanal de crochê Aurora",
        saleType: "ready_stock",
        stockQuantity: 2,
    },
    {
        id: 2,
        name: "Bolsa Florença",
        price: 219.90,
        imageSrc: "/images/products/bolsa-florenca.jpg",
        imageAlt: "Bolsa artesanal de crochê Florença",
        saleType: "made_to_order",
        stockQuantity: 0,
    },
    {
        id: 3,
        name: "Bolsa Serena",
        price: 199.90,
        imageSrc: "/images/products/bolsa-serena.jpg",
        imageAlt: "Bolsa artesanal de crochê Serena",
        saleType: "ready_stock",
        stockQuantity: 1,
    },
];