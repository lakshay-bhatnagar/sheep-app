import { Heart, Shield, Coffee, MessageCircle, CheckCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const features = [
  { icon: Heart, title: "Curated Matches", description: "Profiles curated by preferences, values, and compatibility. No endless swiping." },
  { icon: Coffee, title: "Cafe Dates", description: "Pick a cafe, lock in a time. Real dates in real places." },
  { icon: Shield, title: "₹199 Commitment", description: "A small fee filters out the unserious and unlocks chat." },
  { icon: MessageCircle, title: "Chat After Commit", description: "Chat only unlocks after both commit. Quality conversations." },
  { icon: CheckCircle, title: "SDP Validation", description: "Show your unique code at the cafe. Both validate, date completes." },
  { icon: Sparkles, title: "No-show Protection", description: "Cancel after paying? You lose your fee, your match gets refunded." },
];

const steps = [
  { number: "01", title: "Create Profile", desc: "Add your photos, bio, and a voice intro." },
  { number: "02", title: "Swipe & Match", desc: "See curated profiles. Swipe right when you feel a spark." },
  { number: "03", title: "Pick a Cafe", desc: "Both agree on a cafe and time within 48 hours." },
  { number: "04", title: "Pay ₹199", desc: "Small commitment fee. Chat unlocks for both." },
  { number: "05", title: "Meet & Validate", desc: "Show SDP code at cafe. Enjoy your date! 🐑" },
];

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-b border-border">
        <div className="container mx-auto flex items-center justify-between h-16 px-4">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl">🐑</span>
            <span className="font-display text-xl font-semibold text-foreground">Sheep</span>
          </Link>
          <div className="flex items-center gap-3">
            <Button variant="ghost" asChild>
              <Link to="/auth">Log in</Link>
            </Button>
            <Button asChild>
              <Link to="/auth?tab=signup">Get Started</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-3xl text-center">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 bg-secondary px-4 py-2 rounded-full mb-8">
              <span className="text-sm font-medium text-foreground">Dating, but make it intentional</span>
            </div>
          </motion.div>
          <motion.h1
            initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-5xl md:text-7xl text-foreground leading-tight mb-6"
          >
            Meet someone worth leaving the house for
          </motion.h1>
          <motion.p
            initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
          >
            Sheep is curated dating with cafe commitment. Match, pick a spot, pay ₹199, and actually meet.
          </motion.p>
          <motion.div
            initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button size="lg" className="text-base px-8 py-6" asChild>
              <Link to="/auth?tab=signup">Start Matching — It's Free</Link>
            </Button>
            <Button variant="outline" size="lg" className="text-base px-8 py-6" asChild>
              <Link to="#how-it-works">How It Works</Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="pb-20">
        <div className="container mx-auto max-w-4xl px-4">
          <div className="grid grid-cols-3 gap-6">
            {[
              { num: "234", label: "cafe dates this week" },
              { num: "12.8K", label: "matches made" },
              { num: "4.8", label: "average date rating" },
            ].map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center py-6"
              >
                <p className="font-display text-3xl md:text-4xl text-foreground mb-1">{s.num}</p>
                <p className="text-sm text-muted-foreground">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-secondary/50">
        <div className="container mx-auto max-w-5xl px-4">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-5xl text-foreground mb-4">Dating that respects your time</h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">Every feature filters noise and connects you with serious people.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="bg-background rounded-2xl p-8 border border-border hover:shadow-elevated transition-shadow duration-300"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-5">
                  <f.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-display text-xl text-foreground mb-2">{f.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{f.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-20">
        <div className="container mx-auto max-w-3xl px-4">
          <h2 className="font-display text-3xl md:text-5xl text-foreground mb-12 text-center">Five steps to a real date</h2>
          <div className="space-y-6">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="flex items-start gap-6 p-6 rounded-2xl border border-transparent hover:border-border hover:bg-secondary/30 transition-all"
              >
                <span className="text-3xl font-display text-primary/40 shrink-0">{step.number}</span>
                <div>
                  <h3 className="font-display text-lg text-foreground mb-1">{step.title}</h3>
                  <p className="text-muted-foreground text-sm">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container mx-auto max-w-2xl px-4">
          <div className="bg-primary rounded-3xl p-12 md:p-16 text-center">
            <h2 className="font-display text-3xl md:text-4xl text-primary-foreground mb-4">Your next great date is one swipe away</h2>
            <p className="text-primary-foreground/70 text-lg mb-8 max-w-lg mx-auto">Join thousands ready to meet in person.</p>
            <Button variant="outline" size="lg" className="bg-background text-foreground border-background hover:bg-background/90 text-base px-8 py-6" asChild>
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
          <p className="text-muted-foreground text-sm">© 2026 Sheep. Meet intentionally.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
