'use client';

import { Activity, ShieldCheck, HeartPulse, Moon, Flame, Zap, ChevronRight } from 'lucide-react';

interface WhoopGaugesProps {
  sleepScore?: number;
  recoveryScore?: number;
  strainScore?: number;
  healthMetricsStatus?: string;
  stressLevel?: string;
  stressScore?: number;
  sleepDurationStr?: string;
  activityDurationStr?: string;
}

export default function WhoopGauges({
  sleepScore = 84,
  recoveryScore = 78,
  strainScore = 12.4,
  healthMetricsStatus = '5/5 Metrics Within Range',
  stressLevel = 'MEDIUM (1.7)',
  stressScore = 1.7,
  sleepDurationStr = '8:15 hrs',
  activityDurationStr = '1h 24m',
}: WhoopGaugesProps) {
  // SVG Ring calculations for 3 rings
  const radius = 42;
  const circumference = 2 * Math.PI * radius;

  const sleepOffset = circumference - (sleepScore / 100) * circumference;
  const recoveryOffset = circumference - (recoveryScore / 100) * circumference;
  const strainOffset = circumference - (Math.min(strainScore, 21) / 21) * circumference;

  return (
    <div className="space-y-6">
      {/* WHOOP BRANDING HEADER & TRIPLE GAUGES */}
      <div className="whoop-card p-6 relative overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-4 mb-6">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-black tracking-widest text-slate-300 font-mono">GARMIN</span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Performance Engine</span>
          </div>
          <div className="flex items-center space-x-1.5 text-xs text-emerald-400 font-mono font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping shrink-0" />
            <span>LIVE GARMIN MONITORED</span>
          </div>
        </div>

        {/* 3 CIRCULAR GAUGES: SLEEP, RECOVERY, STRAIN */}
        <div className="grid grid-cols-3 gap-4 text-center">
          {/* 1. SLEEP GAUGE */}
          <div className="flex flex-col items-center space-y-2 group cursor-pointer">
            <div className="relative w-28 h-28 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r={radius} className="stroke-[#2a3137] fill-none stroke-[8]" />
                <circle
                  cx="50"
                  cy="50"
                  r={radius}
                  className="stroke-sky-400 fill-none stroke-[8] transition-all duration-1000"
                  strokeDasharray={circumference}
                  strokeDashoffset={sleepOffset}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-black text-white">{sleepScore}<span className="text-xs text-slate-400 font-bold">%</span></span>
              </div>
            </div>
            <div className="flex items-center space-x-1 text-xs font-black tracking-wider uppercase text-sky-400 group-hover:text-sky-300">
              <span>SLEEP</span>
              <ChevronRight className="w-3 h-3" />
            </div>
          </div>

          {/* 2. RECOVERY GAUGE */}
          <div className="flex flex-col items-center space-y-2 group cursor-pointer">
            <div className="relative w-28 h-28 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r={radius} className="stroke-[#2a3137] fill-none stroke-[8]" />
                <circle
                  cx="50"
                  cy="50"
                  r={radius}
                  className={`fill-none stroke-[8] transition-all duration-1000 ${
                    recoveryScore >= 67
                      ? 'stroke-amber-400'
                      : recoveryScore >= 34
                      ? 'stroke-yellow-400'
                      : 'stroke-rose-500'
                  }`}
                  strokeDasharray={circumference}
                  strokeDashoffset={recoveryOffset}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-black text-white">{recoveryScore}<span className="text-xs text-slate-400 font-bold">%</span></span>
              </div>
            </div>
            <div className="flex items-center space-x-1 text-xs font-black tracking-wider uppercase text-amber-400 group-hover:text-amber-300">
              <span>RECOVERY</span>
              <ChevronRight className="w-3 h-3" />
            </div>
          </div>

          {/* 3. DAY STRAIN GAUGE */}
          <div className="flex flex-col items-center space-y-2 group cursor-pointer">
            <div className="relative w-28 h-28 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r={radius} className="stroke-[#2a3137] fill-none stroke-[8]" />
                <circle
                  cx="50"
                  cy="50"
                  r={radius}
                  className="stroke-blue-500 fill-none stroke-[8] transition-all duration-1000"
                  strokeDasharray={circumference}
                  strokeDashoffset={strainOffset}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-black text-white">{strainScore}</span>
              </div>
            </div>
            <div className="flex items-center space-x-1 text-xs font-black tracking-wider uppercase text-blue-400 group-hover:text-blue-300">
              <span>DAY STRAIN</span>
              <ChevronRight className="w-3 h-3" />
            </div>
          </div>
        </div>

        {/* HEALTH MONITOR & STRESS MONITOR BANNERS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          {/* Health Monitor Banner */}
          <div className="bg-[#242b31] p-4 rounded-2xl border border-slate-800 flex items-center justify-between hover:border-emerald-500/40 transition-colors cursor-pointer group">
            <div className="space-y-1">
              <div className="text-[10px] font-black uppercase text-slate-400 tracking-wider flex items-center space-x-1">
                <HeartPulse className="w-3.5 h-3.5 text-emerald-400" />
                <span>HEALTH MONITOR</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold">
                  ✓ WITHIN RANGE
                </span>
                <span className="text-xs text-slate-300 font-mono font-semibold">5/5 Metrics</span>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
          </div>

          {/* Stress Monitor Banner */}
          <div className="bg-[#242b31] p-4 rounded-2xl border border-slate-800 flex items-center justify-between hover:border-amber-500/40 transition-colors cursor-pointer group">
            <div className="space-y-1">
              <div className="text-[10px] font-black uppercase text-slate-400 tracking-wider flex items-center space-x-1">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>STRESS MONITOR</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-bold font-mono">
                  {stressScore} {stressLevel.split(' ')[0]}
                </span>
                <span className="text-xs text-slate-400 font-mono">Real-time</span>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
          </div>
        </div>
      </div>
    </div>
  );
}
