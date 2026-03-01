import { Heart, Shield, Coffee, MessageCircle, CheckCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const features = [
  {
    icon: Heart,
    title: "Curated Matches",
    description: "No endless swiping. We curate profiles based on your preferences, values, and compatibility.",
  },
  {
    icon: Coffee,
    title: "Cafe Dates",
    description: "Pick a cafe, lock in a time. Real dates in real places — not just chat forever.",
  },
  {
    icon: Shield,
    title: "₹199 Commitment",
    description: "Both pay a small commitment fee. It filters out the unserious and unlocks chat.",
  },
  {
    icon: MessageCircle,
    title: "Chat After Commit",
    description: "Chat only unlocks after both commit. Quality conversations with intention.",
  },
  {
    icon: CheckCircle,
    title: "SDP Validation",
    description: "Show your unique code at the cafe. Both validate, date completes. Simple.",
  },
  {
    icon: Sparkles,
    title: "No-show Protection",
    description: "Cancel after paying? You lose your fee, your match gets refunded. Fair play.",
  },
];

const steps = [
  { number: "01", title: "Create Profile", desc: "Add your photos, bio, and a voice intro. Be authentic." },
  { number: "02", title: "Swipe & Match", desc: "See curated profiles. Swipe right when you feel a spark." },
  { number: "03", title: "Pick a Cafe", desc: "Both agree on a cafe and time within 48 hours." },
  { number: "04", title: "Pay ₹199", desc: "Small commitment fee. Chat unlocks for both of you." },
  { number: "05", title: "Meet & Validate", desc: "Show SDP code at cafe. Enjoy your date! 🐑" },
];

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto flex items-center justify-between h-16 px-4">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl">🐑</span>
            <span className="font-display text-xl text-foreground">Sheep</span>
          </Link>
          <div className="flex items-center gap-3">
            <Button variant="ghost" asChild>
              <Link to="/auth">Log in</Link>
            </Button>
            <Button variant="hero" asChild>
              <Link to="/auth?tab=signup">Get Started</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 bg-peach px-4 py-2 rounded-full mb-8 animate-slide-up">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-foreground">Dating, but make it intentional</span>
          </div>
          <h1 className="font-display text-5xl md:text-7xl text-foreground leading-tight mb-6 animate-slide-up">
            Meet someone worth{" "}
            <span className="text-gradient-hero">leaving the house for</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-slide-up font-body">
            Sheep is curated dating with cafe commitment. Match, pick a spot, pay ₹199, 
            and actually meet. No ghosting. No time-wasters.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up">
            <Button variant="hero" size="lg" className="text-base px-8 py-6" asChild>
              <Link to="/auth?tab=signup">Start Matching — It's Free</Link>
            </Button>
            <Button variant="outline-hero" size="lg" className="text-base px-8 py-6" asChild>
              <Link to="#how-it-works">How It Works</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Floating cards decoration */}
      <section className="relative pb-20 overflow-hidden">
        <div className="container mx-auto max-w-5xl px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { emoji: "☕", text: "234 cafe dates this week", delay: "0s" },
              { emoji: "💕", text: "12,847 matches made", delay: "1s" },
              { emoji: "⭐", text: "4.8 average date rating", delay: "2s" },
            ].map((stat, i) => (
              <div
                key={i}
                className="bg-card rounded-2xl p-6 shadow-soft border border-border text-center animate-float"
                style={{ animationDelay: stat.delay }}
              >
                <span className="text-3xl mb-2 block">{stat.emoji}</span>
                <p className="font-semibold text-foreground">{stat.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-gradient-warm">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-5xl text-foreground mb-4">
              Dating that respects your time
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Every feature is designed to filter out noise and connect you with people who are serious.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <div
                key={i}
                className="bg-card rounded-2xl p-8 shadow-soft border border-border hover:shadow-elevated transition-shadow duration-300 group"
              >
                <div className="w-12 h-12 rounded-xl bg-peach flex items-center justify-center mb-5 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <feature.icon className="w-6 h-6 text-primary group-hover:text-primary-foreground" />
                </div>
                <h3 className="font-display text-xl text-foreground mb-2">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-20">
        <div className="container mx-auto max-w-4xl px-4">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-5xl text-foreground mb-4">
              Five steps to a real date
            </h2>
          </div>
          <div className="space-y-8">
            {steps.map((step, i) => (
              <div
                key={i}
                className="flex items-start gap-6 p-6 rounded-2xl hover:bg-card transition-colors"
              >
                <span className="text-4xl font-display text-gradient-hero shrink-0">
                  {step.number}
                </span>
                <div>
                  <h3 className="font-display text-xl text-foreground mb-1">{step.title}</h3>
                  <p className="text-muted-foreground">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container mx-auto max-w-3xl px-4">
          <div className="bg-gradient-hero rounded-3xl p-12 md:p-16 text-center shadow-glow">
            <h2 className="font-display text-3xl md:text-4xl text-primary-foreground mb-4">
              Your next great date is one swipe away
            </h2>
            <p className="text-primary-foreground/80 text-lg mb-8 max-w-lg mx-auto">
              Join thousands who are tired of endless chatting and ready to meet in person.
            </p>
            <Button
              variant="outline"
              size="lg"
              className="bg-background text-foreground border-background hover:bg-background/90 text-base px-8 py-6 font-semibold"
              asChild
            >
              <Link to="/auth?tab=signup">Create Free Account</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="text-2xl">🐑</span>
            <span className="font-display text-lg text-foreground">Sheep</span>
          </div>
          <p className="text-muted-foreground text-sm">
            © 2026 Sheep Dating. Meet intentionally.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
