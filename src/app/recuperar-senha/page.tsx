import Link from "next/link";
import RecoveryForm from "@/components/auth/RecoveryForm";

export default function RecoveryPage() {
    return (
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
    );
}