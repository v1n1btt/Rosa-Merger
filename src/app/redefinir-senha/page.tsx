import ResetPasswordForm from "@/components/auth/ResetPasswordForm"
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";

export default function ResetPasswordPage() {
    return (
        <>
            <Header />
            <main className="auth-page">
                <h1>Definir nova senha</h1>

                <p>
                    Escolha uma nova senha para acessar sua conta.
                </p>

                <ResetPasswordForm />
            </main>
            <Footer />
        </>
    );
}