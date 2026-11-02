import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/client";

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url);

    const code = searchParams.get("code");
    const next = searchParams.get("next");

    const redirectPath =
        next && next.startsWith("/") && !next.startsWith("//")
        ? next
        : "/";

    if(code){
        const supabase = await createClient();

        const { error } = await supabase.auth.exchangeCodeForSession(code);

        if(!error){
            return NextResponse.redirect(`${origin}${redirectPath}`);
        }
    }

    return NextResponse.redirect(`${origin}/?error=auth-callback`);
}