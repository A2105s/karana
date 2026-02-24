import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Zap, Map, Brain, BarChart3, IndianRupee, ArrowRight, Shield } from 'lucide-react';

const features = [
  { icon: Map, label: 'Live Map', description: 'Real-time project visualization across departments' },
  { icon: Brain, label: 'AI Risk Engine', description: 'Automated clash detection and risk scoring' },
  { icon: BarChart3, label: 'Analytics', description: 'Commissioner-level dashboards and reports' },
  { icon: IndianRupee, label: 'Cost Savings', description: 'Prevent duplicate spend across agencies' },
];

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Skip to main */}
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground">
        Skip to main content
      </a>

      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 lg:px-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Zap className="h-4 w-4 text-primary-foreground" aria-hidden="true" />
            </div>
            <span className="font-semibold tracking-tight">Karana</span>
          </Link>
          <nav className="flex items-center gap-2" aria-label="Primary">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard">Dashboard</Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/map">Open Map</Link>
            </Button>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <main id="main" className="flex-1">
        <section className="mx-auto max-w-6xl px-4 lg:px-6 py-20 lg:py-32">
          <div className="mx-auto max-w-2xl text-center space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-3 py-1 text-xs text-muted-foreground">
              <Shield className="h-3 w-3" aria-hidden="true" />
              GatiShakti Ready &middot; AI Innovation Sprint 2026
            </div>

            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              One Map. One Brain.
              <br />
              <span className="text-gradient">Zero Wasted Crores.</span>
            </h1>

            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              Central AI-powered infrastructure coordination platform for Indian government departments.
              Detect clashes. Score risk. Save public money.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
              <Button size="lg" asChild>
                <Link href="/dashboard">
                  Commissioner Dashboard
                  <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/map">View Live Map</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="border-t border-border bg-secondary/30">
          <div className="mx-auto max-w-6xl px-4 lg:px-6 py-16 lg:py-20">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {features.map((item) => {
                const Icon = item.icon;
                return (
                  <Card key={item.label} className="bg-card border-border hover:border-primary/30 transition-colors">
                    <CardContent className="p-5 space-y-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                        <Icon className="h-4 w-4 text-primary" aria-hidden="true" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{item.label}</p>
                        <p className="text-xs text-muted-foreground mt-1">{item.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="mx-auto max-w-6xl px-4 lg:px-6 py-6 flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            Karana Platform &middot; Built for AI Innovation Sprint 2026
          </p>
          <p className="text-xs text-muted-foreground">
            PWD &middot; Water Board &middot; BESCOM &middot; Municipal &middot; Telecom
          </p>
        </div>
      </footer>
    </div>
  );
}
