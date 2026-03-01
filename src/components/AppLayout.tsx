import { Outlet, Link, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useUserRole } from "@/hooks/useUserRole";
import { Button } from "@/components/ui/button";
import {
  Heart, Settings, Bell, Coffee, BarChart3,
  Users, LogOut, Home, CreditCard, HelpCircle,
} from "lucide-react";

const userNav = [
  { to: "/app", icon: Home, label: "Discover" },
  { to: "/app/matches", icon: Heart, label: "Matches" },
  { to: "/app/notifications", icon: Bell, label: "Alerts" },
  { to: "/app/settings", icon: Settings, label: "Settings" },
];

const cafeNav = [
  { to: "/app", icon: Home, label: "Dashboard" },
  { to: "/app/bookings", icon: Coffee, label: "Bookings" },
  { to: "/app/payments", icon: CreditCard, label: "Payments" },
  { to: "/app/settings", icon: Settings, label: "Settings" },
];

const adminNav = [
  { to: "/app", icon: Home, label: "Overview" },
  { to: "/app/users", icon: Users, label: "Users" },
  { to: "/app/cafes", icon: Coffee, label: "Cafes" },
  { to: "/app/analytics", icon: BarChart3, label: "Analytics" },
  { to: "/app/support", icon: HelpCircle, label: "Support" },
];

const AppLayout = () => {
  const { signOut } = useAuth();
  const { role } = useUserRole();
  const location = useLocation();

  const nav = role === "admin" ? adminNav : role === "cafe" ? cafeNav : userNav;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top bar */}
      <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto flex items-center justify-between h-14 px-4">
          <Link to="/app" className="flex items-center gap-2">
            <span className="text-xl">🐑</span>
            <span className="font-display text-lg text-foreground">Sheep</span>
            {role !== "user" && (
              <span className="text-xs bg-peach text-foreground px-2 py-0.5 rounded-full font-medium capitalize">
                {role}
              </span>
            )}
          </Link>
          <Button variant="ghost" size="sm" onClick={signOut}>
            <LogOut className="w-4 h-4 mr-1" />
            Sign out
          </Button>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 container mx-auto px-4 py-6 max-w-4xl">
        <Outlet />
      </main>

      {/* Bottom nav (mobile-style) */}
      <nav className="sticky bottom-0 bg-card border-t border-border">
        <div className="container mx-auto max-w-lg flex justify-around py-2">
          {nav.map((item) => {
            const active = location.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors ${
                  active ? "text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="text-xs font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default AppLayout;
