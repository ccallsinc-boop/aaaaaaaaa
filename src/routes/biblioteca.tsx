import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { MEMBER_GAMES, MEMBER_GENRES, gameCover } from "@/data/member-library";
import { Input } from "@/components/ui/input";
import { Logo } from "@/components/landing/Logo";

export const Route = createFileRoute("/biblioteca")({
  head: () => ({
    meta: [
      { title: "Minha biblioteca de jogos — Framers" },
      {
        name: "description",
        content: "Área de membros da Framers: sua biblioteca completa de jogos com links de download.",
      },
      { property: "og:title", content: "Minha biblioteca de jogos — Framers" },
      {
        property: "og:description",
        content: "Acesse todos os jogos da sua assinatura Framers em um só lugar.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: LibraryPage,
});

function LibraryPage() {
  const [query, setQuery] = useState("");
  const [genre, setGenre] = useState<string>("Todos");

  const games = useMemo(() => {
    const q = query.trim().toLowerCase();
    return MEMBER_GAMES.filter(
      (g) =>
        (genre === "Todos" || g.genre === genre) &&
        (!q || g.title.toLowerCase().includes(q)),
    ).sort((a, b) => a.title.localeCompare(b.title, "pt-BR"));
  }, [query, genre]);

  return (
    <main className="theme-quiz-br min-h-screen bg-background px-4 py-6 sm:px-6 sm:py-10">
      <div className="mx-auto w-full max-w-6xl">
        <header className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border-2 border-border bg-card px-5 py-4 shadow-soft">
          <Logo className="h-12" />
        </header>

        {(
          <>
            <section className="mt-8">
              <h1 className="text-3xl font-black text-foreground sm:text-4xl">
                Sua biblioteca de jogos
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                {MEMBER_GAMES.length} títulos disponíveis. Clique em um jogo para abrir os links de
                download.
              </p>
            </section>

            <section className="mt-6 space-y-4">
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar por nome do jogo..."
                className="h-12 rounded-full"
              />
              <div className="flex flex-wrap gap-2">
                {MEMBER_GENRES.map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setGenre(g)}
                    className={`rounded-full border-2 px-4 py-2 text-sm font-semibold transition-colors ${
                      genre === g
                        ? "border-foreground bg-foreground text-primary"
                        : "border-border bg-card text-foreground hover:border-primary"
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </section>

            <section className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
              {games.map((game) => (
                <article
                  key={game.id}
                  className="overflow-hidden rounded-2xl border-2 border-border bg-card shadow-soft"
                >
                  <img
                    src={gameCover(game.appid)}
                    alt={game.title}
                    loading="lazy"
                    className="aspect-[2/3] w-full object-cover"
                  />
                  <div className="space-y-2 p-3">
                    <h2 className="text-sm font-bold leading-tight text-foreground">{game.title}</h2>
                    <p className="text-xs text-muted-foreground">{game.genre}</p>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {game.links.map((link) => (
                        <a
                          key={link.url}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rounded-full border-2 border-foreground px-3 py-1 text-xs font-bold text-foreground hover:bg-foreground hover:text-primary"
                        >
                          {link.label}
                        </a>
                      ))}
                    </div>
                  </div>
                </article>
              ))}
            </section>

            {games.length === 0 && (
              <p className="mt-10 text-center text-sm text-muted-foreground">
                Nenhum jogo encontrado com esse filtro.
              </p>
            )}
          </>
        )}
      </div>
    </main>
  );
}
