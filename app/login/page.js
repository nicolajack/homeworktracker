"use client";

import { useState } from "react";
import { supabase } from "@/app/lib/supabase";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isSignUp, setIsSignUp] = useState(false);
    const [error, setError] = useState(null);
    const router = useRouter();

    const handleAuth = async (e) => {
        e.preventDefault();
        setError(null);

        const { error: authError } = isSignUp
            ? await supabase.auth.signUp({ email, password })
            : await supabase.auth.signInWithPassword({ email, password });

        if (authError) {
            setError(authError.message);
        } else {
            router.push("/");
        }
    };

    return (
        <div className="authPage">
            <div className="authCard">
                <h1 className="authTitle">{isSignUp ? "create account" : "sign in"}</h1>
                
                {error && <p className="authError">{error}</p>}
                
                <form onSubmit={handleAuth} className="authForm">
                    <input
                        className="authInput"
                        type="email"
                        placeholder="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        className="authInput"
                        type="password"
                        placeholder="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button type="submit" className="authButton">
                        {isSignUp ? "sign up" : "sign in"}
                    </button>
                </form>

                <button 
                    type="button"
                    onClick={() => setIsSignUp(!isSignUp)} 
                    className="authToggle"
                >
                    {isSignUp ? "already have an account? sign in" : "need an account? sign up"}
                </button>
            </div>
        </div>
    );
}