import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Bell } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { motion } from "framer-motion";

interface Notification {
  id: string;
  title: string;
  body: string;
  is_read: boolean;
  created_at: string;
}

const NotificationsPage = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("notifications")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(50)
      .then(({ data }) => {
        setNotifications(data ?? []);
        setLoading(false);
      });
  }, [user]);

  const markRead = async (id: string) => {
    await supabase.from("notifications").update({ is_read: true }).eq("id", id);
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <span className="text-4xl animate-pulse-soft">🔔</span>
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Bell className="w-10 h-10 text-muted-foreground mx-auto mb-4" />
          <h2 className="font-display text-2xl text-foreground mb-2">All quiet</h2>
          <p className="text-muted-foreground text-sm">No notifications yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-display text-2xl text-foreground mb-6">Notifications</h1>
      <div className="space-y-2">
        {notifications.map((n, i) => (
          <motion.button
            key={n.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
            onClick={() => !n.is_read && markRead(n.id)}
            className={`w-full text-left p-4 rounded-2xl border transition-colors ${
              n.is_read ? "border-border" : "border-primary/20 bg-primary/5"
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-medium text-foreground text-sm">{n.title}</h3>
                <p className="text-muted-foreground text-sm mt-0.5">{n.body}</p>
              </div>
              {!n.is_read && <div className="w-2 h-2 rounded-full bg-primary shrink-0 mt-1.5" />}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {formatDistanceToNow(new Date(n.created_at), { addSuffix: true })}
            </p>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default NotificationsPage;
