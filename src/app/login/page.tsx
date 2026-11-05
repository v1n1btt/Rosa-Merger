import Link from "next/link";
import LoginForm from "@/components/auth/LoginForm";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function LoginPage() {
    return (
        <>
            <Header />
            <main className="auth-page">
                <h1>Entrar na minha conta</h1>

                <p>
                    Acesse sua conta para acompanhar seus pedidos e realizar suas compras.
                </p>

                <LoginForm />

                <p>
                    <Link href="/recuperar-senha">
                        Esqueci minha senha
                    </Link>
                </p>

                <p>
                    Ainda não tem uma conta? <Link href="/cadastro">Cadastre-se</Link>
                </p>
            </main>
            <Footer />
        </>
    );
}