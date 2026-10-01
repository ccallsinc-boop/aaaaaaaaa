import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/landing/Logo";

export const Route = createFileRoute("/auth")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Entrar na área de membros — Framers" },
      {
        name: "description",
        content:
          "Acesse sua biblioteca de jogos da Framers. Área exclusiva para assinantes ativos.",
      },
      { property: "og:title", content: "Entrar na área de membros — Framers" },
      {
        property: "og:description",
        content: "Acesse sua biblioteca de jogos da Framers com o e-mail da sua compra.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) navigate({ to: "/biblioteca", replace: true });
    });
  }, [navigate]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    if (mode === "signup") {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: { emailRedirectTo: `${window.location.origin}/biblioteca` },
      });
      setLoading(false);
      if (signUpError) {
        setError(signUpError.message);
        return;
      }
      if (!data.session) {
        setMessage("Enviamos um e-mail de confirmação. Confirme para liberar seu acesso.");
        return;
      }
      navigate({ to: "/biblioteca" });
      return;
    }

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    setLoading(false);
    if (signInError) {
      setError("E-mail ou senha incorretos.");
      return;
    }
    navigate({ to: "/biblioteca" });
  }

  return (
    <main className="theme-quiz-br flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <div className="w-full max-w-md rounded-3xl border-2 border-border bg-card p-6 shadow-soft sm:p-8">
        <div className="mb-6 flex justify-center">
          <Logo className="h-14" />
        </div>
        <h1 className="text-center text-2xl font-black text-foreground">
          {mode === "login" ? "Entrar na área de membros" : "Criar meu acesso"}
        </h1>
        <p className="mt-2 text-center text-sm text-muted-foreground">
          Use o mesmo e-mail que você utilizou na compra.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="voce@email.com"
              autoComplete="email"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mínimo de 6 caracteres"
              autoComplete={mode === "login" ? "current-password" : "new-password"}
            />
          </div>

          {error && <p className="text-sm font-semibold text-destructive">{error}</p>}
          {message && <p className="text-sm font-semibold text-foreground">{message}</p>}

          <Button type="submit" disabled={loading} className="h-14 w-full rounded-full text-base font-bold">
            {loading ? "Aguarde..." : mode === "login" ? "Entrar" : "Criar acesso"}
          </Button>
        </form>

        <button
          type="button"
          className="mt-5 w-full text-center text-sm font-semibold text-foreground underline underline-offset-4"
          onClick={() => {
            setMode(mode === "login" ? "signup" : "login");
            setError(null);
            setMessage(null);
          }}
        >
          {mode === "login"
            ? "Ainda não criei minha senha"
            : "Já tenho acesso, quero entrar"}
        </button>
      </div>
    </main>
  );
}
