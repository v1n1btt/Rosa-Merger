import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { stringifyCookie } from "next/dist/compiled/@edge-runtime/cookies";

type CartRequestItem = {
    productId: number;
    quantity: number;
};

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        if(!Array.isArray(body.items) || body.items.length === 0){
            return NextResponse.json(
                { error: "O carrinho está vazio ou é inválido." },
                { status: 400 }
            );
        }

        if(body.items.length > 50){
            return NextResponse.json(
                { error: "Quantidade excessiva de produtos." },
                { status: 400 }
            );
        }

        const items: CartRequestItem[] = body.items;

        const hasInvalidItem = items.some((item) =>
            !Number.isSafeInteger(item.productId) ||
            item.productId <= 0 ||
            !Number.isSafeInteger(item.quantity) ||
            item.quantity <= 0
        );

        if(hasInvalidItem){
            return NextResponse.json(
                { error: "Os produtos ou quantidades são inválidos." },
                { status: 400 }
            );
        }

        const productIds = items.map((item) => item.productId);

        if(new Set(productIds).size !== productIds.length){
            return NextResponse.json(
                { error: "Existem produtos duplicados no carrinho." },
                { status: 400 }
            );
        }

        const supabase = await createClient();

        const { data: products, error } = await supabase
            .from("products")
            .select(`
                id,
                name,
                price,
                sale_type,
                stock_quantity,
                reserved_quantity,
                product_images (
                    storage_path,
                    alt_text,
                    position
                )
            `)
            .in("id", productIds)
            .eq("is_active", true);

        if(error){
            console.error("Erro ao validar carrinho: ", error);

            return NextResponse.json(
                { error: "Não foi possível validar seu carrinho." },
                { status: 500 }
            );
        }

        const validatedItems = items.map((item) => {
            const product = products.find(
                (product) => product.id === item.productId
            );

            if(!product){
                return {
                    productId: item.productId,
                    quantity: item.quantity,
                    isAvailable: false,
                    issues: ["Produto não encontrado ou indisponível."],
                };
            }

            const availableQuantity = Math.max(
                0,
                product.stock_quantity - product.reserved_quantity
            );

            const issues: string[] = [];

            if(product.sale_type !== "ready_stock"){
                issues.push("Este produto não está disponível para compra direta.");
            }

            if(availableQuantity < item.quantity){
                issues.push(
                    availableQuantity === 0
                        ? "Produto sem estoque disponível."
                        : `Disponibilidade atual: ${availableQuantity} unidade(s).`
                );
            }

            const sortedImages = [...product.product_images]
                .sort((a, b) => a.position - b.position);

            const imagePath = sortedImages[0]?.storage_path;

            const image = imagePath
                ? supabase.storage
                    .from("product-images")
                    .getPublicUrl(imagePath).data.publicUrl
                : null;

            return {
                productId: item.productId,
                quantity: item.quantity,

                isAvailable: issues.length === 0,
                issues,

                product: {
                    id: product.id,
                    name: product.name,
                    price: Number(product.price),
                    image,

                    saleType: product.sale_type,

                    stockQuantity: product.stock_quantity,
                    reservedQuantity: product.reserved_quantity,
                    availableQuantity,
                },
            };
        });

        const isValid = validatedItems.every(
            (item) => item.isAvailable
        );

        return NextResponse.json({
            valid: isValid,
            items: validatedItems,
        });
    } catch(error) {
        console.error("Erro inesperado ao validar carrinho: ", error);

        return NextResponse.json(
            { error: "Ocorreu um erro ao validar seu carrinho." },
            { status: 500 }
        );
    }
}