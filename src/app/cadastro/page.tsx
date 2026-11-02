import SignUpForm from "@/components/auth/SignUpForm"

export default function SignUpPage() {
    return (
        <main className="auth-page">
            <h1>Criar minha conta</h1>
            <p>Cadastre-se para acompanhar seus pedidos e realizar suas compras.</p>

            <SignUpForm />
        </main>
    );
}