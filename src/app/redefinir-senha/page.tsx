import ResetPasswordForm from "@/components/auth/ResetPasswordForm"

export default function ResetPasswordPage() {
    return (
        <main className="auth-page">
            <h1>Definir nova senha</h1>

            <p>
                Escolha uma nova senha para acessar sua conta.
            </p>

            <ResetPasswordForm />
        </main>
    );
}