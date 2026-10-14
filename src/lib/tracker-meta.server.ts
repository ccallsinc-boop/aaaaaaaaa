/**
 * Ad spend per campaign from the Meta Marketing API (Insights), in BRL.
 *
 * Needs a token with the ads_read permission, for example a System User token
 * from Business Manager. The Conversions API tokens in META_CAPI_ACCESS_TOKEN*
 * usually lack it. Spend here is what Ads Manager shows: WITHOUT the 12,15% tax
 * Meta adds to the invoice in Brazil (see META_TAX_RATE).
 *
 * Server-only: it reads secrets and the FX cache.
 */

import { getFxRates } from "./fx.server";
import type { CampaignSpend } from "./tracker-metrics";

export type MetaSpend =
  | { status: "ok"; totalBrl: number; campaigns: CampaignSpend[]; currencies: string[] }
  | { status: "missing_config" }
  | { status: "error"; message: string };

/** Override with META_GRAPH_VERSION when Meta retires this one. */
const DEFAULT_GRAPH_VERSION = "v24.0";
const CACHE_TTL_MS = 5 * 60 * 1000;
const FETCH_TIMEOUT_MS = 10_000;
/** A runaway pagination loop would otherwise hold the request open. */
const MAX_PAGES = 20;

const cache = new Map<string, { at: number; value: MetaSpend }>();

type InsightRow = {
  campaign_id?: string;
  campaign_name?: string;
  spend?: string;
  account_currency?: string;
};

type InsightsPage = {
  data?: InsightRow[];
  paging?: { next?: string };
  error?: { message?: string; code?: number };
};

/** META_AD_ACCOUNT_IDS: comma-separated, with or without the act_ prefix. */
function accountIds(): string[] {
  return (process.env["META_AD_ACCOUNT_IDS"] ?? "")
    .split(",")
    .map((id) => id.trim().replace(/^act_/, ""))
    .filter((id) => /^\d+$/.test(id));
}

async function fetchPage(url: string, token: string): Promise<InsightsPage> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    // The token goes in the header so it never shows up in a logged URL.
    const response = await fetch(url, {
      headers: { authorization: `Bearer ${token}` },
      signal: controller.signal,
    });
    const body = (await response.json()) as InsightsPage;
    if (!response.ok || body.error) {
      throw new Error(body.error?.message ?? `HTTP ${response.status}`);
    }
    return body;
  } finally {
    clearTimeout(timer);
  }
}

async function accountInsights(
  accountId: string,
  since: string,
  until: string,
  token: string,
): Promise<InsightRow[]> {
  const version = process.env["META_GRAPH_VERSION"] || DEFAULT_GRAPH_VERSION;
  const url = new URL(`https://graph.facebook.com/${version}/act_${accountId}/insights`);
  url.searchParams.set("level", "campaign");
  url.searchParams.set("fields", "campaign_id,campaign_name,spend,account_currency");
  url.searchParams.set("time_range", JSON.stringify({ since, until }));
  url.searchParams.set("limit", "500");

  const rows: InsightRow[] = [];
  let next: string | undefined = url.toString();
  for (let page = 0; next && page < MAX_PAGES; page++) {
    const body = await fetchPage(next, token);
    rows.push(...(body.data ?? []));
    next = body.paging?.next;
  }
  return rows;
}

/** Spend of every configured ad account between two days (YYYY-MM-DD, inclusive). */
export async function getMetaSpend(since: string, until: string): Promise<MetaSpend> {
  const token = process.env["META_ADS_ACCESS_TOKEN"];
  const ids = accountIds();
  if (!token || ids.length === 0) return { status: "missing_config" };

  const key = `${ids.join(",")}|${since}|${until}`;
  const cached = cache.get(key);
  if (cached && Date.now() - cached.at < CACHE_TTL_MS) return cached.value;

  try {
    const [accounts, fx] = await Promise.all([
      Promise.all(ids.map((id) => accountInsights(id, since, until, token))),
      getFxRates(),
    ]);

    const campaigns = new Map<string, CampaignSpend>();
    const currencies = new Set<string>();
    let totalBrl = 0;

    for (const row of accounts.flat()) {
      const spend = Number(row.spend ?? 0);
      if (!Number.isFinite(spend) || spend === 0) continue;
      const currency = (row.account_currency ?? "BRL").toUpperCase();
      currencies.add(currency);
      // fx.rates says how many units of X one BRL buys.
      const rate = currency === "BRL" ? 1 : fx.rates[currency];
      if (!rate) return { status: "error", message: `Sem cotação para ${currency}` };
      const spendBrl = spend / rate;
      totalBrl += spendBrl;

      const id = row.campaign_id ?? "unknown";
      const entry = campaigns.get(id);
      if (entry) entry.spendBrl += spendBrl;
      else campaigns.set(id, { id, name: row.campaign_name ?? id, spendBrl });
    }

    const value: MetaSpend = {
      status: "ok",
      totalBrl,
      campaigns: [...campaigns.values()],
      currencies: [...currencies],
    };
    cache.set(key, { at: Date.now(), value });
    return value;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("[tracker] Meta insights failed:", message);
    return { status: "error", message };
  }
}
