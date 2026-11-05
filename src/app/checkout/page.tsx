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
                <div className="checkout-header">
                    <span className="checkout-eyebrow">
                        ROSA MERGER · FINALIZAÇÃO
                    </span>

                    <h1>Finalizar compra</h1>

                    <p>
                        Estamos quase lá! Confira seu pedido e prepare-se
                        para receber sua bolsa.
                    </p>
                </div>

                <div className="checkout-content">
                    <section className="checkout-section">
                        <h2>Seus dados</h2>
                        <p>
                            Em breve, você poderá conferir seus dados pessoais
                            e endereço de entrega por aqui.
                        </p>
                    </section>

                    <section className="checkout-section">
                        <h2>Resumo do pedido</h2>
                        <p>Os produtos adicionados ao carrinho aparecerão aqui.</p>
                    </section>
                </div>
            </main>
            <Footer />
        </>
    )
}