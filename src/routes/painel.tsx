import { useEffect, useState, type ReactNode } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import type { Session } from "@supabase/supabase-js";
import {
  Banknote,
  Check,
  CircleDollarSign,
  Copy,
  Layers,
  LogOut,
  Megaphone,
  Percent,
  PiggyBank,
  Receipt,
  RefreshCw,
  Settings2,
  ShoppingCart,
  Target,
  TrendingUp,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import { isSupabaseConfigured, supabase } from "@/integrations/supabase/client";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { META_TAX_RATE, META_URL_PARAMETERS } from "@/lib/tracker-config";
import { PERIODS, type CampaignRow, type Period } from "@/lib/tracker-metrics";
import { getTrackerDashboard, type DashboardData } from "@/lib/tracker.functions";

export const Route = createFileRoute("/painel")({
  // The session lives in the browser, and the numbers are private: nothing to SSR.
  ssr: false,
  head: () => ({
    meta: [
      { title: "Painel de vendas — Framers" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: PainelPage,
});

const brlFormat = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

function brl(value: number | null): string {
  return value == null ? "—" : brlFormat.format(value);
}

function decimal(value: number | null): string {
  return value == null
    ? "—"
    : value.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function percent(value: number | null, digits = 1): string {
  return value == null
    ? "—"
    : `${(value * 100).toLocaleString("pt-BR", { minimumFractionDigits: digits, maximumFractionDigits: digits })}%`;
}

function PainelPage() {
  const configured = isSupabaseConfigured();
  // undefined while the stored session is being read.
  const [session, setSession] = useState<Session | null | undefined>(configured ? undefined : null);

  useEffect(() => {
    if (!configured) return;
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data } = supabase.auth.onAuthStateChange((_event, next) => setSession(next));
    return () => data.subscription.unsubscribe();
  }, [configured]);

  return (
    <main className="min-h-screen bg-[#0b0b0c] px-4 py-6 text-zinc-100 sm:px-6 sm:py-10">
      <div className="mx-auto w-full max-w-3xl space-y-5">
        {!configured ? (
          <Notice>
            O Supabase não está configurado neste ambiente, então não há login nem vendas para
            mostrar.
          </Notice>
        ) : session === undefined ? (
          <p className="py-20 text-center text-sm text-zinc-500">Carregando…</p>
        ) : session === null ? (
          <LoginForm />
        ) : (
          <Dashboard email={session.user.email ?? ""} />
        )}
      </div>
    </main>
  );
}

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    setLoading(false);
    if (signInError) setError("E-mail ou senha incorretos.");
  }

  const field =
    "h-12 w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 text-base text-zinc-100 outline-none placeholder:text-zinc-600 focus:border-zinc-500";

  return (
    <form
      onSubmit={submit}
      className="mx-auto mt-16 max-w-sm space-y-4 rounded-3xl border border-zinc-800 bg-[#121213] p-6"
    >
      <div>
        <h1 className="text-xl font-bold">Painel de vendas</h1>
        <p className="mt-1 text-sm text-zinc-400">Entre com um e-mail autorizado.</p>
      </div>
      <input
        className={field}
        type="email"
        autoComplete="email"
        placeholder="E-mail"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        className={field}
        type="password"
        autoComplete="current-password"
        placeholder="Senha"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      {error && <p className="text-sm text-red-400">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="h-12 w-full rounded-xl bg-zinc-100 font-semibold text-zinc-900 transition-opacity disabled:opacity-60"
      >
        {loading ? "Entrando…" : "Entrar"}
      </button>
    </form>
  );
}

function Dashboard({ email }: { email: string }) {
  const [period, setPeriod] = useState<Period>("today");
  const query = useQuery({
    queryKey: ["tracker-dashboard", period],
    queryFn: () => getTrackerDashboard({ data: { period } }),
    refetchInterval: 60_000,
  });

  const response = query.data;

  return (
    <>
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold tracking-tight">Painel de vendas</h1>
          <p className="truncate text-sm text-zinc-500">{email}</p>
        </div>
        <div className="flex items-center gap-2">
          <IconButton
            label="Atualizar"
            onClick={() => void query.refetch()}
            icon={RefreshCw}
            spinning={query.isFetching}
          />
          <IconButton label="Sair" onClick={() => void supabase.auth.signOut()} icon={LogOut} />
        </div>
      </header>

      <nav className="flex gap-1 overflow-x-auto rounded-2xl border border-zinc-800 bg-[#121213] p-1">
        {(Object.keys(PERIODS) as Period[]).map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => setPeriod(key)}
            className={`shrink-0 flex-1 whitespace-nowrap rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
              period === key ? "bg-zinc-100 text-zinc-900" : "text-zinc-400 hover:text-zinc-100"
            }`}
          >
            {PERIODS[key]}
          </button>
        ))}
      </nav>

      {query.isError ? (
        <Notice tone="error">
          Não foi possível carregar o painel: {(query.error as Error).message}
        </Notice>
      ) : !response ? (
        <p className="py-20 text-center text-sm text-zinc-500">Carregando…</p>
      ) : response.status === "forbidden" ? (
        <Notice tone="error">
          O e-mail {response.email || "desta conta"} não está autorizado. Inclua-o na variável
          TRACKER_ADMIN_EMAILS do servidor.
        </Notice>
      ) : (
        <DashboardBody data={response.data} />
      )}
    </>
  );
}

function DashboardBody({ data }: { data: DashboardData }) {
  const f = data.financials;
  const provider = data.providerName;
  const itemsLabel = `${f.items} ${f.items === 1 ? "item" : "itens"}${provider ? ` ${provider}` : ""}`;
  const tax = percent(META_TAX_RATE, 2);
  const updatedAt = new Date(data.generatedAt).toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <>
      <Warnings data={data} />

      <Section
        icon={PiggyBank}
        title="Resultado do período"
        subtitle="Receita, custos e margem do período"
      >
        <MetricCard
          wide
          icon={CircleDollarSign}
          label="Lucro real"
          value={brl(f.profitBrl)}
          tone={f.profitBrl == null ? "plain" : f.profitBrl >= 0 ? "good" : "bad"}
          info={`Faturamento líquido menos o custo dos anúncios com impostos (fatura estimada). ${brl(f.netBrl)} − ${brl(f.billingBrl)}.`}
        />
        <MetricCard
          icon={Banknote}
          label="Faturamento bruto"
          value={brl(f.grossBrl)}
          sub={`${itemsLabel} · ${data.feeLabel}`}
          info="Soma do valor pago de cada item aprovado no período (front, order bumps e upsells), já em reais. Reembolsos e chargebacks saem da conta."
        />
        <MetricCard
          icon={Wallet}
          label="Faturamento líquido"
          value={brl(f.netBrl)}
          sub={`${provider ?? "Checkouts"} · bruto − fees`}
          info="O que sobra do faturamento bruto depois das taxas do checkout."
        />
        <MetricCard
          icon={Megaphone}
          label="Tráfego Insights"
          value={brl(f.spendBrl)}
          sub={`Fatura est. ${brl(f.billingBrl)}`}
          info={`Gasto em anúncios como o Gerenciador do Meta mostra, sem impostos. A fatura estimada soma os ${tax} de PIS/Cofins e ISS que o Meta cobra por dentro no Brasil: gasto ÷ (1 − ${tax}).`}
        />
        <MetricCard
          icon={Receipt}
          label={provider ? `Fees ${provider}` : "Fees checkout"}
          value={brl(f.feesBrl)}
          tone="warn"
          sub={`${data.feeLabel} · ${percent(f.feeEffective)} efetivo`}
          info="Taxas cobradas pelo checkout. Quando o webhook informa o líquido (Hotmart), usa o valor exato; senão, aplica a taxa configurada em src/lib/tracker-config.ts. Efetivo = fees ÷ bruto."
        />
      </Section>

      <Section
        icon={TrendingUp}
        title="Eficiência de mídia"
        subtitle="Retorno sobre investimento e unit economics"
      >
        <MetricCard
          icon={TrendingUp}
          label="ROAS"
          value={decimal(f.roas)}
          tone={f.roas == null ? "plain" : f.roas >= 1 ? "good" : "bad"}
          sub={`bruto ÷ Insights (${brl(f.spendBrl)})`}
          info="Faturamento bruto dividido pelo gasto em anúncios sem impostos. É a conta do Gerenciador do Meta."
        />
        <MetricCard
          icon={Percent}
          label="ROI real"
          value={decimal(f.roi)}
          tone={f.roi == null ? "plain" : f.roi >= 1 ? "good" : "bad"}
          sub="líquido ÷ fatura de anúncios"
          info="Faturamento líquido dividido pelo custo dos anúncios com impostos: quanto volta para o caixa a cada R$ 1 que sai para o Meta."
        />
        <MetricCard
          icon={Target}
          label="CPA"
          value={brl(f.cpaBrl)}
          sub={`${f.frontOrders} front · ${itemsLabel}`}
          info="Gasto em anúncios dividido pelo número de pedidos do produto principal (front). Order bumps e upsells não contam como aquisição."
        />
        <MetricCard
          icon={ShoppingCart}
          label="Ticket médio (AOV)"
          value={brl(f.aovBrl)}
          sub="front bruto ÷ pedidos front"
          info="Faturamento bruto dos itens front dividido pelo número de pedidos front."
        />
      </Section>

      <CampaignTable rows={data.campaigns} />

      <p className="text-center text-xs text-zinc-600">
        {data.range.since === data.range.until
          ? data.range.since.split("-").reverse().join("/")
          : `${data.range.since.split("-").reverse().join("/")} a ${data.range.until.split("-").reverse().join("/")}`}{" "}
        · horário de Brasília · atualizado às {updatedAt}
      </p>

      <SetupPanel />
    </>
  );
}

