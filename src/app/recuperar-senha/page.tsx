import Link from "next/link";
import RecoveryForm from "@/components/auth/RecoveryForm";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function RecoveryPage() {
    return (
        <>
            <Header />
            <main className="auth-page">
                <h1>Recuperar minha senha</h1>

                <p>
                    Informe seu e-mail para receber um link de recuperação de senha.
                </p>

                <RecoveryForm />

                <p>
                    Lembrou sua senha? <Link href="/login">Voltar ao login</Link>
                </p>
            </main>
            <Footer />
        </>
    );
}