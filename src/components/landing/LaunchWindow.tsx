import { useEffect, useState } from "react";
import { Clock } from "lucide-react";

import { remainingUntil, type Remaining } from "@/lib/campaign";
import { useLocale } from "@/lib/locale";

/**
 * Countdown to the end of launch pricing.
 *
 * Renders nothing when there is no campaign or the window has already closed, so
 * an expired deadline disappears instead of sitting there contradicting itself.
 *
 * The clock starts from the server's timestamp, not the browser's, so changing
 * the device date does not extend the offer. The tick runs locally from that
 * baseline, which is enough: the price itself is decided server-side on every
 * request, so a client that fakes the countdown still gets charged the real price.
 */
export function LaunchWindow({ compact = false }: { compact?: boolean }) {
  const { t, money, priceAfter, campaignEndsAt, serverNow } = useLocale();

  // Offset between the server clock and this device, measured once.
  const [mountedAt] = useState(() => Date.now());
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => setTick((value) => value + 1), 1000);
    return () => window.clearInterval(id);
  }, []);

  if (!campaignEndsAt || !serverNow) return null;

  const elapsed = Date.now() - mountedAt;
  const remaining: Remaining | null = remainingUntil(campaignEndsAt, serverNow + elapsed);
  // `tick` only exists to re-render each second.
  void tick;

  if (!remaining) return null;

  const pad = (value: number) => String(value).padStart(2, "0");
  const units: [number, string][] = [
    [remaining.days, t.countdownDays],
    [remaining.hours, t.countdownHours],
    [remaining.minutes, t.countdownMinutes],
    [remaining.seconds, t.countdownSeconds],
  ];

  if (compact) {
    return (
      <p className="text-[11px] font-semibold text-primary">
        {t.countdownCompact(
          `${pad(remaining.days)}:${pad(remaining.hours)}:${pad(remaining.minutes)}:${pad(remaining.seconds)}`,
        )}
      </p>
    );
  }

  return (
    <div className="rounded-2xl border border-primary/30 bg-primary-soft p-5 text-center">
      <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-primary">
        <Clock className="h-3.5 w-3.5" aria-hidden="true" />
        {t.countdownTitle}
      </p>

      <div className="mt-4 flex justify-center gap-2 sm:gap-3">
        {units.map(([value, label]) => (
          <div
            key={label}
            className="min-w-[62px] rounded-xl border border-border bg-background px-3 py-2"
          >
            <span className="block font-display text-2xl leading-none text-foreground">
              {pad(value)}
            </span>
            <span className="mt-1 block text-[10px] uppercase tracking-wide text-muted-foreground">
              {label}
            </span>
          </div>
        ))}
      </div>

      {priceAfter ? (
        <p className="mt-4 text-sm text-muted-foreground">{t.countdownThen(money(priceAfter))}</p>
      ) : null}
    </div>
  );
}
