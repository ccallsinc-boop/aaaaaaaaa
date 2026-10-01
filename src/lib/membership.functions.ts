import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export type Membership = {
  email: string;
  active: boolean;
  status: string | null;
  name: string | null;
  plan: string | null;
  startedAt: string | null;
  endedAt: string | null;
};

export const getMyMembership = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<Membership> => {
    const email = (context.claims?.["email"] as string | undefined) ?? "";
    const { data, error } = await context.supabase
      .from("subscribers")
      .select("email, name, status, plan, started_at, ended_at")
      .ilike("email", email)
      .maybeSingle();

    if (error) {
      console.error("membership lookup failed", error.message);
    }

    return {
      email,
      active: data?.status === "active",
      status: data?.status ?? null,
      name: data?.name ?? null,
      plan: data?.plan ?? null,
      startedAt: data?.started_at ?? null,
      endedAt: data?.ended_at ?? null,
    };
  });
