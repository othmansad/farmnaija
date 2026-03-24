import { useState } from "react";
import { ArrowLeft, Plus, Trash2, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import {
  checkAdminPassword,
  getAlerts, addAlert, removeAlert,
  getSeasonTips, addSeasonTip, removeSeasonTip,
  type FarmAlert, type SeasonTip,
} from "@/services/adminStore";
import { states } from "@/data/locations";

const AdminPage = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [tab, setTab] = useState<"alerts" | "tips">("alerts");
  const [alerts, setAlerts] = useState<FarmAlert[]>(getAlerts());
  const [tips, setTips] = useState<SeasonTip[]>(getSeasonTips());

  // Alert form
  const [alertState, setAlertState] = useState("all");
  const [alertType, setAlertType] = useState<FarmAlert["type"]>("general");
  const [alertTitleEn, setAlertTitleEn] = useState("");
  const [alertTitleHa, setAlertTitleHa] = useState("");
  const [alertMsgEn, setAlertMsgEn] = useState("");
  const [alertMsgHa, setAlertMsgHa] = useState("");

  // Tip form
  const [tipState, setTipState] = useState("all");
  const [tipMonth, setTipMonth] = useState(new Date().getMonth() + 1);
  const [tipEn, setTipEn] = useState("");
  const [tipHa, setTipHa] = useState("");

  const handleLogin = () => {
    if (checkAdminPassword(password)) {
      setAuthenticated(true);
      setError("");
    } else {
      setError("Wrong password");
    }
  };

  const handleAddAlert = () => {
    if (!alertTitleEn) return;
    const updated = addAlert({
      stateId: alertState,
      title: { en: alertTitleEn, ha: alertTitleHa || alertTitleEn },
      message: { en: alertMsgEn, ha: alertMsgHa || alertMsgEn },
      type: alertType,
      active: true,
    });
    setAlerts(updated);
    setAlertTitleEn(""); setAlertTitleHa(""); setAlertMsgEn(""); setAlertMsgHa("");
  };

  const handleRemoveAlert = (id: string) => {
    setAlerts(removeAlert(id));
  };

  const handleAddTip = () => {
    if (!tipEn) return;
    const updated = addSeasonTip({
      stateId: tipState,
      month: tipMonth,
      tip: { en: tipEn, ha: tipHa || tipEn },
    });
    setTips(updated);
    setTipEn(""); setTipHa("");
  };

  const handleRemoveTip = (id: string) => {
    setTips(removeSeasonTip(id));
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
          <button
            onClick={() => setTab("alerts")}
            className={`flex-1 py-2 rounded-lg text-sm font-medium ${tab === "alerts" ? "bg-primary text-primary-foreground" : "bg-muted"}`}
          >
            Alerts
          </button>
          <button
            onClick={() => setTab("tips")}
            className={`flex-1 py-2 rounded-lg text-sm font-medium ${tab === "tips" ? "bg-primary text-primary-foreground" : "bg-muted"}`}
          >
            Season Tips
          </button>
        </div>

        {tab === "alerts" && (
          <div className="space-y-4">
            <div className="card-farm space-y-3">
              <h3 className="font-semibold text-sm">New Alert</h3>
              <select value={alertState} onChange={e => setAlertState(e.target.value)} className="w-full bg-muted rounded-lg px-3 py-2 text-sm">
                {stateOptions.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
              <select value={alertType} onChange={e => setAlertType(e.target.value as FarmAlert["type"])} className="w-full bg-muted rounded-lg px-3 py-2 text-sm">
                <option value="pest">🐛 Pest Warning</option>
                <option value="weather">🌧️ Weather Warning</option>
                <option value="season">🌱 Season Alert</option>
                <option value="general">ℹ️ General</option>
              </select>
              <input placeholder="Title (English)" value={alertTitleEn} onChange={e => setAlertTitleEn(e.target.value)} className="w-full bg-muted rounded-lg px-3 py-2 text-sm" />
              <input placeholder="Title (Hausa)" value={alertTitleHa} onChange={e => setAlertTitleHa(e.target.value)} className="w-full bg-muted rounded-lg px-3 py-2 text-sm" />
              <textarea placeholder="Message (English)" value={alertMsgEn} onChange={e => setAlertMsgEn(e.target.value)} className="w-full bg-muted rounded-lg px-3 py-2 text-sm" rows={2} />
              <textarea placeholder="Message (Hausa)" value={alertMsgHa} onChange={e => setAlertMsgHa(e.target.value)} className="w-full bg-muted rounded-lg px-3 py-2 text-sm" rows={2} />
              <button onClick={handleAddAlert} className="w-full bg-primary text-primary-foreground py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2">
                <Plus className="w-4 h-4" /> Add Alert
              </button>
            </div>

            <div className="space-y-2">
              {alerts.map(a => (
                <div key={a.id} className="card-farm flex items-start justify-between gap-2">
                  <div>
                    <div className="text-sm font-medium">{a.title.en}</div>
                    <div className="text-xs text-muted-foreground">{a.type} • {a.stateId === "all" ? "All States" : states[a.stateId]?.name || a.stateId}</div>
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
              <button onClick={handleAddTip} className="w-full bg-primary text-primary-foreground py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2">
                <Plus className="w-4 h-4" /> Add Tip
              </button>
            </div>

            <div className="space-y-2">
              {tips.map(tip => (
                <div key={tip.id} className="card-farm flex items-start justify-between gap-2">
                  <div>
                    <div className="text-sm font-medium">{tip.tip.en}</div>
                    <div className="text-xs text-muted-foreground">{months[tip.month - 1]} • {tip.stateId === "all" ? "All States" : states[tip.stateId]?.name || tip.stateId}</div>
                  </div>
                  <button onClick={() => handleRemoveTip(tip.id)} className="text-destructive p-1"><Trash2 className="w-4 h-4" /></button>
                </div>
              ))}
              {tips.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">No tips yet</p>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
