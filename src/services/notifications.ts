import { supabase } from "@/integrations/supabase/client";

const SHOWN_KEY = "farmwise-notif-shown";

export async function requestNotificationPermission(): Promise<boolean> {
  if (!("Notification" in window)) return false;
  if (Notification.permission === "granted") return true;
  if (Notification.permission === "denied") return false;
  const result = await Notification.requestPermission();
  return result === "granted";
}

function getShown(): Record<string, string> {
  try { return JSON.parse(localStorage.getItem(SHOWN_KEY) || "{}"); } catch { return {}; }
}
function markShown(id: string) {
  const shown = getShown();
  shown[id] = new Date().toDateString();
  localStorage.setItem(SHOWN_KEY, JSON.stringify(shown));
}
function wasShownToday(id: string): boolean {
  return getShown()[id] === new Date().toDateString();
}

function send(title: string, body: string, tag: string) {
  if (Notification.permission !== "granted") return;
  try {
    new Notification(title, { body, tag, icon: "/placeholder.svg", badge: "/placeholder.svg" });
  } catch {
    // some browsers require service worker — fall back silently
  }
}

/**
 * Check upcoming tasks and planting events for the signed-in user
 * and fire local notifications for items due today or in the next 2 days.
 */
export async function checkAndNotifyReminders(userId: string) {
  if (Notification.permission !== "granted") return;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const horizon = new Date(today);
  horizon.setDate(horizon.getDate() + 2);
  const horizonStr = horizon.toISOString().slice(0, 10);
  const todayStr = today.toISOString().slice(0, 10);

  // Tasks
  const { data: tasks } = await supabase
    .from("farm_tasks")
    .select("id,title,due_date,completed")
    .eq("user_id", userId)
    .eq("completed", false)
    .not("due_date", "is", null)
    .lte("due_date", horizonStr);

  tasks?.forEach((t: any) => {
    const id = `task-${t.id}`;
    if (wasShownToday(id)) return;
    const due = t.due_date;
    const label = due === todayStr ? "due today" : `due ${due}`;
    send("🌾 Farm Task Reminder", `${t.title} — ${label}`, id);
    markShown(id);
  });

  // Planting events upcoming
  const { data: events } = await supabase
    .from("planting_events")
    .select("id,crop_name,crop_icon,plant_date,status")
    .eq("user_id", userId)
    .neq("status", "harvested")
    .lte("plant_date", horizonStr);

  events?.forEach((e: any) => {
    const id = `plant-${e.id}`;
    if (wasShownToday(id)) return;
    const when = e.plant_date === todayStr ? "today" : `on ${e.plant_date}`;
    send(`${e.crop_icon} Planting Reminder`, `Plant ${e.crop_name} ${when}`, id);
    markShown(id);
  });
}
