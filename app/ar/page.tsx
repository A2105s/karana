'use client';

import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import VoiceQuery from '@/components/VoiceQuery';
import { Camera, MapPin, ShieldAlert, Volume2 } from 'lucide-react';
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

  const warnings = [
    { project: 'MLN Road Resurfacing (PWD)', risk: 'HIGH', distance: '200m' },
    { project: 'Sewer Line – MLN Road (WATER)', risk: 'HIGH', distance: '150m' },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <div className="flex flex-1">
        <Sidebar />

        <main className="flex-1 p-6 lg:p-8 space-y-6 overflow-auto">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">AR Field Warning System</h1>
            <p className="text-sm text-muted-foreground mt-1">Live camera overlay with zone risk indicators and voice alerts</p>
          </div>

          <Card className="bg-card border-border overflow-hidden">
            {/* Camera viewport */}
            <div className="relative w-full bg-black">
              {hasCamera ? (
                <video
                  ref={videoRef}
                  autoPlay
                  className="w-full h-80 lg:h-96 object-cover"
                />
              ) : (
                <div className="w-full h-80 lg:h-96 flex items-center justify-center bg-secondary">
                  <div className="text-center space-y-2">
                    <Camera className="h-8 w-8 text-muted-foreground mx-auto" aria-hidden="true" />
                    <p className="text-sm text-muted-foreground">Camera not available</p>
                    <p className="text-xs text-muted-foreground/70">Allow camera access to use AR features</p>
                  </div>
                </div>
              )}

              {/* AR overlay */}
              {hasCamera && (
                <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center" role="status" aria-live="polite">
                  <div className="rounded-lg border border-destructive/60 bg-destructive/80 px-6 py-4 text-center animate-pulse-ring">
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <ShieldAlert className="h-5 w-5 text-white" aria-hidden="true" />
                      <p className="text-lg font-semibold text-white">HIGH RISK ZONE</p>
                    </div>
                    <p className="text-xs text-white/80 mt-1">Sewer + PWD projects active</p>
                    <p className="text-[10px] text-white/60 mt-0.5">Get clearance before digging</p>
                  </div>
                </div>
              )}
            </div>

            <CardContent className="p-5 space-y-5">
              {/* Warnings list */}
              <div>
                <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
                  <ShieldAlert className="h-4 w-4 text-destructive" aria-hidden="true" />
                  Active Warnings
                </h3>
                <div className="space-y-2">
                  {warnings.map((warning, idx) => (
                    <div key={idx} className="flex items-center justify-between rounded-md border border-destructive/20 bg-destructive/5 p-3">
                      <div>
                        <p className="text-sm font-medium">{warning.project}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                          <MapPin className="h-3 w-3" aria-hidden="true" />
                          {warning.distance} away
                        </p>
                      </div>
                      <Badge variant="destructive">{warning.risk}</Badge>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Voice */}
              <div>
                <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
                  <Volume2 className="h-4 w-4 text-primary" aria-hidden="true" />
                  Voice Alerts (Hindi)
                </h3>
                <VoiceQuery />
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
