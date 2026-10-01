import { Cta } from "@/components/landing/Cta";
import { useLocale } from "@/lib/locale";

export function MidCta({ index }: { index: number }) {
  const { t } = useLocale();
  const [title, label] = t.midCtas[index] ?? ["", ""];

  return (
    <section className="px-5 py-6 sm:py-8">
      <div className="mx-auto max-w-4xl rounded-2xl border border-border bg-primary-soft p-7 text-center shadow-soft sm:p-10">
        <h2 className="mx-auto max-w-2xl text-[clamp(1.7rem,4.5vw,2.5rem)]">
          {title}
        </h2>
        <Cta className="mt-7 w-full sm:w-auto" location={`mid-${index + 1}`}>
          {label}
        </Cta>
      </div>
    </section>
  );
}
