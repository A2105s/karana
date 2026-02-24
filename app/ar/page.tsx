'use client';

import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import VoiceQuery from '@/components/VoiceQuery';
import { useEffect, useRef, useState } from 'react';

export default function ARPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasCamera, setHasCamera] = useState(false);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setHasCamera(true);
        }
      } catch (error) {
        console.error('Camera access denied:', error);
      }
    };

    startCamera();

    const currentVideo = videoRef.current;
    return () => {
      if (currentVideo?.srcObject) {
        (currentVideo.srcObject as MediaStream).getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-900 to-blue-900">
      <Navbar />
      
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 p-8">
          <h1 className="text-3xl font-bold text-white mb-8">AR Field Warning System</h1>

          <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
            <div className="relative w-full bg-black">
              {hasCamera ? (
                <video
                  ref={videoRef}
                  autoPlay
                  className="w-full h-96 object-cover"
                />
              ) : (
                <div className="w-full h-96 flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900">
                  <div className="text-center">
                    <p className="text-gray-400 mb-2">📱 Camera not available</p>
                    <p className="text-sm text-gray-500">Please allow camera access to use AR features</p>
                  </div>
                </div>
              )}

              {/* AR Overlay - Warning Banner */}
              {hasCamera && (
                <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center">
                  <div className="bg-red-600/80 text-white px-6 py-4 rounded-lg text-center animate-pulse">
                    <p className="text-xl font-bold">⚠️ HIGH RISK ZONE</p>
                    <p className="text-sm mt-2">Sewer + PWD projects active</p>
                    <p className="text-xs mt-1">Get clearance before digging</p>
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Active Warnings</h3>
                <div className="space-y-3">
                  {[
                    { project: 'MLN Road Resurfacing (PWD)', risk: 'HIGH', distance: '200m' },
                    { project: 'Sewer Line – MLN Road (WATER)', risk: 'HIGH', distance: '150m' },
                  ].map((warning, idx) => (
                    <div key={idx} className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                      <p className="text-white font-semibold">{warning.project}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-red-300 text-sm">📍 {warning.distance}</span>
                        <span className="px-2 py-1 bg-red-600 text-white rounded text-xs font-bold">{warning.risk}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-white/10 pt-6">
                <h3 className="text-lg font-semibold text-white mb-4">Voice Alerts (Hindi)</h3>
                <VoiceQuery />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
