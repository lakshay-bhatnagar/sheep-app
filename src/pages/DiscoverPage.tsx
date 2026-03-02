import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Heart, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";

interface Profile {
  id: string;
  user_id: string;
  name: string;
  bio: string;
  gender: string | null;
  religion: string | null;
  dating_prompt_answer: string;
  profile_picture_url: string | null;
  interests: string[];
  fun_prompts: Record<string, string>;
}

const DiscoverPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [swiping, setSwiping] = useState<"left" | "right" | null>(null);

  useEffect(() => {
    if (!user) return;

    const fetchProfiles = async () => {
      const { data: swiped } = await supabase
        .from("swipes")
        .select("swiped_id")
        .eq("swiper_id", user.id);

      const swipedIds = swiped?.map((s) => s.swiped_id) ?? [];
      const excludeIds = [user.id, ...swipedIds];

      const { data } = await supabase
        .from("profiles")
        .select("id, user_id, name, bio, gender, religion, dating_prompt_answer, profile_picture_url, interests, fun_prompts")
        .eq("is_active", true)
        .eq("onboarding_completed", true)
        .not("user_id", "in", `(${excludeIds.join(",")})`)
        .limit(20);

      setProfiles((data as any) ?? []);
      setLoading(false);
    };

    fetchProfiles();
  }, [user]);

  const handleSwipe = async (direction: "right" | "left") => {
    if (!user || !profiles[currentIndex]) return;
    setSwiping(direction);

    const target = profiles[currentIndex];

    await supabase.from("swipes").insert({
      swiper_id: user.id,
      swiped_id: target.user_id,
      direction,
    });

    if (direction === "right") {
      const { data: mutual } = await supabase
        .from("swipes")
        .select("id")
        .eq("swiper_id", target.user_id)
        .eq("swiped_id", user.id)
        .eq("direction", "right")
        .maybeSingle();

      if (mutual) {
        await supabase.from("matches").insert({
          user1_id: target.user_id,
          user2_id: user.id,
          status: "pending_cafe_selection",
          expires_at: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
        });
        toast({
          title: "🎉 It's a match!",
          description: `You and ${target.name} matched! Pick a cafe within 48 hours.`,
        });
      }
    }

    setTimeout(() => {
      setSwiping(null);
      setCurrentIndex((prev) => prev + 1);
    }, 300);
  };

  const currentProfile = profiles[currentIndex];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <span className="text-5xl block mb-4 animate-pulse-soft">🐑</span>
          <p className="text-muted-foreground text-sm">Finding people for you...</p>
        </div>
      </div>
    );
  }

  if (!currentProfile) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center max-w-xs">
          <span className="text-5xl block mb-4">🌙</span>
          <h2 className="font-display text-2xl text-foreground mb-2">That's everyone for now</h2>
          <p className="text-muted-foreground text-sm">Check back later. Quality over quantity. 🐑</p>
        </div>
      </div>
    );
  }

  const promptEntries = Object.entries(currentProfile.fun_prompts || {}).filter(([, v]) => v);

  return (
    <div className="max-w-sm mx-auto">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentProfile.id}
          initial={{ opacity: 1, scale: 1 }}
          animate={{
            opacity: swiping ? 0.5 : 1,
            x: swiping === "left" ? -100 : swiping === "right" ? 100 : 0,
            rotate: swiping === "left" ? -8 : swiping === "right" ? 8 : 0,
          }}
          transition={{ duration: 0.3 }}
          className="rounded-3xl overflow-hidden border border-border"
        >
          {/* Profile image */}
          <div className="aspect-[3/4] bg-secondary flex items-center justify-center relative">
            {currentProfile.profile_picture_url ? (
              <img
                src={currentProfile.profile_picture_url}
                alt={currentProfile.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-8xl opacity-20">🐑</span>
            )}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background to-transparent p-6 pt-20">
              <h2 className="font-display text-2xl text-foreground">{currentProfile.name}</h2>
              {currentProfile.gender && (
                <p className="text-muted-foreground text-sm mt-1">
                  {currentProfile.gender}
                  {currentProfile.religion && ` · ${currentProfile.religion}`}
                </p>
              )}
            </div>
          </div>

          {/* Bio & details */}
          <div className="p-6 space-y-4">
            {currentProfile.bio && (
              <p className="text-foreground text-sm leading-relaxed">{currentProfile.bio}</p>
            )}

            {/* Interests */}
            {currentProfile.interests?.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {currentProfile.interests.slice(0, 6).map((i) => (
                  <span key={i} className="px-3 py-1 rounded-full border border-border text-xs text-foreground">
                    {i}
                  </span>
                ))}
              </div>
            )}

            {/* Prompt */}
            {promptEntries.length > 0 && (
              <div className="border border-border rounded-xl p-4">
                <p className="text-xs text-muted-foreground mb-1 font-medium">{promptEntries[0][0]}</p>
                <p className="text-foreground text-sm">{promptEntries[0][1]}</p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-center gap-8 p-6 pt-0">
            <button
              onClick={() => handleSwipe("left")}
              className="w-16 h-16 rounded-full border-2 border-border flex items-center justify-center hover:border-primary/40 transition-colors"
            >
              <X className="w-7 h-7 text-muted-foreground" />
            </button>
            <button
              onClick={() => handleSwipe("right")}
              className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              <Heart className="w-7 h-7" />
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default DiscoverPage;
