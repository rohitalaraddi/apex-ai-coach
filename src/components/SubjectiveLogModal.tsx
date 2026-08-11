'use client';

import { useState } from 'react';
import { X, Activity, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmitted?: () => void;
}

export default function SubjectiveLogModal({ isOpen, onClose, onSubmitted }: Props) {
  const [overallFeeling, setOverallFeeling] = useState(4);
  const [perceivedFatigue, setPerceivedFatigue] = useState(3);
  const [stressLevel, setStressLevel] = useState(3);

  // Muscle Soreness (0-10)
  const [quads, setQuads] = useState(0);
  const [calves, setCalves] = useState(0);
  const [hamstrings, setHamstrings] = useState(0);
  const [glutes, setGlutes] = useState(0);
  const [hips, setHips] = useState(0);
  const [knees, setKnees] = useState(0);
  const [shins, setShins] = useState(0);
  const [ankles, setAnkles] = useState(0);
  const [feet, setFeet] = useState(0);

  const [painLocation, setPainLocation] = useState('');
  const [painSeverity, setPainSeverity] = useState(0);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const res = await fetch('/api/subjective-log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          overallFeeling,
          perceivedFatigue,
          stressLevel,
          quadsSoreness: quads,
          calvesSoreness: calves,
          hamstringsSoreness: hamstrings,
          glutesSoreness: glutes,
          hipsSoreness: hips,
          kneesSoreness: knees,
          shinsSoreness: shins,
          anklesSoreness: ankles,
          feetSoreness: feet,
          painLocation: painLocation || null,
          painSeverity,
          notes: notes || null,
        }),
      });

      if (res.ok) {
        if (onSubmitted) onSubmitted();
        onClose();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const muscles = [
    { name: 'Quads', val: quads, set: setQuads },
    { name: 'Calves', val: calves, set: setCalves },
    { name: 'Hamstrings', val: hamstrings, set: setHamstrings },
    { name: 'Glutes', val: glutes, set: setGlutes },
    { name: 'Hips', val: hips, set: setHips },
    { name: 'Knees', val: knees, set: setKnees },
    { name: 'Shins', val: shins, set: setShins },
    { name: 'Ankles', val: ankles, set: setAnkles },
    { name: 'Feet', val: feet, set: setFeet },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-2">
            <Activity className="w-5 h-5 text-cyan-400" />
            <h3 className="text-lg font-bold text-white">Daily Subjective Check-in</h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Overall Feeling */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              How do you feel today overall?
            </label>
            <div className="grid grid-cols-5 gap-2">
              {[
                { label: 'Exhausted', val: 1, color: 'border-red-500/50 bg-red-500/10 text-red-400' },
                { label: 'Tired', val: 2, color: 'border-amber-500/50 bg-amber-500/10 text-amber-400' },
                { label: 'Normal', val: 3, color: 'border-slate-700 bg-slate-800 text-slate-300' },
                { label: 'Good', val: 4, color: 'border-cyan-500/50 bg-cyan-500/10 text-cyan-400' },
                { label: 'Fresh', val: 5, color: 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400' },
              ].map((item) => (
                <button
                  key={item.val}
                  type="button"
                  onClick={() => setOverallFeeling(item.val)}
                  className={`p-3 rounded-xl border text-center font-medium text-xs transition-all ${
                    overallFeeling === item.val
                      ? `${item.color} ring-2 ring-cyan-400/30 scale-105`
                      : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Soreness Heatmap sliders */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3">
              Muscle Soreness & Tightness Ratings (0 = None, 10 = Severe)
            </label>
            <div className="grid grid-cols-3 gap-4 bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
              {muscles.map((m) => (
                <div key={m.name} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400 font-medium">{m.name}</span>
                    <span className={`font-bold ${m.val > 5 ? 'text-amber-400' : 'text-cyan-400'}`}>
                      {m.val}/10
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    value={m.val}
                    onChange={(e) => m.set(parseInt(e.target.value))}
                    className="w-full accent-cyan-400 bg-slate-800 h-1.5 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Pain & Notes */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Pain Location (If any)</label>
              <input
                type="text"
                placeholder="e.g. Right calf, Left knee"
                value={painLocation}
                onChange={(e) => setPainLocation(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Pain Severity (0 - 10)</label>
              <input
                type="number"
                min="0"
                max="10"
                value={painSeverity}
                onChange={(e) => setPainSeverity(parseInt(e.target.value) || 0)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Notes / Observations</label>
            <textarea
              rows={2}
              placeholder="e.g. Slept late due to travel, felt slight tightness during stride intervals."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="flex justify-end space-x-3 border-t border-slate-800 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-xs font-bold text-slate-950 flex items-center space-x-1.5 shadow-lg shadow-cyan-500/20"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isSubmitting ? 'Saving...' : 'Save Check-in'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
