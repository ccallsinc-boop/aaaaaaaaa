import { Cta } from "@/components/landing/Cta";
import { Logo } from "@/components/landing/Logo";
import { useLocale } from "@/lib/locale";
import { LEGAL_LINKS } from "@/data/legal";
import { COMPANY, whatsappLink } from "@/lib/company";

export function Footer() {
  const { t, priceLabel, totalGames, marketLang } = useLocale();
  const legal = LEGAL_LINKS[marketLang];
  const whatsapp = whatsappLink();

  return (
    <footer className="border-t border-border bg-surface py-14">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 md:grid-cols-2 lg:grid-cols-4">
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
          <p className="text-sm font-bold">{t.legalTitle}</p>
          <ul className="mt-4 space-y-2">
            {legal.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {link.label}
                </a>
              </li>
            ))}
            {COMPANY.supportEmail ? (
              <li>
                <a
                  href={`mailto:${COMPANY.supportEmail}`}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {COMPANY.supportEmail}
                </a>
              </li>
            ) : null}
            {whatsapp ? (
              <li>
                <a
                  href={whatsapp}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {t.legalWhatsapp}
                </a>
              </li>
            ) : null}
          </ul>
        </div>

        <div>
          <p className="text-sm font-bold">{t.footerReady}</p>
          <Cta className="mt-4" location="footer">
            {t.footerCta(priceLabel)}
          </Cta>
        </div>
      </div>

      <div className="mx-auto mt-10 max-w-7xl space-y-1 border-t border-border px-5 pt-6 text-xs text-muted-foreground">
        <p>
          © {new Date().getFullYear()} {COMPANY.tradeName}. {t.rights}
        </p>
        {/* Identity lines render only once filled in src/lib/company.ts, so the
            footer never publishes an invented legal name or tax ID. */}
        {COMPANY.legalName ? <p>{COMPANY.legalName}</p> : null}
        {COMPANY.taxId ? <p>{COMPANY.taxId}</p> : null}
        {COMPANY.address ? <p>{COMPANY.address}</p> : null}
        <p>{t.trademarkNotice}</p>
      </div>
    </footer>
  );
}
