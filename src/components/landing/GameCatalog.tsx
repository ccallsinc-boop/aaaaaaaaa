import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { CATALOG } from "@/data/catalog";
import { Cta } from "@/components/landing/Cta";
import { useLocale } from "@/lib/locale";

const EN_GENRE: Record<string, string> = {
  "Ação": "Action",
  "Aventura": "Adventure",
  "Terror": "Horror",
  "Corrida": "Racing",
  "Esportes": "Sports",
  "RPG": "RPG",
  "Estratégia": "Strategy",
  "Plataforma": "Platformer",
  "Simulação": "Simulation",
  "Outros": "Other",
};

const ES_GENRE: Record<string, string> = {
  "Ação": "Acción",
  "Aventura": "Aventura",
  "Terror": "Terror",
  "Corrida": "Carreras",
  "Esportes": "Deportes",
  "RPG": "RPG",
  "Estratégia": "Estrategia",
  "Plataforma": "Plataformas",
  "Simulação": "Simulación",
  "Outros": "Otros",
};

const GENRES = [
  "Ação",
  "Aventura",
  "Terror",
  "Corrida",
  "Esportes",
  "RPG",
  "Estratégia",
  "Plataforma",
  "Simulação",
  "Outros",
] as const;

const RULES: [string, RegExp][] = [
  ["Terror", /resident evil|silent hill|outlast|fnaf|granny|poppy|phasmo|dead space|amnesia|slender|bendy|cry of fear|dying light|hello neighbor|five nights|miside|lethal company|the forest|sons of the forest|dead island|land of the dead|killing floor|repo\b|left 4 dead|no i'm not a human/i],
  ["Corrida", /need for speed|forza|f1 |dirt|colin mcrae|assetto|beamng|flatout|blur|crazy taxi|truck simulator|rally|drive|rocket league|skater|hot pursuit|nascar/i],
  ["Esportes", /fifa|pes |nba|efootball|guitar hero|golf|tennis|wwe|ufc|football|futebol|skate/i],
  ["RPG", /elden ring|dark souls|fallout|witcher|final fantasy|dragon ball|naruto|kenshi|sekiro|skyrim|hogwarts|persona|kingdom come|dungeon|stardew|slime rancher|cult of the lamb/i],
  ["Estratégia", /age of empires|hearts of iron|civilization|cities|simcity|plague inc|factorio|bloons|total war|spore|poly bridge/i],
  ["Plataforma", /mario|sonic|celeste|hollow knight|cuphead|rayman|crash|spyro|limbo|super meat|geometry dash|little nightmares|a hat in time|pizza tower|dead cells|blasphemous|castle crashers|ori\b/i],
  ["Simulação", /simulator|my summer car|goat sim|people playground|garry's mod|schedule i|streamer life|supermarket|farming|project zomboid|roblox|minecraft|the sims/i],
  ["Aventura", /gta|grand theft|red dead|assassin|uncharted|tomb raider|zelda|detroit|life is strange|l\.a noire|mafia|bully|sleeping dogs|subnautica|days gone|god of war|spider-man|batman|lego|south park|deltarune|papa|henry stickmin|among us|journey/i],
  ["Ação", /call of duty|cod:|counter strike|battlefield|doom|halo|far cry|crysis|metal gear|max payne|devil may cry|mortal kombat|injustice|payday|hitman|just cause|prototype|saints row|borderlands|gears of war|bioshock|metro|half life|portal|quake|duke nukem|postal|manhunt|medal of honor|fear|ravenfield|fortnite|superhot|hotline miami|deadpool|metal slug|jujutsu|swat/i],
];

function genreOf(name: string) {
  for (const [genre, re] of RULES) if (re.test(name)) return genre;
  return "Outros";
}

const GAMES = CATALOG.map((game) => ({ ...game, genre: genreOf(game.name) }));
const COUNTS = GAMES.reduce<Record<string, number>>((acc, game) => {
  acc[game.genre] = (acc[game.genre] ?? 0) + 1;
  return acc;
}, {});

const PAGE = 24;

export function GameCatalog() {
  const { t, lang, totalGames, money, price } = useLocale();
  const label = (g: string) =>
    lang === "pt" ? g : lang === "es" || lang === "es2" ? (ES_GENRE[g] ?? g) : (EN_GENRE[g] ?? g);
  const [query, setQuery] = useState("");
  const [genre, setGenre] = useState("Todos");
  const [sort, setSort] = useState("az");
  const [limit, setLimit] = useState(PAGE);

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    return [
      ...GAMES.filter(
        (game) =>
          (genre === "Todos" || game.genre === genre) &&
          (!term || game.name.toLowerCase().includes(term)),
      ),
    ].sort((a, b) =>
      sort === "az"
        ? a.name.localeCompare(b.name, "pt-BR")
        : b.name.localeCompare(a.name, "pt-BR"),
    );
  }, [query, genre, sort]);

  const visible = filtered.slice(0, limit);

  return (
    <section id="jogos" className="border-t border-border bg-surface py-20">
      <div className="mx-auto max-w-7xl px-5">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
          {t.catalogEyebrow}
        </p>

        <div className="mt-3 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <h2 className="text-[clamp(1.8rem,4.5vw,3rem)]">
            {t.catalogTitle(totalGames)}
          </h2>
          <label className="relative w-full lg:max-w-sm">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setLimit(PAGE);
              }}
              placeholder={t.search}
              className="w-full rounded-full border border-border bg-background py-3 pl-11 pr-4 text-sm outline-none focus:border-primary/50"
            />
          </label>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {(["Todos", ...GENRES] as string[]).map((item) => {
            const active = item === genre;
            const count = item === "Todos" ? GAMES.length : (COUNTS[item] ?? 0);
            return (
              <button
                key={item}
                type="button"
                onClick={() => {
                  setGenre(item);
                  setLimit(PAGE);
                }}
                className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                  active
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-background text-foreground hover:border-primary/40"
                }`}
              >
                {item === "Todos" ? t.all : label(item)}{" "}
                <span className={active ? "opacity-70" : "text-muted-foreground"}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground">
            {t.found(filtered.length)}
          </p>
          <label className="flex items-center gap-2 text-sm text-muted-foreground">
            {t.sortBy}
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="rounded-full border border-border bg-background px-4 py-2 text-sm font-semibold text-foreground outline-none"
            >
              <option value="az">{t.sortAz}</option>
              <option value="za">{t.sortZa}</option>
            </select>
          </label>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {visible.map((game) => (
            <article
              key={game.name}
              className="group overflow-hidden rounded-2xl border border-border bg-background transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-soft"
            >
              <div className="grid aspect-[2/3] place-items-center bg-primary-soft">
                {game.img ? (
                  <img
                    src={game.img}
                    alt={t.coverAlt(game.name)}
                    loading="lazy"
                    className={`h-full w-full transition-transform duration-500 group-hover:scale-105 ${game.wide ? "object-contain" : "object-cover"}`}
                  />
                ) : (
                  <span className="px-3 text-center text-sm font-bold text-primary">
                    {game.name}
                  </span>
                )}
              </div>
              <div className="p-3">
                <h3 className="truncate text-sm font-semibold" title={game.name}>
                  {game.name}
                </h3>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {label(game.genre)}
                </p>
              </div>
            </article>
          ))}
        </div>

        {limit < filtered.length ? (
          <div className="mt-10 text-center">
            <button
              type="button"
              onClick={() => setLimit((value) => value + 60)}
              className="rounded-full border border-border bg-background px-7 py-3 text-sm font-bold transition-colors hover:border-primary/40 hover:text-primary"
            >
              {t.seeMore}
            </button>
          </div>
        ) : null}

        <div className="mt-10 rounded-2xl border border-border bg-background p-6 text-center sm:p-8">
          <p className="text-sm text-muted-foreground">
            {t.catalogTitle(totalGames)}
          </p>
          <Cta className="mt-4" location="catalog">
            {t.ctaCatalog}
          </Cta>
        </div>
      </div>
    </section>
  );
}
