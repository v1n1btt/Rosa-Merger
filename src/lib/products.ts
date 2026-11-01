export type Product = {
    id: number;
    name: string;
    price: number;
    images: {
        src: string;
        alt: string;
    }[];
    saleType: "ready_stock" | "made_to_order";
    stockQuantity: number;

    dimensions: {
        width: number;
        height: number;
        depth: number;
    };

    features: string[];
};

export const products: Product[] = [
    {
        id: 1,
        name: "Bolsa Aurora",
        price: 189.90,
        images: [
            {
                src: "/images/products/bolsa-aurora-1.jpeg",
                alt: "Bolsa Aurora vista de frente",
            },
            {
                src: "/images/products/bolsa-aurora-2.jpeg",
                alt: "Bolsa Aurora vista de lado",
            },
            {
                src: "/images/products/bolsa-aurora-3.jpeg",
                alt: "Detalhe do acabamento da Bolsa Aurora",
            },
        ],
        saleType: "ready_stock",
        stockQuantity: 2,

        dimensions: {
            width: 25,
            height: 20,
            depth: 10,
        },

        features: [
            "Acompanha alça de mão em crochê",
            "Acompanha alça de ombro em corrente",
            "Peça artesanal feita à mão",
        ],
    },
    {
        id: 2,
        name: "Bolsa Florença",
        price: 219.90,
        images: [
            {
                src: "/images/products/bolsa-aurora-1.jpeg",
                alt: "Bolsa Aurora vista de frente",
            },
            {
                src: "/images/products/bolsa-aurora-2.jpeg",
                alt: "Bolsa Aurora vista de lado",
            },
            {
                src: "/images/products/bolsa-aurora-3.jpeg",
                alt: "Detalhe do acabamento da Bolsa Aurora",
            },
        ],
        saleType: "made_to_order",
        stockQuantity: 0,

        dimensions: {
            width: 25,
            height: 20,
            depth: 10,
        },

        features: [
            "Acompanha alça de mão em crochê",
            "Acompanha alça de ombro em corrente",
            "Peça artesanal feita à mão",
        ],
    },
    {
        id: 3,
        name: "Bolsa Serena",
        price: 199.90,
        images: [
            {
                src: "/images/products/bolsa-aurora-1.jpeg",
                alt: "Bolsa Aurora vista de frente",
            },
            {
                src: "/images/products/bolsa-aurora-2.jpeg",
                alt: "Bolsa Aurora vista de lado",
            },
            {
                src: "/images/products/bolsa-aurora-3.jpeg",
                alt: "Detalhe do acabamento da Bolsa Aurora",
            },
        ],
        saleType: "ready_stock",
        stockQuantity: 1,

        dimensions: {
            width: 25,
            height: 20,
            depth: 10,
        },

        features: [
            "Acompanha alça de mão em crochê",
            "Acompanha alça de ombro em corrente",
            "Peça artesanal feita à mão",
        ],
    },
];