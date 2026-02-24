'use client';

import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';

export default function ContractorPage() {
  const contractors = [
    {
      id: 1,
      name: 'BuildCorp India Ltd',
      completed: 12,
      avgDelay: 3,
      penalty: 125000,
    },
    {
      id: 2,
      name: 'Infrastructure Plus',
      completed: 18,
      avgDelay: 1,
      penalty: 45000,
    },
    {
      id: 3,
      name: 'Highway Systems',
      completed: 8,
      avgDelay: 7,
      penalty: 280000,
    },
    {
      id: 4,
      name: 'Urban Development Co',
      completed: 15,
      avgDelay: 2,
      penalty: 85000,
    },
    {
      id: 5,
      name: 'Metro Engineering',
      completed: 20,
      avgDelay: 0,
      penalty: 0,
    },
  ];

  const getScore = (completed: number, delay: number) => {
    return Math.max(0, 100 - delay * 5 - (completed < 10 ? 10 : 0));
  };

  const sortedContractors = [...contractors].sort(
    (a, b) => getScore(b.completed, b.avgDelay) - getScore(a.completed, a.avgDelay)
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-900 to-blue-900">
      <Navbar />
      
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 p-8">
          <h1 className="text-3xl font-bold text-white mb-8">Contractor Performance Scorecard</h1>

          <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-4 px-4 text-gray-300 font-semibold">Rank</th>
                    <th className="text-left py-4 px-4 text-gray-300 font-semibold">Contractor Name</th>
                    <th className="text-center py-4 px-4 text-gray-300 font-semibold">Projects Completed</th>
                    <th className="text-center py-4 px-4 text-gray-300 font-semibold">Avg Delay (days)</th>
                    <th className="text-right py-4 px-4 text-gray-300 font-semibold">Penalties</th>
                    <th className="text-center py-4 px-4 text-gray-300 font-semibold">Score</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedContractors.map((contractor, idx) => {
                    const score = getScore(contractor.completed, contractor.avgDelay);
                    const medal = idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : '  ';
                    
                    return (
                      <tr key={contractor.id} className="border-b border-white/10 hover:bg-white/5 transition">
                        <td className="py-4 px-4 text-white font-bold text-lg">{medal}</td>
                        <td className="py-4 px-4 text-white font-medium">{contractor.name}</td>
                        <td className="py-4 px-4 text-center text-gray-300">{contractor.completed}</td>
                        <td className="py-4 px-4 text-center text-gray-300">{contractor.avgDelay}</td>
                        <td className="py-4 px-4 text-right text-gray-300">
                          ₹{contractor.penalty.toLocaleString('en-IN')}
                        </td>
                        <td className="py-4 px-4 text-center">
                          <div className="flex items-center justify-center space-x-2">
                            <div className="w-24 bg-white/10 rounded-full h-2">
                              <div
                                className={`h-full rounded-full transition ${
                                  score >= 80 ? 'bg-green-500' :
                                  score >= 60 ? 'bg-yellow-500' :
                                  'bg-red-500'
                                }`}
                                style={{ width: `${score}%` }}
                              />
                            </div>
                            <span className={`font-bold text-sm ${
                              score >= 80 ? 'text-green-400' :
                              score >= 60 ? 'text-yellow-400' :
                              'text-red-400'
                            }`}>
                              {score.toFixed(0)}
                            </span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 pt-8 border-t border-white/10">
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                <p className="text-sm text-gray-300">🥇 Top Performer</p>
                <p className="text-lg font-bold text-green-400 mt-1">
                  {sortedContractors[0].name}
                </p>
              </div>

              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                <p className="text-sm text-gray-300">⚠️ Average Delay</p>
                <p className="text-lg font-bold text-yellow-400 mt-1">
                  {(sortedContractors.reduce((sum, c) => sum + c.avgDelay, 0) / sortedContractors.length).toFixed(1)} days
                </p>
              </div>

              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                <p className="text-sm text-gray-300">💰 Total Penalties</p>
                <p className="text-lg font-bold text-blue-400 mt-1">
                  ₹{(sortedContractors.reduce((sum, c) => sum + c.penalty, 0) / 100000).toFixed(1)}L
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
