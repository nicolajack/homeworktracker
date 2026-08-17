"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/app/lib/supabase";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isSignUp, setIsSignUp] = useState(false);
    const [loading, setLoading] = useState(false);
    const [signUpSuccess, setSignUpSuccess] = useState(false);
    const [verifiedBanner, setVerifiedBanner] = useState(false);
    const [error, setError] = useState(null);

    const router = useRouter();
    const searchParams = useSearchParams();

    // Check if user came from clicking the email verification link
    useEffect(() => {
        if (searchParams.get("verified") === "true") {
            setVerifiedBanner(true);
        }
    }, [searchParams]);

    const passwordRequirements = [
        { id: "length", label: "8+ characters", valid: password.length >= 8 },
        { id: "number", label: "1+ number", valid: /\d/.test(password) },
        { id: "uppercase", label: "1+ uppercase letter", valid: /[A-Z]/.test(password) },
        { id: "special", label: "1+ special character (!@#$%^&*)", valid: /[^A-Za-z0-9]/.test(password) },
    ];

    const isPasswordValid = passwordRequirements.every((req) => req.valid);

    const handleAuth = async (e) => {
        e.preventDefault();
        setError(null);

        if (isSignUp && !isPasswordValid) {
            setError("please satisfy all password requirements before signing up.");
            return;
        }

        setLoading(true);

        if (isSignUp) {
            const { data, error: authError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    // Redirects to /login?verified=true after confirmation link is clicked
                    emailRedirectTo: `${window.location.origin}/login?verified=true`,
                },
            });

            setLoading(false);

            if (authError) {
                setError(authError.message.toLowerCase());
            } else if (data?.user && data?.session === null) {
                setSignUpSuccess(true);
            } else {
                router.push("/assignments");
            }
        } else {
            const { error: authError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            setLoading(false);

            if (authError) {
                setError(authError.message.toLowerCase());
            } else {
                router.push("/assignments");
            }
        }
    };

    const toggleMode = () => {
        setIsSignUp(!isSignUp);
        setError(null);
        setPassword("");
        setSignUpSuccess(false);
        setVerifiedBanner(false);
    };

    if (signUpSuccess) {
        return (
            <div className="authPage">
                <div className="authCard">
                    <div style={{ textAlign: "center" }}>
                        <div style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>✉️</div>
                        <h1 className="authTitle">verify your email</h1>
                        <p style={{ margin: "1rem 0", lineHeight: "1.5", fontSize: "0.95rem" }}>
                            we sent a confirmation link to <strong>{email}</strong>. please check your inbox and click the link to activate your account.
                        </p>
                        <p style={{ margin: "1rem 0", lineHeight: "1.5", fontSize: "0.85rem", color: "#D0342C"}}>
                            don&apos;t see an email? check your spam folder!!
                        </p>
                        <button
                            type="button"
                            onClick={toggleMode}
                            className="authButton"
                        >
                            back to sign in
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="authPage">
            <div className="authCard">
                <h1 className="authTitle">{isSignUp ? "create account" : "sign in"}</h1>

                {/* Banner shown after user clicks email confirmation link */}
                {verifiedBanner && (
                    <p style={{
                        padding: "0.75rem",
                        backgroundColor: "#e8f5e9",
                        color: "#2e7d32",
                        borderRadius: "4px",
                        fontSize: "0.85rem",
                        marginBottom: "1rem",
                        textAlign: "center"
                    }}>
                        ✓ email verified! please sign in below.
                    </p>
                )}

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

                    <div className="passwordWrapper">
                        <input
                            className="authInput"
                            type={showPassword ? "text" : "password"}
                            placeholder="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <button
                            type="button"
                            className="passwordToggleBtn"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? "hide" : "show"}
                        </button>
                    </div>

                    {isSignUp && password.length > 0 && (
                        <div className="passwordChecklist">
                            {passwordRequirements.map((req) => (
                                <div
                                    key={req.id}
                                    className={`checkItem ${req.valid ? "valid" : "invalid"}`}
                                >
                                    <span>{req.valid ? "✓" : "○"}</span> {req.label}
                                </div>
                            ))}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="authButton"
                        disabled={loading || (isSignUp && !isPasswordValid)}
                    >
                        {loading
                            ? "please wait..."
                            : isSignUp
                            ? "create account"
                            : "sign in"}
                    </button>
                </form>

                <button
                    type="button"
                    onClick={toggleMode}
                    className="authToggle"
                    style={{ marginTop: "1rem" }}
                >
                    {isSignUp
                        ? "already have an account? sign in"
                        : "need an account? sign up"}
                </button>
            </div>
        </div>
    );
}