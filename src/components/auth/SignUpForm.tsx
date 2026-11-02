"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function SignUpForm() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    async function handleSignUp(event: React.FormEvent<HTMLFormElement>) {
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

            const { error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: name,
                    },
                    emailRedirectTo: `${window.location.origin}/auth/callback`,
                },
            });

            if(error){
                setErrorMessage(error.message);
                return;
            }

            setSuccessMessage(
                "Cadastro realizado! Verifique seu e-mail para confirmar sua conta."
            );
        } catch{
            setErrorMessage("Não foi possível realizar o cadastro. Tente novamente.");
        } finally{
            setLoading(false);
        }
    }

    return (
        <form className="auth-form" onSubmit={handleSignUp}>
            <div className="auth-form-field">
                <label htmlFor="name">Nome completo</label>
                <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    autoComplete="name"
                    required
                />
            </div>

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
                    autoComplete="new-password"
                    minLength={8}
                    required
                />
            </div>

            <div className="auth-form-field">
                <label htmlFor="confirmPassword">Confirmar senha</label>
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
                {loading ? "Criando conta..." : "Criar minha conta"}
            </button>
        </form>
    )
}