
-- Alerts table (admin-managed, public read)
CREATE TABLE public.farm_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  state_id TEXT NOT NULL DEFAULT 'all',
  title_en TEXT NOT NULL,
  title_ha TEXT NOT NULL DEFAULT '',
  message_en TEXT NOT NULL DEFAULT '',
  message_ha TEXT NOT NULL DEFAULT '',
  alert_type TEXT NOT NULL DEFAULT 'general',
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.farm_alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read active alerts"
  ON public.farm_alerts FOR SELECT
  USING (active = true);

CREATE POLICY "Anyone can insert alerts"
  ON public.farm_alerts FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update alerts"
  ON public.farm_alerts FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can delete alerts"
  ON public.farm_alerts FOR DELETE
  USING (true);

-- Analytics events table (simple counters)
CREATE TABLE public.analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL,
  event_value TEXT NOT NULL DEFAULT '',
  device_id TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert analytics"
  ON public.analytics_events FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can read analytics"
  ON public.analytics_events FOR SELECT
  USING (true);

-- Season tips table
CREATE TABLE public.season_tips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  state_id TEXT NOT NULL DEFAULT 'all',
  month INTEGER NOT NULL,
  tip_en TEXT NOT NULL,
  tip_ha TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.season_tips ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read tips"
  ON public.season_tips FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert tips"
  ON public.season_tips FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can delete tips"
  ON public.season_tips FOR DELETE
  USING (true);
