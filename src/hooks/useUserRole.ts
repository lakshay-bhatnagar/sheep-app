import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

type AppRole = "user" | "cafe" | "admin";

export function useUserRole() {
  const [role, setRole] = useState<AppRole>("user");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRole = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .limit(1)
        .maybeSingle();

      if (data) {
        setRole(data.role as AppRole);
      }
      setLoading(false);
    };

    fetchRole();
  }, []);

  return { role, loading };
}
