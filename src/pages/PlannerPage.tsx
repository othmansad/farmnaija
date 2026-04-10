import { useState, useEffect } from "react";
import { useApp } from "@/contexts/AppContext";
import { useAuth } from "@/contexts/AuthContext";
import { usePremium } from "@/contexts/PremiumContext";
import { PremiumModal } from "@/components/PremiumModal";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, Link } from "react-router-dom";
import { useSidebar } from "@/components/ui/sidebar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { toast } from "sonner";
import {
  CalendarDays, Home, Menu, Plus, Trash2, Check, CalendarIcon,
  Sprout, ListTodo, BarChart3, Loader2, ChevronDown, Leaf, AlertTriangle, Sun, Droplets
} from "lucide-react";

// --- Types ---
interface PlantingEvent {
  id: string; crop_name: string; crop_icon: string; plant_date: string;
  expected_harvest: string | null; notes: string; status: string;
}
interface FarmTask {
  id: string; title: string; description: string; due_date: string | null;
  priority: string; completed: boolean;
}
interface CropTrack {
  id: string; crop_name: string; crop_icon: string; area_size: string;
  growth_stage: string; health: string; planted_date: string; notes: string;
}

const CROP_OPTIONS = [
  { name: "Maize", icon: "🌽" }, { name: "Rice", icon: "🌾" }, { name: "Cassava", icon: "🥔" },
  { name: "Yam", icon: "🍠" }, { name: "Tomato", icon: "🍅" }, { name: "Pepper", icon: "🌶️" },
  { name: "Groundnut", icon: "🥜" }, { name: "Sorghum", icon: "🌿" }, { name: "Millet", icon: "🌾" },
  { name: "Cowpea", icon: "🫘" }, { name: "Cocoa", icon: "🍫" }, { name: "Soybean", icon: "🫛" },
];

const STAGES = ["seedling", "vegetative", "flowering", "fruiting", "harvest-ready"];
const HEALTH_OPTIONS = ["excellent", "good", "fair", "poor", "critical"];
const PRIORITY_COLORS: Record<string, string> = {
  high: "bg-destructive/15 text-destructive border-destructive/30",
  medium: "bg-harvest/15 text-harvest-foreground border-harvest/30",
  low: "bg-primary/15 text-primary border-primary/30",
};
const HEALTH_ICONS: Record<string, React.ReactNode> = {
  excellent: <Sun className="w-4 h-4 text-harvest" />,
  good: <Leaf className="w-4 h-4 text-primary" />,
  fair: <Droplets className="w-4 h-4 text-accent" />,
  poor: <AlertTriangle className="w-4 h-4 text-harvest" />,
  critical: <AlertTriangle className="w-4 h-4 text-destructive" />,
};

