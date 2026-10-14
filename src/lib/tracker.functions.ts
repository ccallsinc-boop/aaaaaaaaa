import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { FEE_RULES, type SaleKind, type SaleProvider } from "./tracker-config";
import {
  PERIODS,
  campaignBreakdown,
  computeFinancials,
  periodRange,
  type CampaignRow,
  type Financials,
  type MetricSale,
  type Period,
  type PeriodRange,
} from "./tracker-metrics";
import { TOUCH_ID_PATTERN, UTM_KEYS } from "./tracker-utm";

const param = z.string().trim().max(500).optional();

const touchSchema = z
  .object({
    id: z.string().regex(TOUCH_ID_PATTERN),
    utm_source: param,
    utm_medium: param,
    utm_campaign: param,
    utm_content: param,
    utm_term: param,
    landing_path: z.string().max(500).optional(),
  })
  .refine((touch) => UTM_KEYS.some((key) => touch[key]), "empty touch");

/**
 * Stores an ad click so a later sale can find its UTMs by id. Public on purpose:
 * it runs on the landing for anonymous visitors. It only accepts a well-formed
 * id plus bounded UTM strings, and never overwrites an existing click.
 */
export const recordTouch = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => touchSchema.parse(data))
  .handler(async ({ data }) => {
    try {
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      const { error } = await supabaseAdmin
        .from("tracker_touches")
        .upsert(data, { onConflict: "id", ignoreDuplicates: true });
      if (error) throw new Error(error.message);
      return { ok: true as const };
    } catch (error) {
      // The funnel must not care: without the record the sale is just unattributed.
      console.warn("[tracker] could not record touch:", error);
      return { ok: false as const };
    }
  });

export type DashboardData = {
  range: PeriodRange;
  financials: Financials;
  campaigns: CampaignRow[];
  meta:
    | { status: "ok"; currencies: string[] }
    | { status: "missing_config" }
    | { status: "error"; message: string };
  /** Items paid in a currency other than BRL, converted at the webhook's rate. */
  convertedItems: number;
  /** "4,99% + R$ 2,49" when one rule explains every fee, else a short description. */
  feeLabel: string;
  /** Display name of the only checkout in the period, or null when several sold. */
  providerName: string | null;
  generatedAt: string;
};

export type DashboardResponse =
  { status: "ok"; data: DashboardData } | { status: "forbidden"; email: string };

const PROVIDER_NAMES: Record<SaleProvider, string> = { hubla: "Hubla", hotmart: "Hotmart" };

/** TRACKER_ADMIN_EMAILS: comma-separated e-mails allowed to open /painel. */
function isAdmin(email: string): boolean {
  const admins = (process.env["TRACKER_ADMIN_EMAILS"] ?? "")
    .split(",")
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);
  return email !== "" && admins.includes(email.toLowerCase());
}

/** PostgREST returns at most 1000 rows per request. */
const PAGE_SIZE = 1000;

const periodSchema = z.object({
  period: z.enum(Object.keys(PERIODS) as [Period, ...Period[]]),
});

export const getTrackerDashboard = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => periodSchema.parse(data))
  .handler(async ({ data, context }): Promise<DashboardResponse> => {
    const email = (context.claims?.["email"] as string | undefined) ?? "";
    if (!isAdmin(email)) return { status: "forbidden", email };

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { getMetaSpend } = await import("./tracker-meta.server");

    const range = periodRange(data.period, new Date());

    const sales: (MetricSale & { currency: string })[] = [];
    for (let from = 0; ; from += PAGE_SIZE) {
      const { data: rows, error } = await supabaseAdmin
        .from("tracker_sales")
        .select("provider, kind, gross_brl_cents, net_brl_cents, utm_campaign, currency")
        .eq("status", "paid")
        .gte("approved_at", range.startIso)
        .lt("approved_at", range.endIso)
        .order("approved_at", { ascending: true })
        .range(from, from + PAGE_SIZE - 1);
      if (error) throw new Error(`tracker_sales: ${error.message}`);
      for (const row of rows) {
        sales.push({
          provider: row.provider as SaleProvider,
          kind: row.kind as SaleKind,
          grossBrlCents: row.gross_brl_cents,
          netBrlCents: row.net_brl_cents,
          utmCampaign: row.utm_campaign,
          currency: row.currency,
        });
      }
      if (rows.length < PAGE_SIZE) break;
    }

    const meta = await getMetaSpend(range.since, range.until);
    const spendBrl = meta.status === "ok" ? meta.totalBrl : null;
    const financials = computeFinancials(sales, spendBrl);

    const providers = financials.providers;
    const only = providers.length === 1 ? providers[0] : undefined;
    const feeLabel = !only
      ? providers.length === 0
        ? "sem vendas"
        : "taxa de cada checkout"
      : only.reportedItems === only.items
        ? "líquido informado pelo checkout"
        : only.reportedItems === 0
          ? FEE_RULES[only.provider].label
          : `${FEE_RULES[only.provider].label} ou informado`;

    return {
      status: "ok",
      data: {
        range,
        financials,
        campaigns: campaignBreakdown(sales, meta.status === "ok" ? meta.campaigns : null),
        meta:
          meta.status === "ok"
            ? { status: "ok", currencies: meta.currencies }
            : meta.status === "error"
              ? { status: "error", message: meta.message }
              : { status: "missing_config" },
        convertedItems: sales.filter((sale) => sale.currency !== "BRL").length,
        feeLabel,
        providerName: only ? PROVIDER_NAMES[only.provider] : null,
        generatedAt: new Date().toISOString(),
      },
    };
  });
