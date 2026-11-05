import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const siteURL = process.env.NEXT_PUBLIC_SITE_URL;

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
            return NextResponse.redirect(`${siteURL}${redirectPath}`);
        }
    }

    return NextResponse.redirect(`${siteURL}/?error=auth-callback`);
}