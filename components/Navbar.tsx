'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Zap, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import SidebarNav from '@/components/Sidebar';

export default function Navbar() {
  const [role, setRole] = useState('commissioner');

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="flex h-14 items-center px-4 lg:px-6">
        {/* Mobile menu trigger */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="lg:hidden mr-2" aria-label="Open navigation menu">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <SheetTitle className="sr-only">Navigation</SheetTitle>
            <SidebarNav />
          </SheetContent>
        </Sheet>

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group mr-6">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Zap className="h-4 w-4 text-primary-foreground" aria-hidden="true" />
          </div>
          <span className="font-semibold text-base tracking-tight group-hover:text-primary transition-colors">
            Karana
          </span>
        </Link>

        <Separator orientation="vertical" className="h-6 hidden lg:block" />

        {/* Spacer */}
        <div className="flex-1" />

        {/* Role selector */}
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground hidden sm:inline">Role</span>
          <Select value={role} onValueChange={setRole}>
            <SelectTrigger className="w-[160px] h-8 text-xs bg-secondary border-border" aria-label="Select role">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="commissioner">Commissioner</SelectItem>
              <SelectItem value="dept-head">Dept Head</SelectItem>
              <SelectItem value="field-engineer">Field Engineer</SelectItem>
              <SelectItem value="tender-officer">Tender Officer</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </header>
  );
}
