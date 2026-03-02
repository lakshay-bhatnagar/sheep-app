import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";

const INTEREST_OPTIONS = [
  "Dogs", "Cats", "Pottery", "Long Walks", "Matcha", "Americano",
  "Reading", "Poetry", "Fitness", "Spirituality", "Music", "Travel",
  "Cafe Hopping", "Art", "Photography", "Cooking", "Dancing", "Hiking",
  "Movies", "Gaming", "Yoga", "Wine Tasting",
];

const PROMPT_QUESTIONS = [
  "Dating me is like ______",
  "My perfect Sunday looks like ______",
  "I'll fall for you if ______",
  "The one thing you should know about me is ______",
];

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const TIME_SLOTS = ["Morning", "Afternoon", "Evening", "Late Night"];
const GENDERS = ["Male", "Female", "Non-binary", "Other"];
const RELIGIONS = ["Hindu", "Muslim", "Christian", "Sikh", "Buddhist", "Jain", "Jewish", "Atheist", "Other"];

const OnboardingPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);

  // Step 1: Basic Details
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [religion, setReligion] = useState("");
  const [bio, setBio] = useState("");

  // Step 2: Preferences
  const [prefGender, setPrefGender] = useState("");
  const [ageRange, setAgeRange] = useState([18, 35]);
  const [prefReligion, setPrefReligion] = useState("");
  const [budgetRange, setBudgetRange] = useState([200, 1000]);
  const [prefDays, setPrefDays] = useState<string[]>([]);
  const [prefTimeSlots, setPrefTimeSlots] = useState<string[]>([]);

  // Step 3: Interests
  const [interests, setInterests] = useState<string[]>([]);
  const [customInterest, setCustomInterest] = useState("");

  // Step 4: Prompts
  const [prompts, setPrompts] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!user) return;
    // Check if already onboarded
    supabase
      .from("profiles")
      .select("onboarding_completed, name")
      .eq("user_id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (data?.onboarding_completed) {
          navigate("/app");
        }
        if (data?.name) setName(data.name);
      });
  }, [user, navigate]);

  const totalSteps = 4;

  const toggleItem = (arr: string[], item: string, setter: (v: string[]) => void) => {
    setter(arr.includes(item) ? arr.filter((i) => i !== item) : [...arr, item]);
  };

  const addCustomInterest = () => {
    const trimmed = customInterest.trim();
    if (trimmed && !interests.includes(trimmed)) {
      setInterests([...interests, trimmed]);
      setCustomInterest("");
    }
  };

  const canProceed = () => {
    switch (step) {
      case 0:
        const age = dob ? Math.floor((Date.now() - new Date(dob).getTime()) / (365.25 * 24 * 60 * 60 * 1000)) : 0;
        return name.trim() && dob && age >= 18 && gender && religion && bio.length >= 40;
      case 1:
        return prefGender && prefDays.length > 0 && prefTimeSlots.length > 0;
      case 2:
        return interests.length >= 5;
      case 3:
        return Object.values(prompts).filter((v) => v.trim().length > 0).length >= 3;
      default:
        return false;
    }
  };

  const handleFinish = async () => {
    if (!user) return;
    setSaving(true);

    try {
      // Update profile
      const { error: profileErr } = await supabase
        .from("profiles")
        .update({
          name,
          date_of_birth: dob,
          gender,
          religion,
          bio,
          interests,
          fun_prompts: prompts,
          onboarding_completed: true,
        })
        .eq("user_id", user.id);

      if (profileErr) throw profileErr;

      // Upsert preferences
      const { error: prefErr } = await supabase.from("user_preferences").upsert(
        {
          user_id: user.id,
          preferred_gender: prefGender,
          min_age: ageRange[0],
          max_age: ageRange[1],
          preferred_religion: prefReligion || null,
          budget_min: budgetRange[0],
          budget_max: budgetRange[1],
          preferred_days: prefDays,
          preferred_time_slots: prefTimeSlots,
        },
        { onConflict: "user_id" }
      );

      if (prefErr) throw prefErr;

      toast({ title: "Welcome to Sheep! 🐑", description: "Your profile is ready. Start discovering." });
      navigate("/app");
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div className="space-y-5">
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your full name" className="rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label>Date of Birth</Label>
              <Input type="date" value={dob} onChange={(e) => setDob(e.target.value)} className="rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label>Gender</Label>
              <div className="flex flex-wrap gap-2">
                {GENDERS.map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setGender(g)}
                    className={`px-4 py-2 rounded-xl border text-sm transition-all ${
                      gender === g ? "bg-primary text-primary-foreground border-primary" : "border-border text-foreground hover:border-primary/40"
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Religion</Label>
              <div className="flex flex-wrap gap-2">
                {RELIGIONS.map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setReligion(r)}
                    className={`px-4 py-2 rounded-xl border text-sm transition-all ${
                      religion === r ? "bg-primary text-primary-foreground border-primary" : "border-border text-foreground hover:border-primary/40"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Bio <span className="text-muted-foreground text-xs">(min 40 chars)</span></Label>
              <Textarea value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Tell people about yourself..." rows={3} className="rounded-xl" />
              <p className="text-xs text-muted-foreground">{bio.length}/40 minimum</p>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label>Preferred Gender</Label>
              <div className="flex flex-wrap gap-2">
                {["Male", "Female", "Non-binary", "Any"].map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setPrefGender(g)}
                    className={`px-4 py-2 rounded-xl border text-sm transition-all ${
                      prefGender === g ? "bg-primary text-primary-foreground border-primary" : "border-border text-foreground hover:border-primary/40"
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-3">
              <Label>Age Range: {ageRange[0]} – {ageRange[1]}</Label>
              <Slider min={18} max={60} step={1} value={ageRange} onValueChange={setAgeRange} className="py-2" />
            </div>
            <div className="space-y-2">
              <Label>Religion Preference <span className="text-muted-foreground text-xs">(optional)</span></Label>
              <div className="flex flex-wrap gap-2">
                {["Any", ...RELIGIONS].map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setPrefReligion(r === "Any" ? "" : r)}
                    className={`px-3 py-1.5 rounded-xl border text-xs transition-all ${
                      (r === "Any" && !prefReligion) || prefReligion === r
                        ? "bg-primary text-primary-foreground border-primary"
                        : "border-border text-foreground hover:border-primary/40"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-3">
              <Label>Date Budget: ₹{budgetRange[0]} – ₹{budgetRange[1]}</Label>
              <Slider min={100} max={5000} step={50} value={budgetRange} onValueChange={setBudgetRange} className="py-2" />
            </div>
            <div className="space-y-2">
              <Label>Preferred Days</Label>
              <div className="flex flex-wrap gap-2">
                {DAYS.map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => toggleItem(prefDays, d, setPrefDays)}
                    className={`px-3 py-1.5 rounded-xl border text-xs transition-all ${
                      prefDays.includes(d) ? "bg-primary text-primary-foreground border-primary" : "border-border text-foreground hover:border-primary/40"
                    }`}
                  >
                    {d.slice(0, 3)}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Preferred Time Slots</Label>
              <div className="flex flex-wrap gap-2">
                {TIME_SLOTS.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => toggleItem(prefTimeSlots, t, setPrefTimeSlots)}
                    className={`px-3 py-1.5 rounded-xl border text-xs transition-all ${
                      prefTimeSlots.includes(t) ? "bg-primary text-primary-foreground border-primary" : "border-border text-foreground hover:border-primary/40"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-5">
            <div>
              <Label>Select your interests <span className="text-muted-foreground text-xs">(min 5)</span></Label>
              <p className="text-xs text-muted-foreground mt-1">{interests.length} selected</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {INTEREST_OPTIONS.map((i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => toggleItem(interests, i, setInterests)}
                  className={`px-4 py-2 rounded-xl border text-sm transition-all ${
                    interests.includes(i) ? "bg-primary text-primary-foreground border-primary" : "border-border text-foreground hover:border-primary/40"
                  }`}
                >
                  {i}
                </button>
              ))}
              {interests.filter((i) => !INTEREST_OPTIONS.includes(i)).map((i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => toggleItem(interests, i, setInterests)}
                  className="px-4 py-2 rounded-xl border text-sm bg-primary text-primary-foreground border-primary"
                >
                  {i}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={customInterest}
                onChange={(e) => setCustomInterest(e.target.value)}
                placeholder="Add custom interest"
                className="rounded-xl"
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addCustomInterest())}
              />
              <Button variant="outline" size="sm" onClick={addCustomInterest} disabled={!customInterest.trim()}>
                Add
              </Button>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-5">
            <div>
              <Label>Fun Prompts <span className="text-muted-foreground text-xs">(answer at least 3)</span></Label>
              <p className="text-xs text-muted-foreground mt-1">
                {Object.values(prompts).filter((v) => v.trim()).length}/3 answered
              </p>
            </div>
            {PROMPT_QUESTIONS.map((q) => (
              <div key={q} className="space-y-2">
                <p className="text-sm font-medium text-foreground">{q}</p>
                <Input
                  value={prompts[q] ?? ""}
                  onChange={(e) => setPrompts({ ...prompts, [q]: e.target.value })}
                  placeholder="Your answer..."
                  className="rounded-xl"
                />
              </div>
            ))}
          </div>
        );
    }
  };

  const stepLabels = ["Basics", "Preferences", "Interests", "Prompts"];

  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <span className="text-4xl block mb-2">🐑</span>
          <h1 className="font-display text-2xl text-foreground">Complete your profile</h1>
          <p className="text-muted-foreground text-sm mt-1">Step {step + 1} of {totalSteps}</p>
        </div>

        {/* Progress */}
        <div className="flex gap-2 mb-8">
          {stepLabels.map((label, i) => (
            <div key={i} className="flex-1">
              <div className={`h-1 rounded-full transition-all ${i <= step ? "bg-primary" : "bg-border"}`} />
              <p className={`text-[10px] mt-1 text-center ${i <= step ? "text-primary" : "text-muted-foreground"}`}>
                {label}
              </p>
            </div>
          ))}
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex gap-3 mt-8">
          {step > 0 && (
            <Button variant="outline" onClick={() => setStep(step - 1)} className="flex-1">
              <ChevronLeft className="w-4 h-4 mr-1" /> Back
            </Button>
          )}
          {step < totalSteps - 1 ? (
            <Button onClick={() => setStep(step + 1)} disabled={!canProceed()} className="flex-1">
              Next <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          ) : (
            <Button onClick={handleFinish} disabled={!canProceed() || saving} className="flex-1">
              {saving ? "Setting up..." : <>Finish <Check className="w-4 h-4 ml-1" /></>}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;
