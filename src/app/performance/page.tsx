'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import { LineChart, Trophy, Flame, Zap, Shield, Sparkles } from 'lucide-react';

export default function PerformancePage() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch('/api/dashboard')
      .then((res) => res.json())
      .then((json) => setData(json));
  }, []);

  const predictions = data?.racePredictions || [];
  const equipment = data?.equipment || [];
  const profile = data?.profile;

  const prs = [
    { event: '5K PR', time: profile?.pb5k || '21:45', pace: '4:21/km' },
    { event: '10K PR', time: profile?.pb10k || '45:30', pace: '4:33/km' },
    { event: 'Half Marathon PR', time: profile?.pbHalfMarathon || '1:42:15', pace: '4:50/km' },
    { event: 'Marathon PR', time: profile?.pbMarathon || '3:48:00', pace: '5:24/km' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-16">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-8">
        {/* PERFORMANCE DASHBOARD HERO BANNER FROM SCREENSHOT */}
        <section className="glass-card p-8 rounded-3xl border border-cyan-500/30 bg-gradient-to-br from-slate-900 via-slate-900/90 to-cyan-950/40 text-center space-y-3 shadow-2xl">
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Performance Dashboard
          </h1>
          <p className="text-sm sm:text-base font-medium text-slate-300 max-w-2xl mx-auto leading-relaxed">
            It&apos;s your data. View it your way. Customize charts of your training data to your preferences, and compare data over different time periods with ease.
          </p>
        </section>

        {/* PR Wall of Fame */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>Personal Records Wall</span>
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {prs.map((pr) => (
              <div key={pr.event} className="glass-card p-4 rounded-xl border border-slate-800 space-y-1">
                <div className="text-[10px] font-bold text-slate-400 uppercase">{pr.event}</div>
                <div className="text-xl font-black text-amber-400">{pr.time}</div>
                <div className="text-[11px] text-slate-400 font-mono">Pace {pr.pace}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Race Predictions */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
            <Zap className="w-4 h-4 text-cyan-400" />
            <span>Current Race Capability Predictions</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {predictions.map((rp: any) => (
              <div key={rp.distance} className="glass-card p-5 rounded-xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-sm font-bold text-white">{rp.distance} Forecast</span>
                  <span className="text-[10px] font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded">
                    Confidence: 88%
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
                    <div className="text-[10px] text-slate-400">Conservative</div>
                    <div className="text-sm font-bold text-slate-300">{rp.conservative}</div>
                  </div>
                  <div className="bg-slate-900 p-2 rounded-lg border border-cyan-500/30">
                    <div className="text-[10px] text-cyan-400 font-bold">Likely</div>
                    <div className="text-base font-black text-cyan-300">{rp.likely}</div>
                  </div>
                  <div className="bg-slate-900 p-2 rounded-lg border border-emerald-500/30">
                    <div className="text-[10px] text-emerald-400 font-bold">Optimistic</div>
                    <div className="text-sm font-bold text-emerald-300">{rp.optimistic}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Equipment Tracker */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
            <Shield className="w-4 h-4 text-purple-400" />
            <span>Shoe & Equipment Wear Tracker</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {equipment.map((eq: any) => {
              const pct = Math.min(100, Math.round((eq.accumulatedDistance / eq.retirementThreshold) * 100));
              return (
                <div key={eq.id} className="glass-card p-5 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-white">{eq.name}</h4>
                      <p className="text-xs text-slate-400">{eq.brand} • {eq.model}</p>
                    </div>
                    <span className="text-xs font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded">
                      {eq.accumulatedDistance} / {eq.retirementThreshold} km
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${pct > 80 ? 'bg-amber-400' : 'bg-cyan-400'}`}
                      style={{ width: `${pct}%` }}
                    ></div>
                  </div>
                  <div className="text-[10px] text-slate-400 flex justify-between">
                    <span>Condition: {pct > 80 ? 'Monitor foam wear' : 'Excellent cushioned state'}</span>
                    <span>{pct}% Used</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
