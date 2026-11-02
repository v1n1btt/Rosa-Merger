"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/router";

export default function ResetPasswordForm() {
    const router = useRouter();

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [checkingSession, setCheckingSession] = useState(true);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    useEffect(() => {
        async function checkSession() {
            const supabase = createClient();

            const { data, error } = await supabase.auth.getSession();

            if(error || !data.session){
                window.location.href = "/recuperar-senha";
                return;
            }

            setCheckingSession(false);
        }

        checkSession();
    }, []);

    async function handleResetPassword(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        setErrorMessage("");
        setSuccessMessage("");

        if(password !== confirmPassword){
            setErrorMessage("As senhas não coincidem.");
            return;
        }

        if(password.length < 8){
            setErrorMessage("A senha deve ter pelo menos 8 caracteres.");
            return;
        }

        setLoading(true);

        try{
            const supabase = createClient();

            const { error } = await supabase.auth.updateUser({
                password,
            });

            if(error){
                setErrorMessage(
                    "Não foi possível redefinir sua senha. Solicite um novo link."
                );
                return;
            }

            setSuccessMessage("Senha alterada com sucesso!");

            setTimeout(() => {
                router.push("/login");
            }, 2000);
        } catch{
            setErrorMessage("Ocorreu um erro. Tente novamente.");
        } finally{
            setLoading(false);
        }
    }

    if(checkingSession){
        return <p>Verificando sessão...</p>;
    }

    return (
        <form className="auth-form" onSubmit={handleResetPassword}>
            <div className="auth-form-field">
                <label htmlFor="password">Nova senha</label>

                <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    autoComplete="new-password"
                    minLength={8}
                    required
                />
            </div>

            <div className="auth-form-field">
                <label htmlFor="confirmPassword">Confirmar nova senha</label>

                <input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    autoComplete="new-password"
                    minLength={8}
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
                {loading ? "Alterando senha..." : "Redefinir senha"}
            </button>
        </form>
    )
}