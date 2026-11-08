import { createClient } from "@/lib/supabase/server";

export type ProductImage = {
    src: string;
    alt: string;
};

export type Product = {
    id: number;
    name: string;
    price: number;

    images: ProductImage[];

    saleType: "ready_stock" | "made_to_order";
    stockQuantity: number;

    dimensions: {
        width: number | null;
        height: number | null;
        depth: number | null;
    };

    features: string[];
};

type ProductRow = {
    id: number;
    name: string;
    price: number | string;
    sale_type: "ready_stock" | "made_to_order";
    stock_quantity: number;

    width: number | string | null;
    height: number | string | null;
    depth: number | string | null;

    features: string[];

    product_images: {
        id: number;
        storage_path: string;
        alt_text: string | null;
        position: number;
    }[] | null;
};

function mapProduct(row: ProductRow, supabase: Awaited<ReturnType<typeof createClient>>): Product {
    const images = [...(row.product_images ?? [])]
        .sort((a, b) => a.position - b.position)
        .map((image) => {
            const { data } = supabase.storage
                .from("product-images")
                .getPublicUrl(image.storage_path);

            return {
                src: data.publicUrl,
                alt: image.alt_text ?? row.name,
            };
        });
    
    return {
        id: row.id,
        name: row.name,
        price: Number(row.price),

        images,

        saleType: row.sale_type,
        stockQuantity: row.stock_quantity,

        dimensions: {
            width: row.width === null ? null : Number(row.width),
            height: row.height === null ? null : Number(row.height),
            depth: row.depth === null ? null : Number(row.depth),
        },

        features: row.features ?? [],
    };
}

export async function getProducts(): Promise<Product[]> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("products")
        .select(`
            id,
            name,
            price,
            sale_type,
            stock_quantity,
            width,
            height,
            depth,
            features,
            product_images (
                id,
                storage_path,
                alt_text,
                position
            )
        `)
        .eq("is_active", true);

    if(error){
        console.error("Erro ao buscar produtos: ", error);
        throw new Error("Não foi possível carregar os produtos.");
    }

    return (data as ProductRow[]).map((row) =>
        mapProduct(row, supabase)
    );
}

export async function getProductById(id: number): Promise<Product | null> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("products")
        .select(`
            id,
            name,
            price,
            sale_type,
            stock_quantity,
            width,
            height,
            depth,
            features,
            product_images (
                id,
                storage_path,
                alt_text,
                position
            )
        `)
        .eq("id", id)
        .eq("is_active", true)
        .maybeSingle();

    if(error){
        console.error("Erro ao buscar produto:", error);
        throw new Error("Não foi possível carregar o produto.");
    }

    if(!data){
        return null;
    }

    return mapProduct(data as ProductRow, supabase);
}