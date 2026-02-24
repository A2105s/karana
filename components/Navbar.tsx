'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Navbar() {
  const [role, setRole] = useState('commissioner');

  return (
    <nav className="bg-black/40 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2 group">
          <div className="text-2xl">⚡</div>
          <span className="font-bold text-xl text-white group-hover:text-blue-400 transition">
            Karana Platform
          </span>
        </Link>

        <div className="flex items-center space-x-8">
          <div className="flex items-center space-x-2">
            <label className="text-sm text-gray-300">Role:</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="px-3 py-1 rounded-lg bg-white/10 border border-white/20 text-white text-sm focus:outline-none focus:border-blue-500"
            >
              <option value="commissioner">Commissioner</option>
              <option value="dept-head">Dept Head</option>
              <option value="field-engineer">Field Engineer</option>
              <option value="tender-officer">Tender Officer</option>
            </select>
          </div>
        </div>
      </div>
    </nav>
  );
}
