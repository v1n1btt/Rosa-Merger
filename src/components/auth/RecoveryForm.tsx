"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function RecoveryForm() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    async function handleRecovery(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        setErrorMessage("");
        setSuccessMessage("");
        setLoading(true);

        try{
            const supabase = createClient();

            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback?next=/redefinir-senha`,
            });

            if(error){
                setErrorMessage("Não foi possível enviar o e-mail. Tente novamente.")
                return;
            }

            setSuccessMessage(
                "Se existir uma conta associada a esse e-mail, você receberá um link para redefinir sua senha."
            );
        } catch{
            setErrorMessage("Ocorreu um erro. Tente novamente.");
        } finally{
            setLoading(false);
        }
    }

    return (
        <form className="auth-form" onSubmit={handleRecovery}>
            <div className="auth-form-field">
                <label htmlFor="email">E-mail cadastrado</label>

                <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    autoComplete="email"
                    required
                />
            </div>

            {errorMessage && (
                <p className="auth-form-error" role="alert">
                    {errorMessage}
                </p>
            )}

            {successMessage && (
                <p className="auth-form-success" role="status">
                    {successMessage}
                </p>
            )}

            <button type="submit" disabled={loading}>
                {loading ? "Enviando..." : "Enviar link de recuperação"}
            </button>
        </form>
    );
}