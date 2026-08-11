'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import { Activity as ActivityIcon, Zap, Search, Filter, ChevronRight, X, Flame } from 'lucide-react';

export default function ActivitiesPage() {
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedActivity, setSelectedActivity] = useState<any>(null);
  const [filterType, setFilterType] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/dashboard');
      const json = await res.json();
      setActivities(json.recentActivities || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  const filtered = activities.filter((act) => {
    const matchesType = filterType === 'All' || act.type.toLowerCase() === filterType.toLowerCase();
    const matchesSearch = act.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-16">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-extrabold text-white flex items-center space-x-2">
              <ActivityIcon className="w-6 h-6 text-cyan-400" />
              <span>Garmin Activities Directory</span>
            </h1>
            <p className="text-xs text-slate-400">Complete normalized activity history with post-workout AI scores</p>
          </div>

          <div className="flex items-center space-x-3">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search workout title..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-medium"
            >
              <option value="All">All Types</option>
              <option value="Running">Running</option>
              <option value="Cycling">Cycling</option>
              <option value="Swimming">Swimming</option>
            </select>
          </div>
        </div>

        {/* Activities Table */}
        <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-slate-400 uppercase bg-slate-900/80 border-b border-slate-800 font-semibold">
                <tr>
                  <th className="p-3">Date</th>
                  <th className="p-3">Title & Sport</th>
                  <th className="p-3">Distance</th>
                  <th className="p-3">Duration</th>
                  <th className="p-3">Pace / Speed</th>
                  <th className="p-3">Avg / Max HR</th>
                  <th className="p-3">Load</th>
                  <th className="p-3 text-right">AI Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-medium">
                {filtered.map((act) => (
                  <tr
                    key={act.id}
                    onClick={() => setSelectedActivity(act)}
                    className="hover:bg-slate-900/60 cursor-pointer transition-colors"
                  >
                    <td className="p-3 text-slate-400 whitespace-nowrap">
                      {new Date(act.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="p-3 font-bold text-slate-100 whitespace-nowrap">
                      {act.title}
                      <span className="block text-[10px] text-slate-400 font-normal">{act.type}</span>
                    </td>
                    <td className="p-3 text-cyan-300 font-bold whitespace-nowrap">
                      {(act.distance / 1000).toFixed(2)} km
                    </td>
                    <td className="p-3 text-slate-300 whitespace-nowrap font-mono">
                      {Math.floor(act.duration / 3600) > 0 ? `${Math.floor(act.duration / 3600)}h ` : ''}
                      {Math.floor((act.duration % 3600) / 60)}m {act.duration % 60}s
                    </td>
                    <td className="p-3 text-slate-200 whitespace-nowrap font-mono">
                      {Math.floor(act.paceSecondsPerKm / 60)}:
                      {Math.round(act.paceSecondsPerKm % 60).toString().padStart(2, '0')} /km
                    </td>
                    <td className="p-3 text-slate-300 whitespace-nowrap">
                      {act.avgHr} <span className="text-slate-500 text-[10px]">/ {act.maxHr} bpm</span>
                    </td>
                    <td className="p-3 text-amber-300 whitespace-nowrap font-semibold">{act.trainingLoad}</td>
                    <td className="p-3 text-right whitespace-nowrap">
                      <span className="px-2.5 py-1 rounded-md bg-purple-500/10 text-purple-300 font-bold border border-purple-500/20">
                        {act.aiPerformanceScore || '8.4'} / 10
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Activity Detail Modal */}
      {selectedActivity && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
          <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white">{selectedActivity.title}</h3>
                <p className="text-xs text-slate-400">
                  {new Date(selectedActivity.date).toLocaleString()} • {selectedActivity.type}
                </p>
              </div>
              <button onClick={() => setSelectedActivity(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* AI Verdict Box */}
            <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-purple-300 uppercase tracking-wider flex items-center space-x-1.5">
                  <Zap className="w-4 h-4 text-purple-400" />
                  <span>AI Post-Workout Verdict</span>
                </span>
                <span className="text-sm font-black text-purple-200 px-2 py-0.5 rounded bg-purple-500/20">
                  Score: {selectedActivity.aiPerformanceScore || '8.5'}/10
                </span>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed font-medium">
                {selectedActivity.aiAnalysisSummary}
              </p>
            </div>

            {/* Dynamics & Stats Grid */}
            <div className="grid grid-cols-3 gap-3 text-xs">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <div className="text-slate-400 text-[10px]">Avg Cadence</div>
                <div className="text-sm font-bold text-cyan-300">{selectedActivity.avgCadence || 174} spm</div>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <div className="text-slate-400 text-[10px]">Running Power</div>
                <div className="text-sm font-bold text-amber-300">{selectedActivity.runningPower || 255} W</div>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <div className="text-slate-400 text-[10px]">Vertical Osc.</div>
                <div className="text-sm font-bold text-emerald-300">{selectedActivity.verticalOscillation || 8.6} cm</div>
              </div>
            </div>

            {/* Lap Splits Table */}
            {selectedActivity.splitsJson && (
              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-slate-300 uppercase">Km Lap Splits</h4>
                <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-900 text-slate-400 font-semibold border-b border-slate-800">
                      <tr>
                        <th className="p-2">Km</th>
                        <th className="p-2">Pace</th>
                        <th className="p-2">Avg HR</th>
                        <th className="p-2 text-right">Ele Gain</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 font-mono">
                      {JSON.parse(selectedActivity.splitsJson).map((sp: any) => (
                        <tr key={sp.km}>
                          <td className="p-2 text-slate-400">Km {sp.km}</td>
                          <td className="p-2 text-cyan-300 font-bold">{sp.pace}</td>
                          <td className="p-2 text-slate-300">{sp.avgHr} bpm</td>
                          <td className="p-2 text-right text-slate-400">+{sp.elevationGain}m</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
