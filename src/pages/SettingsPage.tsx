import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

const SettingsPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState({
    name: "",
    bio: "",
    gender: "",
    religion: "",
    dating_prompt_answer: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("profiles")
      .select("name, bio, gender, religion, dating_prompt_answer")
      .eq("user_id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (data) setProfile({
          name: data.name ?? "",
          bio: data.bio ?? "",
          gender: data.gender ?? "",
          religion: data.religion ?? "",
          dating_prompt_answer: data.dating_prompt_answer ?? "",
        });
      });
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase.from("profiles").update(profile).eq("user_id", user.id);
    setSaving(false);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Saved!", description: "Your profile has been updated." });
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
      <h1 className="font-display text-2xl text-foreground mb-6">Your Profile</h1>
      <div className="rounded-2xl p-6 border border-border space-y-4 max-w-md">
        <div className="space-y-2">
          <Label>Name</Label>
          <Input value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} className="rounded-xl" />
        </div>
        <div className="space-y-2">
          <Label>Gender</Label>
          <Input value={profile.gender} onChange={(e) => setProfile({ ...profile, gender: e.target.value })} placeholder="e.g. Male, Female, Non-binary" className="rounded-xl" />
        </div>
        <div className="space-y-2">
          <Label>Religion</Label>
          <Input value={profile.religion} onChange={(e) => setProfile({ ...profile, religion: e.target.value })} placeholder="Optional" className="rounded-xl" />
        </div>
        <div className="space-y-2">
          <Label>Bio</Label>
          <Textarea value={profile.bio} onChange={(e) => setProfile({ ...profile, bio: e.target.value })} placeholder="Tell people about yourself..." rows={3} className="rounded-xl" />
        </div>
        <div className="space-y-2">
          <Label>Dating prompt answer</Label>
          <Textarea value={profile.dating_prompt_answer} onChange={(e) => setProfile({ ...profile, dating_prompt_answer: e.target.value })} placeholder="What's your idea of a perfect first date?" rows={2} className="rounded-xl" />
        </div>
        <Button onClick={handleSave} disabled={saving} className="w-full">
          {saving ? "Saving..." : "Save Profile"}
        </Button>
      </div>
    </motion.div>
  );
};

export default SettingsPage;
