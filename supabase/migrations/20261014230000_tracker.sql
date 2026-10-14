-- Sales tracker behind /painel: ad clicks with their UTMs, and sales normalized
-- from the checkout webhooks. Only the server (service role) reads and writes
-- these tables: RLS is on with no policy, so no browser can query them.

-- One ad click. The id is generated in the browser and travels to the checkout
-- in the `src` parameter; the sale's webhook brings it back and the sale
-- inherits the click's UTMs.
CREATE TABLE public.tracker_touches (
  id TEXT PRIMARY KEY,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_content TEXT,
  utm_term TEXT,
  landing_path TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- One sold item. Order bumps and upsells are rows of their own, linked to the
-- main order through parent_external_id.
CREATE TABLE public.tracker_sales (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  provider TEXT NOT NULL,
  external_id TEXT NOT NULL,
  parent_external_id TEXT,
  kind TEXT NOT NULL DEFAULT 'front',
  status TEXT NOT NULL,
  product_id TEXT,
  product_name TEXT,
  -- Amount in the currency the buyer paid, in cents.
  currency TEXT NOT NULL,
  gross_cents BIGINT NOT NULL,
  -- The same amount in BRL. For other currencies, converted at the rate of the
  -- moment the webhook arrived (fx_rate = BRL per unit of the currency).
  gross_brl_cents BIGINT NOT NULL,
  fx_rate NUMERIC,
  -- Net amount reported by the checkout itself, in BRL. Null when the checkout
  -- does not report it: the dashboard then applies the fee in tracker-config.ts.
  net_brl_cents BIGINT,
  payment_method TEXT,
  buyer_email TEXT,
  touch_id TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_content TEXT,
  utm_term TEXT,
  ordered_at TIMESTAMPTZ,
  approved_at TIMESTAMPTZ,
  refunded_at TIMESTAMPTZ,
  raw JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (provider, external_id)
);

CREATE INDEX tracker_sales_approved_at_idx ON public.tracker_sales (approved_at);

GRANT ALL ON public.tracker_touches TO service_role;
GRANT ALL ON public.tracker_sales TO service_role;

ALTER TABLE public.tracker_touches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tracker_sales ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER update_tracker_sales_updated_at
  BEFORE UPDATE ON public.tracker_sales
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
