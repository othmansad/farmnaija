import { supabase } from "@/integrations/supabase/client";

export interface FarmAlert {
  id: string;
  state_id: string;
  title_en: string;
  title_ha: string;
  message_en: string;
  message_ha: string;
  alert_type: string;
  active: boolean;
  created_at: string;
}

export async function fetchAlertsForState(stateId: string): Promise<FarmAlert[]> {
  const { data, error } = await supabase
    .from("farm_alerts")
    .select("*")
    .eq("active", true)
    .or(`state_id.eq.${stateId},state_id.eq.all`)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching alerts:", error);
    return [];
  }
  return (data || []) as FarmAlert[];
}

export async function fetchAllAlerts(): Promise<FarmAlert[]> {
  const { data, error } = await supabase
    .from("farm_alerts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return [];
  return (data || []) as FarmAlert[];
}

export async function createAlert(alert: {
  state_id: string;
  title_en: string;
  title_ha: string;
  message_en: string;
  message_ha: string;
  alert_type: string;
}): Promise<boolean> {
  const { error } = await supabase.from("farm_alerts").insert({
    ...alert,
    active: true,
  });
  return !error;
}

export async function deleteAlert(id: string): Promise<boolean> {
  const { error } = await supabase.from("farm_alerts").delete().eq("id", id);
  return !error;
}

export async function createSeasonTip(tip: {
  state_id: string;
  month: number;
  tip_en: string;
  tip_ha: string;
}): Promise<boolean> {
  const { error } = await supabase.from("season_tips").insert(tip);
  return !error;
}

export async function fetchSeasonTips() {
  const { data, error } = await supabase
    .from("season_tips")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) return [];
  return data || [];
}

export async function deleteSeasonTip(id: string): Promise<boolean> {
  const { error } = await supabase.from("season_tips").delete().eq("id", id);
  return !error;
}
