import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default async function CheckoutPage() {
    const supabase = await createClient();

    const { data: { user }, error } = await supabase.auth.getUser();

    if(error || !user){
        redirect("/login?next=/checkout");
    }

    return (
        <>
            <Header />
            <main className="checkout-page">
                <h1>Finalizar compra</h1>

                <p>
                    Para continuar com seu pedido, faça login ou crie uma conta.
                </p>
            </main>
            <Footer />
        </>
    )
}