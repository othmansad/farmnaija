
-- Planting calendar events
CREATE TABLE public.planting_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  crop_name TEXT NOT NULL,
  crop_icon TEXT NOT NULL DEFAULT '🌱',
  plant_date DATE NOT NULL,
  expected_harvest DATE,
  notes TEXT DEFAULT '',
  status TEXT NOT NULL DEFAULT 'planned',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.planting_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own planting events" ON public.planting_events FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Farm tasks
CREATE TABLE public.farm_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  due_date DATE,
  priority TEXT NOT NULL DEFAULT 'medium',
  completed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.farm_tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own farm tasks" ON public.farm_tasks FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Crop tracking
CREATE TABLE public.crop_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  crop_name TEXT NOT NULL,
  crop_icon TEXT NOT NULL DEFAULT '🌱',
  area_size TEXT DEFAULT '',
  growth_stage TEXT NOT NULL DEFAULT 'seedling',
  health TEXT NOT NULL DEFAULT 'good',
  planted_date DATE NOT NULL,
  last_updated TIMESTAMPTZ NOT NULL DEFAULT now(),
  notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.crop_tracking ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own crop tracking" ON public.crop_tracking FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
