"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setErrorMessage("");
        setLoading(true);

        try{
            const supabase = createClient();

            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if(error){
                setErrorMessage("E-mail ou senha inválidos.");
                return;
            }

            const params = new URLSearchParams(window.location.search);
            const next = params.get("next");

            const redirectTo =
                next && next.startsWith("/") && !next.startsWith("//")
                    ? next
                    : "/";

            window.location.href = redirectTo;
        } catch{
            setErrorMessage("Não foi possível realizar o login. Tente novamente.");
        } finally{
            setLoading(false);
        }
    }

    return (
        <form className="auth-form" onSubmit={handleLogin}>
            <div className="auth-form-field">
                <label htmlFor="email">E-mail</label>
                <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    autoComplete="email"
                    required
                />
            </div>

            <div className="auth-form-field">
                <label htmlFor="password">Senha</label>
                <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    autoComplete="current-password"
                    required
                />
            </div>

            {errorMessage && (
                <p className="auth-form-error" role="alert">
                    {errorMessage}
                </p>
            )}

            <button type="submit" disabled={loading}>
                {loading ? "Entrando..." : "Entrar"}
            </button>
        </form>
    );
}