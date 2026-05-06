import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useApp } from "@/contexts/AppContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, User, Mail, Lock, LogOut, Trash2, Loader2, Shield } from "lucide-react";

const Account = () => {
  const { user, loading, signOut } = useAuth();
  const { language } = useApp();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [fullName, setFullName] = useState("");
  const [savingName, setSavingName] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!loading && !user) navigate("/auth");
  }, [user, loading, navigate]);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("profiles")
      .select("full_name")
      .eq("id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        setFullName(data?.full_name || user.user_metadata?.full_name || "");
      });
  }, [user]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const t = (en: string, ha: string) => (language === "en" ? en : ha);

  const handleSaveName = async () => {
    setSavingName(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ full_name: fullName, updated_at: new Date().toISOString() })
        .eq("id", user.id);
      if (error) throw error;
      await supabase.auth.updateUser({ data: { full_name: fullName } });
      toast({ title: t("Profile updated", "An sabunta") });
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    } finally {
      setSavingName(false);
    }
  };

  const handleChangePassword = async () => {
    if (newPassword.length < 6) {
      toast({ title: t("Password too short", "Gajere"), variant: "destructive" });
      return;
    }
    setSavingPassword(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      toast({ title: t("Password changed", "An canza kalmar sirri") });
      setNewPassword("");
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    } finally {
      setSavingPassword(false);
    }
  };

  const handleSignOut = async () => {
    setSigningOut(true);
    await signOut();
    navigate("/");
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const { error } = await supabase.functions.invoke("delete-account");
      if (error) throw error;
      await signOut();
      toast({ title: t("Account deleted", "An share asusu") });
      navigate("/");
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
      setDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 gradient-header px-4 py-4 shadow-md">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-xl bg-primary-foreground/15 hover:bg-primary-foreground/25 text-primary-foreground transition-colors"
            aria-label="Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-primary-foreground font-black text-lg tracking-tight">
              {t("Account", "Asusu")}
            </h1>
            <p className="text-primary-foreground/70 text-xs font-semibold">
              {t("Manage your profile & security", "Sarrafa bayanan asusunka")}
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-5">
        {/* Profile header */}
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="bg-primary/10 p-3.5 rounded-2xl">
              <User className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-black text-base truncate">
                {fullName || user.email?.split("@")[0]}
              </p>
              <p className="text-xs text-muted-foreground font-semibold flex items-center gap-1.5 mt-0.5">
                <Mail className="w-3.5 h-3.5" />
                <span className="truncate">{user.email}</span>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Edit name */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-black">{t("Profile", "Bayanai")}</CardTitle>
            <CardDescription className="text-xs">
              {t("Update your display name", "Sabunta sunan ka")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="fullName" className="text-xs font-bold">
                {t("Full name", "Cikakken suna")}
              </Label>
              <Input
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Amina Ibrahim"
              />
            </div>
            <Button onClick={handleSaveName} disabled={savingName} className="w-full font-bold">
              {savingName && <Loader2 className="w-4 h-4 animate-spin" />}
              {t("Save changes", "Ajiye")}
            </Button>
          </CardContent>
        </Card>

        {/* Change password */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-black flex items-center gap-2">
              <Lock className="w-4 h-4" /> {t("Security", "Tsaro")}
            </CardTitle>
            <CardDescription className="text-xs">
              {t("Set a new password (min 6 chars)", "Sabuwar kalmar sirri (akalla 6)")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="pwd" className="text-xs font-bold">
                {t("New password", "Sabuwar kalma")}
              </Label>
              <Input
                id="pwd"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
            <Button
              onClick={handleChangePassword}
              disabled={savingPassword || !newPassword}
              variant="secondary"
              className="w-full font-bold"
            >
              {savingPassword && <Loader2 className="w-4 h-4 animate-spin" />}
              {t("Update password", "Sabunta kalma")}
            </Button>
          </CardContent>
        </Card>

        {/* Danger zone */}
        <Card className="border-destructive/30">
          <CardHeader>
            <CardTitle className="text-base font-black flex items-center gap-2 text-destructive">
              <Shield className="w-4 h-4" /> {t("Danger zone", "Yankin haɗari")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              onClick={handleSignOut}
              disabled={signingOut}
              variant="outline"
              className="w-full font-bold gap-2"
            >
              {signingOut ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogOut className="w-4 h-4" />}
              {t("Sign out", "Fita")}
            </Button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="w-full font-bold gap-2">
                  <Trash2 className="w-4 h-4" />
                  {t("Delete account", "Share asusu")}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    {t("Delete your account?", "Share asusunka?")}
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    {t(
                      "This permanently removes your profile, crops, tasks, and login. This cannot be undone.",
                      "Wannan zai share dukkan bayananka har abada. Babu komawa baya."
                    )}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>{t("Cancel", "Soke")}</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    disabled={deleting}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    {deleting && <Loader2 className="w-4 h-4 animate-spin" />}
                    {t("Yes, delete", "Ee, share")}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Account;
