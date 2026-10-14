/**
 * Turns checkout webhooks into rows of tracker_sales.
 *
 * Each checkout has its own payload; normalizeHotmart and normalizeHubla read
 * only explicit, documented paths and say why when a payload does not fit,
 * instead of guessing an amount. A guessed amount would silently corrupt every
 * total on the dashboard; a rejected payload stays in the webhook's raw log and
 * the reason goes back in the response, visible in the checkout's webhook logs.
 *
 * Server-only: it reads the service-role client and the FX cache.
 */

import type { Json } from "@/integrations/supabase/types";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { getFxRates } from "./fx.server";
import { PRODUCT_KINDS, type SaleKind, type SaleProvider, type SaleStatus } from "./tracker-config";
import { TOUCH_ID_PATTERN, UTM_KEYS, type UtmKey } from "./tracker-utm";

type Obj = Record<string, unknown>;

export type NormalizedSale = {
  provider: SaleProvider;
  externalId: string;
  parentExternalId: string | null;
  kind: SaleKind;
  status: SaleStatus;
  productId: string | null;
  productName: string | null;
  /** Amount in the currency the buyer paid, in cents. */
  currency: string;
  grossCents: number;
  /** Net amount the checkout reports for the seller, in cents of netCurrency. */
  netCents: number | null;
  netCurrency: string | null;
  paymentMethod: string | null;
  buyerEmail: string | null;
  touchId: string | null;
  utm: Partial<Record<UtmKey, string>>;
  orderedAt: string | null;
  approvedAt: string | null;
  refundedAt: string | null;
};

export type NormalizeResult = { ok: true; sale: NormalizedSale } | { ok: false; reason: string };

function obj(value: unknown): Obj | null {
  return value != null && typeof value === "object" && !Array.isArray(value)
    ? (value as Obj)
    : null;
}

