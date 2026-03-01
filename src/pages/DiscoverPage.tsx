import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Heart, X, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Profile {
  id: string;
  user_id: string;
  name: string;
  bio: string;
  gender: string | null;
  religion: string | null;
  dating_prompt_answer: string;
  profile_picture_url: string | null;
}

const DiscoverPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchProfiles = async () => {
      // Get already swiped
      const { data: swiped } = await supabase
        .from("swipes")
        .select("swiped_id")
        .eq("swiper_id", user.id);

      const swipedIds = swiped?.map((s) => s.swiped_id) ?? [];
      const excludeIds = [user.id, ...swipedIds];

      const { data } = await supabase
        .from("profiles")
        .select("id, user_id, name, bio, gender, religion, dating_prompt_answer, profile_picture_url")
        .eq("is_active", true)
        .not("user_id", "in", `(${excludeIds.join(",")})`)
        .limit(20);

      setProfiles(data ?? []);
      setLoading(false);
    };

    fetchProfiles();
  }, [user]);

  const handleSwipe = async (direction: "right" | "left") => {
    if (!user || !profiles[currentIndex]) return;

    const target = profiles[currentIndex];

    await supabase.from("swipes").insert({
      swiper_id: user.id,
      swiped_id: target.user_id,
      direction,
    });

    if (direction === "right") {
      // Check for mutual swipe
      const { data: mutual } = await supabase
        .from("swipes")
        .select("id")
        .eq("swiper_id", target.user_id)
        .eq("swiped_id", user.id)
        .eq("direction", "right")
        .maybeSingle();

      if (mutual) {
        // Create match
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

    setCurrentIndex((prev) => prev + 1);
  };

  const currentProfile = profiles[currentIndex];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <span className="text-4xl block mb-4 animate-pulse-soft">🐑</span>
          <p className="text-muted-foreground">Finding people for you...</p>
        </div>
      </div>
    );
  }

  if (!currentProfile) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center max-w-sm">
          <span className="text-5xl block mb-4">🌙</span>
          <h2 className="font-display text-2xl text-foreground mb-2">That's everyone for now</h2>
          <p className="text-muted-foreground">Check back later for new profiles. Quality over quantity. 🐑</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-sm mx-auto">
      <div className="bg-card rounded-3xl overflow-hidden shadow-elevated border border-border">
        {/* Profile image placeholder */}
        <div className="aspect-[3/4] bg-gradient-warm flex items-center justify-center relative">
          {currentProfile.profile_picture_url ? (
            <img
              src={currentProfile.profile_picture_url}
              alt={currentProfile.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-8xl opacity-30">🐑</span>
          )}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-card to-transparent p-6 pt-20">
            <h2 className="font-display text-2xl text-foreground">{currentProfile.name}</h2>
            {currentProfile.gender && (
              <div className="flex items-center gap-1 text-muted-foreground text-sm mt-1">
                <MapPin className="w-3 h-3" />
                <span>{currentProfile.gender}</span>
                {currentProfile.religion && <span>• {currentProfile.religion}</span>}
              </div>
            )}
          </div>
        </div>

        {/* Bio */}
        <div className="p-6">
          {currentProfile.bio && (
            <p className="text-foreground mb-3">{currentProfile.bio}</p>
          )}
          {currentProfile.dating_prompt_answer && (
            <div className="bg-peach rounded-xl p-4">
              <p className="text-sm text-muted-foreground mb-1 font-medium">Dating prompt</p>
              <p className="text-foreground text-sm">{currentProfile.dating_prompt_answer}</p>
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex justify-center gap-6 p-6 pt-0">
          <button
            onClick={() => handleSwipe("left")}
            className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center hover:bg-destructive hover:text-destructive-foreground transition-colors shadow-soft"
          >
            <X className="w-7 h-7" />
          </button>
          <button
            onClick={() => handleSwipe("right")}
            className="w-16 h-16 rounded-full bg-gradient-hero flex items-center justify-center text-primary-foreground shadow-glow hover:opacity-90 transition-opacity"
          >
            <Heart className="w-7 h-7" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DiscoverPage;