const PlannerPage = () => {
  const { language } = useApp();
  const { user } = useAuth();
  const { canAccessPremium } = usePremium();
  const { toggleSidebar } = useSidebar();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [tab, setTab] = useState("calendar");
  const [loading, setLoading] = useState(true);

  // Planting events
  const [events, setEvents] = useState<PlantingEvent[]>([]);
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [newEvent, setNewEvent] = useState({ crop: CROP_OPTIONS[0], plantDate: new Date(), harvestDate: undefined as Date | undefined, notes: "" });

  // Tasks
  const [tasks, setTasks] = useState<FarmTask[]>([]);
  const [showAddTask, setShowAddTask] = useState(false);
  const [newTask, setNewTask] = useState({ title: "", description: "", dueDate: undefined as Date | undefined, priority: "medium" });

  // Crop tracking
  const [crops, setCrops] = useState<CropTrack[]>([]);
  const [showAddCrop, setShowAddCrop] = useState(false);
  const [newCrop, setNewCrop] = useState({ crop: CROP_OPTIONS[0], area: "", plantedDate: new Date(), stage: "seedling", health: "good", notes: "" });

  useEffect(() => {
    if (!canAccessPremium) setShowModal(true);
    else if (user) loadAll();
  }, [canAccessPremium, user]);

  const loadAll = async () => {
    if (!user) return;
    setLoading(true);
    const [e, t, c] = await Promise.all([
      supabase.from("planting_events").select("*").eq("user_id", user.id).order("plant_date"),
      supabase.from("farm_tasks").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
      supabase.from("crop_tracking").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
    ]);
    if (e.data) setEvents(e.data as PlantingEvent[]);
    if (t.data) setTasks(t.data as FarmTask[]);
    if (c.data) setCrops(c.data as CropTrack[]);
    setLoading(false);
  };

  // --- Planting Calendar ---
  const addEvent = async () => {
    if (!user) return;
    const { error } = await supabase.from("planting_events").insert({
      user_id: user.id, crop_name: newEvent.crop.name, crop_icon: newEvent.crop.icon,
      plant_date: format(newEvent.plantDate, "yyyy-MM-dd"),
      expected_harvest: newEvent.harvestDate ? format(newEvent.harvestDate, "yyyy-MM-dd") : null,
      notes: newEvent.notes,
    });
    if (error) { toast.error("Failed to add"); return; }
    toast.success(language === "en" ? "Planting event added!" : "An ƙara abin shuka!");
    setShowAddEvent(false);
    setNewEvent({ crop: CROP_OPTIONS[0], plantDate: new Date(), harvestDate: undefined, notes: "" });
    loadAll();
  };

  const deleteEvent = async (id: string) => {
    await supabase.from("planting_events").delete().eq("id", id);
    setEvents(p => p.filter(e => e.id !== id));
  };

  const updateEventStatus = async (id: string, status: string) => {
    await supabase.from("planting_events").update({ status }).eq("id", id);
    setEvents(p => p.map(e => e.id === id ? { ...e, status } : e));
  };

  // --- Tasks ---
  const addTask = async () => {
    if (!user || !newTask.title.trim()) return;
    const { error } = await supabase.from("farm_tasks").insert({
      user_id: user.id, title: newTask.title, description: newTask.description,
      due_date: newTask.dueDate ? format(newTask.dueDate, "yyyy-MM-dd") : null,
      priority: newTask.priority,
    });
    if (error) { toast.error("Failed to add"); return; }
    toast.success(language === "en" ? "Task added!" : "An ƙara aiki!");
    setShowAddTask(false);
    setNewTask({ title: "", description: "", dueDate: undefined, priority: "medium" });
    loadAll();
  };

  const toggleTask = async (id: string, completed: boolean) => {
    await supabase.from("farm_tasks").update({ completed: !completed }).eq("id", id);
    setTasks(p => p.map(t => t.id === id ? { ...t, completed: !completed } : t));
  };

  const deleteTask = async (id: string) => {
    await supabase.from("farm_tasks").delete().eq("id", id);
    setTasks(p => p.filter(t => t.id !== id));
  };

  // --- Crop Tracking ---
  const addCropTrack = async () => {
    if (!user) return;
    const { error } = await supabase.from("crop_tracking").insert({
      user_id: user.id, crop_name: newCrop.crop.name, crop_icon: newCrop.crop.icon,
      area_size: newCrop.area, growth_stage: newCrop.stage, health: newCrop.health,
      planted_date: format(newCrop.plantedDate, "yyyy-MM-dd"), notes: newCrop.notes,
    });
    if (error) { toast.error("Failed to add"); return; }
    toast.success(language === "en" ? "Crop added to tracking!" : "An ƙara amfanin gona!");
    setShowAddCrop(false);
    setNewCrop({ crop: CROP_OPTIONS[0], area: "", plantedDate: new Date(), stage: "seedling", health: "good", notes: "" });
    loadAll();
  };

  const updateCropStage = async (id: string, growth_stage: string) => {
    await supabase.from("crop_tracking").update({ growth_stage, last_updated: new Date().toISOString() }).eq("id", id);
    setCrops(p => p.map(c => c.id === id ? { ...c, growth_stage } : c));
  };

  const updateCropHealth = async (id: string, health: string) => {
    await supabase.from("crop_tracking").update({ health, last_updated: new Date().toISOString() }).eq("id", id);
    setCrops(p => p.map(c => c.id === id ? { ...c, health } : c));
  };

  const deleteCrop = async (id: string) => {
    await supabase.from("crop_tracking").delete().eq("id", id);
    setCrops(p => p.filter(c => c.id !== id));
  };

  const en = language === "en";

  if (!canAccessPremium) {
    return <PremiumModal open={showModal} onClose={() => { setShowModal(false); navigate("/"); }} featureName="Farm Planner" />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 gradient-header px-4 py-3 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <Link to="/" className="text-primary-foreground/80 hover:text-primary-foreground p-1.5 rounded-lg hover:bg-primary-foreground/10">
            <Home className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-primary-foreground" />
            <span className="text-primary-foreground font-black text-lg">{en ? "Farm Planner" : "Tsarin Noma"}</span>
          </div>
        </div>
        <button onClick={toggleSidebar} className="text-primary-foreground/80 hover:text-primary-foreground p-2 rounded-xl hover:bg-primary-foreground/10">
          <Menu className="w-5 h-5" />
        </button>
      </header>

      <div className="max-w-2xl mx-auto px-3 py-4">
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="w-full grid grid-cols-3 mb-4">
            <TabsTrigger value="calendar" className="text-xs font-bold gap-1">
              <CalendarDays className="w-3.5 h-3.5" /> {en ? "Calendar" : "Kalanda"}
            </TabsTrigger>
            <TabsTrigger value="tasks" className="text-xs font-bold gap-1">
              <ListTodo className="w-3.5 h-3.5" /> {en ? "Tasks" : "Ayyuka"}
            </TabsTrigger>
            <TabsTrigger value="crops" className="text-xs font-bold gap-1">
              <Sprout className="w-3.5 h-3.5" /> {en ? "Crops" : "Amfanin Gona"}
            </TabsTrigger>
          </TabsList>

          {loading ? (
            <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
          ) : (
            <>
              {/* ===== CALENDAR TAB ===== */}
              <TabsContent value="calendar" className="space-y-3">
                <Button onClick={() => setShowAddEvent(!showAddEvent)} size="sm" className="w-full gap-2 font-bold">
                  <Plus className="w-4 h-4" /> {en ? "Add Planting Event" : "Ƙara Abin Shuka"}
                </Button>

                {showAddEvent && (
                  <div className="card-farm space-y-3 animate-fade-up">
                    <h4 className="font-bold text-sm">{en ? "New Planting" : "Sabuwar Shuka"}</h4>
                    {/* Crop picker */}
                    <div className="grid grid-cols-4 gap-2">
                      {CROP_OPTIONS.map(c => (
                        <button key={c.name} onClick={() => setNewEvent(p => ({ ...p, crop: c }))}
                          className={cn("p-2 rounded-xl text-center text-xs font-bold border-2 transition-all",
                            newEvent.crop.name === c.name ? "border-primary bg-primary/10" : "border-transparent bg-muted/40")}>
                          <div className="text-xl">{c.icon}</div>
                          <div className="mt-0.5">{c.name}</div>
                        </button>
                      ))}
                    </div>
                    {/* Dates */}
                    <div className="grid grid-cols-2 gap-2">
                      <DatePick label={en ? "Plant Date" : "Ranar Shuka"} date={newEvent.plantDate} onChange={d => setNewEvent(p => ({ ...p, plantDate: d || new Date() }))} />
                      <DatePick label={en ? "Expected Harvest" : "Lokacin Girbi"} date={newEvent.harvestDate} onChange={d => setNewEvent(p => ({ ...p, harvestDate: d }))} />
                    </div>
                    <Input placeholder={en ? "Notes (optional)" : "Bayanai"} value={newEvent.notes} onChange={e => setNewEvent(p => ({ ...p, notes: e.target.value }))} />
                    <div className="flex gap-2">
                      <Button size="sm" onClick={addEvent} className="flex-1 font-bold">{en ? "Save" : "Ajiye"}</Button>
                      <Button size="sm" variant="outline" onClick={() => setShowAddEvent(false)}>{en ? "Cancel" : "Soke"}</Button>
                    </div>
                  </div>
                )}

                {events.length === 0 ? (
                  <EmptyState icon="📅" text={en ? "No planting events yet. Add your first crop!" : "Babu abin shuka. Ƙara na farko!"} />
                ) : (
                  events.map(ev => (
                    <div key={ev.id} className="card-farm flex items-start gap-3">
                      <span className="text-2xl mt-1">{ev.crop_icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-sm">{ev.crop_name}</span>
                          <Badge variant="outline" className={cn("text-[10px]",
                            ev.status === "planted" ? "border-primary text-primary" :
                            ev.status === "growing" ? "border-accent text-accent" :
                            ev.status === "harvested" ? "border-harvest text-harvest" : ""
                          )}>{ev.status}</Badge>
                        </div>
                        <div className="text-xs text-muted-foreground mt-0.5">
                          🗓 {format(new Date(ev.plant_date), "MMM d, yyyy")}
                          {ev.expected_harvest && <> → {format(new Date(ev.expected_harvest), "MMM d, yyyy")}</>}
                        </div>
                        {ev.notes && <p className="text-xs text-muted-foreground mt-1">{ev.notes}</p>}
                        <div className="flex gap-1 mt-2 flex-wrap">
                          {["planned", "planted", "growing", "harvested"].map(s => (
                            <button key={s} onClick={() => updateEventStatus(ev.id, s)}
                              className={cn("text-[10px] px-2 py-0.5 rounded-full font-bold border transition-all",
                                ev.status === s ? "bg-primary text-primary-foreground border-primary" : "border-border hover:bg-muted")}>
                              {s}
                            </button>
                          ))}
                        </div>
                      </div>
                      <button onClick={() => deleteEvent(ev.id)} className="text-muted-foreground hover:text-destructive p-1">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </TabsContent>

              {/* ===== TASKS TAB ===== */}
              <TabsContent value="tasks" className="space-y-3">
                <Button onClick={() => setShowAddTask(!showAddTask)} size="sm" className="w-full gap-2 font-bold">
                  <Plus className="w-4 h-4" /> {en ? "Add Task" : "Ƙara Aiki"}
                </Button>

                {showAddTask && (
                  <div className="card-farm space-y-3 animate-fade-up">
                    <h4 className="font-bold text-sm">{en ? "New Task" : "Sabon Aiki"}</h4>
                    <Input placeholder={en ? "Task title *" : "Sunan aiki *"} value={newTask.title} onChange={e => setNewTask(p => ({ ...p, title: e.target.value }))} />
                    <Input placeholder={en ? "Description (optional)" : "Bayani"} value={newTask.description} onChange={e => setNewTask(p => ({ ...p, description: e.target.value }))} />
                    <div className="grid grid-cols-2 gap-2">
                      <DatePick label={en ? "Due Date" : "Ranar Ƙarewa"} date={newTask.dueDate} onChange={d => setNewTask(p => ({ ...p, dueDate: d }))} />
                      <div>
                        <label className="text-xs font-bold text-muted-foreground mb-1 block">{en ? "Priority" : "Muhimmanci"}</label>
                        <div className="flex gap-1">
                          {(["low", "medium", "high"] as const).map(p => (
                            <button key={p} onClick={() => setNewTask(prev => ({ ...prev, priority: p }))}
                              className={cn("flex-1 text-xs font-bold py-1.5 rounded-lg border-2 transition-all capitalize",
                                newTask.priority === p ? PRIORITY_COLORS[p] + " border-current" : "border-transparent bg-muted/40")}>
                              {p}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={addTask} className="flex-1 font-bold" disabled={!newTask.title.trim()}>{en ? "Save" : "Ajiye"}</Button>
                      <Button size="sm" variant="outline" onClick={() => setShowAddTask(false)}>{en ? "Cancel" : "Soke"}</Button>
                    </div>
                  </div>
                )}

                {tasks.length === 0 ? (
                  <EmptyState icon="✅" text={en ? "No tasks yet. Stay organized!" : "Babu ayyuka. Ka tsara aiki!"} />
                ) : (
                  <>
                    {/* Active tasks */}
                    {tasks.filter(t => !t.completed).map(task => <TaskCard key={task.id} task={task} onToggle={toggleTask} onDelete={deleteTask} en={en} />)}
                    {/* Completed */}
                    {tasks.some(t => t.completed) && (
                      <>
                        <p className="text-xs font-bold text-muted-foreground mt-4 px-1">{en ? "Completed" : "An gama"}</p>
                        {tasks.filter(t => t.completed).map(task => <TaskCard key={task.id} task={task} onToggle={toggleTask} onDelete={deleteTask} en={en} />)}
                      </>
                    )}
                  </>
                )}
              </TabsContent>

              {/* ===== CROPS TAB ===== */}
              <TabsContent value="crops" className="space-y-3">
                <Button onClick={() => setShowAddCrop(!showAddCrop)} size="sm" className="w-full gap-2 font-bold">
                  <Plus className="w-4 h-4" /> {en ? "Track New Crop" : "Ƙara Amfanin Gona"}
                </Button>

                {showAddCrop && (
                  <div className="card-farm space-y-3 animate-fade-up">
                    <h4 className="font-bold text-sm">{en ? "Add Crop" : "Ƙara Amfanin Gona"}</h4>
                    <div className="grid grid-cols-4 gap-2">
                      {CROP_OPTIONS.map(c => (
                        <button key={c.name} onClick={() => setNewCrop(p => ({ ...p, crop: c }))}
                          className={cn("p-2 rounded-xl text-center text-xs font-bold border-2 transition-all",
                            newCrop.crop.name === c.name ? "border-primary bg-primary/10" : "border-transparent bg-muted/40")}>
                          <div className="text-xl">{c.icon}</div>
                          <div className="mt-0.5">{c.name}</div>
                        </button>
                      ))}
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <Input placeholder={en ? "Area (e.g. 2 hectares)" : "Yanki"} value={newCrop.area} onChange={e => setNewCrop(p => ({ ...p, area: e.target.value }))} />
                      <DatePick label={en ? "Planted Date" : "Ranar Shuka"} date={newCrop.plantedDate} onChange={d => setNewCrop(p => ({ ...p, plantedDate: d || new Date() }))} />
                    </div>
                    <Input placeholder={en ? "Notes (optional)" : "Bayanai"} value={newCrop.notes} onChange={e => setNewCrop(p => ({ ...p, notes: e.target.value }))} />
                    <div className="flex gap-2">
                      <Button size="sm" onClick={addCropTrack} className="flex-1 font-bold">{en ? "Save" : "Ajiye"}</Button>
                      <Button size="sm" variant="outline" onClick={() => setShowAddCrop(false)}>{en ? "Cancel" : "Soke"}</Button>
                    </div>
                  </div>
                )}

                {crops.length === 0 ? (
                  <EmptyState icon="🌱" text={en ? "No crops tracked yet. Start monitoring!" : "Babu amfanin gona. Fara sa ido!"} />
                ) : (
                  crops.map(crop => (
                    <div key={crop.id} className="card-farm space-y-2.5">
                      <div className="flex items-start gap-3">
                        <span className="text-3xl">{crop.crop_icon}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold">{crop.crop_name}</span>
                            <div className="flex items-center gap-1">
                              {HEALTH_ICONS[crop.health]}
                              <span className="text-[10px] font-bold capitalize">{crop.health}</span>
                            </div>
                          </div>
                          {crop.area_size && <p className="text-xs text-muted-foreground">📐 {crop.area_size}</p>}
                          <p className="text-xs text-muted-foreground">🗓 {en ? "Planted" : "Shuka"}: {format(new Date(crop.planted_date), "MMM d, yyyy")}</p>
                          {crop.notes && <p className="text-xs text-muted-foreground italic mt-1">{crop.notes}</p>}
                        </div>
                        <button onClick={() => deleteCrop(crop.id)} className="text-muted-foreground hover:text-destructive p-1">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      {/* Growth stage slider */}
                      <div>
                        <p className="text-[10px] font-bold text-muted-foreground mb-1">{en ? "Growth Stage" : "Matakin Girma"}</p>
                        <div className="flex gap-1">
                          {STAGES.map((s, i) => (
                            <button key={s} onClick={() => updateCropStage(crop.id, s)}
                              className={cn("flex-1 text-[9px] py-1.5 rounded-lg font-bold border transition-all capitalize",
                                crop.growth_stage === s ? "bg-primary text-primary-foreground border-primary" :
                                STAGES.indexOf(crop.growth_stage) >= i ? "bg-primary/20 border-primary/30" : "bg-muted/40 border-transparent")}>
                              {s.replace("-", " ")}
                            </button>
                          ))}
                        </div>
                      </div>
                      {/* Health selector */}
                      <div>
                        <p className="text-[10px] font-bold text-muted-foreground mb-1">{en ? "Health" : "Lafiya"}</p>
                        <div className="flex gap-1">
                          {HEALTH_OPTIONS.map(h => (
                            <button key={h} onClick={() => updateCropHealth(crop.id, h)}
                              className={cn("flex-1 text-[9px] py-1.5 rounded-lg font-bold border transition-all capitalize",
                                crop.health === h ? "bg-accent text-accent-foreground border-accent" : "bg-muted/40 border-transparent")}>
                              {h}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </TabsContent>
            </>
          )}
        </Tabs>
      </div>
    </div>
  );
};

// --- Reusable sub-components ---

const DatePick = ({ label, date, onChange }: { label: string; date?: Date; onChange: (d: Date | undefined) => void }) => (
  <div>
    <label className="text-xs font-bold text-muted-foreground mb-1 block">{label}</label>
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className={cn("w-full justify-start text-left font-medium text-xs", !date && "text-muted-foreground")}>
          <CalendarIcon className="w-3.5 h-3.5 mr-1.5" />
          {date ? format(date, "MMM d, yyyy") : "Pick date"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar mode="single" selected={date} onSelect={onChange} initialFocus className="p-3 pointer-events-auto" />
      </PopoverContent>
    </Popover>
  </div>
);

const TaskCard = ({ task, onToggle, onDelete, en }: { task: FarmTask; onToggle: (id: string, c: boolean) => void; onDelete: (id: string) => void; en: boolean }) => (
  <div className={cn("card-farm flex items-start gap-3", task.completed && "opacity-60")}>
    <button onClick={() => onToggle(task.id, task.completed)}
      className={cn("mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all",
        task.completed ? "bg-primary border-primary" : "border-border hover:border-primary")}>
      {task.completed && <Check className="w-3 h-3 text-primary-foreground" />}
    </button>
    <div className="flex-1 min-w-0">
      <span className={cn("font-bold text-sm", task.completed && "line-through")}>{task.title}</span>
      {task.description && <p className="text-xs text-muted-foreground mt-0.5">{task.description}</p>}
      <div className="flex items-center gap-2 mt-1.5 flex-wrap">
        <Badge variant="outline" className={cn("text-[10px]", PRIORITY_COLORS[task.priority])}>
          {task.priority}
        </Badge>
        {task.due_date && (
          <span className="text-[10px] text-muted-foreground font-semibold">
            📅 {format(new Date(task.due_date), "MMM d")}
          </span>
        )}
      </div>
    </div>
    <button onClick={() => onDelete(task.id)} className="text-muted-foreground hover:text-destructive p-1">
      <Trash2 className="w-4 h-4" />
    </button>
  </div>
);

const EmptyState = ({ icon, text }: { icon: string; text: string }) => (
  <div className="text-center py-12">
    <span className="text-4xl block mb-3">{icon}</span>
    <p className="text-sm text-muted-foreground font-semibold">{text}</p>
  </div>
);

export default PlannerPage;
