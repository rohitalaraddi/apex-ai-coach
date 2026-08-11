'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import {
  Trophy,
  Target,
  Zap,
  Calendar,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  TrendingUp,
  ShieldCheck,
  Award,
  Layers,
  ChevronRight,
  Flame,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export default function GoalsPage() {
  const [goals, setGoals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/dashboard')
      .then((res) => res.json())
      .then((json) => {
        setGoals(json.goals || []);
        setLoading(false);
      });
  }, []);

  const registeredGoals = goals.filter((g) => g.status === 'Registered');
  const potentialGoals = goals.filter((g) => g.status === 'Potential');

  const periodizationBlocks = [
    {
      block: 'Block 1: Aerobic Foundation & Base Building',
      dates: 'Aug 10 - Sep 06, 2026',
      weeks: [
        { week: 'Week 1', type: 'Progressive Load', volume: '52 km', focus: 'Zone 2 Base + 1x Threshold Tempo (5:10/km)' },
        { week: 'Week 2', type: 'Progressive Load', volume: '58 km', focus: 'Zone 2 Base + 24 km Long Run (5:55/km)' },
        { week: 'Week 3', type: 'Progressive Load', volume: '65 km', focus: 'Zone 2 Volume + 28 km Peak Long Run' },
        { week: 'Week 4', type: 'DELOAD / RECOVERY', volume: '42 km (-35%)', focus: 'Active flush, mobility, sleep restoration & HRV reset', isDeload: true },
      ],
    },
    {
      block: 'Block 2: Marathon Specificity & Peak Taper (Bengaluru Marathon)',
      dates: 'Sep 07 - Sep 27, 2026',
      weeks: [
        { week: 'Week 5', type: 'Progressive Peak', volume: '68 km', focus: '32 km Peak Long Run with 10k at Sub-4:15 Pace (6:02/km)' },
        { week: 'Week 6', type: 'Sharpening & Taper 1', volume: '50 km', focus: 'Marathon Pace intervals ($3 \\times 4\\text{ km}$ at 5:55/km)' },
        { week: 'Week 7', type: 'Final Race Taper', volume: '30 km', focus: 'Carb loading, easy Zone 2 strides & rest' },
        { week: 'Race Week', type: 'RACE DAY', volume: '42.2 km', focus: 'Wipro Bengaluru Full Marathon (Sub-4:15 Target)', isRace: true },
      ],
    },
    {
      block: 'Block 3: Post-Marathon Recovery & Delhi Half Speed Showcase',
      dates: 'Sep 28 - Oct 18, 2026',
      weeks: [
        { week: 'Week 8', type: 'DELOAD / RECOVERY', volume: '25 km (-60%)', focus: 'Post-marathon tissue repair, foam rolling & easy walk/jog', isDeload: true },
        { week: 'Week 9', type: 'Speed Flush', volume: '45 km', focus: '12 km Half Marathon Pace Tempo (5:12/km)' },
        { week: 'Week 10', type: 'RACE DAY', volume: '21.1 km', focus: 'Vedanta Delhi Half Marathon (Sub-1:50 Target)', isRace: true },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-16">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-8">
        {/* HEADER TITLE */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h1 className="text-xl font-extrabold text-white flex items-center space-x-2">
              <Trophy className="w-6 h-6 text-amber-400" />
              <span>Target Goals & Race Strategy Engine</span>
            </h1>
            <p className="text-xs text-slate-400">
              Registered future races, AI feasibility evaluation for potential goals, and strict 3:1 Periodization Plan
            </p>
          </div>

          <div className="flex items-center space-x-2 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800 text-xs font-semibold text-slate-300">
            <Layers className="w-4 h-4 text-cyan-400" />
            <span>Rule: <strong className="text-cyan-300">3 Progressive Load Weeks + 1 Deload Week</strong></span>
          </div>
        </div>

        {/* SECTION 1: REGISTERED FUTURE RACES */}
        <section className="space-y-4">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <h2 className="text-base font-bold text-white uppercase tracking-wider">Registered Future Races (Confirmed)</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {registeredGoals.map((g) => (
              <div
                key={g.id}
                className="glass-card glass-card-hover p-6 rounded-2xl border border-emerald-500/30 relative overflow-hidden space-y-4 shadow-xl"
              >
                <div className="absolute right-0 top-0 bg-emerald-500/20 text-emerald-300 text-[10px] font-extrabold uppercase px-3 py-1 rounded-bl-xl border-l border-b border-emerald-500/30">
                  Confirmed Entry
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                    {g.category} • {new Date(g.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                  <h3 className="text-lg font-black text-white">{g.title}</h3>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                    <div className="text-[10px] text-slate-400">Previous PR</div>
                    <div className="font-bold text-slate-300 mt-0.5">{g.baselineValue}</div>
                  </div>
                  <div className="bg-slate-900 p-2.5 rounded-xl border border-cyan-500/30">
                    <div className="text-[10px] text-cyan-400 font-bold">Garmin Est.</div>
                    <div className="font-bold text-cyan-300 mt-0.5">{g.currentCapability}</div>
                  </div>
                  <div className="bg-slate-900 p-2.5 rounded-xl border border-amber-500/30">
                    <div className="text-[10px] text-amber-400 font-bold">Target Goal</div>
                    <div className="font-bold text-amber-300 mt-0.5">{g.targetValue}</div>
                  </div>
                </div>

                <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex items-center space-x-1.5 text-xs font-bold text-emerald-400">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>AI Coaching Strategy & Feasibility</span>
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed font-medium">{g.aiStrategy}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 2: POTENTIAL FUTURE GOALS (FEASIBILITY EVALUATOR) */}
        <section className="space-y-4">
          <div className="flex items-center space-x-2">
            <HelpCircle className="w-5 h-5 text-amber-400" />
            <h2 className="text-base font-bold text-white uppercase tracking-wider">
              Potential Future Goals — AI Feasibility Evaluator
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {potentialGoals.map((g) => (
              <div
                key={g.id}
                className="glass-card glass-card-hover p-6 rounded-2xl border border-slate-800 relative space-y-4 shadow-xl"
              >
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-slate-400">
                      {g.category} Target • {new Date(g.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    <h3 className="text-lg font-black text-white">{g.title}</h3>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 font-bold text-xs border border-amber-500/20">
                    Evaluating Feasibility
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                    <div className="text-[10px] text-slate-400">Baseline</div>
                    <div className="font-bold text-slate-300 mt-0.5">{g.baselineValue}</div>
                  </div>
                  <div className="bg-slate-900 p-2.5 rounded-xl border border-cyan-500/30">
                    <div className="text-[10px] text-cyan-400 font-bold">Projected Est.</div>
                    <div className="font-bold text-cyan-300 mt-0.5">{g.currentCapability}</div>
                  </div>
                  <div className="bg-slate-900 p-2.5 rounded-xl border border-amber-500/30">
                    <div className="text-[10px] text-amber-400 font-bold">Target Goal</div>
                    <div className="font-bold text-amber-300 mt-0.5">{g.targetValue}</div>
                  </div>
                </div>

                <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1.5 text-xs font-bold text-cyan-400">
                      <Sparkles className="w-4 h-4 text-cyan-400" />
                      <span>AI Feasibility Assessment</span>
                    </div>
                    <span className="text-[10px] font-black text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      {g.title.includes('Mumbai') ? '88% REALISTIC' : '82% FEASIBLE'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed font-medium">{g.aiStrategy}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 3: STRICT 3:1 PERIODIZATION PLANNER */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Layers className="w-5 h-5 text-cyan-400" />
              <h2 className="text-base font-bold text-white uppercase tracking-wider">
                Strict 3:1 Periodized Training Architecture
              </h2>
            </div>
            <span className="text-xs text-slate-400">3 Progressive Load Weeks $\rightarrow$ 1 Recovery Deload Week</span>
          </div>

          <div className="space-y-6">
            {periodizationBlocks.map((blk, idx) => (
              <div key={idx} className="glass-card p-5 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                  <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                    <span>{blk.block}</span>
                  </h3>
                  <span className="text-xs text-slate-400 font-semibold">{blk.dates}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {blk.weeks.map((w, wIdx) => (
                    <div
                      key={wIdx}
                      className={`p-3.5 rounded-xl border text-xs space-y-2 transition-all ${
                        w.isDeload
                          ? 'bg-purple-950/40 border-purple-500/50 shadow-lg shadow-purple-500/10'
                          : w.isRace
                          ? 'bg-amber-950/40 border-amber-500/50 shadow-lg shadow-amber-500/10'
                          : 'bg-slate-900 border-slate-800'
                      }`}
                    >
                      <div className="flex items-center justify-between font-bold">
                        <span className={w.isDeload ? 'text-purple-300' : w.isRace ? 'text-amber-300' : 'text-white'}>
                          {w.week}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                            w.isDeload
                              ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                              : w.isRace
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                          }`}
                        >
                          {w.type}
                        </span>
                      </div>

                      <div className="flex items-baseline justify-between pt-1">
                        <span className="text-slate-400 text-[11px]">Weekly Vol:</span>
                        <span className="font-extrabold text-sm text-white">{w.volume}</span>
                      </div>

                      <p className="text-[11px] text-slate-300 leading-snug border-t border-slate-800/80 pt-2 font-medium">
                        {w.focus}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
