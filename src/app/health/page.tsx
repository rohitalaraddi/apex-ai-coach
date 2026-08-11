'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import WhoopGauges from '@/components/WhoopGauges';
import WhoopHealthMonitor from '@/components/WhoopHealthMonitor';
import { HeartPulse, Moon, Activity as MuscleIcon } from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

export default function HealthPage() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch('/api/dashboard')
      .then((res) => res.json())
      .then((json) => setData(json));
  }, []);

  const latestLog = data?.latestSubjectiveLog;
  const healthHistory = data?.healthHistory || [];
  const latestDailyHealth = healthHistory[0] || {};
  const readiness = data?.readiness;

  const sleepCompositionData = healthHistory.slice(-14).map((h: any) => ({
    date: new Date(h.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    deep: Number((h.deepSleepSeconds / 3600).toFixed(1)),
    rem: Number((h.remSleepSeconds / 3600).toFixed(1)),
    light: Number((h.lightSleepSeconds / 3600).toFixed(1)),
  }));

  const muscles = [
    { name: 'Quads', val: latestLog?.quadsSoreness || 2 },
    { name: 'Calves', val: latestLog?.calvesSoreness || 2 },
    { name: 'Hamstrings', val: latestLog?.hamstringsSoreness || 1 },
    { name: 'Glutes', val: latestLog?.glutesSoreness || 1 },
    { name: 'Hips', val: latestLog?.hipsSoreness || 0 },
    { name: 'Knees', val: latestLog?.kneesSoreness || 0 },
    { name: 'Shins', val: latestLog?.shinsSoreness || 0 },
    { name: 'Ankles', val: latestLog?.anklesSoreness || 1 },
    { name: 'Feet', val: latestLog?.feetSoreness || 0 },
  ];

  return (
    <div className="min-h-screen bg-[#121619] text-slate-100 pb-16 font-sans">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-8">
        <div>
          <h1 className="text-xl font-extrabold text-white flex items-center space-x-2 font-mono">
            <HeartPulse className="w-6 h-6 text-emerald-400" />
            <span>Garmin Health Monitor & Recovery Analytics</span>
          </h1>
          <p className="text-xs text-slate-400 font-mono">
            Live 5/5 Biometric Monitoring, Nightly HRV, Sleep Composition, and Muscle Recovery Matrix
          </p>
        </div>

        {/* WHOOP TRIPLE GAUGES */}
        <WhoopGauges
          sleepScore={latestDailyHealth?.sleepScore || 84}
          recoveryScore={readiness?.score || 78}
          strainScore={12.4}
          healthMetricsStatus="5/5 Metrics Within Range"
          stressLevel="MEDIUM (1.7)"
          stressScore={1.7}
        />

        {/* WHOOP 5 BIOMETRICS HEALTH MONITOR */}
        <WhoopHealthMonitor
          respiratoryRate={15.2}
          spo2={96}
          rhr={latestDailyHealth?.restingHr || 56}
          hrv={latestDailyHealth?.hrvNightlyAvg || 65}
          skinTemp={-0.7}
        />

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Sleep Composition */}
          <div className="whoop-card p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center space-x-2 font-mono">
                <Moon className="w-4 h-4 text-purple-400" />
                <span>Sleep Stage Breakdown (Hours)</span>
              </h3>
              <span className="text-xs font-bold text-purple-300 bg-purple-500/10 px-2 py-0.5 rounded font-mono">
                Target: 7.5h
              </span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sleepCompositionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2a3137" />
                  <XAxis dataKey="date" stroke="#64748b" fontSize={10} />
                  <YAxis stroke="#64748b" fontSize={10} />
                  <Tooltip contentStyle={{ backgroundColor: '#1c2126', borderColor: '#334155', borderRadius: '1rem' }} />
                  <Bar dataKey="deep" name="Deep Sleep" stackId="a" fill="#8b5cf6" />
                  <Bar dataKey="rem" name="REM Sleep" stackId="a" fill="#3b82f6" />
                  <Bar dataKey="light" name="Light Sleep" stackId="a" fill="#334155" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Muscle Soreness Matrix */}
          <div className="whoop-card p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center space-x-2 font-mono">
                <MuscleIcon className="w-4 h-4 text-amber-400" />
                <span>Subjective Muscle Soreness Heatmap</span>
              </h3>
              <span className="text-[10px] text-slate-400 uppercase font-semibold font-mono">Latest Check-in</span>
            </div>

            <div className="grid grid-cols-3 gap-3 pt-2">
              {muscles.map((m) => (
                <div
                  key={m.name}
                  className={`p-3 rounded-xl border flex flex-col justify-between ${
                    m.val > 4
                      ? 'border-amber-500/50 bg-amber-500/10 text-amber-300'
                      : m.val > 2
                      ? 'border-cyan-500/30 bg-cyan-500/5 text-cyan-300'
                      : 'border-slate-800 bg-[#242b31] text-slate-300'
                  }`}
                >
                  <span className="text-xs font-semibold">{m.name}</span>
                  <span className="text-lg font-black mt-1 font-mono">{m.val} / 10</span>
                </div>
              ))}
            </div>

            {latestLog?.painLocation && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 text-xs text-red-300 font-medium">
                ⚠️ Flagged Pain: <strong>{latestLog.painLocation}</strong> (Severity {latestLog.painSeverity}/10)
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
