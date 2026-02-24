'use client';

import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import mockProjects from '@/data/mockProjects.json';

export default function DashboardPage() {
  const projects = (mockProjects as any).features;
  const clashingProjects = projects.filter((p: any) => p.properties.clash_with !== null);
  const totalCost = projects.reduce((sum: number, p: any) => sum + p.properties.cost, 0);
  const wasteRisk = clashingProjects.reduce((sum: number, p: any) => sum + (p.properties.cost * 0.2), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-900 to-blue-900">
      <Navbar />
      
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 p-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[
              { label: 'Total Projects', value: projects.length, icon: '📦', color: 'from-blue-600 to-blue-700' },
              { label: 'Active Clashes', value: clashingProjects.length, icon: '⚠️', color: 'from-red-600 to-red-700' },
              { label: 'Total Investment', value: `₹${(totalCost / 10000000).toFixed(1)}Cr`, icon: '💰', color: 'from-green-600 to-green-700' },
              { label: 'Waste at Risk', value: `₹${(wasteRisk / 10000000).toFixed(1)}Cr`, icon: '🔴', color: 'from-orange-600 to-orange-700' },
            ].map((stat) => (
              <div
                key={stat.label}
                className={`bg-gradient-to-br ${stat.color} rounded-2xl p-6 text-white shadow-lg`}
              >
                <div className="text-3xl mb-2">{stat.icon}</div>
                <p className="text-sm text-gray-100 opacity-80">{stat.label}</p>
                <p className="text-3xl font-bold mt-2">{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Clashes Table */}
          <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-white mb-6">Active Clashes</h2>
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-3 px-4 text-gray-300">Project 1</th>
                    <th className="text-left py-3 px-4 text-gray-300">Dept</th>
                    <th className="text-left py-3 px-4 text-gray-300">Clashing With</th>
                    <th className="text-left py-3 px-4 text-gray-300">Combined Cost</th>
                    <th className="text-left py-3 px-4 text-gray-300">Risk</th>
                    <th className="text-left py-3 px-4 text-gray-300">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {clashingProjects.map((project: any) => (
                    <tr key={project.properties.id} className="border-b border-white/10 hover:bg-white/5 transition">
                      <td className="py-4 px-4 text-white font-medium">{project.properties.title}</td>
                      <td className="py-4 px-4 text-gray-300">{project.properties.dept}</td>
                      <td className="py-4 px-4 text-gray-300">{project.properties.clash_with}</td>
                      <td className="py-4 px-4 text-gray-300">₹{(project.properties.cost / 1000000).toFixed(1)}L</td>
                      <td className="py-4 px-4">
                        <span className={`px-3 py-1 rounded text-xs font-semibold ${
                          project.properties.risk === 'HIGH' ? 'bg-red-500/20 text-red-300' :
                          project.properties.risk === 'MEDIUM' ? 'bg-yellow-500/20 text-yellow-300' :
                          'bg-green-500/20 text-green-300'
                        }`}>
                          {project.properties.risk}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <button className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-semibold transition">
                          Merge Tender
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
