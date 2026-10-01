import { Link } from "@tanstack/react-router";

import { legalDoc, LEGAL_LINKS, type LegalKind } from "@/data/legal";
import { COMPANY, whatsappLink } from "@/lib/company";
import { Logo } from "@/components/landing/Logo";
import { useMarket } from "@/lib/use-market";

/**
 * Renders a policy in the visitor's market language.
 *
 * One route per policy instead of one per policy per language: the country is
 * already resolved server-side for pricing, so the same URL can serve pt, es and
 * en. That keeps the footer links identical everywhere and avoids nine routes
 * drifting out of sync.
 */
export function LegalPage({ kind }: { kind: LegalKind }) {
  const { market } = useMarket();
  const doc = legalDoc(kind, market.lang);
  const links = LEGAL_LINKS[market.lang];
  const whatsapp = whatsappLink();

  const backLabel =
    market.lang === "pt"
      ? "Voltar ao site"
      : market.lang === "es"
        ? "Volver al sitio"
        : "Back to site";
  const updatedLabel =
    market.lang === "pt"
      ? "Atualizado em"
      : market.lang === "es"
        ? "Actualizado el"
        : "Last updated";
  const contactLabel =
    market.lang === "pt" ? "Contato" : market.lang === "es" ? "Contacto" : "Contact";

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-5 py-5">
          <Link to="/" className="flex items-center gap-2">
            <Logo variant="3d" className="h-10 w-auto" />
          </Link>
          <Link
            to="/"
            className="rounded-full border border-border px-4 py-2 text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground"
          >
            {backLabel}
          </Link>
        </div>
      </header>

      <article className="mx-auto max-w-3xl px-5 py-14">
        <h1 className="text-[clamp(1.8rem,5vw,2.6rem)]">{doc.title}</h1>
        <p className="mt-3 text-xs uppercase tracking-[0.2em] text-muted-foreground">
          {updatedLabel} {doc.updated}
        </p>
        <p className="mt-6 text-base text-muted-foreground">{doc.intro}</p>

        <div className="mt-12 space-y-10">
          {doc.sections.map((section) => (
            <section key={section.heading}>
              <h2 className="text-lg font-semibold">{section.heading}</h2>
              <div className="mt-3 space-y-3">
                {section.body.map((paragraph) => (
                  <p key={paragraph} className="text-sm leading-relaxed text-muted-foreground">
                    {paragraph}
                  </p>
                ))}
              </div>
            </section>
          ))}
        </div>

        <section className="mt-14 rounded-2xl border border-border bg-surface p-6">
          <h2 className="text-sm font-bold uppercase tracking-[0.15em] text-primary">
            {contactLabel}
          </h2>
          <div className="mt-4 space-y-1.5 text-sm text-muted-foreground">
            {/* Each identity line is omitted when empty, so the page never shows
                an invented company name, tax ID or address. */}
            {COMPANY.legalName ? <p>{COMPANY.legalName}</p> : null}
            {COMPANY.taxId ? <p>{COMPANY.taxId}</p> : null}
            {COMPANY.address ? <p>{COMPANY.address}</p> : null}
            {COMPANY.supportEmail ? (
              <p>
                <a
                  className="text-foreground hover:text-primary"
                  href={`mailto:${COMPANY.supportEmail}`}
                >
                  {COMPANY.supportEmail}
                </a>
              </p>
            ) : null}
            {whatsapp ? (
              <p>
                <a
                  className="text-foreground hover:text-primary"
                  href={whatsapp}
                  target="_blank"
                  rel="noreferrer"
                >
                  WhatsApp
                </a>
              </p>
            ) : null}
            <p>
              {COMPANY.platform}:{" "}
              <a
                className="text-foreground hover:text-primary"
                href={COMPANY.platformUrl}
                target="_blank"
                rel="noreferrer"
              >
                {COMPANY.platformUrl.replace("https://", "")}
              </a>
            </p>
          </div>
        </section>

        <nav className="mt-10 flex flex-wrap gap-4 border-t border-border pt-6 text-xs text-muted-foreground">
          {links.map((link) => (
            <a key={link.href} href={link.href} className="hover:text-foreground">
              {link.label}
            </a>
          ))}
        </nav>

        <p className="mt-6 text-xs text-muted-foreground">
          © {new Date().getFullYear()} {COMPANY.tradeName}
        </p>
      </article>
    </main>
  );
}
