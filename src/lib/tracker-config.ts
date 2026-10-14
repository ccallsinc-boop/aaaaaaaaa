/**
 * Settings of the sales tracker behind /painel.
 *
 * Everything here changes what the dashboard reports, so each value says where
 * it comes from. Keep the fees in line with the contract of each checkout: the
 * dashboard has no other source for them when the webhook does not report the
 * net amount.
 */

export type SaleProvider = "hubla" | "hotmart";

/** Front is the main offer; bump and upsell are extra items of the same buyer. */
export type SaleKind = "front" | "bump" | "upsell";

export type SaleStatus = "pending" | "paid" | "refunded" | "chargeback" | "canceled";

export type FeeRule = {
  /** Share of the gross amount, 0.0499 for 4.99%. */
  percent: number;
  /** Fixed amount per item, in BRL. */
  fixedBrl: number;
  /** How the rule is written on the dashboard. */
  label: string;
};

/**
 * Checkout fee per item, used only when the webhook does not report the net
 * amount. Hubla: 4,99% + R$ 2,49 (the plan the reference dashboard uses). Hotmart:
 * 9,9% + R$ 1,00, its standard Brazilian rate; Hotmart webhooks usually report the
 * producer commission, and that exact amount wins over this estimate.
 */
export const FEE_RULES: Record<SaleProvider, FeeRule> = {
  // Non-breaking spaces keep "R$ 2,49" on one line when the label wraps.
  hubla: { percent: 0.0499, fixedBrl: 2.49, label: "4,99% + R$ 2,49" },
  hotmart: { percent: 0.099, fixedBrl: 1, label: "9,9% + R$ 1,00" },
};

/**
 * Tax Meta adds to the ad spend billed in Brazil since January 2026: PIS/Cofins
 * 9,25% + ISS 2,9%. Ads Manager and the Insights API report spend WITHOUT it.
 * The tax is calculated "por dentro", so the bill is spend / (1 - 12,15%): R$ 100
 * of spend becomes R$ 113,83 on the invoice.
 */
export const META_TAX_RATE = 0.1215;

/**
 * Product id at the checkout -> kind, for products the webhook alone cannot
 * classify. Hotmart flags order bumps itself; Hubla does not, so list the bump
 * and upsell product ids of Hubla here. Anything unlisted counts as front.
 */
export const PRODUCT_KINDS: Record<string, SaleKind> = {};

/** How long a click keeps the credit for a sale made later from the same browser. */
export const ATTRIBUTION_WINDOW_DAYS = 30;

/** Day boundaries of every period on the dashboard. Brazil has no DST since 2019. */
export const DASHBOARD_TIME_ZONE = "America/Sao_Paulo";
export const DASHBOARD_UTC_OFFSET = "-03:00";

/**
 * Hosts whose links get the visitor's UTMs and click id appended. Every buy
 * button of the funnel points to one of these (see src/lib/checkout.ts).
 */
export const CHECKOUT_HOSTS = ["pay.hotmart.com", "xpag.global", "pay.hub.la"];

/**
 * URL parameters for Meta ads. Paste in Ads Manager > Ad > Tracking > URL
 * parameters. Name and id are joined by "|" so the dashboard can match each sale
 * to the spend of its campaign even after the campaign is renamed.
 */
export const META_URL_PARAMETERS =
  "utm_source=FB&utm_campaign={{campaign.name}}|{{campaign.id}}&utm_medium={{adset.name}}|{{adset.id}}&utm_content={{ad.name}}|{{ad.id}}&utm_term={{placement}}";
