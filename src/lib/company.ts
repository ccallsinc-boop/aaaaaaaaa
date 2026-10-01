/**
 * Legal identity of the seller, used by the terms, privacy and refund pages.
 *
 * Every field is optional on purpose. An empty field is omitted from the page
 * rather than rendered with a placeholder, so the site never publishes an
 * invented company name, tax ID or address. Fill these in before launch:
 * Hotmart and Meta both look for them, and a footer with no identifiable seller
 * is a common reason for ad rejection and for chargebacks going the wrong way.
 */
export type Company = {
  /** Trading name shown in the copyright line. */
  tradeName: string;
  /** Registered legal name, if different from the trading name. */
  legalName?: string;
  /** CNPJ, CPF or the equivalent tax ID. */
  taxId?: string;
  /** Registered address, one line. */
  address?: string;
  /** Support inbox. Required for a usable refund policy. */
  supportEmail?: string;
  /** Support WhatsApp in international format, digits only, e.g. 5566999999999. */
  supportWhatsapp?: string;
  /** Checkout platform that issues the invoice and processes the refund. */
  platform: string;
  platformUrl: string;
};

export const COMPANY: Company = {
  tradeName: "Framers",
  legalName: "",
  taxId: "",
  address: "",
  supportEmail: "",
  supportWhatsapp: "",
  platform: "Hotmart",
  platformUrl: "https://hotmart.com",
};

/** True when there is enough identity to present a complete legal footer. */
export function companyIsComplete(): boolean {
  return Boolean(COMPANY.legalName && COMPANY.taxId && COMPANY.supportEmail);
}

export function whatsappLink(): string | null {
  if (!COMPANY.supportWhatsapp) return null;
  return `https://wa.me/${COMPANY.supportWhatsapp}`;
}
