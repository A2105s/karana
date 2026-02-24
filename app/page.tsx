import Link from 'next/link';

export default function Home() {
  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-900 via-slate-900 to-blue-900 flex flex-col">
      {/* Navbar */}
      <nav className="bg-black/40 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <Link href="/" className="flex items-center space-x-2">
            <div className="text-3xl">⚡</div>
            <span className="font-bold text-2xl text-white">Karana</span>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="max-w-2xl text-center space-y-8">
          <div>
            <h1 className="text-6xl font-bold text-white mb-4">
              One Map. One Brain.
              <br />
              <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                Zero Wasted Crores.
              </span>
            </h1>
            <p className="text-xl text-gray-300 mb-2">
              Central AI-powered infrastructure coordination platform
            </p>
            <p className="text-lg text-gray-400">
              for Indian government departments
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-8">
            {[
              { icon: '🗺️', label: 'Live Map' },
              { icon: '🤖', label: 'AI Risk' },
              { icon: '📊', label: 'Analytics' },
              { icon: '💰', label: 'Savings' },
            ].map((item) => (
              <div
                key={item.label}
                className="bg-white/5 border border-white/10 rounded-lg p-4 hover:bg-white/10 transition"
              >
                <div className="text-3xl mb-2">{item.icon}</div>
                <p className="text-sm text-gray-300">{item.label}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <Link
              href="/dashboard"
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold rounded-lg transition transform hover:scale-105 shadow-lg"
            >
              Commissioner Dashboard
            </Link>
            <Link
              href="/map"
              className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-lg transition border border-white/20"
            >
              View Live Map
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-white/10 bg-black/40 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-8 text-center text-gray-400 text-sm">
          <p>Karana Platform | GatiShakti Ready | Built for AI Innovation Sprint 2026</p>
        </div>
      </div>
    </div>
  );
}
