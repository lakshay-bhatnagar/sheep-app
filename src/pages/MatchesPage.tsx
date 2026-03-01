import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Clock, MessageCircle, Coffee } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface MatchWithProfile {
  id: string;
  status: string;
  chat_unlocked: boolean;
  expires_at: string | null;
  created_at: string;
  other_name: string;
  other_picture: string | null;
}

const MatchesPage = () => {
  const { user } = useAuth();
  const [matches, setMatches] = useState<MatchWithProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchMatches = async () => {
      const { data } = await supabase
        .from("matches")
        .select("*")
        .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)
        .order("created_at", { ascending: false });

      if (!data) {
        setLoading(false);
        return;
      }

      const otherIds = data.map((m) =>
        m.user1_id === user.id ? m.user2_id : m.user1_id
      );

      const { data: profiles } = await supabase
        .from("profiles")
        .select("user_id, name, profile_picture_url")
        .in("user_id", otherIds);

      const profileMap = new Map(profiles?.map((p) => [p.user_id, p]) ?? []);

      const enriched: MatchWithProfile[] = data.map((m) => {
        const otherId = m.user1_id === user.id ? m.user2_id : m.user1_id;
        const profile = profileMap.get(otherId);
        return {
          id: m.id,
          status: m.status,
          chat_unlocked: m.chat_unlocked,
          expires_at: m.expires_at,
          created_at: m.created_at,
          other_name: profile?.name ?? "Someone",
          other_picture: profile?.profile_picture_url ?? null,
        };
      });

      setMatches(enriched);
      setLoading(false);
    };

    fetchMatches();
  }, [user]);

  const statusConfig: Record<string, { label: string; color: string; icon: typeof Clock }> = {
    pending_cafe_selection: { label: "Pick a cafe", color: "bg-gold text-gold-foreground", icon: Coffee },
    cafe_proposed: { label: "Cafe proposed", color: "bg-peach text-foreground", icon: Coffee },
    awaiting_payment: { label: "Pay ₹199", color: "bg-warm text-warm-foreground", icon: Clock },
    confirmed: { label: "Date confirmed!", color: "bg-success text-success-foreground", icon: MessageCircle },
    completed: { label: "Completed", color: "bg-muted text-muted-foreground", icon: Clock },
    cancelled: { label: "Cancelled", color: "bg-destructive/10 text-destructive", icon: Clock },
    expired: { label: "Expired", color: "bg-muted text-muted-foreground", icon: Clock },
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <span className="text-4xl animate-pulse-soft">🐑</span>
      </div>
    );
  }

  if (matches.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <span className="text-5xl block mb-4">💕</span>
          <h2 className="font-display text-2xl text-foreground mb-2">No matches yet</h2>
          <p className="text-muted-foreground">Keep swiping! Your person is out there.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-display text-2xl text-foreground mb-6">Your Matches</h1>
      <div className="space-y-3">
        {matches.map((match) => {
          const config = statusConfig[match.status] ?? statusConfig.expired;
          const StatusIcon = config.icon;
          return (
            <div
              key={match.id}
              className="bg-card rounded-2xl p-4 border border-border shadow-soft flex items-center gap-4"
            >
              <div className="w-14 h-14 rounded-full bg-peach flex items-center justify-center shrink-0 overflow-hidden">
                {match.other_picture ? (
                  <img src={match.other_picture} alt="" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-2xl">🐑</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground truncate">{match.other_name}</h3>
                <p className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(match.created_at), { addSuffix: true })}
                </p>
              </div>
              <div className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium ${config.color}`}>
                <StatusIcon className="w-3 h-3" />
                {config.label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MatchesPage;