function arr(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

function str(value: unknown): string | null {
  if (typeof value === "string") return value.trim() || null;
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  return null;
}

function num(value: unknown): number | null {
  if (typeof value === "number") return Number.isFinite(value) ? value : null;
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

/** ISO instant from epoch milliseconds (Hotmart) or an ISO string (Hubla). */
function instant(value: unknown): string | null {
  const ms =
    typeof value === "number" ? value : typeof value === "string" ? Date.parse(value) : NaN;
  return Number.isFinite(ms) ? new Date(ms).toISOString() : null;
}

function fail(reason: string): NormalizeResult {
  return { ok: false, reason };
}

const HOTMART_STATUS: Record<string, SaleStatus> = {
  PURCHASE_APPROVED: "paid",
  PURCHASE_COMPLETE: "paid",
  PURCHASE_REFUNDED: "refunded",
  PURCHASE_CHARGEBACK: "chargeback",
  PURCHASE_CANCELED: "canceled",
  PURCHASE_EXPIRED: "canceled",
  PURCHASE_BILLET_PRINTED: "pending",
  PURCHASE_DELAYED: "pending",
};

/**
 * Hotmart webhook 2.0: data.purchase.transaction, price {value, currency_value},
 * order_bump {is_order_bump, parent_purchase_transaction}, origin {src, sck} and
 * data.commissions[] where source PRODUCER is the seller's net amount.
 */
export function normalizeHotmart(payload: unknown): NormalizeResult {
  const root = obj(payload);
  const event = str(root?.["event"])?.toUpperCase();
  if (!event) return fail("missing event");
  const status = HOTMART_STATUS[event];
  if (!status) return fail(`event ${event} is not a sale`);

  const data = obj(root?.["data"]);
  const purchase = obj(data?.["purchase"]);
  const transaction = str(purchase?.["transaction"]);
  if (!transaction) return fail("missing data.purchase.transaction");

  const price = obj(purchase?.["price"]);
  const value = num(price?.["value"]);
  const currency = str(price?.["currency_value"]) ?? str(price?.["currency_code"]);
  if (value == null || !currency) return fail("missing data.purchase.price value or currency");

  const producer = arr(data?.["commissions"])
    .map(obj)
    .find((c) => (str(c?.["source"]) ?? str(c?.["role"]))?.toUpperCase() === "PRODUCER");
  const netValue = num(producer?.["value"]);
  const netCurrency = str(producer?.["currency_value"]) ?? str(producer?.["currency_code"]);

  const orderBump = obj(purchase?.["order_bump"]);
  const isBump = orderBump?.["is_order_bump"] === true;
  const product = obj(data?.["product"]);
  const productId = str(product?.["id"]);
  const origin = obj(purchase?.["origin"]);
  const touchId =
    [str(origin?.["src"]), str(origin?.["sck"])].find(
      (candidate): candidate is string => candidate != null && TOUCH_ID_PATTERN.test(candidate),
    ) ?? null;

  const eventAt = instant(root?.["creation_date"]) ?? new Date().toISOString();

  return {
    ok: true,
    sale: {
      provider: "hotmart",
      externalId: transaction,
      parentExternalId: isBump ? str(orderBump?.["parent_purchase_transaction"]) : null,
      kind: (productId ? PRODUCT_KINDS[productId] : undefined) ?? (isBump ? "bump" : "front"),
      status,
      productId,
      productName: str(product?.["name"]),
      currency: currency.toUpperCase(),
      grossCents: Math.round(value * 100),
      netCents: netValue != null && netCurrency ? Math.round(netValue * 100) : null,
      netCurrency: netValue != null && netCurrency ? netCurrency.toUpperCase() : null,
      paymentMethod: str(obj(purchase?.["payment"])?.["type"]),
      buyerEmail: str(obj(data?.["buyer"])?.["email"])?.toLowerCase() ?? null,
      touchId,
      utm: {},
      orderedAt: instant(purchase?.["order_date"]),
      approvedAt: instant(purchase?.["approved_date"]) ?? (status === "paid" ? eventAt : null),
      refundedAt: status === "refunded" || status === "chargeback" ? eventAt : null,
    },
  };
}

const HUBLA_INVOICE_STATUS: Record<string, SaleStatus> = {
  paid: "paid",
  refunded: "refunded",
  chargeback: "chargeback",
  chargedback: "chargeback",
  pending: "pending",
  unpaid: "pending",
  waiting_payment: "pending",
  draft: "pending",
  canceled: "canceled",
  cancelled: "canceled",
  expired: "canceled",
  failed: "canceled",
};

function hublaStatus(eventType: string, invoiceStatus: string | null): SaleStatus | null {
  const fromInvoice = invoiceStatus ? HUBLA_INVOICE_STATUS[invoiceStatus.toLowerCase()] : undefined;
  if (fromInvoice) return fromInvoice;
  const type = eventType.toLowerCase();
  if (type.includes("chargeback")) return "chargeback";
  if (type.includes("refund")) return "refunded";
  if (type.includes("payment_succeeded") || type.includes("paid")) return "paid";
  if (type.includes("expired") || type.includes("canceled") || type.includes("failed")) {
    return "canceled";
  }
  if (type.includes("created")) return "pending";
  return null;
}

const UTM_ALIASES: Record<UtmKey, string[]> = {
  utm_source: ["utm_source", "utmSource"],
  utm_medium: ["utm_medium", "utmMedium"],
  utm_campaign: ["utm_campaign", "utmCampaign"],
  utm_content: ["utm_content", "utmContent"],
  utm_term: ["utm_term", "utmTerm"],
};

/** Object keys under which a checkout may nest UTMs as plain source/medium/... */
const UTM_CONTAINERS = new Set(["utm", "utms", "tracking"]);

/**
 * UTMs and touch id anywhere in the payload, by exact key name only. Hubla's
 * documentation does not fix where it puts the checkout's UTMs, so this looks
 * for the parameter names themselves rather than for one path.
 */
function findTracking(payload: unknown): {
  utm: Partial<Record<UtmKey, string>>;
  touchId: string | null;
} {
  const utm: Partial<Record<UtmKey, string>> = {};
  let touchId: string | null = null;

  const visit = (value: unknown, depth: number, inUtmContainer: boolean) => {
    if (depth > 6) return;
    if (Array.isArray(value)) {
      for (const item of value) visit(item, depth + 1, false);
      return;
    }
    const node = obj(value);
    if (!node) return;
    for (const key of UTM_KEYS) {
      if (utm[key]) continue;
      const names = inUtmContainer ? [...UTM_ALIASES[key], key.slice(4)] : UTM_ALIASES[key];
      for (const name of names) {
        const found = str(node[name]);
        if (found) {
          utm[key] = found;
          break;
        }
      }
    }
    if (!touchId) {
      for (const name of ["src", "sck"]) {
        const found = str(node[name]);
        if (found && TOUCH_ID_PATTERN.test(found)) touchId = found;
      }
    }
    for (const [key, child] of Object.entries(node)) {
      visit(child, depth + 1, UTM_CONTAINERS.has(key.toLowerCase()));
    }
  };

  visit(payload, 0, false);
  return { utm, touchId };
}

/**
 * Hubla webhook v2: { type, event: { invoice, product, user } }. One invoice is
 * one row. The amount is read from invoice.amountInCents, or from
 * invoice.amount.totalCents in the payloads that nest it.
 */
export function normalizeHubla(payload: unknown): NormalizeResult {
  const root = obj(payload);
  const event = obj(root?.["event"]) ?? root;
  const eventType = str(root?.["type"]) ?? str(event?.["type"]) ?? "";
  const invoice = obj(event?.["invoice"]);
  if (!invoice) return fail(`event ${eventType || "(no type)"} has no invoice`);

  const invoiceId = str(invoice["id"]);
  if (!invoiceId) return fail("missing event.invoice.id");

  const status = hublaStatus(eventType, str(invoice["status"]));
  if (!status) return fail(`event ${eventType || "(no type)"} is not a sale status`);

  const amount = obj(invoice["amount"]);
  const grossCents =
    num(invoice["amountInCents"]) ?? num(amount?.["totalCents"]) ?? num(invoice["totalCents"]);
  if (grossCents == null) return fail("missing event.invoice.amountInCents");

  const product = obj(event?.["product"]) ?? obj(arr(event?.["products"])[0]);
  const productId = str(product?.["id"]);
  const isBump = invoice["isOrderBump"] === true || product?.["isOrderBump"] === true;
  const { utm, touchId } = findTracking(event);
  const now = new Date().toISOString();

  return {
    ok: true,
    sale: {
      provider: "hubla",
      externalId: invoiceId,
      parentExternalId: null,
      kind: (productId ? PRODUCT_KINDS[productId] : undefined) ?? (isBump ? "bump" : "front"),
      status,
      productId,
      productName: str(product?.["name"]),
      currency: (str(invoice["currency"]) ?? "BRL").toUpperCase(),
      grossCents: Math.round(grossCents),
      // Hubla does not report the seller's net here: FEE_RULES.hubla applies.
      netCents: null,
      netCurrency: null,
      paymentMethod: str(invoice["paymentMethod"]),
      buyerEmail:
        (
          str(obj(event?.["user"])?.["email"]) ?? str(obj(invoice["payer"])?.["email"])
        )?.toLowerCase() ?? null,
      touchId,
      utm,
      orderedAt: instant(invoice["createdAt"]) ?? instant(invoice["billingDate"]),
      approvedAt: instant(invoice["paidAt"]) ?? (status === "paid" ? now : null),
      refundedAt:
        instant(invoice["refundedAt"]) ??
        (status === "refunded" || status === "chargeback" ? now : null),
    },
  };
}

/**
 * Later states win, whatever order the webhooks arrive in: a late "pending"
 * cannot undo a payment, and a late "paid" cannot undo a refund.
 */
const STATUS_RANK: Record<SaleStatus, number> = {
  pending: 0,
  canceled: 1,
  paid: 2,
  refunded: 3,
  chargeback: 3,
};

export type RecordSaleResult =
  | { ok: true; externalId: string; status: SaleStatus; attributed: boolean }
  | { ok: false; reason: string };

/** Upserts a normalized sale, converting to BRL and attaching the ad click's UTMs. */
export async function recordSale(raw: unknown, sale: NormalizedSale): Promise<RecordSaleResult> {
  const fx = await getFxRates();
  // fx.rates says how many units of X one BRL buys, so BRL per unit is 1 / rate.
  const brlPerUnit = (currency: string): number | null => {
    if (currency === "BRL") return 1;
    const rate = fx.rates[currency];
    return rate ? 1 / rate : null;
  };

  const grossRate = brlPerUnit(sale.currency);
  if (grossRate == null) return { ok: false, reason: `no exchange rate for ${sale.currency}` };
  const netRate = sale.netCurrency ? brlPerUnit(sale.netCurrency) : null;

  const utm = { ...sale.utm };
  if (sale.touchId) {
    const { data: touch } = await supabaseAdmin
      .from("tracker_touches")
      .select("utm_source, utm_medium, utm_campaign, utm_content, utm_term")
      .eq("id", sale.touchId)
      .maybeSingle();
    if (touch) {
      for (const key of UTM_KEYS) utm[key] ??= touch[key] ?? undefined;
    }
  }

  const { data: existing } = await supabaseAdmin
    .from("tracker_sales")
    .select("status, approved_at, refunded_at")
    .eq("provider", sale.provider)
    .eq("external_id", sale.externalId)
    .maybeSingle();

  const previous = existing?.status as SaleStatus | undefined;
  const status =
    previous && STATUS_RANK[previous] > STATUS_RANK[sale.status] ? previous : sale.status;

  const { error } = await supabaseAdmin.from("tracker_sales").upsert(
    {
      provider: sale.provider,
      external_id: sale.externalId,
      parent_external_id: sale.parentExternalId,
      kind: sale.kind,
      status,
      product_id: sale.productId,
      product_name: sale.productName,
      currency: sale.currency,
      gross_cents: sale.grossCents,
      gross_brl_cents: Math.round(sale.grossCents * grossRate),
      fx_rate: sale.currency === "BRL" ? null : grossRate,
      net_brl_cents:
        sale.netCents != null && netRate != null ? Math.round(sale.netCents * netRate) : null,
      payment_method: sale.paymentMethod,
      buyer_email: sale.buyerEmail,
      touch_id: sale.touchId,
      utm_source: utm.utm_source ?? null,
      utm_medium: utm.utm_medium ?? null,
      utm_campaign: utm.utm_campaign ?? null,
      utm_content: utm.utm_content ?? null,
      utm_term: utm.utm_term ?? null,
      ordered_at: sale.orderedAt,
      // The first approval date is kept: a refund must not move the sale to another day.
      approved_at: existing?.approved_at ?? sale.approvedAt,
      refunded_at: existing?.refunded_at ?? sale.refundedAt,
      raw: raw as Json,
    },
    { onConflict: "provider,external_id" },
  );
  if (error) return { ok: false, reason: `database: ${error.message}` };

  return {
    ok: true,
    externalId: sale.externalId,
    status,
    attributed: Boolean(utm.utm_campaign || utm.utm_source),
  };
}
