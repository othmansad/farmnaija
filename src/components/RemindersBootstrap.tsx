import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { checkAndNotifyReminders, requestNotificationPermission } from "@/services/notifications";

/**
 * Background reminder checker — runs while the user is signed in.
 * - Asks permission once (after a short delay so it isn't jarring on first paint)
 * - Checks tasks/planting events on mount, then every 30 minutes
 * - Also re-checks when the tab regains focus
 */
export const RemindersBootstrap = () => {
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;
    let cancelled = false;

    const askTimer = setTimeout(() => {
      if (!cancelled) requestNotificationPermission();
    }, 4000);

    const run = () => checkAndNotifyReminders(user.id).catch(() => {});
    run();
    const interval = setInterval(run, 30 * 60 * 1000);
    const onFocus = () => run();
    window.addEventListener("focus", onFocus);

    return () => {
      cancelled = true;
      clearTimeout(askTimer);
      clearInterval(interval);
      window.removeEventListener("focus", onFocus);
    };
  }, [user]);

  return null;
};
