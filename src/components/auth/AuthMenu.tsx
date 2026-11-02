"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { usePathname } from "next/navigation";

export default function AuthMenu() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);
    const [userName, setUserName] = useState("");

    const pathname = usePathname();

    useEffect(() => {
        async function checkUser() {
            const supabase = createClient();

            const { data } = await supabase.auth.getUser();

            setIsLoggedIn(!!data.user);

            if(data.user){
                setUserName(data.user.user_metadata?.full_name || "");
            }

            setLoading(false);
        }

        checkUser();
    }, []);

    async function handleLogout() {
        const supabase = createClient();

        const { error } = await supabase.auth.signOut();

        if(!error) {
            window.location.href = "/";
        }
    }

    if(loading) return null;

    if(isLoggedIn){
        return (
            <div className="auth-menu-user">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="21"
                    height="21"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                >
                    <circle cx="12" cy="8" r="4" />
                    <path d="M5 21a7 7 0 0 1 14 0" />
                </svg>

                <div className="auth-menu-user-info">
                    <span>
                        Olá, {userName || "cliente"}!
                    </span>

                    <button
                        type="button"
                        className="auth-menu-logout"
                        onClick={handleLogout}
                    >
                        Sair da minha conta
                    </button>
                </div>
            </div>
        );
    }

    return (
        <Link
            href={`/login?next=${encodeURIComponent(
                pathname === "/login" ? "/" : pathname
            )}`}
        >
            Minha conta
        </Link>
    );
}