'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import {
  Calendar,
  Zap,
  CheckCircle2,
  Layers,
  ShieldCheck,
  Activity,
  Footprints,
  Dumbbell,
  Heart,
  HelpCircle,
  TrendingUp,
  Sparkles,
  Award,
  Clock,
  Flame,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Flag,
  Sliders,
  Check,
  Timer,
  Wind,
  Snowflake,
  Moon,
} from 'lucide-react';

export default function TrainingPlanPage() {
  const [data, setData] = useState<any>(null);
  const [selectedWeekIndex, setSelectedWeekIndex] = useState<number>(0);
  const [fitnessLevel, setFitnessLevel] = useState<'current' | 'boosted' | 'peak'>('current');

  useEffect(() => {
    fetch('/api/dashboard')
      .then((res) => res.json())
      .then((json) => setData(json));
  }, []);

  // Empirical Garmin Pace Adjuster based on VO2 Max expansion
  const getEmpiricalPace = (basePaceStr: string) => {
    if (fitnessLevel === 'current') return basePaceStr;
    if (fitnessLevel === 'boosted') {
      return basePaceStr.replace(/(\d+):(\d+)/g, (match, p1, p2) => {
        const totalSec = parseInt(p1) * 60 + parseInt(p2) - 8;
        const m = Math.floor(totalSec / 60);
        const s = totalSec % 60;
        return `${m}:${s < 10 ? '0' : ''}${s}`;
      });
    }
    // peak adapt
    return basePaceStr.replace(/(\d+):(\d+)/g, (match, p1, p2) => {
      const totalSec = parseInt(p1) * 60 + parseInt(p2) - 15;
      const m = Math.floor(totalSec / 60);
      const s = totalSec % 60;
      return `${m}:${s < 10 ? '0' : ''}${s}`;
    });
  };

  // FULL 27-WEEK MASTER ROADMAP (Aug 10, 2026 - Feb 17, 2027) — 3:1 Progressive Overload Periodization
  const master27Weeks = [
    { weekNum: 1, dateRange: 'Aug 10 - Aug 16, 2026', title: 'Block 1: Week 1 - Aerobic Base Ramping (Build 1)', targetVolume: '36 km', longRunKm: '18 km', isDeload: false, isRace: false, phase: 'Bengaluru Build' },
    { weekNum: 2, dateRange: 'Aug 17 - Aug 23, 2026', title: 'Block 1: Week 2 - Aerobic Base Ramping (Build 2)', targetVolume: '42 km', longRunKm: '21 km', isDeload: false, isRace: false, phase: 'Bengaluru Build' },
    { weekNum: 3, dateRange: 'Aug 24 - Aug 30, 2026', title: 'Block 1: Week 3 - Progressive Peak Base (Build 3)', targetVolume: '48 km', longRunKm: '24 km', isDeload: false, isRace: false, phase: 'Bengaluru Build' },
    { weekNum: 4, dateRange: 'Aug 31 - Sep 06, 2026', title: 'Block 1: Week 4 - DELOAD & RECOVERY WEEK (-35%)', targetVolume: '31 km', longRunKm: '15 km', isDeload: true, isRace: false, phase: 'Deload / Adaptation' },
    { weekNum: 5, dateRange: 'Sep 07 - Sep 13, 2026', title: 'Block 2: Week 5 - PEAK BENGALURU LONG RUN (28 KM)', targetVolume: '52 km', longRunKm: '28 km', isDeload: false, isRace: false, phase: 'Peak Build' },
    { weekNum: 6, dateRange: 'Sep 14 - Sep 20, 2026', title: 'Block 2: Week 6 - MARATHON TAPER 1', targetVolume: '36 km', longRunKm: '18 km', isDeload: true, isRace: false, phase: 'Bengaluru Taper' },
    { weekNum: 7, dateRange: 'Sep 21 - Sep 27, 2026', title: 'Block 2: Week 7 - RACE WEEK: WIPRO BENGALURU MARATHON', targetVolume: '42.2 km Race', longRunKm: '42.2 km RACE', isDeload: false, isRace: true, phase: 'RACE WEEK' },
    { weekNum: 8, dateRange: 'Sep 28 - Oct 04, 2026', title: 'Block 3: Week 8 - DELOAD WEEK: Post-Marathon Recovery', targetVolume: '20 km', longRunKm: '8 km', isDeload: true, isRace: false, phase: 'Post-Marathon Flush' },
    { weekNum: 9, dateRange: 'Oct 05 - Oct 11, 2026', title: 'Block 3: Week 9 - Delhi Half Speed Flush', targetVolume: '36 km', longRunKm: '16 km', isDeload: false, isRace: false, phase: 'Delhi Speed Flush' },
    { weekNum: 10, dateRange: 'Oct 12 - Oct 18, 2026', title: 'Block 3: Week 10 - RACE WEEK: VEDANTA DELHI HALF MARATHON', targetVolume: '21.1 km Race', longRunKm: '21.1 km RACE', isDeload: false, isRace: true, phase: 'RACE WEEK' },
    { weekNum: 11, dateRange: 'Oct 19 - Oct 25, 2026', title: 'Block 4: Week 11 - DELOAD & RECOVERY WEEK (-40%)', targetVolume: '22 km', longRunKm: '10 km', isDeload: true, isRace: false, phase: 'Deload / Adaptation' },
    { weekNum: 12, dateRange: 'Oct 26 - Nov 01, 2026', title: 'Block 4: Week 12 - TMM Base Foundation (Build 1)', targetVolume: '44 km', longRunKm: '22 km', isDeload: false, isRace: false, phase: 'TMM Build' },
    { weekNum: 13, dateRange: 'Nov 02 - Nov 08, 2026', title: 'Block 4: Week 13 - TMM Base Expansion (Build 2)', targetVolume: '50 km', longRunKm: '25 km', isDeload: false, isRace: false, phase: 'TMM Build' },
    { weekNum: 14, dateRange: 'Nov 09 - Nov 15, 2026', title: 'Block 4: Week 14 - TMM Peak Base Volume (Build 3)', targetVolume: '56 km', longRunKm: '28 km', isDeload: false, isRace: false, phase: 'TMM Build' },
    { weekNum: 15, dateRange: 'Nov 16 - Nov 22, 2026', title: 'Block 4: Week 15 - DELOAD WEEK (-35%)', targetVolume: '36 km', longRunKm: '18 km', isDeload: true, isRace: false, phase: 'Deload / Adaptation' },
    { weekNum: 16, dateRange: 'Nov 23 - Nov 29, 2026', title: 'Block 4: Week 16 - Pedder Road Hill Reps (Build 4)', targetVolume: '60 km', longRunKm: '30 km', isDeload: false, isRace: false, phase: 'TMM Build' },
    { weekNum: 17, dateRange: 'Nov 30 - Dec 06, 2026', title: 'Block 4: Week 17 - TMM Specific Pace Inoculation (Build 5)', targetVolume: '65 km', longRunKm: '33 km', isDeload: false, isRace: false, phase: 'TMM Build' },
    { weekNum: 18, dateRange: 'Dec 07 - Dec 13, 2026', title: 'Block 4: Week 18 - PEAK TMM VOLUME (70 KM - Build 6)', targetVolume: '70 km', longRunKm: '35 km', isDeload: false, isRace: false, phase: 'TMM Peak Build' },
    { weekNum: 19, dateRange: 'Dec 14 - Dec 20, 2026', title: 'Block 4: Week 19 - DELOAD WEEK (-35%)', targetVolume: '44 km', longRunKm: '22 km', isDeload: true, isRace: false, phase: 'Deload / Adaptation' },
    { weekNum: 20, dateRange: 'Dec 21 - Dec 27, 2026', title: 'Block 4: Week 20 - TMM Taper Phase 1', targetVolume: '40 km', longRunKm: '20 km', isDeload: true, isRace: false, phase: 'TMM Taper' },
    { weekNum: 21, dateRange: 'Dec 28 - Jan 03, 2027', title: 'Block 4: Week 21 - TMM Taper Phase 2', targetVolume: '30 km', longRunKm: '14 km', isDeload: true, isRace: false, phase: 'TMM Taper' },
    { weekNum: 22, dateRange: 'Jan 04 - Jan 10, 2027', title: 'Block 4: Week 22 - Final Race Taper & Carb Load', targetVolume: '20 km', longRunKm: '8 km', isDeload: true, isRace: false, phase: 'TMM Taper' },
    { weekNum: 23, dateRange: 'Jan 11 - Jan 17, 2027', title: 'Block 4: Week 23 - RACE WEEK: TATA MUMBAI MARATHON (TMM 2027)', targetVolume: '42.2 km Race', longRunKm: '42.2 km RACE', isDeload: false, isRace: true, phase: 'RACE WEEK' },
    { weekNum: 24, dateRange: 'Jan 18 - Jan 24, 2027', title: 'Block 5: Week 24 - DELOAD WEEK: Post-TMM Ultra Transition', targetVolume: '22 km', longRunKm: '10 km', isDeload: true, isRace: false, phase: 'Ultra Transition' },
    { weekNum: 25, dateRange: 'Jan 25 - Jan 31, 2027', title: 'Block 5: Week 25 - Back-to-Back Long Runs (28k Sat + 16k Sun)', targetVolume: '55 km', longRunKm: '28 km Sat + 16 km Sun', isDeload: false, isRace: false, phase: 'Lonavala Ultra Build' },
    { weekNum: 26, dateRange: 'Feb 01 - Feb 07, 2027', title: 'Block 5: Week 26 - Trail Elevation & 60g Carbs Fueling Protocol', targetVolume: '42 km', longRunKm: '22 km Trail', isDeload: false, isRace: false, phase: 'Lonavala Ultra Build' },
    { weekNum: 27, dateRange: 'Feb 08 - Feb 17, 2027', title: 'Block 5: Week 27 - RACE WEEK: TATA ULTRA LONAVALA 50 KM', targetVolume: '50 km Ultra Race', longRunKm: '50 km ULTRA', isDeload: false, isRace: true, phase: 'ULTRA RACE WEEK' },
  ];

  const getCalendarDatesForWeek = (dateRangeStr: string) => {
    try {
      const parts = dateRangeStr.split(' - ');
      const yearMatch = dateRangeStr.match(/\d{4}/);
      const year = yearMatch ? yearMatch[0] : '2026';
      const startStr = `${parts[0]}, ${year}`;
      const startDate = new Date(startStr);

      const dates: string[] = [];
      for (let i = 0; i < 7; i++) {
        const d = new Date(startDate);
        d.setDate(startDate.getDate() + i);
        const formatted = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        dates.push(formatted);
      }
      return dates;
    } catch (e) {
      return ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'];
    }
  };

  // Helper generator for 7-day microcycle: Monday & Friday Rest, Sunday Long Run, Tuesday/Wednesday/Thursday/Saturday distribution
  const get7DaySchedule = (w: typeof master27Weeks[0]) => {
    const isRace = w.isRace;
    const isDeload = w.isDeload;
    const dates = getCalendarDatesForWeek(w.dateRange);
    const todayDayName = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase();

    // Parse numerical target volume and long run distance
    const totalKm = parseFloat(w.targetVolume) || 36;
    let longKm = parseFloat(w.longRunKm) || 18;
    if (isRace) {
      if (w.title.includes('HALF')) longKm = 21.1;
      else if (w.title.includes('ULTRA')) longKm = 50;
      else longKm = 42.2;
    }

    if (isRace) {
      return [
        {
          day: 'MONDAY',
          date: dates[0],
          isToday: todayDayName === 'MONDAY',
          category: 'Rest & Mental Preparation',
          totalDistance: '0 km',
          warmup: { timeDist: 'N/A', pace: 'Rest', hr: 'Zone 1 (<130 bpm)' },
          mainSet: { structure: 'Rest & Mental Strategy Review', pace: 'Rest', hr: 'Zone 1 (<130 bpm)' },
          cooldown: { timeDist: '15 mins Mobility', pace: 'N/A', hr: 'Zone 1 (<130 bpm)' },
          strength: 'Deep breathing & thoracic mobility.',
          rationale: 'Glycogen preservation and autonomic nervous system priming.'
        },
        {
          day: 'TUESDAY',
          date: dates[1],
          isToday: todayDayName === 'TUESDAY',
          category: 'Easy Sharpening & Strides',
          totalDistance: '5 km',
          warmup: { timeDist: '1 km (7 mins)', pace: getEmpiricalPace('7:30 /km'), hr: 'Zone 1 (<130 bpm)' },
          mainSet: { structure: '3 km Easy Sharpening + 4x100m strides', pace: getEmpiricalPace('6:40 /km'), hr: 'Zone 2 (130-154 bpm)' },
          cooldown: { timeDist: '1 km (7 mins)', pace: getEmpiricalPace('7:30 /km'), hr: 'Zone 1 (<130 bpm)' },
          strength: 'Dynamic leg swings & light stride drills.',
          rationale: 'Neuromuscular speed activation without muscle fatigue.'
        },
        {
          day: 'WEDNESDAY',
          date: dates[2],
          isToday: todayDayName === 'WEDNESDAY',
          category: 'Rest & Glycogen Supercompensation',
          totalDistance: '0 km',
          warmup: { timeDist: 'N/A', pace: 'Rest', hr: 'Zone 1 (<130 bpm)' },
          mainSet: { structure: 'Glycogen Supercompensation & Hydration', pace: 'Rest', hr: 'Zone 1 (<130 bpm)' },
          cooldown: { timeDist: '10 mins Mobility', pace: 'N/A', hr: 'Zone 1 (<130 bpm)' },
          strength: 'Light static stretching & foam rolling.',
          rationale: 'Restores muscle glycogen stores to 100% capacity.'
        },
        {
          day: 'THURSDAY',
          date: dates[3],
          isToday: todayDayName === 'THURSDAY',
          category: 'Pre-Race Shakeout',
          totalDistance: '3 km',
          warmup: { timeDist: '1 km (7 mins)', pace: getEmpiricalPace('7:30 /km'), hr: 'Zone 1 (<130 bpm)' },
          mainSet: { structure: '1 km Pre-Race Shakeout', pace: getEmpiricalPace('7:00 /km'), hr: 'Zone 1/2' },
          cooldown: { timeDist: '1 km (7 mins)', pace: getEmpiricalPace('7:45 /km'), hr: 'Zone 1 (<130 bpm)' },
          strength: 'Full body mobility flow.',
          rationale: 'Keeps legs loose and blood flowing.'
        },
        {
          day: 'FRIDAY',
          date: dates[4],
          isToday: todayDayName === 'FRIDAY',
          category: 'Race Expo & Complete Rest',
          totalDistance: '0 km',
          warmup: { timeDist: 'N/A', pace: 'Rest', hr: 'Zone 1 (<130 bpm)' },
          mainSet: { structure: 'Bib Pickup, Race Kit Prep & Complete Rest', pace: 'Rest', hr: 'Zone 1 (<130 bpm)' },
          cooldown: { timeDist: 'Rest', pace: 'N/A', hr: 'Zone 1 (<130 bpm)' },
          strength: 'Complete rest.',
          rationale: 'Mental lock-in & bib pickup.'
        },
        {
          day: 'SATURDAY',
          date: dates[5],
          isToday: todayDayName === 'SATURDAY',
          category: '2 km Final Activation',
          totalDistance: '2 km',
          warmup: { timeDist: '0.5 km (3.5 mins)', pace: getEmpiricalPace('7:30 /km'), hr: 'Zone 1 (<130 bpm)' },
          mainSet: { structure: '1 km Easy Activation Run', pace: getEmpiricalPace('7:10 /km'), hr: 'Zone 1 (<130 bpm)' },
          cooldown: { timeDist: '0.5 km (3.5 mins)', pace: getEmpiricalPace('7:45 /km'), hr: 'Zone 1 (<130 bpm)' },
          strength: 'Dynamic leg swings.',
          rationale: 'Final pre-race shakeout.'
        },
        {
          day: 'SUNDAY',
          date: dates[6],
          isToday: todayDayName === 'SUNDAY',
          category: `OFFICIAL RACE DAY: ${w.title}`,
          totalDistance: `${longKm} km`,
          warmup: { timeDist: '15 mins Dynamic Warm-Up', pace: getEmpiricalPace('7:15 /km'), hr: 'Zone 1/2' },
          mainSet: { structure: `OFFICIAL RACE DAY: ${w.title}`, pace: getEmpiricalPace('Target Race Pace'), hr: 'Zone 3/4' },
          cooldown: { timeDist: 'Post-Race Medal Celebration & Walk', pace: 'Walk', hr: 'Zone 1' },
          strength: 'MEDAL FINISH & RECOVERY FLUSH!',
          rationale: `RACE DAY! Execute your targeted race strategy!`
        },
      ];
    }

    // For progressive & deload weeks, calculate exact daily mileage breakdown:
    // Monday: 0 km, Friday: 0 km, Sunday: longKm km
    // Remaining volume = totalKm - longKm distributed across Tue, Wed, Thu, Sat
    const remKm = Math.max(0, totalKm - longKm);
    const tueKm = Math.round(remKm * 0.28);
    const wedKm = Math.round(remKm * 0.42);
    const thuKm = Math.round(remKm * 0.18);
    const satKm = Math.max(0, Math.round(remKm - (tueKm + wedKm + thuKm)));

    return [
      {
        day: 'MONDAY',
        date: dates[0],
        isToday: todayDayName === 'MONDAY',
        category: 'Rest & Autonomic Recovery',
        totalDistance: '0 km',
        warmup: { timeDist: 'N/A', pace: 'Rest', hr: 'Zone 1 (<130 bpm)' },
        mainSet: { structure: 'Rest & Autonomic Nervous System Reset', pace: 'Rest', hr: 'Zone 1 (<130 bpm)' },
        cooldown: { timeDist: '15 mins Mobility', pace: 'N/A', hr: 'Zone 1 (<130 bpm)' },
        strength: '15-min Ankle & Hip Mobility: Couch Stretch (3x45s), Thoracic Rotations (2x10), Ankle Wall Mobilization (2x12).',
        rationale: 'Resets autonomic nervous system post-Sunday long run. Restores nightly HRV.'
      },
      {
        day: 'TUESDAY',
        date: dates[1],
        isToday: todayDayName === 'TUESDAY',
        category: isDeload ? 'Easy Zone 2 Base Run' : 'Zone 2 Base Run + Strength',
        totalDistance: `${tueKm} km`,
        warmup: { timeDist: '1 km (7 mins)', pace: getEmpiricalPace('7:30 - 7:50 /km'), hr: 'Zone 1 (<130 bpm)' },
        mainSet: { structure: `${Math.max(1, tueKm - 2)} km Continuous Aerobic Base Run`, pace: getEmpiricalPace('6:50 - 7:15 /km'), hr: 'Zone 2 (130 - 154 bpm)' },
        cooldown: { timeDist: '1 km (7 mins)', pace: getEmpiricalPace('7:30 - 8:00 /km'), hr: 'Zone 1 (<130 bpm)' },
        strength: '30-min Lower Body Heavy Strength: Romanian Deadlifts (4x8), Bulgarian Split Squats (3x10), Standing Calf Raises (4x12).',
        rationale: 'Verified Garmin Zone 2 pace (6:50-7:15/km). Stimulates mitochondrial capillarization; heavy RDLs & split squats fortify glutes.'
      },
      {
        day: 'WEDNESDAY',
        date: dates[2],
        isToday: todayDayName === 'WEDNESDAY',
        category: isDeload ? 'Easy Aerobic Flush' : 'Aerobic Threshold Intervals',
        totalDistance: `${wedKm} km`,
        warmup: { timeDist: '1.5 km (10 mins)', pace: getEmpiricalPace('7:15 - 7:45 /km'), hr: 'Zone 1/2 (125-140 bpm)' },
        mainSet: { structure: isDeload ? `${Math.max(1, wedKm - 3)} km Easy Aerobic Flush` : `3 x 2 km Threshold Intervals w/ 2 min jog recovery @ 7:30/km`, pace: getEmpiricalPace('5:45 - 6:10 /km'), hr: 'Zone 4 (167 - 180 bpm)' },
        cooldown: { timeDist: '1.5 km (10 mins)', pace: getEmpiricalPace('7:30 - 8:00 /km'), hr: 'Zone 1 (<130 bpm)' },
        strength: 'Post-run Dynamic Hamstring Swings (2x15) & Foam Rolling Calves/IT Band.',
        rationale: 'Shifts lactate threshold rightward to support marathon race pace.'
      },
      {
        day: 'THURSDAY',
        date: dates[3],
        isToday: todayDayName === 'THURSDAY',
        category: 'Active Zone 2 Recovery Flush',
        totalDistance: `${thuKm} km`,
        warmup: { timeDist: '1 km (7.5 mins)', pace: getEmpiricalPace('7:30 - 8:00 /km'), hr: 'Zone 1 (<130 bpm)' },
        mainSet: { structure: `${Math.max(1, thuKm - 2)} km Continuous Recovery Flush`, pace: getEmpiricalPace('7:15 - 7:45 /km'), hr: 'Zone 1/2 (130 - 145 bpm)' },
        cooldown: { timeDist: '1 km (7.5 mins)', pace: getEmpiricalPace('7:45 - 8:15 /km'), hr: 'Zone 1 (<130 bpm)' },
        strength: '20-min Core Anti-Rotation & Pelvic Stability: Pallof Press (3x12), Single-Leg Glute Bridges (3x12), Side Planks (3x45s).',
        rationale: 'Flushes metabolic waste from Wednesday threshold work; Pallof press eliminates pelvic drop under late-marathon fatigue.'
      },
      {
        day: 'FRIDAY',
        date: dates[4],
        isToday: todayDayName === 'FRIDAY',
        category: 'Rest & Glycogen Replenishment',
        totalDistance: '0 km',
        warmup: { timeDist: 'N/A', pace: 'Rest', hr: 'Zone 1 (<130 bpm)' },
        mainSet: { structure: 'Complete Muscle Rest & Glycogen Supercompensation', pace: 'Rest', hr: 'Zone 1 (<130 bpm)' },
        cooldown: { timeDist: '20 mins Foam Rolling', pace: 'N/A', hr: 'Zone 1 (<130 bpm)' },
        strength: 'Full Body Foam Rolling & Light Static Stretching.',
        rationale: 'Restores glycogen stores to 100% capacity and lowers neuromuscular fatigue prior to Sunday long run.'
      },
      {
        day: 'SATURDAY',
        date: dates[5],
        isToday: todayDayName === 'SATURDAY',
        category: 'Shakeout Run & Dynamic Activation',
        totalDistance: `${satKm} km`,
        warmup: { timeDist: '1 km (7 mins)', pace: getEmpiricalPace('7:30 - 8:00 /km'), hr: 'Zone 1 (<130 bpm)' },
        mainSet: { structure: `${Math.max(1, satKm - 2)} km Easy Shakeout Run w/ 4x50m light strides`, pace: getEmpiricalPace('7:00 - 7:20 /km'), hr: 'Zone 1/2 (125-140 bpm)' },
        cooldown: { timeDist: '1 km (7 mins)', pace: getEmpiricalPace('7:45 - 8:15 /km'), hr: 'Zone 1 (<130 bpm)' },
        strength: 'Dynamic Leg Swings & Glute Activation Band Walks (2x15).',
        rationale: 'Primes nervous system for Sunday key long run.'
      },
      {
        day: 'SUNDAY',
        date: dates[6],
        isToday: todayDayName === 'SUNDAY',
        category: isDeload ? `${longKm} km RECOVERY LONG RUN` : `${longKm} km KEY SUNDAY LONG RUN`,
        totalDistance: `${longKm} km`,
        warmup: { timeDist: '2 km (14 mins)', pace: getEmpiricalPace('7:15 - 7:30 /km'), hr: 'Zone 1/2 (130-145 bpm)' },
        mainSet: { structure: `${Math.max(1, longKm - 5)} km Aerobic Base @ 6:30-6:45/km + Last 3 km Progression @ 6:15/km`, pace: getEmpiricalPace('6:30 - 6:45 /km'), hr: 'Zone 3 (155 - 166 bpm)' },
        cooldown: { timeDist: '3 km (22 mins)', pace: getEmpiricalPace('7:30 - 8:00 /km'), hr: 'Zone 1 (<130 bpm)' },
        strength: 'Post-Long Run Cold Water Leg Flush & 15-min Gentle Hip Release.',
        rationale: `Verified Garmin Doddaballapur 21.2k Long Run pace (6:39/km @ 167 bpm). Key Sunday long run of ${longKm} km!`
      }
    ];
  };

  const currentWeek = master27Weeks[selectedWeekIndex] || master27Weeks[0];
  const currentWeekDays = get7DaySchedule(currentWeek);

  return (
    <div className="min-h-screen bg-[#f0f4f9] text-slate-900 pb-16">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-8">
        {/* HEADER TITLE */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h1 className="text-xl font-extrabold text-white flex items-center space-x-2">
              <Calendar className="w-6 h-6 text-cyan-400" />
              <span>Master Roadmap Engine (Aug 2026 – Feb 2027)</span>
            </h1>
            <p className="text-xs text-slate-400">
              Interactive 27-Week Roadmap to Lonavala 50K Ultra • Sunday Long Runs • Verified Empirical Garmin HR vs Pace
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <span className="px-3 py-1.5 rounded-xl bg-cyan-500/10 text-cyan-300 font-extrabold text-xs border border-cyan-500/30">
              Max HR: 200 bpm
            </span>
            <span className="px-3 py-1.5 rounded-xl bg-amber-500/10 text-amber-300 font-extrabold text-xs border border-amber-500/30">
              Sunday Long Runs
            </span>
          </div>
        </div>

        {/* GARMIN VERIFIED HR VS PACE AUDIT CARD */}
        <section className="glass-card p-5 rounded-2xl border border-emerald-500/40 bg-emerald-500/5 space-y-3 shadow-xl">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center space-x-2 text-emerald-300 font-bold text-xs">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Garmin Connect Empirical Pace vs HR Audit (54 Activities Analyzed):</span>
            </div>

            <span className="text-[10px] font-extrabold text-emerald-400 bg-emerald-500/20 px-2.5 py-0.5 rounded border border-emerald-500/30">
              ✓ Verified with Garmin History
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs pt-1">
            <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800 space-y-1">
              <span className="text-slate-400 font-bold text-[10px] block">Zone 1: Active Recovery</span>
              <span className="font-extrabold text-cyan-300">Under 130 bpm</span>
              <span className="text-xs font-mono font-bold text-white block">Pace: 7:30 - 8:30 /km</span>
            </div>
            <div className="bg-slate-900/90 p-3 rounded-xl border border-emerald-500/30 space-y-1">
              <span className="text-emerald-400 font-bold text-[10px] block">Zone 2: Aerobic Base</span>
              <span className="font-extrabold text-emerald-300">130 - 154 bpm</span>
              <span className="text-xs font-mono font-bold text-emerald-300 block">Pace: 6:50 - 7:15 /km</span>
            </div>
            <div className="bg-slate-900/90 p-3 rounded-xl border border-cyan-500/30 space-y-1">
              <span className="text-cyan-400 font-bold text-[10px] block">Zone 3: Marathon Pace</span>
              <span className="font-extrabold text-cyan-300">155 - 166 bpm</span>
              <span className="text-xs font-mono font-bold text-cyan-300 block">Pace: 6:25 - 6:45 /km</span>
            </div>
            <div className="bg-slate-900/90 p-3 rounded-xl border border-amber-500/30 space-y-1">
              <span className="text-amber-400 font-bold text-[10px] block">Zone 4: Threshold</span>
              <span className="font-extrabold text-amber-300">167 - 180 bpm</span>
              <span className="text-xs font-mono font-bold text-amber-300 block">Pace: 5:45 - 6:15 /km</span>
            </div>
            <div className="bg-slate-900/90 p-3 rounded-xl border border-rose-500/30 space-y-1">
              <span className="text-rose-400 font-bold text-[10px] block">Zone 5: VO2 Max Interval</span>
              <span className="font-extrabold text-rose-300">181 - 200 bpm</span>
              <span className="text-xs font-mono font-bold text-rose-300 block">Pace: 4:55 - 5:25 /km</span>
            </div>
          </div>
        </section>

        {/* FITNESS ADAPTATION & AUTO-REGULATION TOGGLE BAR */}
        <section className="glass-card p-5 rounded-2xl border border-purple-500/40 bg-purple-500/5 space-y-3 shadow-xl">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center space-x-2 text-purple-300 font-bold text-xs">
              <Sliders className="w-4 h-4 text-purple-400" />
              <span>AI Dynamic Fitness Adaptation Control (Auto-Adjust Target Paces):</span>
            </div>

            <div className="flex items-center space-x-2 bg-slate-900 p-1 rounded-xl border border-purple-500/30">
              <button
                onClick={() => setFitnessLevel('current')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  fitnessLevel === 'current'
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Verified Garmin Base (VO2 Max 50)
              </button>
              <button
                onClick={() => setFitnessLevel('boosted')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  fitnessLevel === 'boosted'
                    ? 'bg-cyan-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                ⚡ Advanced (+8s/km Faster)
              </button>
              <button
                onClick={() => setFitnessLevel('peak')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  fitnessLevel === 'peak'
                    ? 'bg-amber-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                🔥 Peak Adapt (+15s/km Faster)
              </button>
            </div>
          </div>
          <p className="text-[11px] text-purple-200/80 leading-relaxed">
            As your Garmin VO2 Max expands, target paces automatically sharpen across all 27 weeks while preserving strict HR Zone boundaries.
          </p>
        </section>

        {/* 27-WEEK SELECTOR DROPDOWN BAR */}
        <section className="glass-card p-5 rounded-2xl border border-cyan-500/40 space-y-3 bg-cyan-500/5 shadow-xl">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center space-x-2">
              <Flag className="w-5 h-5 text-cyan-400" />
              <label htmlFor="weekSelector" className="text-xs font-extrabold text-white uppercase tracking-wider">
                Select Roadmap Week (Aug 2026 ➔ Feb 17, 2027 Ultra):
              </label>
            </div>

            {/* DROPDOWN MENU */}
            <div className="relative min-w-[280px]">
              <select
                id="weekSelector"
                value={selectedWeekIndex}
                onChange={(e) => setSelectedWeekIndex(Number(e.target.value))}
                className="w-full bg-slate-900 text-cyan-300 text-xs font-bold py-2.5 px-3 pr-8 rounded-xl border border-cyan-500/40 focus:outline-none focus:ring-2 focus:ring-cyan-400 cursor-pointer"
              >
                {master27Weeks.map((w, idx) => (
                  <option key={idx} value={idx}>
                    {w.isRace ? '🏆 ' : w.isDeload ? '🔋 ' : '🏃 '}
                    Week {w.weekNum}: {w.dateRange} — {w.title} ({w.targetVolume})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* ACTIVE WEEK SUMMARY BADGES */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs">
            <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800 space-y-0.5">
              <span className="text-[10px] text-slate-400 font-semibold block">Target Weekly Volume</span>
              <span className="text-sm font-black text-cyan-300">{currentWeek.targetVolume}</span>
            </div>
            <div className="bg-slate-900/90 p-3 rounded-xl border border-amber-500/30 space-y-0.5">
              <span className="text-[10px] text-amber-400 font-bold block">Sunday Key Long Run</span>
              <span className="text-sm font-black text-amber-300">{currentWeek.longRunKm}</span>
            </div>
            <div className="bg-slate-900/90 p-3 rounded-xl border border-purple-500/30 space-y-0.5">
              <span className="text-[10px] text-purple-300 font-bold block">3:1 Periodization Status</span>
              <span className="text-xs font-extrabold text-purple-200">
                {currentWeek.isDeload ? '🔋 DELOAD / RECOVERY WEEK' : '📈 PROGRESSIVE LOAD WEEK'}
              </span>
            </div>
            <div className="bg-slate-900/90 p-3 rounded-xl border border-emerald-500/30 space-y-0.5">
              <span className="text-[10px] text-emerald-400 font-bold block">Macrocycle Goal Phase</span>
              <span className="text-xs font-extrabold text-emerald-300">{currentWeek.phase}</span>
            </div>
          </div>
        </section>

        {/* PRESCRIBED DAY-BY-DAY MASTER WORKOUT TABLE FOR SELECTED WEEK */}
        <section className="glass-card p-6 rounded-2xl border border-slate-800 space-y-6 shadow-2xl">
          {/* HEADER CONTROLS DIRECTLY INSIDE TABLE CARD */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-base font-bold text-white flex items-center space-x-2">
                <Footprints className="w-5 h-5 text-cyan-400" />
                <span>{currentWeek.title} ({currentWeek.dateRange})</span>
              </h2>
              <p className="text-xs text-slate-400">
                Prescribed 7-day schedule with Sunday Long Runs, recalibrated HR Zones (Max HR 200 bpm), Strength & Mobility
              </p>
            </div>

            {/* PREVIOUS / NEXT WEEK NAVIGATION BUTTONS INSIDE TABLE HEADER */}
            <div className="flex items-center space-x-2">
              <button
                disabled={selectedWeekIndex === 0}
                onClick={() => setSelectedWeekIndex((prev) => Math.max(0, prev - 1))}
                className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 font-bold text-xs border border-slate-800 disabled:opacity-40 disabled:cursor-not-allowed flex items-center space-x-1"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Prev Week</span>
              </button>

              <span className="text-xs font-black text-cyan-400 bg-cyan-500/10 px-3 py-1.5 rounded-xl border border-cyan-500/30">
                Week {currentWeek.weekNum} of 27
              </span>

              <button
                disabled={selectedWeekIndex === master27Weeks.length - 1}
                onClick={() => setSelectedWeekIndex((prev) => Math.min(master27Weeks.length - 1, prev + 1))}
                className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 font-bold text-xs border border-slate-800 disabled:opacity-40 disabled:cursor-not-allowed flex items-center space-x-1"
              >
                <span>Next Week</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* TABLE CONTAINER */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-slate-300 uppercase bg-slate-900/90 border-b border-slate-800 font-bold tracking-wider">
                <tr>
                  <th className="p-3.5 whitespace-nowrap">Day & Date</th>
                  <th className="p-3.5 whitespace-nowrap">Workout Category</th>
                  <th className="p-3.5">Complete Workout Structure (Warm-Up, Main Set, Cooldown)</th>
                  <th className="p-3.5">Exact Strength & Mobility Routine</th>
                  <th className="p-3.5">Sports Science Rationale</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/70 font-medium">
                {currentWeekDays.map((row, idx) => (
                  <tr
                    key={idx}
                    className={`transition-colors ${
                      row.day === 'SUNDAY'
                        ? 'bg-amber-500/10 hover:bg-amber-500/15 border-l-4 border-l-amber-400'
                        : row.isToday
                        ? 'bg-cyan-500/10 hover:bg-cyan-500/15 border-l-4 border-l-cyan-400'
                        : 'hover:bg-slate-900/50'
                    }`}
                  >
                    {/* Day & Date */}
                    <td className="p-3.5 whitespace-nowrap align-top">
                      <div className="font-extrabold text-sm text-white flex items-center space-x-1.5">
                        <span>{row.day}</span>
                        {row.day === 'SUNDAY' && (
                          <span className="text-[9px] font-black text-amber-950 bg-amber-400 px-1.5 py-0.5 rounded">
                            KEY LONG RUN
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400 font-semibold">{row.date}</div>
                      <div className="mt-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-black bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                          Total: {row.totalDistance}
                        </span>
                      </div>
                    </td>

                    {/* Workout Category */}
                    <td className="p-3.5 whitespace-nowrap align-top">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold border bg-slate-900 text-cyan-300 border-slate-800 block w-fit">
                        {row.category}
                      </span>
                    </td>

                    {/* STRUCTURED WORKOUT (WARM-UP, MAIN SET, COOLDOWN) */}
                    <td className="p-3.5 min-w-[340px] space-y-2 align-top">
                      {row.totalDistance === '0 km' || row.category.toLowerCase().includes('rest') ? (
                        /* REST DAY CARD */
                        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 space-y-1 shadow-sm">
                          <div className="flex items-center space-x-2 text-purple-300 font-bold text-xs">
                            <Moon className="w-4 h-4 text-purple-400" />
                            <span>Rest & Autonomic Recovery</span>
                          </div>
                          <p className="text-xs text-slate-300 leading-relaxed font-medium">
                            Full muscle rest & glycogen supercompensation. Focus on hydration, tissue repair, and nightly HRV recovery.
                          </p>
                        </div>
                      ) : !row.category.toLowerCase().includes('threshold') &&
                        !row.category.toLowerCase().includes('interval') &&
                        !row.category.toLowerCase().includes('key') &&
                        !row.category.toLowerCase().includes('race') &&
                        row.day !== 'SUNDAY' ? (
                        /* CONTINUOUS EASY RUN CARD (NO WARM-UP/COOLDOWN NEEDED) */
                        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3.5 space-y-1.5 shadow-sm">
                          <div className="flex items-center space-x-1.5 text-emerald-300 font-black text-xs uppercase tracking-wider">
                            <Footprints className="w-4 h-4 text-emerald-400" />
                            <span>Continuous Easy Base Run ({row.totalDistance})</span>
                          </div>
                          <div className="text-xs text-white font-extrabold">
                            {row.mainSet.structure}
                          </div>
                          <div className="text-xs text-emerald-300 font-mono font-bold">
                            Target Pace: {row.mainSet.pace}
                          </div>
                          <div className="text-[11px] text-emerald-200/80 font-semibold">
                            Garmin HR Zone: <span className="text-white font-bold bg-emerald-500/30 px-1.5 py-0.5 rounded">{row.mainSet.hr}</span>
                          </div>
                          <p className="text-[10px] text-slate-400 italic pt-0.5">
                            *No separate warm-up/cooldown needed—start easy for the first 5 mins and maintain steady Zone 2 throughout.
                          </p>
                        </div>
                      ) : (
                        /* QUALITY WORKOUT & KEY LONG RUN 3-STAGE BREAKDOWN */
                        <>
                          {/* WARM-UP */}
                          <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-2.5 space-y-1">
                            <div className="flex items-center space-x-1.5 text-amber-300 font-black text-[10px] uppercase tracking-wider">
                              <Flame className="w-3.5 h-3.5 text-amber-400" />
                              <span>1. WARM-UP ROUTINE</span>
                            </div>
                            <div className="text-xs text-amber-100 font-bold">
                              {row.warmup.timeDist} <span className="text-amber-300 font-mono">@ {row.warmup.pace}</span>
                            </div>
                            <div className="text-[10px] text-amber-200/80 font-semibold">
                              HR Target: <span className="text-white font-bold">{row.warmup.hr}</span>
                            </div>
                          </div>

                          {/* MAIN WORKOUT SET */}
                          <div className="bg-cyan-500/10 border border-cyan-500/40 rounded-xl p-2.5 space-y-1 shadow-md">
                            <div className="flex items-center space-x-1.5 text-cyan-300 font-black text-[10px] uppercase tracking-wider">
                              <Zap className="w-3.5 h-3.5 text-cyan-400" />
                              <span>2. MAIN WORKOUT SET</span>
                            </div>
                            <div className="text-xs text-white font-extrabold">
                              {row.mainSet.structure}
                            </div>
                            <div className="text-xs text-cyan-300 font-mono font-black">
                              Target Pace: {row.mainSet.pace}
                            </div>
                            <div className="text-[10px] text-purple-300 font-bold">
                              Garmin HR Zone: <span className="text-white bg-purple-500/30 px-1.5 py-0.5 rounded">{row.mainSet.hr}</span>
                            </div>
                          </div>

                          {/* COOLDOWN */}
                          <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-2.5 space-y-1">
                            <div className="flex items-center space-x-1.5 text-blue-300 font-black text-[10px] uppercase tracking-wider">
                              <Snowflake className="w-3.5 h-3.5 text-blue-400" />
                              <span>3. COOLDOWN & RECOVERY</span>
                            </div>
                            <div className="text-xs text-blue-100 font-bold">
                              {row.cooldown.timeDist} <span className="text-blue-300 font-mono">@ {row.cooldown.pace}</span>
                            </div>
                            <div className="text-[10px] text-blue-200/80 font-semibold">
                              HR Target: <span className="text-white font-bold">{row.cooldown.hr}</span>
                            </div>
                          </div>
                        </>
                      )}
                    </td>

                    {/* Exact Strength & Mobility */}
                    <td className="p-3.5 min-w-[220px] align-top">
                      <div className="flex items-start space-x-1.5 text-slate-200 bg-slate-900/90 p-3 rounded-xl border border-slate-800">
                        <Dumbbell className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                        <span className="text-[11px] leading-snug">{row.strength}</span>
                      </div>
                    </td>

                    {/* Sports Science Rationale */}
                    <td className="p-3.5 min-w-[240px] align-top">
                      <div className="flex items-start space-x-1.5 text-slate-300 bg-slate-900/90 p-3 rounded-xl border border-slate-800">
                        <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                        <span className="text-[11px] leading-relaxed font-medium">{row.rationale}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* HR ZONES REFERENCE GUIDE (RECALIBRATED FOR MAX HR 200 BPM) */}
        <section className="glass-card p-5 rounded-2xl border border-slate-800 space-y-3">
          <div className="flex items-center space-x-2 text-rose-400">
            <Heart className="w-4 h-4" />
            <h3 className="text-xs font-bold uppercase tracking-wider">Garmin HR Zone Reference Table (Recalibrated for Max HR: 200 bpm)</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
            <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 space-y-1">
              <span className="text-slate-400 font-bold text-[10px] block">Zone 1: Active Recovery</span>
              <span className="font-extrabold text-cyan-300">Under 130 bpm (&lt;65% HRmax)</span>
              <p className="text-[10px] text-slate-400 font-mono">Pace: 7:30 - 8:30 /km</p>
            </div>
            <div className="bg-slate-900 p-3 rounded-xl border border-emerald-500/30 space-y-1">
              <span className="text-emerald-400 font-bold text-[10px] block">Zone 2: Aerobic Endurance</span>
              <span className="font-extrabold text-emerald-300">130 - 154 bpm (65-77% HRmax)</span>
              <p className="text-[10px] text-slate-400 font-mono">Pace: 6:50 - 7:15 /km</p>
            </div>
            <div className="bg-slate-900 p-3 rounded-xl border border-cyan-500/30 space-y-1">
              <span className="text-cyan-400 font-bold text-[10px] block">Zone 3: Tempo / Marathon Pace</span>
              <span className="font-extrabold text-cyan-300">155 - 166 bpm (77-83% HRmax)</span>
              <p className="text-[10px] text-slate-400 font-mono">Pace: 6:25 - 6:45 /km</p>
            </div>
            <div className="bg-slate-900 p-3 rounded-xl border border-amber-500/30 space-y-1">
              <span className="text-amber-400 font-bold text-[10px] block">Zone 4: Threshold & Speed</span>
              <span className="font-extrabold text-amber-300">167 - 180 bpm (83-90% HRmax)</span>
              <p className="text-[10px] text-slate-400 font-mono">Pace: 5:45 - 6:15 /km</p>
            </div>
            <div className="bg-slate-900 p-3 rounded-xl border border-rose-500/30 space-y-1">
              <span className="text-rose-400 font-bold text-[10px] block">Zone 5: VO2 Max Maximum</span>
              <span className="font-extrabold text-rose-300">181 - 200 bpm (&gt;90% HRmax)</span>
              <p className="text-[10px] text-slate-400 font-mono">Pace: 4:55 - 5:25 /km</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
