import { Cta } from "@/components/landing/Cta";
import { Logo } from "@/components/landing/Logo";
import { useLocale } from "@/lib/locale";

export function Footer() {
  const { t, priceLabel, totalGames } = useLocale();

  return (
    <footer className="border-t border-border bg-surface py-14">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 md:grid-cols-3">
        <div>
          <Logo variant="3d" className="logo-3d-spin h-14 w-auto" />
          <p className="mt-4 max-w-sm text-sm text-muted-foreground">
            {t.footerSub(totalGames, priceLabel)}
          </p>
        </div>

        <div>
          <p className="text-sm font-bold">{t.footerLinksTitle}</p>
          <ul className="mt-4 space-y-2">
            {t.footerLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-sm font-bold">{t.footerReady}</p>
          <Cta className="mt-4" location="footer">
            {t.footerCta(priceLabel)}
          </Cta>
        </div>
      </div>

      <p className="mx-auto mt-10 max-w-7xl border-t border-border px-5 pt-6 text-xs text-muted-foreground">
        © {new Date().getFullYear()} Framers. {t.rights}
      </p>
    </footer>
  );
}
