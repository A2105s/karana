'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: '📊' },
  { href: '/map', label: 'Live Map', icon: '🗺️' },
  { href: '/tender', label: 'Tender', icon: '📝' },
  { href: '/ar', label: 'AR View', icon: '📱' },
  { href: '/contractor', label: 'Scoreboard', icon: '🏆' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-black/40 backdrop-blur-xl border-r border-white/10 hidden lg:flex flex-col">
      <div className="p-6 border-b border-white/10">
        <h2 className="font-bold text-lg text-white">Navigation</h2>
      </div>

      <nav className="flex-1 p-6 space-y-3">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-6 border-t border-white/10">
        <div className="text-xs text-gray-400 text-center">
          <p>Karana Platform</p>
          <p>GatiShakti Ready</p>
        </div>
      </div>
    </aside>
  );
}
