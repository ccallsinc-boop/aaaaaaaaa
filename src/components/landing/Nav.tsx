import { Link } from "@tanstack/react-router";
import { Logo } from "@/components/landing/Logo";
import { useLocale } from "@/lib/locale";

export function Nav() {
  const { t, lang, others, home } = useLocale();
  const quizVisual = lang === "pt" || lang === "es";

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-5 py-4">
        <a href={`${home}#topo`} className="flex items-center gap-2">
          <Logo variant="3d" className={quizVisual ? "h-12 w-auto sm:h-14" : "h-8 w-auto"} />
        </a>
        <div className="hidden items-center gap-8 md:flex">
          {t.nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
            </a>
          ))}
        </div>
        <div className="flex items-center gap-3">
          {others.map((o) => (
            <Link
              key={o.href}
              to={o.href}
              className="hidden rounded-full border border-border px-3 py-2 text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground sm:inline-flex"
            >
              {o.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
