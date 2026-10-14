/**
 * The numbers on /painel, computed from sales and ad spend.
 *
 * Pure functions, shared by the server function that serves the dashboard and
 * by anything that needs to check the math. Amounts are BRL as plain numbers and
 * are rounded only when displayed, so a ratio of two totals is never computed
 * from already rounded parts.
 */

import {
  DASHBOARD_TIME_ZONE,
  DASHBOARD_UTC_OFFSET,
  FEE_RULES,
  META_TAX_RATE,
  type SaleKind,
  type SaleProvider,
} from "./tracker-config";

export type MetricSale = {
  provider: SaleProvider;
  kind: SaleKind;
  grossBrlCents: number;
  /** Net reported by the checkout; null means "apply the fee rule". */
  netBrlCents: number | null;
  utmCampaign: string | null;
};

export type ProviderTotals = {
  provider: SaleProvider;
  items: number;
  grossBrl: number;
  feesBrl: number;
  /** Items whose fee came from the webhook rather than from FEE_RULES. */
  reportedItems: number;
};

export type Financials = {
  items: number;
  frontOrders: number;
  grossBrl: number;
  frontGrossBrl: number;
  feesBrl: number;
  netBrl: number;
  /** Fees over gross, 0.054 for 5.4%. */
  feeEffective: number | null;
  /** Ad spend as Ads Manager reports it, without taxes. Null when unavailable. */
  spendBrl: number | null;
  /** Spend plus the tax Meta bills on top of it. */
  billingBrl: number | null;
  /** Net revenue minus the billed ad cost. */
  profitBrl: number | null;
  /** Gross revenue over spend. */
  roas: number | null;
  /** Net revenue over the billed ad cost. */
  roi: number | null;
  /** Spend per front order. */
  cpaBrl: number | null;
  /** Gross of front items per front order. */
  aovBrl: number | null;
  providers: ProviderTotals[];
};

function ratio(numerator: number, denominator: number | null): number | null {
  if (denominator == null || denominator <= 0) return null;
  return numerator / denominator;
}

/** What Meta bills for a given spend: the tax is charged "por dentro". */
export function billedAdCost(spendBrl: number, taxRate = META_TAX_RATE): number {
  return spendBrl / (1 - taxRate);
}

export function computeFinancials(
  sales: MetricSale[],
  spendBrl: number | null,
  taxRate = META_TAX_RATE,
): Financials {
  const byProvider = new Map<SaleProvider, ProviderTotals>();
  let frontOrders = 0;
  let frontGrossBrl = 0;

  for (const sale of sales) {
    const grossBrl = sale.grossBrlCents / 100;
    const totals = byProvider.get(sale.provider) ?? {
      provider: sale.provider,
      items: 0,
      grossBrl: 0,
      feesBrl: 0,
      reportedItems: 0,
    };
    totals.items += 1;
    totals.grossBrl += grossBrl;
    if (sale.netBrlCents != null) {
      totals.feesBrl += grossBrl - sale.netBrlCents / 100;
      totals.reportedItems += 1;
    } else {
      const rule = FEE_RULES[sale.provider];
      totals.feesBrl += grossBrl * rule.percent + rule.fixedBrl;
    }
    byProvider.set(sale.provider, totals);

    if (sale.kind === "front") {
      frontOrders += 1;
      frontGrossBrl += grossBrl;
    }
  }

  const providers = [...byProvider.values()].sort((a, b) => b.grossBrl - a.grossBrl);
  const grossBrl = providers.reduce((sum, p) => sum + p.grossBrl, 0);
  const feesBrl = providers.reduce((sum, p) => sum + p.feesBrl, 0);
  const netBrl = grossBrl - feesBrl;
  const billingBrl = spendBrl == null ? null : billedAdCost(spendBrl, taxRate);

  return {
    items: sales.length,
    frontOrders,
    grossBrl,
    frontGrossBrl,
    feesBrl,
    netBrl,
    feeEffective: ratio(feesBrl, grossBrl),
    spendBrl,
    billingBrl,
    profitBrl: billingBrl == null ? null : netBrl - billingBrl,
    roas: ratio(grossBrl, spendBrl),
    roi: ratio(netBrl, billingBrl),
    cpaBrl: spendBrl == null || frontOrders === 0 ? null : spendBrl / frontOrders,
    aovBrl: frontOrders === 0 ? null : frontGrossBrl / frontOrders,
    providers,
  };
}

/**
 * Splits "Campaign name|1234567890" into name and id. The dashboard recommends
 * that format for utm_campaign (META_URL_PARAMETERS) because the id survives a
 * rename; a value without the id still groups by name.
 */
