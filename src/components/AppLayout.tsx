import { Outlet, Link, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useRequireAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Heart, Settings, Bell, Home, LogOut } from "lucide-react";

const userNav = [
  { to: "/app", icon: Home, label: "Discover" },
  { to: "/app/matches", icon: Heart, label: "Matches" },
  { to: "/app/notifications", icon: Bell, label: "Alerts" },
  { to: "/app/settings", icon: Settings, label: "Settings" },
];

const AppLayout = () => {
  const { signOut } = useAuth();
  useRequireAuth();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top bar */}
      <header className="sticky top-0 z-50 bg-background/90 backdrop-blur-md border-b border-border">
        <div className="container mx-auto flex items-center justify-between h-14 px-4">
          <Link to="/app" className="flex items-center gap-2">
            <span className="text-xl">🐑</span>
            <span className="font-display text-lg font-semibold text-foreground">Sheep</span>
          </Link>
          <Button variant="ghost" size="sm" onClick={signOut}>
            <LogOut className="w-4 h-4 mr-1" />
            Sign out
          </Button>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 container mx-auto px-4 py-6 max-w-lg">
        <Outlet />
      </main>

      {/* Bottom nav */}
      <nav className="sticky bottom-0 bg-background border-t border-border safe-area-bottom">
        <div className="container mx-auto max-w-lg flex justify-around py-2">
          {userNav.map((item) => {
            const active = location.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-colors ${
                  active ? "text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default AppLayout;
