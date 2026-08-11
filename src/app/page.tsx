'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import SubjectiveLogModal from '@/components/SubjectiveLogModal';
import WhoopGauges from '@/components/WhoopGauges';
import WhoopHealthMonitor from '@/components/WhoopHealthMonitor';
import {
  Heart,
  Moon,
  Activity,
  Zap,
  Flame,
  Filter,
  Trophy,
  Gauge,
  Sliders,
  Footprints,
  Clock,
  Sparkles,
  TrendingUp,
  Award,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LineChart,
  Line,
} from 'recharts';

export default function Dashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isCheckinOpen, setIsCheckinOpen] = useState(false);
  const [selectedRange, setSelectedRange] = useState<string>('all'); // 24h, 72h, 7d, 30d, 90d, all

  const fetchDashboardData = async (range: string = selectedRange) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/dashboard?range=${range}`);
      const json = await res.json();
      setData(json);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData(selectedRange);
  }, [selectedRange]);

  const handleRangeChange = (rangeKey: string) => {
    setSelectedRange(rangeKey);
  };

  if (loading && !data) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
          <div className="w-12 h-12 border-4 border-cyan-500/30 border-t-cyan-400 rounded-full animate-spin mx-auto"></div>
          <p className="text-sm font-medium text-slate-400">Loading Garmin Connect Athlete Intelligence...</p>
        </div>
      </div>
    );
  }

  const {
    readiness,
    latestDailyHealth,
    healthHistory,
    recentActivities,
    trainingLoad,
    racePredictions,
    vo2MaxData,
    timeframeSummary,
  } = data || {};

  const rangeButtons = [
    { label: '24 Hours', key: '24h' },
    { label: '72 Hours', key: '72h' },
    { label: 'Weekly', key: '7d' },
    { label: 'Last Month', key: '30d' },
    { label: 'Last 3 Months', key: '90d' },
    { label: 'Jan 1 2026 - Present', key: 'all' },
  ];

  // Chart 1: HRV & Heart Rate Trend
  const hrvChartData = (healthHistory || []).map((h: any) => ({
    date: new Date(h.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    hrv: h.hrvNightlyAvg,
    rhr: h.restingHr,
    baseline: 54,
    sleepScore: h.sleepScore,
  }));

  // Chart 2: Body Battery & Daily Stress
  const stressChartData = (healthHistory || []).map((h: any) => ({
    date: new Date(h.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    bodyBattery: h.bodyBatteryStart || 85,
    stress: h.avgStress || 13,
  }));

  // Chart 3: Steps & Sleep Score Trend
  const stepsChartData = (healthHistory || []).map((h: any) => ({
    date: new Date(h.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    steps: h.steps,
    sleepScore: h.sleepScore,
  }));

  return (
    <div className="min-h-screen bg-[#f0f4f9] text-slate-900 pb-16">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-8">
        {/* INTERACTIVE TIME-RANGE CONTROLS BAR */}
        <div className="whoop-card p-3.5 flex flex-wrap items-center justify-between gap-3 shadow-lg">
          <div className="flex items-center space-x-2 text-xs font-bold text-slate-300">
            <Filter className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span className="uppercase font-mono tracking-wider">Metric Timeline:</span>
            <span className="text-[10px] text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20 font-mono">
              ACTIVE: {selectedRange.toUpperCase()}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {rangeButtons.map((btn) => (
              <button
                key={btn.key}
                onClick={() => handleRangeChange(btn.key)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold font-mono transition-all ${
                  selectedRange === btn.key
                    ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                    : 'bg-[#242b31] text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>

        {/* WHOOP TRIPLE-RING PERFORMANCE GAUGES (SLEEP, RECOVERY, STRAIN) */}
        <WhoopGauges
          sleepScore={latestDailyHealth?.sleepScore || 84}
          recoveryScore={readiness?.score || 78}
          strainScore={12.4}
          healthMetricsStatus="5/5 Metrics Within Range"
          stressLevel="MEDIUM (1.7)"
          stressScore={1.7}
        />

        {/* WHOOP 5 BIOMETRIC HEALTH MONITOR */}
        <WhoopHealthMonitor
          respiratoryRate={15.2}
          spo2={96}
          rhr={latestDailyHealth?.restingHr || 56}
          hrv={latestDailyHealth?.hrvNightlyAvg || 65}
          skinTemp={-0.7}
        />

        {/* HERO SECTION: TODAY'S GARMIN TRAINING READINESS */}
        <section className="glass-card p-6 md:p-8 rounded-2xl relative overflow-hidden border border-slate-800/80">
          <div className="absolute -right-16 -top-16 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -left-16 -bottom-16 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left: Readiness Gauge */}
            <div className="lg:col-span-4 flex flex-col items-center justify-center text-center space-y-3 border-b lg:border-b-0 lg:border-r border-slate-800 pb-6 lg:pb-0 lg:pr-6">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Garmin Training Readiness
              </span>

              <div className="relative flex items-center justify-center w-36 h-36">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-slate-800"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-amber-400"
                    strokeDasharray={`${readiness?.score || 29}, 100`}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-4xl font-black text-amber-400">{readiness?.score || 29}</span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">/ 100</span>
                </div>
              </div>

              <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
                <span>LOW — High Recovery Needs</span>
              </div>
            </div>

            {/* Right: AI Morning Coach Directive & Summary */}
            <div className="lg:col-span-8 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Zap className="w-5 h-5 text-cyan-400" />
                  <h2 className="text-lg font-bold text-white">Live Garmin Health & Recovery Breakdown</h2>
                </div>
                <button
                  onClick={() => setIsCheckinOpen(true)}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 text-xs font-semibold border border-cyan-500/20 transition-all"
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Daily Check-in</span>
                </button>
              </div>

              <div className="bg-slate-900/90 rounded-xl p-4 border border-slate-800 space-y-2">
                <p className="text-sm text-slate-200 leading-relaxed font-medium">{readiness?.summary}</p>
                <div className="pt-2 border-t border-slate-800/80 flex items-start space-x-2">
                  <ChevronRight className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <p className="text-xs font-semibold text-cyan-300">
                    <span className="text-slate-400 uppercase font-bold text-[10px] tracking-wider block mb-0.5">
                      Garmin Coach Recommendation:
                    </span>
                    {readiness?.recommendation}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 text-[10px] font-semibold text-slate-400">
                <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800">
                  Nightly HRV: <strong className="text-cyan-400">54 ms (Balanced)</strong>
                </span>
                <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800">
                  Sleep Score: <strong className="text-purple-400">86/100 (Good)</strong>
                </span>
                <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800">
                  Resting HR: <strong className="text-rose-400">56 bpm</strong>
                </span>
                <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800">
                  Garmin Stress: <strong className="text-amber-400">13</strong>
                </span>
                <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800">
                  ACWR Load: <strong className="text-blue-400">1.1 (Optimal)</strong>
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* REQUESTED DASHBOARD CARDS GRID: 6 MAIN AT-A-GLANCE METRICS */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1: Sleep & Sleep Score */}
          <div className="glass-card glass-card-hover p-5 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Garmin Sleep & Score</span>
              <Moon className="w-4 h-4 text-purple-400" />
            </div>
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-3xl font-black text-white">{timeframeSummary?.latestSleepScore || 86}</span>
                <span className="text-xs text-slate-400 block font-semibold">Sleep Score / 100</span>
              </div>
              <div className="text-right">
                <span className="text-xl font-bold text-purple-300">{timeframeSummary?.latestSleepHours || '7.9'}h</span>
                <span className="text-[10px] text-slate-400 block">
                  {selectedRange === 'all' ? 'Timeline Avg' : selectedRange} Avg: <strong className="text-purple-400">{timeframeSummary?.avgSleepScore}/100</strong>
                </span>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-1 text-[10px] pt-1 text-center font-semibold border-t border-slate-800">
              <div className="bg-slate-900 p-1.5 rounded">
                <span className="text-slate-400 block">Deep</span>
                <span className="text-indigo-400 font-bold">{timeframeSummary?.deepSleepHours || '1.7'}h</span>
              </div>
              <div className="bg-slate-900 p-1.5 rounded">
                <span className="text-slate-400 block">REM</span>
                <span className="text-purple-400 font-bold">{timeframeSummary?.remSleepHours || '1.9'}h</span>
              </div>
              <div className="bg-slate-900 p-1.5 rounded">
                <span className="text-slate-400 block">Light</span>
                <span className="text-cyan-400 font-bold">{timeframeSummary?.lightSleepHours || '3.8'}h</span>
              </div>
              <div className="bg-slate-900 p-1.5 rounded">
                <span className="text-slate-400 block">Awake</span>
                <span className="text-rose-400 font-bold">{timeframeSummary?.awakeSleepHours || '0.5'}h</span>
              </div>
            </div>
          </div>

          {/* Card 2: Garmin Training Status */}
          <div className="glass-card glass-card-hover p-5 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Garmin Training Status</span>
              <Activity className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl font-black text-emerald-400">{timeframeSummary?.trainingStatus || 'Productive'}</span>
              <span className="text-xs font-bold text-emerald-300 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                Since {timeframeSummary?.trainingStatusSince || 'Aug 9'}
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Acute Load: <strong className="text-slate-200">{trainingLoad?.atl || 392}</strong> | Chronic Load: <strong className="text-slate-200">{trainingLoad?.ctl || 329}</strong>
            </p>
            <div className="text-[10px] text-slate-400 bg-slate-900 p-2 rounded border border-slate-800 flex justify-between">
              <span>ACWR Ratio: <strong className="text-emerald-400">{trainingLoad?.acwr || 1.1} (Optimal)</strong></span>
              <span>Load Balance: <strong className="text-cyan-400">High Aerobic</strong></span>
            </div>
          </div>

          {/* Card 3: Live Heart Rate Data */}
          <div className="glass-card glass-card-hover p-5 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Live & Timeline Heart Rate</span>
              <Heart className="w-4 h-4 text-rose-500 animate-pulse" />
            </div>
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-3xl font-black text-white">{timeframeSummary?.latestRestingHr || 56}</span>
                <span className="text-xs text-slate-400 block font-semibold">Resting HR (bpm)</span>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-rose-400 block">7d Avg: {timeframeSummary?.avgRestingHr || 56} bpm</span>
                <span className="text-[10px] text-slate-400">Min {timeframeSummary?.minHr || 48} | Max {timeframeSummary?.maxHr || 188} bpm</span>
              </div>
            </div>
            <div className="text-[10px] text-slate-400 bg-slate-900 p-2 rounded border border-slate-800 flex justify-between">
              <span>HRV 7d Avg: <strong className="text-cyan-400">54 ms</strong></span>
              <span>Status: <strong className="text-emerald-400">Balanced</strong></span>
            </div>
          </div>

          {/* Card 4: Daily & Timeline Steps */}
          <div className="glass-card glass-card-hover p-5 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Steps ({selectedRange.toUpperCase()})</span>
              <Footprints className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-3xl font-black text-cyan-300">{(timeframeSummary?.latestSteps || 195).toLocaleString()}</span>
                <span className="text-xs text-slate-400 block font-semibold">Today's Steps</span>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-slate-300 block">Goal: {(timeframeSummary?.stepGoal || 8520).toLocaleString()}</span>
                <span className="text-[10px] text-slate-400">
                  {selectedRange} Daily Avg: <strong className="text-cyan-400">{(timeframeSummary?.avgSteps || 8940).toLocaleString()}</strong>
                </span>
              </div>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-cyan-500 to-emerald-400 h-full rounded-full"
                style={{ width: `${Math.min(100, ((timeframeSummary?.latestSteps || 195) / 8520) * 100)}%` }}
              ></div>
            </div>
          </div>

          {/* Card 5: Garmin Fitness Age */}
          <div className="glass-card glass-card-hover p-5 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Garmin Fitness Age</span>
              <Award className="w-4 h-4 text-amber-400" />
            </div>
            <div className="flex items-baseline space-x-3">
              <div>
                <span className="text-3xl font-black text-amber-400">{timeframeSummary?.fitnessAge || 24.5}</span>
                <span className="text-xs text-slate-400 block font-semibold">Fitness Age</span>
              </div>
              <div className="border-l border-slate-800 pl-3">
                <span className="text-sm font-bold text-emerald-400">-{timeframeSummary?.fitnessAgeDiff || 5.5} Years</span>
                <span className="text-[10px] text-slate-400 block">Younger than actual age ({timeframeSummary?.actualAge || 30})</span>
              </div>
            </div>
            <p className="text-[11px] text-slate-400 bg-slate-900 p-2 rounded border border-slate-800">
              Achieved via high VO2 Max ({vo2MaxData?.currentVo2Max || 50}) and low resting HR ({timeframeSummary?.latestRestingHr || 56} bpm).
            </p>
          </div>

          {/* Card 6: Running VO2 Max */}
          <div className="glass-card glass-card-hover p-5 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Running VO2 Max</span>
              <Gauge className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl font-black text-white">{vo2MaxData?.currentVo2Max || 50.0}</span>
              <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                Excellent (Top 10%)
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Estimated 5K Pace: <strong className="text-slate-200">{vo2MaxData?.estimated5kPace}</strong>
            </p>
          </div>
        </section>

        {/* DYNAMIC TIMELINE CHARTS GRID */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Chart 1: HRV & Heart Rate Trend */}
          <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                  <Heart className="w-4 h-4 text-cyan-400" />
                  <span>HRV (54 ms) & Heart Rate Trend ({selectedRange.toUpperCase()})</span>
                </h3>
                <p className="text-xs text-slate-400">Nightly HRV avg vs Resting HR (56 bpm)</p>
              </div>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={hrvChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="hrvGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="date" stroke="#64748b" fontSize={10} tickLine={false} />
                  <YAxis domain={[40, 90]} stroke="#64748b" fontSize={10} tickLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }} />
                  <Line type="monotone" dataKey="baseline" stroke="#475569" strokeDasharray="5 5" strokeWidth={1.5} dot={false} />
                  <Area type="monotone" dataKey="hrv" name="Nightly HRV (ms)" stroke="#06b6d4" strokeWidth={2.5} fillOpacity={1} fill="url(#hrvGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 2: Body Battery & Daily Stress */}
          <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                  <Zap className="w-4 h-4 text-amber-400" />
                  <span>Garmin Body Battery & Stress ({selectedRange.toUpperCase()})</span>
                </h3>
                <p className="text-xs text-slate-400">Peak Morning Body Battery vs Daily Stress ({latestDailyHealth?.avgStress || 13})</p>
              </div>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stressChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="date" stroke="#64748b" fontSize={10} tickLine={false} />
                  <YAxis domain={[0, 100]} stroke="#64748b" fontSize={10} tickLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }} />
                  <Line type="monotone" dataKey="bodyBattery" name="Body Battery" stroke="#10b981" strokeWidth={2.5} dot={false} />
                  <Line type="monotone" dataKey="stress" name="Avg Stress" stroke="#f59e0b" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        {/* RECENT ACTIVITIES TABLE & RACE PREDICTIONS */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Race Predictions Forecast */}
          <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                <Trophy className="w-4 h-4 text-amber-400" />
                <span>Race Forecast (VO2 Max 50)</span>
              </h3>
            </div>
            <div className="space-y-2.5 pt-1">
              {(racePredictions || []).map((rp: any) => (
                <div key={rp.distance} className="bg-slate-900 p-3 rounded-xl border border-slate-800 space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-white">{rp.distance}</span>
                    <span className="font-black text-cyan-300">{rp.likely}</span>
                  </div>
                  <div className="text-[10px] text-slate-400 flex justify-between">
                    <span>Opt: <strong className="text-emerald-400">{rp.optimistic}</strong></span>
                    <span>Cons: <strong className="text-slate-300">{rp.conservative}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Activities Directory Table */}
          <div className="lg:col-span-2 glass-card p-5 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                <Activity className="w-4 h-4 text-cyan-400" />
                <span>Garmin Completed Activities ({selectedRange.toUpperCase()})</span>
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="text-slate-400 uppercase bg-slate-900/80 border-b border-slate-800 font-semibold">
                  <tr>
                    <th className="p-2.5">Date</th>
                    <th className="p-2.5">Activity</th>
                    <th className="p-2.5">Distance</th>
                    <th className="p-2.5">Pace</th>
                    <th className="p-2.5">Avg HR</th>
                    <th className="p-2.5 text-right">Load</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-medium">
                  {(recentActivities || []).slice(0, 7).map((act: any) => (
                    <tr key={act.id} className="hover:bg-slate-900/40 transition-colors">
                      <td className="p-2.5 text-slate-400 whitespace-nowrap">
                        {new Date(act.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </td>
                      <td className="p-2.5 text-slate-200 font-bold whitespace-nowrap">{act.title}</td>
                      <td className="p-2.5 text-cyan-300 font-bold whitespace-nowrap">
                        {(act.distance / 1000).toFixed(1)} km
                      </td>
                      <td className="p-2.5 text-slate-200 whitespace-nowrap font-mono">
                        {Math.floor(act.paceSecondsPerKm / 60)}:
                        {Math.round(act.paceSecondsPerKm % 60).toString().padStart(2, '0')}/km
                      </td>
                      <td className="p-2.5 text-slate-300 whitespace-nowrap">{act.avgHr} bpm</td>
                      <td className="p-2.5 text-right font-bold text-amber-300 whitespace-nowrap">
                        {Math.round(act.trainingLoad)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>

      {/* Subjective Check-in Modal */}
      <SubjectiveLogModal
        isOpen={isCheckinOpen}
        onClose={() => setIsCheckinOpen(false)}
        onSubmitted={() => fetchDashboardData(selectedRange)}
      />
    </div>
  );
}
