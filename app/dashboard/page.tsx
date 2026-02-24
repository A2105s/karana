'use client';

import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import mockProjects from '@/data/mockProjects.json';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { FolderKanban, AlertTriangle, IndianRupee, TrendingDown, GitMerge } from 'lucide-react';

export default function DashboardPage() {
  const projects = (mockProjects as any).features;
  const clashingProjects = projects.filter((p: any) => p.properties.clash_with !== null);
  const totalCost = projects.reduce((sum: number, p: any) => sum + p.properties.cost, 0);
  const wasteRisk = clashingProjects.reduce((sum: number, p: any) => sum + (p.properties.cost * 0.2), 0);

  const stats = [
    { label: 'Total Projects', value: projects.length, icon: FolderKanban, accent: 'text-primary' },
    { label: 'Active Clashes', value: clashingProjects.length, icon: AlertTriangle, accent: 'text-destructive' },
    { label: 'Total Investment', value: `₹${(totalCost / 10000000).toFixed(1)}Cr`, icon: IndianRupee, accent: 'text-emerald-400' },
    { label: 'Waste at Risk', value: `₹${(wasteRisk / 10000000).toFixed(1)}Cr`, icon: TrendingDown, accent: 'text-orange-400' },
  ];

  const riskVariant = (risk: string) => {
    if (risk === 'HIGH') return 'destructive' as const;
    if (risk === 'MEDIUM') return 'secondary' as const;
    return 'outline' as const;
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <div className="flex flex-1">
        <Sidebar />

        <main className="flex-1 p-6 lg:p-8 space-y-6 overflow-auto">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
            <p className="text-sm text-muted-foreground mt-1">Commissioner overview of active infrastructure projects</p>
          </div>

          {/* Stat cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <Card key={stat.label} className="bg-card border-border">
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-medium text-muted-foreground">{stat.label}</p>
                      <Icon className={`h-4 w-4 ${stat.accent}`} aria-hidden="true" />
                    </div>
                    <p className="text-2xl font-semibold mt-2">{stat.value}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Clashes table */}
          <Card className="bg-card border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-destructive" aria-hidden="true" />
                Active Clashes
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead>Project</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Clashing With</TableHead>
                    <TableHead className="text-right">Cost</TableHead>
                    <TableHead>Risk</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {clashingProjects.map((project: any) => (
                    <TableRow key={project.properties.id} className="border-border">
                      <TableCell className="font-medium">{project.properties.title}</TableCell>
                      <TableCell className="text-muted-foreground">{project.properties.dept}</TableCell>
                      <TableCell className="text-muted-foreground">{project.properties.clash_with}</TableCell>
                      <TableCell className="text-right text-muted-foreground">
                        ₹{(project.properties.cost / 1000000).toFixed(1)}L
                      </TableCell>
                      <TableCell>
                        <Badge variant={riskVariant(project.properties.risk)}>
                          {project.properties.risk}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm" className="h-7 text-xs gap-1.5">
                          <GitMerge className="h-3 w-3" aria-hidden="true" />
                          Merge Tender
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
