import { supabase } from "@/integrations/supabase/client";

const DEVICE_ID_KEY = "farmwise-device-id";

export function getDeviceId(): string {
  let id = localStorage.getItem(DEVICE_ID_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(DEVICE_ID_KEY, id);
  }
  return id;
}

type EventType = "page_view" | "state_select" | "crop_view" | "chat_message" | "alert_view" | "language_switch";

export async function trackEvent(eventType: EventType, eventValue: string = "") {
  try {
    const deviceId = getDeviceId();
    await supabase.from("analytics_events").insert({
      event_type: eventType,
      event_value: eventValue,
      device_id: deviceId,
    });
  } catch {
    // Silent fail - analytics should never break the app
  }
}

export interface AnalyticsSummary {
  totalUsers: number;
  topStates: { state: string; count: number }[];
  topCrops: { crop: string; count: number }[];
  chatMessages: number;
  alertViews: number;
}

export async function getAnalyticsSummary(): Promise<AnalyticsSummary> {
  const { data: events } = await supabase
    .from("analytics_events")
    .select("event_type, event_value, device_id");

  const allEvents = events || [];

  const uniqueDevices = new Set(allEvents.map(e => e.device_id));

  const stateEvents = allEvents.filter(e => e.event_type === "state_select");
  const stateCounts: Record<string, number> = {};
  stateEvents.forEach(e => { stateCounts[e.event_value] = (stateCounts[e.event_value] || 0) + 1; });
  const topStates = Object.entries(stateCounts)
    .map(([state, count]) => ({ state, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  const cropEvents = allEvents.filter(e => e.event_type === "crop_view");
  const cropCounts: Record<string, number> = {};
  cropEvents.forEach(e => { cropCounts[e.event_value] = (cropCounts[e.event_value] || 0) + 1; });
  const topCrops = Object.entries(cropCounts)
    .map(([crop, count]) => ({ crop, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  const chatMessages = allEvents.filter(e => e.event_type === "chat_message").length;
  const alertViews = allEvents.filter(e => e.event_type === "alert_view").length;

  return {
    totalUsers: uniqueDevices.size,
    topStates,
    topCrops,
    chatMessages,
    alertViews,
  };
}
