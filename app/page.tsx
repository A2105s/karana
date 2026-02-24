'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
    ArrowRight,
    BarChart3,
    Brain,
    Camera,
    CheckCircle2,
    FileText,
    Globe,
    LayoutDashboard,
    Map,
    MapPin,
    Shield,
    ShieldCheck,
    Trophy,
    Users,
    Zap,
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

/* ── Solution tabs (like AtomAI nav row) ── */
const solutions = [
  { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { key: 'mapping', label: 'Mapping', icon: Map },
  { key: 'clash', label: 'Clash Detection', icon: ShieldCheck },
  { key: 'risk', label: 'AI Risk Scoring', icon: Brain },
  { key: 'tender', label: 'Tender', icon: FileText },
  { key: 'ar', label: 'AR View', icon: Camera },
  { key: 'scoreboard', label: 'Scoreboard', icon: Trophy },
];

/* ── Feature showcase data ── */
const showcases = [
  {
    id: 'clash',
    title: 'Clash Detection with Karana',
    image: '/clash-preview.svg',
    features: [
      {
        heading: 'Automated Spatial Overlap Analysis',
        body: 'Karana automatically detects when two or more departments plan work on overlapping geographies, preventing duplicate excavation and wasted public funds.',
      },
      {
        heading: 'Department-Level Visibility',
        body: 'Every department — PWD, Water Board, BESCOM, Municipal, Telecom — sees a unified view of all planned and active projects in real time.',
      },
      {
        heading: 'Merge Tender Recommendations',
        body: 'When clashes are detected, Karana recommends merging tenders to share costs, reducing total project spend by up to 40%.',
      },
    ],
  },
  {
    id: 'mapping',
    title: 'Real-time Mapping in Karana',
    image: '/map-preview.svg',
    features: [
      {
        heading: 'GatiShakti-Ready GIS Layer',
        body: 'All infrastructure projects plotted on an interactive Leaflet map with department-coded lines, risk halos, and click-through project details.',
      },
      {
        heading: 'Department Toggle Filters',
        body: 'Commissioners and department heads can toggle visibility per department to focus on relevant projects and quickly assess inter-departmental overlaps.',
      },
      {
        heading: 'Conflict Summary Panel',
        body: 'A real-time sidebar shows active clash count, waste-at-risk totals, and lets users export a text report for committee meetings instantly.',
      },
    ],
  },
  {
    id: 'risk',
    title: 'AI-Powered Risk Scoring',
    image: '/risk-preview.svg',
    features: [
      {
        heading: 'LLM-Driven Risk Assessment',
        body: 'Each tender is analysed by Groq-hosted Llama 3.1 to score risk on a 0-100 scale, factoring in cost, timeline, department overlap, and historical patterns.',
      },
      {
        heading: 'Automated NIT Generation',
        body: 'Once a tender passes review, Karana generates a compliant Notice Inviting Tender (NIT) document in PDF format, ready for publication.',
      },
      {
        heading: 'Hindi Voice Warnings',
        body: 'Field engineers receive spoken warnings in Hindi via the Web Speech API when approaching high-risk zones, supporting multilingual ground teams.',
      },
    ],
  },
];

/* ── Impact stats ── */
const stats = [
  { value: '₹12Cr+', label: 'Potential savings identified', sub: 'across Gwalior infrastructure' },
  { value: '6', label: 'Departments connected', sub: 'on a single unified map' },
  { value: '40%', label: 'Reduction in duplicate work', sub: 'through clash detection' },
  { value: '< 3s', label: 'AI risk score turnaround', sub: 'per tender submission' },
];

/* ── "Why Karana" features ── */
const whyFeatures = [
  {
    icon: Globe,
    title: 'GatiShakti Aligned',
    body: 'Built from the ground up to align with PM GatiShakti National Master Plan for multi-modal infrastructure coordination.',
  },
  {
    icon: Users,
    title: 'Role-Based Access',
    body: 'Commissioners, department heads, field engineers, and tender officers each get a purpose-built view with relevant controls.',
  },
  {
    icon: Shield,
    title: 'Secure & Local-First',
    body: 'All data processing happens on secure APIs. No sensitive government data leaves the controlled environment.',
  },
  {
    icon: BarChart3,
    title: 'Actionable Analytics',
    body: 'From commissioner dashboards to contractor scorecards, every metric is designed to drive decisions, not just display data.',
  },
];

export default function Home() {
  const [activeTab, setActiveTab] = useState('clash');

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Skip to main */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground"
      >
        Skip to main content
      </a>

      {/* ───── Navbar ───── */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 lg:px-8">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary">
              <Zap className="h-4.5 w-4.5 text-primary-foreground" aria-hidden="true" />
            </div>
            <span className="text-lg font-bold tracking-tight">Karana</span>
          </Link>

          <nav className="hidden md:flex items-center gap-1" aria-label="Primary">
            {['Dashboard', 'Live Map', 'Tender', 'AR View', 'Scoreboard'].map((item) => {
              const href =
                item === 'Dashboard' ? '/dashboard' :
                item === 'Live Map' ? '/map' :
                item === 'Tender' ? '/tender' :
                item === 'AR View' ? '/ar' : '/contractor';
              return (
                <Button key={item} variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground" asChild>
                  <Link href={href}>{item}</Link>
                </Button>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" asChild>
              <Link href="/dashboard">Sign in</Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/map">
                Open Platform
                <ArrowRight className="ml-1.5 h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* ───── Hero ───── */}
      <main id="main" className="flex-1">
        <section className="relative overflow-hidden">
          {/* Subtle radial gradient bg */}
          <div
            className="pointer-events-none absolute inset-0 -z-10"
            style={{
              background: 'radial-gradient(ellipse 70% 50% at 50% 0%, oklch(0.92 0.04 260 / 0.35), transparent)',
            }}
            aria-hidden="true"
          />

          <div className="mx-auto max-w-7xl px-4 lg:px-8 pt-20 pb-16 lg:pt-32 lg:pb-24">
            <div className="mx-auto max-w-3xl text-center space-y-6 animate-fade-up">
              <div className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-4 py-1.5 text-xs font-medium text-muted-foreground">
                <Shield className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                GatiShakti Ready &middot; AI Innovation Sprint 2026
              </div>

              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl leading-[1.1]">
                Made Effortless
                <br />
                With <span className="text-gradient">Karana</span>
              </h1>

              <p className="mx-auto max-w-2xl text-lg text-muted-foreground leading-relaxed">
                Effortlessly manage infrastructure coordination, clash detection, risk scoring,
                and tender optimization across Indian government departments. One platform,
                built to save crores.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <Button size="lg" className="h-12 px-8 text-base" asChild>
                  <Link href="/dashboard">
                    Open Dashboard
                    <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" className="h-12 px-8 text-base" asChild>
                  <Link href="/map">View Live Map</Link>
                </Button>
              </div>
            </div>

            {/* Product preview mockup */}
            <div className="mx-auto mt-16 max-w-5xl animate-fade-up" style={{ animationDelay: '0.15s' }}>
              <div className="rounded-2xl border border-border bg-card shadow-xl shadow-primary/5 overflow-hidden">
                <div className="flex items-center gap-1.5 border-b border-border px-4 py-3">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-400" aria-hidden="true" />
                  <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" aria-hidden="true" />
                  <span className="h-2.5 w-2.5 rounded-full bg-green-400" aria-hidden="true" />
                  <span className="ml-3 text-xs text-muted-foreground">karana-platform.gov.in/dashboard</span>
                </div>
                <div className="relative aspect-[16/9] bg-gradient-to-br from-primary/5 via-secondary to-accent flex items-center justify-center">
                  <div className="text-center space-y-3">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                      <Map className="h-8 w-8 text-primary" aria-hidden="true" />
                    </div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Commissioner Dashboard &middot; Gwalior, MP
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ───── Solution Tabs (horizontal pills like AtomAI) ───── */}
        <section className="border-y border-border bg-secondary/40">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <div className="flex items-center gap-2 overflow-x-auto py-4 no-scrollbar" role="tablist" aria-label="Platform solutions">
              {solutions.map((s) => {
                const Icon = s.icon;
                const isActive = activeTab === s.key;
                return (
                  <button
                    key={s.key}
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setActiveTab(s.key)}
                    className={`flex items-center gap-2 whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                    }`}
                  >
                    <Icon className="h-4 w-4" aria-hidden="true" />
                    {s.label}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* ───── Feature Showcases (alternating, like AtomAI) ───── */}
        {showcases.map((section, idx) => (
          <section key={section.id} className={idx % 2 === 1 ? 'bg-secondary/30' : ''}>
            <div className="mx-auto max-w-7xl px-4 lg:px-8 py-20 lg:py-28">
              <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center ${idx % 2 === 1 ? 'lg:[direction:rtl]' : ''}`}>
                {/* Image / mockup */}
                <div className={idx % 2 === 1 ? 'lg:[direction:ltr]' : ''}>
                  <div className="rounded-2xl border border-border bg-card shadow-lg overflow-hidden aspect-[4/3] flex items-center justify-center">
                    <div className="text-center space-y-2 p-8">
                      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
                        {idx === 0 && <ShieldCheck className="h-7 w-7 text-primary" aria-hidden="true" />}
                        {idx === 1 && <MapPin className="h-7 w-7 text-primary" aria-hidden="true" />}
                        {idx === 2 && <Brain className="h-7 w-7 text-primary" aria-hidden="true" />}
                      </div>
                      <p className="text-sm text-muted-foreground">{section.title}</p>
                    </div>
                  </div>
                </div>

                {/* Feature list */}
                <div className={idx % 2 === 1 ? 'lg:[direction:ltr]' : ''}>
                  <h2 className="text-3xl font-bold tracking-tight lg:text-4xl">{section.title}</h2>
                  <div className="mt-8 space-y-6">
                    {section.features.map((f) => (
                      <div key={f.heading} className="flex gap-4">
                        <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10">
                          <CheckCircle2 className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                        </div>
                        <div>
                          <h3 className="text-base font-semibold">{f.heading}</h3>
                          <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{f.body}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 flex items-center gap-4">
                    <Button asChild>
                      <Link href={section.id === 'clash' ? '/dashboard' : section.id === 'mapping' ? '/map' : '/tender'}>
                        Explore {section.id === 'clash' ? 'Dashboard' : section.id === 'mapping' ? 'Live Map' : 'Tender'}
                        <ArrowRight className="ml-1.5 h-3.5 w-3.5" aria-hidden="true" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        ))}

        {/* ───── Impact Stats (like AtomAI "Our Impact") ───── */}
        <section className="border-y border-border bg-primary/[0.03]">
          <div className="mx-auto max-w-7xl px-4 lg:px-8 py-20 lg:py-24">
            <div className="text-center mb-14">
              <h2 className="text-3xl font-bold tracking-tight lg:text-4xl">Our Impact</h2>
              <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
                Karana drives impact by streamlining infrastructure coordination and clash prevention
                across government departments, saving crores in public money.
              </p>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((s) => (
                <div key={s.label} className="text-center">
                  <p className="text-4xl font-bold tracking-tight text-primary lg:text-5xl">{s.value}</p>
                  <p className="mt-2 text-sm font-medium">{s.label}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{s.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ───── "Why Karana" Feature Grid ───── */}
        <section className="bg-secondary/30">
          <div className="mx-auto max-w-7xl px-4 lg:px-8 py-20 lg:py-24">
            <div className="text-center mb-14">
              <p className="text-sm font-medium text-primary mb-2">Why work with Karana</p>
              <h2 className="text-3xl font-bold tracking-tight lg:text-4xl">
                More about Karana and its features
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {whyFeatures.map((f) => {
                const Icon = f.icon;
                return (
                  <Card key={f.title} className="bg-card border-border hover:shadow-md transition-shadow">
                    <CardContent className="p-6 space-y-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                        <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
                      </div>
                      <h3 className="text-base font-semibold">{f.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{f.body}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* ───── CTA Section ───── */}
        <section className="border-t border-border">
          <div className="mx-auto max-w-7xl px-4 lg:px-8 py-20 lg:py-28">
            <div className="mx-auto max-w-2xl text-center space-y-6">
              <h2 className="text-3xl font-bold tracking-tight lg:text-4xl">
                Ready to Transform Your Infrastructure?
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Discover how Karana can streamline coordination, save time, and cut costs.
                See the platform in action and explore how it fits your department.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <Button size="lg" className="h-12 px-8" asChild>
                  <Link href="/dashboard">
                    Open Dashboard
                    <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" className="h-12 px-8" asChild>
                  <Link href="/map">Explore Live Map</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ───── Footer (multi-column like AtomAI) ───── */}
      <footer className="border-t border-border bg-secondary/30">
        <div className="mx-auto max-w-7xl px-4 lg:px-8 py-12 lg:py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="col-span-2 md:col-span-1">
              <Link href="/" className="flex items-center gap-2 mb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                  <Zap className="h-4 w-4 text-primary-foreground" aria-hidden="true" />
                </div>
                <span className="font-bold tracking-tight">Karana</span>
              </Link>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Powering intelligent infrastructure coordination for a smarter, efficient India.
              </p>
            </div>

            {/* Solutions */}
            <div>
              <h3 className="text-sm font-semibold mb-4">Solutions</h3>
              <ul className="space-y-2.5">
                {[
                  { label: 'Clash Detection', href: '/dashboard' },
                  { label: 'Mapping & GIS', href: '/map' },
                  { label: 'Tender Management', href: '/tender' },
                  { label: 'AR Field View', href: '/ar' },
                  { label: 'Contractor Scoreboard', href: '/contractor' },
                ].map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Departments */}
            <div>
              <h3 className="text-sm font-semibold mb-4">Departments</h3>
              <ul className="space-y-2.5">
                {['PWD', 'Water Board', 'BESCOM', 'Municipal Corp', 'Telecom'].map((dept) => (
                  <li key={dept}>
                    <span className="text-sm text-muted-foreground">{dept}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Learn More */}
            <div>
              <h3 className="text-sm font-semibold mb-4">Learn More</h3>
              <ul className="space-y-2.5">
                {[
                  { label: 'GatiShakti Portal', href: 'https://pmgatishakti.gov.in/' },
                  { label: 'AI Sprint 2026', href: '#' },
                  { label: 'Documentation', href: '#' },
                ].map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                      {...(link.href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-muted-foreground">
              Karana Platform &middot; AI Innovation Sprint 2026 &middot; Gwalior, Madhya Pradesh
            </p>
            <p className="text-xs text-muted-foreground">
              Built for GatiShakti National Master Plan
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
