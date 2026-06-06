import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Sign in — LK Clothiers" }] }),
  component: AuthPage,
});

function AuthPage() {
  const [mode, setMode] = useState<"login" | "signup" | "forgot">("login");
  const navigate = useNavigate();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      localStorage.setItem(
        "lk_user",
        JSON.stringify({ name: "Aisha", email: "aisha@example.com" }),
      );
    } catch {
      /* ignore */
    }
    navigate({ to: "/account" });
  };

  return (
    <div className="px-6 py-20 max-w-md mx-auto">
      <p className="eyebrow mb-3 text-center">
        {mode === "login" ? "Welcome back" : mode === "signup" ? "Join LK" : "Reset Password"}
      </p>
      <h1 className="font-display text-4xl text-center mb-10">
        {mode === "login" ? "Sign In" : mode === "signup" ? "Create Account" : "Forgot Password"}
      </h1>

      <form onSubmit={submit} className="space-y-5">
        {mode === "signup" && (
          <label className="block">
            <span className="eyebrow block mb-2">Full Name</span>
            <input
              required
              className="w-full border border-border px-3 py-3 text-sm focus:outline-none focus:border-foreground"
            />
          </label>
        )}
        <label className="block">
          <span className="eyebrow block mb-2">Email</span>
          <input
            type="email"
            required
            className="w-full border border-border px-3 py-3 text-sm focus:outline-none focus:border-foreground"
          />
        </label>
        {mode !== "forgot" && (
          <label className="block">
            <span className="eyebrow block mb-2">Password</span>
            <input
              type="password"
              required
              className="w-full border border-border px-3 py-3 text-sm focus:outline-none focus:border-foreground"
            />
          </label>
        )}
        <button className="w-full bg-[color:var(--accent)] text-white px-7 py-4 text-xs uppercase tracking-[0.25em] hover:bg-foreground transition-colors">
          {mode === "login" ? "Sign In" : mode === "signup" ? "Create Account" : "Send Reset Link"}
        </button>
      </form>

      <div className="mt-8 text-center text-xs uppercase tracking-[0.2em] text-muted-foreground space-y-3">
        {mode === "login" && (
          <>
            <button onClick={() => setMode("forgot")} className="lk-link block w-full">
              Forgot password?
            </button>
            <button onClick={() => setMode("signup")} className="lk-link block w-full">
              New here? Create an account
            </button>
          </>
        )}
        {mode === "signup" && (
          <button onClick={() => setMode("login")} className="lk-link">
            Already have an account? Sign in
          </button>
        )}
        {mode === "forgot" && (
          <button onClick={() => setMode("login")} className="lk-link">
            Back to sign in
          </button>
        )}
        <Link to="/" className="block lk-link">
          ← Back to home
        </Link>
      </div>
    </div>
  );
}