export function parseUtmCampaign(value: string | null): { id: string | null; name: string | null } {
  const trimmed = value?.trim();
  if (!trimmed) return { id: null, name: null };
  const bar = trimmed.lastIndexOf("|");
  if (bar >= 0) {
    const id = trimmed.slice(bar + 1).trim();
    if (/^\d{5,}$/.test(id)) return { id, name: trimmed.slice(0, bar).trim() || null };
  }
  return { id: null, name: trimmed };
}

export type CampaignSpend = { id: string; name: string; spendBrl: number };

export type CampaignRow = {
  key: string;
  name: string;
  campaignId: string | null;
  /** Null when the campaign has no spend data (no id match, or Meta unavailable). */
  spendBrl: number | null;
  frontOrders: number;
  items: number;
  grossBrl: number;
  roas: number | null;
};

export const NO_CAMPAIGN_KEY = "none";

/**
 * Sales and spend per campaign. A sale joins its campaign by the id in
 * utm_campaign, or by an exact name match when the id is missing. Campaigns that
 * spent without selling are listed too: they are where the money is lost.
 */
export function campaignBreakdown(
  sales: MetricSale[],
  spend: CampaignSpend[] | null,
): CampaignRow[] {
  const rows = new Map<string, CampaignRow>();
  const idByName = new Map<string, string>();

  for (const campaign of spend ?? []) {
    idByName.set(campaign.name.trim().toLowerCase(), campaign.id);
    const key = `id:${campaign.id}`;
    const row = rows.get(key);
    if (row) {
      row.spendBrl = (row.spendBrl ?? 0) + campaign.spendBrl;
    } else {
      rows.set(key, {
        key,
        name: campaign.name,
        campaignId: campaign.id,
        spendBrl: campaign.spendBrl,
        frontOrders: 0,
        items: 0,
        grossBrl: 0,
        roas: null,
      });
    }
  }

  for (const sale of sales) {
    const parsed = parseUtmCampaign(sale.utmCampaign);
    const id = parsed.id ?? (parsed.name ? idByName.get(parsed.name.toLowerCase()) : undefined);
    const key = id
      ? `id:${id}`
      : parsed.name
        ? `name:${parsed.name.toLowerCase()}`
        : NO_CAMPAIGN_KEY;
    let row = rows.get(key);
    if (!row) {
      row = {
        key,
        name: parsed.name ?? "Sem UTM de campanha",
        campaignId: id ?? null,
        spendBrl: null,
        frontOrders: 0,
        items: 0,
        grossBrl: 0,
        roas: null,
      };
      rows.set(key, row);
    }
    row.items += 1;
    row.grossBrl += sale.grossBrlCents / 100;
    if (sale.kind === "front") row.frontOrders += 1;
  }

  for (const row of rows.values()) row.roas = ratio(row.grossBrl, row.spendBrl);

  return [...rows.values()].sort(
    (a, b) => b.grossBrl - a.grossBrl || (b.spendBrl ?? 0) - (a.spendBrl ?? 0),
  );
}

export const PERIODS = {
  today: "Hoje",
  yesterday: "Ontem",
  "7d": "7 dias",
  "30d": "30 dias",
  month: "Este mês",
} as const;

export type Period = keyof typeof PERIODS;

export type PeriodRange = {
  period: Period;
  /** First and last day, inclusive, as YYYY-MM-DD in DASHBOARD_TIME_ZONE. */
  since: string;
  until: string;
  /** The same days as instants: [startIso, endIso). */
  startIso: string;
  endIso: string;
};

/** YYYY-MM-DD of an instant, in the dashboard's time zone. */
export function localDate(instant: Date, timeZone = DASHBOARD_TIME_ZONE): string {
  // en-CA formats as YYYY-MM-DD.
  return new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(instant);
}

function addDays(day: string, days: number): string {
  const date = new Date(`${day}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

export function periodRange(period: Period, now: Date): PeriodRange {
  const today = localDate(now);
  const [since, until] =
    period === "today"
      ? [today, today]
      : period === "yesterday"
        ? [addDays(today, -1), addDays(today, -1)]
        : period === "7d"
          ? [addDays(today, -6), today]
          : period === "30d"
            ? [addDays(today, -29), today]
            : [`${today.slice(0, 8)}01`, today];

  return {
    period,
    since,
    until,
    startIso: `${since}T00:00:00${DASHBOARD_UTC_OFFSET}`,
    endIso: `${addDays(until, 1)}T00:00:00${DASHBOARD_UTC_OFFSET}`,
  };
}
