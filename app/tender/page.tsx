'use client';

import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import jsPDF from 'jspdf';
import { useState } from 'react';

export default function TenderPage() {
  const [formData, setFormData] = useState({
    dept: 'PWD',
    title: '',
    location: '',
    startDate: '',
    endDate: '',
    cost: '',
  });

  const [clashes, setClashes] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [riskScore, setRiskScore] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Create GeoJSON project
      const newProject = {
        type: 'Feature',
        properties: {
          id: 999,
          dept: formData.dept,
          title: formData.title,
          start: formData.startDate,
          end: formData.endDate,
          cost: parseInt(formData.cost),
          risk: 'MEDIUM',
          clash_with: null,
          description: formData.location,
        },
        geometry: {
          type: 'LineString',
          coordinates: [[78.17, 26.22], [78.18, 26.23]],
        },
      };

      // Check for clashes
      const clashRes = await fetch('/api/clashes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProject),
      });

      const clashData = await clashRes.json();
      setClashes(clashData);

      if (clashData.clashes.length > 0) {
        // Score risk for first clash
        const riskRes = await fetch('/api/score-risk', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            project_title: formData.title,
            dept: formData.dept,
            clashing_dept: clashData.clashes[0].dept,
            overlap_meters: 500,
            combined_cost: formData.cost + clashData.clashes[0].cost,
          }),
        });

        const riskData = await riskRes.json();
        setRiskScore(riskData);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateNIT = async () => {
    if (!clashes || clashes.clashes.length === 0) return;

    try {
      const projectsList = [
        { dept: formData.dept, title: formData.title, cost: parseInt(formData.cost) },
        ...clashes.clashes,
      ];

      const nitRes = await fetch('/api/generate-nit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projects: projectsList }),
      });

      const { nit } = await nitRes.json();

      // Generate PDF
      const doc = new jsPDF();
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.text('Notice Inviting Tender (NIT)', 20, 20);
      
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(11);
      const splitText = doc.splitTextToSize(nit, 170);
      doc.text(splitText, 20, 35);

      doc.save('karana-nit.pdf');
    } catch (error) {
      console.error('Error generating NIT:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-900 to-blue-900">
      <Navbar />
      
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 p-8">
          <div className="max-w-2xl">
            <h1 className="text-3xl font-bold text-white mb-8">New Tender Submission</h1>

            <form onSubmit={handleSubmit} className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-8 space-y-6 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Department</label>
                  <select
                    value={formData.dept}
                    onChange={(e) => setFormData({ ...formData, dept: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:border-blue-500"
                  >
                    <option>PWD</option>
                    <option>WATER</option>
                    <option>BESCOM</option>
                    <option>MUNICIPAL</option>
                    <option>TELECOM</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Project Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Road Resurfacing"
                    className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g. MLN Road, Gwalior"
                  className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Start Date</label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">End Date</label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Estimated Cost (₹)</label>
                  <input
                    type="number"
                    value={formData.cost}
                    onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                    placeholder="0"
                    className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 text-white font-bold rounded-lg transition"
              >
                {isLoading ? 'Checking for Clashes...' : 'Submit & Check Clashes'}
              </button>
            </form>

            {/* Clash Results */}
            {clashes && (
              <div
                className={`bg-black/40 backdrop-blur-xl border rounded-2xl p-6 mb-8 ${
                  clashes.clashes.length > 0
                    ? 'border-red-500/30 bg-red-500/5'
                    : 'border-green-500/30 bg-green-500/5'
                }`}
              >
                <h3 className="text-lg font-bold text-white mb-4">Clash Analysis Result</h3>
                
                {clashes.clashes.length > 0 ? (
                  <div className="space-y-4">
                    <p className="text-red-300 font-semibold">
                      ⚠️ {clashes.clashes.length} Clash(es) Detected!
                    </p>
                    
                    <div className="space-y-3">
                      {clashes.clashes.map((clash: any) => (
                        <div key={clash.id} className="bg-white/5 border border-white/10 rounded-lg p-3">
                          <p className="text-white font-semibold">{clash.title}</p>
                          <p className="text-sm text-gray-300">
                            {clash.dept} • ₹{(clash.cost / 1000000).toFixed(1)}L
                          </p>
                        </div>
                      ))}
                    </div>

                    {riskScore && (
                      <div className="mt-4 bg-white/5 border border-white/10 rounded-lg p-4">
                        <h4 className="font-semibold text-white mb-2">AI Risk Assessment</h4>
                        <div className="space-y-2 text-sm">
                          <p className="text-gray-300">
                            Risk Score: <span className="text-red-400 font-bold">{riskScore.risk_score}/10</span>
                          </p>
                          <p className="text-gray-300">
                            Potential Waste: <span className="text-orange-400 font-bold">₹{(riskScore.waste_inr / 1000000).toFixed(1)}L</span>
                          </p>
                          <p className="text-gray-300">
                            Recommendation: <span className="text-blue-400 font-semibold capitalize">{riskScore.recommendation}</span>
                          </p>
                        </div>
                      </div>
                    )}

                    <button
                      onClick={generateNIT}
                      className="w-full px-6 py-2 bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white font-semibold rounded-lg transition mt-4"
                    >
                      📄 Generate Combined NIT & Download PDF
                    </button>
                  </div>
                ) : (
                  <p className="text-green-300">✅ No conflicts detected - Safe to proceed!</p>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
