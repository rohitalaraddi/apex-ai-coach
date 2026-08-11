'use client';

import { HeartPulse, Wind, Droplets, Activity, Thermometer, FileText, ArrowRight, CheckCircle2 } from 'lucide-react';

interface WhoopHealthMonitorProps {
  respiratoryRate?: number;
  spo2?: number;
  rhr?: number;
  hrv?: number;
  skinTemp?: number;
}

export default function WhoopHealthMonitor({
  respiratoryRate = 15.2,
  spo2 = 96,
  rhr = 56,
  hrv = 65,
  skinTemp = -0.7,
}: WhoopHealthMonitorProps) {
  return (
    <div className="whoop-card p-6 space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-sm font-black uppercase text-white tracking-widest flex items-center space-x-2">
            <HeartPulse className="w-4 h-4 text-emerald-400" />
            <span>HEALTH MONITOR</span>
          </h2>
          <p className="text-[10px] text-slate-400 font-mono">LAST NIGHT'S READINGS & BIOMETRIC BASELINES</p>
        </div>
        <span className="px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-xs font-bold font-mono">
          ✓ 5/5 METRICS IN RANGE
        </span>
      </div>

      {/* 5 BIOMETRIC CARDS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* 1. RESPIRATORY RATE */}
        <div className="bg-[#242b31] p-4 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold uppercase tracking-wider">
            <span className="flex items-center space-x-1.5">
              <Wind className="w-3.5 h-3.5 text-cyan-400" />
              <span>RESPIRATORY RATE</span>
            </span>
          </div>
          <div className="text-2xl font-black text-white font-mono">{respiratoryRate} <span className="text-xs font-normal text-slate-400">rpm</span></div>
          <div className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold font-mono">
            <CheckCircle2 className="w-3 h-3" />
            <span>within 14.1 - 16.5</span>
          </div>
        </div>

        {/* 2. BLOOD OXYGEN (SpO2) */}
        <div className="bg-[#242b31] p-4 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold uppercase tracking-wider">
            <span className="flex items-center space-x-1.5">
              <Droplets className="w-3.5 h-3.5 text-sky-400" />
              <span>BLOOD OXYGEN</span>
            </span>
          </div>
          <div className="text-2xl font-black text-white font-mono">{spo2}<span className="text-xs font-normal text-slate-400">%</span></div>
          <div className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold font-mono">
            <CheckCircle2 className="w-3 h-3" />
            <span>within 94% - 100%</span>
          </div>
        </div>

        {/* 3. RESTING HEART RATE (RHR) */}
        <div className="bg-[#242b31] p-4 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold uppercase tracking-wider">
            <span className="flex items-center space-x-1.5">
              <Activity className="w-3.5 h-3.5 text-rose-400" />
              <span>RHR</span>
            </span>
          </div>
          <div className="text-2xl font-black text-white font-mono">{rhr} <span className="text-xs font-normal text-slate-400">bpm</span></div>
          <div className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold font-mono">
            <CheckCircle2 className="w-3 h-3" />
            <span>within 52 - 58</span>
          </div>
        </div>

        {/* 4. HEART RATE VARIABILITY (HRV) */}
        <div className="bg-[#242b31] p-4 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold uppercase tracking-wider">
            <span className="flex items-center space-x-1.5">
              <HeartPulse className="w-3.5 h-3.5 text-purple-400" />
              <span>HRV</span>
            </span>
          </div>
          <div className="text-2xl font-black text-white font-mono">{hrv} <span className="text-xs font-normal text-slate-400">ms</span></div>
          <div className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold font-mono">
            <CheckCircle2 className="w-3 h-3" />
            <span>within 55 - 75</span>
          </div>
        </div>

        {/* 5. SKIN TEMP */}
        <div className="bg-[#242b31] p-4 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold uppercase tracking-wider">
            <span className="flex items-center space-x-1.5">
              <Thermometer className="w-3.5 h-3.5 text-amber-400" />
              <span>SKIN TEMP (FROM BASELINE)</span>
            </span>
          </div>
          <div className="text-2xl font-black text-white font-mono">{skinTemp > 0 ? `+${skinTemp}` : skinTemp} <span className="text-xs font-normal text-slate-400">°F</span></div>
          <div className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold font-mono">
            <CheckCircle2 className="w-3 h-3" />
            <span>within -1.5 to +2.3</span>
          </div>
        </div>

        {/* 6. SHARE HEALTH REPORT CARD */}
        <div className="bg-gradient-to-tr from-slate-900 to-[#242b31] p-4 rounded-2xl border border-slate-700 space-y-2 flex flex-col justify-between group cursor-pointer hover:border-cyan-500/40 transition-colors">
          <div>
            <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-300">
              <span>SHARE YOUR HEALTH REPORT</span>
              <ArrowRight className="w-4 h-4 text-cyan-400 group-hover:translate-x-1 transition-transform" />
            </div>
            <p className="text-[11px] text-slate-400 pt-1 leading-normal">
              Printable PDF report for sharing with your doctor, physician, trainer, or AI coach.
            </p>
          </div>
          <button className="w-full py-2 px-3 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 font-bold text-xs border border-cyan-500/30 flex items-center justify-center space-x-1.5">
            <FileText className="w-3.5 h-3.5" />
            <span>Export 30-Day Report</span>
          </button>
        </div>
      </div>
    </div>
  );
}
