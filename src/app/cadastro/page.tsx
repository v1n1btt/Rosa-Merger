import SignUpForm from "@/components/auth/SignUpForm"
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";

export default function SignUpPage() {
    return (
        <>
            <Header />
            <main className="auth-page">
                <h1>Criar minha conta</h1>
                <p>Cadastre-se para acompanhar seus pedidos e realizar suas compras.</p>

                <SignUpForm />
            </main>
            <Footer />
        </>
    );
}