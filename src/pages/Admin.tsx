import { useState, useEffect } from "react";
import { ArrowLeft, Plus, Trash2, Shield, BarChart3 } from "lucide-react";
import { Link } from "react-router-dom";
import { checkAdminPassword } from "@/services/adminStore";
import {
  fetchAllAlerts, createAlert, deleteAlert,
  fetchSeasonTips, createSeasonTip, deleteSeasonTip,
  type FarmAlert,
} from "@/services/alertsService";
import { getAnalyticsSummary, type AnalyticsSummary } from "@/services/analytics";
import { states } from "@/data/locations";

const AdminPage = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [tab, setTab] = useState<"alerts" | "tips" | "analytics">("alerts");
  const [alerts, setAlerts] = useState<FarmAlert[]>([]);
  const [tips, setTips] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [saving, setSaving] = useState(false);

  // Alert form
  const [alertState, setAlertState] = useState("all");
  const [alertType, setAlertType] = useState("general");
  const [alertTitleEn, setAlertTitleEn] = useState("");
  const [alertTitleHa, setAlertTitleHa] = useState("");
  const [alertMsgEn, setAlertMsgEn] = useState("");
  const [alertMsgHa, setAlertMsgHa] = useState("");

  // Tip form
  const [tipState, setTipState] = useState("all");
  const [tipMonth, setTipMonth] = useState(new Date().getMonth() + 1);
  const [tipEn, setTipEn] = useState("");
  const [tipHa, setTipHa] = useState("");

  useEffect(() => {
    if (authenticated) {
      fetchAllAlerts().then(setAlerts);
      fetchSeasonTips().then(setTips);
    }
  }, [authenticated]);

  const handleLogin = () => {
    if (checkAdminPassword(password)) {
      setAuthenticated(true);
      setError("");
    } else {
      setError("Wrong password");
    }
  };

  const handleAddAlert = async () => {
    if (!alertTitleEn || saving) return;
    setSaving(true);
    const ok = await createAlert({
      state_id: alertState,
      title_en: alertTitleEn,
      title_ha: alertTitleHa || alertTitleEn,
      message_en: alertMsgEn,
      message_ha: alertMsgHa || alertMsgEn,
      alert_type: alertType,
    });
    if (ok) {
      setAlertTitleEn(""); setAlertTitleHa(""); setAlertMsgEn(""); setAlertMsgHa("");
      fetchAllAlerts().then(setAlerts);
    }
    setSaving(false);
  };

  const handleRemoveAlert = async (id: string) => {
    await deleteAlert(id);
    setAlerts(prev => prev.filter(a => a.id !== id));
  };

  const handleAddTip = async () => {
    if (!tipEn || saving) return;
    setSaving(true);
    const ok = await createSeasonTip({
      state_id: tipState,
      month: tipMonth,
      tip_en: tipEn,
      tip_ha: tipHa || tipEn,
    });
    if (ok) {
      setTipEn(""); setTipHa("");
      fetchSeasonTips().then(setTips);
    }
    setSaving(false);
  };

  const handleRemoveTip = async (id: string) => {
    await deleteSeasonTip(id);
    setTips(prev => prev.filter((t: any) => t.id !== id));
  };

  const loadAnalytics = async () => {
    setTab("analytics");
    const summary = await getAnalyticsSummary();
    setAnalytics(summary);
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="w-full max-w-sm space-y-4">
          <div className="text-center">
            <Shield className="w-12 h-12 mx-auto text-primary mb-2" />
            <h1 className="text-xl font-bold">Admin Login</h1>
            <p className="text-sm text-muted-foreground">Enter admin password</p>
          </div>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleLogin()}
            placeholder="Password"
            className="w-full bg-muted rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/30"
          />
          {error && <p className="text-sm text-destructive text-center">{error}</p>}
          <button onClick={handleLogin} className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-medium">
            Login
          </button>
          <Link to="/" className="block text-center text-sm text-muted-foreground">← Back to app</Link>
        </div>
      </div>
    );
  }

  const stateOptions = [{ id: "all", name: "All States" }, ...Object.entries(states).map(([id, s]) => ({ id, name: s.name }))];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-primary px-4 py-3 flex items-center gap-3 shadow-md">
        <Link to="/" className="text-primary-foreground"><ArrowLeft className="w-5 h-5" /></Link>
        <span className="text-primary-foreground font-bold text-lg">Admin Panel</span>
      </header>

      <div className="px-4 py-3 max-w-lg mx-auto">
        <div className="flex gap-2 mb-4">
          {(["alerts", "tips", "analytics"] as const).map(t => (
            <button
              key={t}
              onClick={() => t === "analytics" ? loadAnalytics() : setTab(t)}
              className={`flex-1 py-2 rounded-lg text-sm font-medium capitalize ${tab === t ? "bg-primary text-primary-foreground" : "bg-muted"}`}
            >
              {t === "analytics" ? <span className="flex items-center justify-center gap-1"><BarChart3 className="w-4 h-4" /> Stats</span> : t}
            </button>
          ))}
        </div>

        {tab === "alerts" && (
          <div className="space-y-4">
            <div className="card-farm space-y-3">
              <h3 className="font-semibold text-sm">New Alert</h3>
              <select value={alertState} onChange={e => setAlertState(e.target.value)} className="w-full bg-muted rounded-lg px-3 py-2 text-sm">
                {stateOptions.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
              <select value={alertType} onChange={e => setAlertType(e.target.value)} className="w-full bg-muted rounded-lg px-3 py-2 text-sm">
                <option value="pest">🐛 Pest Warning</option>
                <option value="weather">🌧️ Weather Warning</option>
                <option value="season">🌱 Season Alert</option>
                <option value="general">ℹ️ General</option>
              </select>
              <input placeholder="Title (English)" value={alertTitleEn} onChange={e => setAlertTitleEn(e.target.value)} className="w-full bg-muted rounded-lg px-3 py-2 text-sm" />
              <input placeholder="Title (Hausa)" value={alertTitleHa} onChange={e => setAlertTitleHa(e.target.value)} className="w-full bg-muted rounded-lg px-3 py-2 text-sm" />
              <textarea placeholder="Message (English)" value={alertMsgEn} onChange={e => setAlertMsgEn(e.target.value)} className="w-full bg-muted rounded-lg px-3 py-2 text-sm" rows={2} />
              <textarea placeholder="Message (Hausa)" value={alertMsgHa} onChange={e => setAlertMsgHa(e.target.value)} className="w-full bg-muted rounded-lg px-3 py-2 text-sm" rows={2} />
              <button onClick={handleAddAlert} disabled={saving} className="w-full bg-primary text-primary-foreground py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-50">
                <Plus className="w-4 h-4" /> {saving ? "Saving..." : "Add Alert"}
              </button>
            </div>
            <div className="space-y-2">
              {alerts.map(a => (
                <div key={a.id} className="card-farm flex items-start justify-between gap-2">
                  <div>
                    <div className="text-sm font-medium">{a.title_en}</div>
                    <div className="text-xs text-muted-foreground">{a.alert_type} • {a.state_id === "all" ? "All States" : states[a.state_id]?.name || a.state_id}</div>
                  </div>
                  <button onClick={() => handleRemoveAlert(a.id)} className="text-destructive p-1"><Trash2 className="w-4 h-4" /></button>
                </div>
              ))}
              {alerts.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">No alerts yet</p>}
            </div>
          </div>
        )}

        {tab === "tips" && (
          <div className="space-y-4">
            <div className="card-farm space-y-3">
              <h3 className="font-semibold text-sm">New Season Tip</h3>
              <select value={tipState} onChange={e => setTipState(e.target.value)} className="w-full bg-muted rounded-lg px-3 py-2 text-sm">
                {stateOptions.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
              <select value={tipMonth} onChange={e => setTipMonth(Number(e.target.value))} className="w-full bg-muted rounded-lg px-3 py-2 text-sm">
                {months.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
              </select>
              <textarea placeholder="Tip (English)" value={tipEn} onChange={e => setTipEn(e.target.value)} className="w-full bg-muted rounded-lg px-3 py-2 text-sm" rows={2} />
              <textarea placeholder="Tip (Hausa)" value={tipHa} onChange={e => setTipHa(e.target.value)} className="w-full bg-muted rounded-lg px-3 py-2 text-sm" rows={2} />
              <button onClick={handleAddTip} disabled={saving} className="w-full bg-primary text-primary-foreground py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-50">
                <Plus className="w-4 h-4" /> {saving ? "Saving..." : "Add Tip"}
              </button>
            </div>
            <div className="space-y-2">
              {tips.map((tip: any) => (
                <div key={tip.id} className="card-farm flex items-start justify-between gap-2">
                  <div>
                    <div className="text-sm font-medium">{tip.tip_en}</div>
                    <div className="text-xs text-muted-foreground">{months[tip.month - 1]} • {tip.state_id === "all" ? "All States" : states[tip.state_id]?.name || tip.state_id}</div>
                  </div>
                  <button onClick={() => handleRemoveTip(tip.id)} className="text-destructive p-1"><Trash2 className="w-4 h-4" /></button>
                </div>
              ))}
              {tips.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">No tips yet</p>}
            </div>
          </div>
        )}

        {tab === "analytics" && (
          <div className="space-y-4">
            {!analytics ? (
              <div className="text-center py-8 text-muted-foreground">Loading analytics...</div>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div className="card-farm text-center">
                    <div className="text-2xl font-bold text-primary">{analytics.totalUsers}</div>
                    <div className="text-xs text-muted-foreground">Total Users</div>
                  </div>
                  <div className="card-farm text-center">
                    <div className="text-2xl font-bold text-primary">{analytics.chatMessages}</div>
                    <div className="text-xs text-muted-foreground">Chat Messages</div>
                  </div>
                </div>

                {analytics.topStates.length > 0 && (
                  <div className="card-farm">
                    <h3 className="font-semibold text-sm mb-2">Top States</h3>
                    {analytics.topStates.map(s => (
                      <div key={s.state} className="flex justify-between text-sm py-1">
                        <span>{states[s.state]?.name || s.state}</span>
                        <span className="text-muted-foreground">{s.count}</span>
                      </div>
                    ))}
                  </div>
                )}

                {analytics.topCrops.length > 0 && (
                  <div className="card-farm">
                    <h3 className="font-semibold text-sm mb-2">Top Crop Queries</h3>
                    {analytics.topCrops.map(c => (
                      <div key={c.crop} className="flex justify-between text-sm py-1">
                        <span>{c.crop}</span>
                        <span className="text-muted-foreground">{c.count}</span>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