function Warnings({ data }: { data: DashboardData }) {
  const notes: { tone: "info" | "error"; text: string }[] = [];
  if (data.meta.status === "missing_config") {
    notes.push({
      tone: "info",
      text: "O gasto do Meta ainda não está configurado (META_ADS_ACCESS_TOKEN e META_AD_ACCOUNT_IDS). Lucro, ROAS, ROI e CPA ficam em branco até lá.",
    });
  } else if (data.meta.status === "error") {
    notes.push({ tone: "error", text: `O Meta recusou a consulta de gasto: ${data.meta.message}` });
  }
  if (data.convertedItems > 0) {
    notes.push({
      tone: "info",
      text: `${data.convertedItems} ${data.convertedItems === 1 ? "item foi pago" : "itens foram pagos"} em outra moeda e convertidos para reais pela cotação do momento da venda.`,
    });
  }
  if (notes.length === 0) return null;
  return (
    <div className="space-y-2">
      {notes.map((note) => (
        <Notice key={note.text} tone={note.tone}>
          {note.text}
        </Notice>
      ))}
    </div>
  );
}

function Section({
  icon: Icon,
  title,
  subtitle,
  children,
}: {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-3xl border border-zinc-800 bg-[#121213] p-3 sm:p-5">
      <div className="mb-4 flex items-center gap-3 px-1 pt-1">
        <IconBox icon={Icon} />
        <div className="min-w-0">
          <h2 className="text-lg font-semibold leading-tight">{title}</h2>
          <p className="text-sm text-zinc-400">{subtitle}</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">{children}</div>
    </section>
  );
}

const TONES = {
  plain: "text-zinc-50",
  good: "text-green-400",
  bad: "text-red-400",
  warn: "text-amber-300",
} as const;

function MetricCard({
  icon,
  label,
  value,
  sub,
  info,
  tone = "plain",
  wide = false,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  sub?: string;
  info: string;
  tone?: keyof typeof TONES;
  wide?: boolean;
}) {
  return (
    <div
      className={`flex min-w-0 flex-col rounded-2xl border border-zinc-800 bg-[#18181a] p-3 sm:p-4 ${
        wide ? "col-span-2" : ""
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        {/* Half-width cards on a phone are too narrow for icon, label and button in
            one row ("FATURAMENTO" alone does not fit), so the label drops below the icon. */}
        <div
          className={`flex min-w-0 gap-2.5 ${
            wide ? "items-center" : "flex-col sm:flex-row sm:items-center"
          }`}
        >
          <IconBox icon={icon} small />
          <span className="text-[0.7rem] font-medium uppercase leading-snug tracking-[0.08em] text-zinc-400 sm:text-xs">
            {label}
          </span>
        </div>
        <InfoButton text={info} label={label} />
      </div>
      <p
        className={`mt-4 break-words font-bold tabular-nums tracking-tight ${TONES[tone]} ${
          wide ? "text-3xl sm:text-4xl" : "text-[1.35rem] sm:text-3xl"
        }`}
      >
        {value}
      </p>
      {sub && <p className="mt-2 text-xs leading-snug text-zinc-400 sm:text-sm">{sub}</p>}
    </div>
  );
}

function IconBox({ icon: Icon, small = false }: { icon: LucideIcon; small?: boolean }) {
  return (
    <span
      className={`grid shrink-0 place-items-center rounded-xl border border-zinc-700/80 bg-zinc-900 text-zinc-300 ${
        small ? "size-8 sm:size-9" : "size-11"
      }`}
    >
      <Icon className={small ? "size-4" : "size-5"} strokeWidth={1.75} />
    </span>
  );
}

function InfoButton({ text, label }: { text: string; label: string }) {
  return (
    <Popover>
      <PopoverTrigger
        aria-label={`Como ${label} é calculado`}
        className="grid size-8 shrink-0 place-items-center rounded-lg border border-zinc-700/80 bg-zinc-800/60 font-serif text-sm text-zinc-300 hover:text-zinc-50"
      >
        i
      </PopoverTrigger>
      <PopoverContent
        collisionPadding={16}
        className="w-72 border-zinc-700 bg-zinc-900 text-sm leading-relaxed text-zinc-200"
      >
        {text}
      </PopoverContent>
    </Popover>
  );
}

function IconButton({
  label,
  icon: Icon,
  onClick,
  spinning = false,
}: {
  label: string;
  icon: LucideIcon;
  onClick: () => void;
  spinning?: boolean;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className="grid size-10 place-items-center rounded-xl border border-zinc-800 bg-[#121213] text-zinc-300 hover:text-zinc-50"
    >
      <Icon className={`size-4 ${spinning ? "animate-spin" : ""}`} />
    </button>
  );
}

function Notice({ children, tone = "info" }: { children: ReactNode; tone?: "info" | "error" }) {
  return (
    <p
      className={`rounded-2xl border px-4 py-3 text-sm leading-relaxed ${
        tone === "error"
          ? "border-red-900/60 bg-red-950/40 text-red-200"
          : "border-zinc-800 bg-[#121213] text-zinc-300"
      }`}
    >
      {children}
    </p>
  );
}

function CampaignTable({ rows }: { rows: CampaignRow[] }) {
  return (
    <section className="rounded-3xl border border-zinc-800 bg-[#121213] p-3 sm:p-5">
      <div className="mb-4 flex items-center gap-3 px-1 pt-1">
        <IconBox icon={Layers} />
        <div className="min-w-0">
          <h2 className="text-lg font-semibold leading-tight">Campanhas</h2>
          <p className="text-sm text-zinc-400">Vendas pela UTM do anúncio e gasto do Meta</p>
        </div>
      </div>
      {rows.length === 0 ? (
        <p className="px-1 pb-2 text-sm text-zinc-500">Sem vendas nem gasto no período.</p>
      ) : (
        // Front and item counts only fit from sm up; on a phone the money columns stay.
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs tabular-nums sm:text-sm">
            <thead className="text-[0.65rem] uppercase tracking-wider text-zinc-500 sm:text-xs">
              <tr>
                <th className="py-2 pr-2 font-medium sm:pr-3">Campanha</th>
                <th className="py-2 pr-2 text-right font-medium sm:pr-3">Gasto</th>
                <th className="hidden py-2 pr-3 text-right font-medium sm:table-cell">Front</th>
                <th className="hidden py-2 pr-3 text-right font-medium sm:table-cell">Itens</th>
                <th className="py-2 pr-2 text-right font-medium sm:pr-3">Bruto</th>
                <th className="py-2 text-right font-medium">ROAS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {rows.map((row) => (
                <tr key={row.key}>
                  <td
                    className="max-w-[7.5rem] truncate py-2.5 pr-2 text-zinc-200 sm:max-w-[14rem] sm:pr-3"
                    title={row.name}
                  >
                    {row.name}
                  </td>
                  <td className="whitespace-nowrap py-2.5 pr-2 text-right text-zinc-300 sm:pr-3">
                    {brl(row.spendBrl)}
                  </td>
                  <td className="hidden py-2.5 pr-3 text-right text-zinc-300 sm:table-cell">
                    {row.frontOrders}
                  </td>
                  <td className="hidden py-2.5 pr-3 text-right text-zinc-300 sm:table-cell">
                    {row.items}
                  </td>
                  <td className="whitespace-nowrap py-2.5 pr-2 text-right text-zinc-100 sm:pr-3">
                    {brl(row.grossBrl)}
                  </td>
                  <td
                    className={`py-2.5 text-right ${
                      row.roas == null
                        ? "text-zinc-500"
                        : row.roas >= 1
                          ? "text-green-400"
                          : "text-red-400"
                    }`}
                  >
                    {decimal(row.roas)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

function CopyField({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div>
      <p className="mb-1.5 text-xs font-medium uppercase tracking-wider text-zinc-500">{label}</p>
      <div className="flex items-start gap-2">
        <code className="min-w-0 flex-1 break-all rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-zinc-300">
          {value}
        </code>
        <button
          type="button"
          aria-label={`Copiar ${label}`}
          onClick={() => {
            void navigator.clipboard.writeText(value).then(() => {
              setCopied(true);
              setTimeout(() => setCopied(false), 1500);
            });
          }}
          className="grid size-9 shrink-0 place-items-center rounded-xl border border-zinc-800 bg-zinc-900 text-zinc-300 hover:text-zinc-50"
        >
          {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
        </button>
      </div>
    </div>
  );
}

function SetupPanel() {
  const origin = typeof window === "undefined" ? "" : window.location.origin;
  return (
    <details className="group rounded-3xl border border-zinc-800 bg-[#121213] p-3 sm:p-5">
      <summary className="flex cursor-pointer list-none items-center gap-3 px-1 pt-1">
        <IconBox icon={Settings2} />
        <div className="min-w-0">
          <h2 className="text-lg font-semibold leading-tight">Configuração</h2>
          <p className="text-sm text-zinc-400">Webhooks dos checkouts e UTMs dos anúncios</p>
        </div>
      </summary>
      <div className="mt-5 space-y-4 px-1 pb-1">
        <CopyField label="Parâmetros de URL dos anúncios do Meta" value={META_URL_PARAMETERS} />
        <CopyField label="Webhook da Hotmart (versão 2.0)" value={`${origin}/api/public/hotmart`} />
        <CopyField label="Webhook da Hubla (versão 2)" value={`${origin}/api/public/hubla`} />
        <p className="text-sm leading-relaxed text-zinc-400">
          O site guarda a UTM do clique e a repassa para o checkout junto com um código em{" "}
          <code className="text-zinc-300">src</code>. A venda chega pelo webhook e é ligada à
          campanha por esse código. Vendas sem o código ou sem UTM aparecem como “Sem UTM de
          campanha”.
        </p>
      </div>
    </details>
  );
}
