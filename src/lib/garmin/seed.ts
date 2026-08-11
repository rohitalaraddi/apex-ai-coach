import { db } from '../db';

export async function seedGarminDemoData() {
  console.log('Seeding Apex AI Coach Demo Data...');

  // 1. Create or Update Athlete Profile
  await db.athleteProfile.upsert({
    where: { id: 'default-profile' },
    update: {
      name: 'Rohit',
      age: 30,
      height: 178.0,
      weight: 71.0,
      sex: 'Male',
      timeZone: 'Asia/Kolkata',
      location: 'Bengaluru, India',
      pb5k: '21:45',
      pb10k: '45:30',
      pbHalfMarathon: '1:42:15',
      pbMarathon: '3:48:00',
      targetWeeklyMileage: 55.0,
      maxHistoricalMileage: 72.0,
      typicalFrequency: 5,
      preferredTrainingDays: 'Tue,Wed,Thu,Sat,Sun',
      currentPhase: 'Marathon Build Phase 2',
      restingHrBaseline: 54,
      hrvBaseline: 68.0,
      vo2Max: 52.5,
      maxHr: 188,
      lactateThresholdHr: 168,
      sleepBaselineHours: 7.5,
      injuryHistory: 'Mild right Achilles tightness (resolved May 2025)',
      currentRestrictions: 'Avoid back-to-back downhill speed sessions',
    },
    create: {
      id: 'default-profile',
      name: 'Rohit',
      age: 30,
      height: 178.0,
      weight: 71.0,
      sex: 'Male',
      timeZone: 'Asia/Kolkata',
      location: 'Bengaluru, India',
      pb5k: '21:45',
      pb10k: '45:30',
      pbHalfMarathon: '1:42:15',
      pbMarathon: '3:48:00',
      targetWeeklyMileage: 55.0,
      maxHistoricalMileage: 72.0,
      typicalFrequency: 5,
      preferredTrainingDays: 'Tue,Wed,Thu,Sat,Sun',
      currentPhase: 'Marathon Build Phase 2',
      restingHrBaseline: 54,
      hrvBaseline: 68.0,
      vo2Max: 52.5,
      maxHr: 188,
      lactateThresholdHr: 168,
      sleepBaselineHours: 7.5,
      injuryHistory: 'Mild right Achilles tightness (resolved May 2025)',
      currentRestrictions: 'Avoid back-to-back downhill speed sessions',
    },
  });

  // 2. Clear old demo activities & daily records
  await db.activity.deleteMany({});
  await db.dailyHealth.deleteMany({});
  await db.subjectiveLog.deleteMany({});
  await db.goal.deleteMany({});
  await db.equipment.deleteMany({});
  await db.trainingPlan.deleteMany({});

  // 3. Create Goals
  await db.goal.createMany({
    data: [
      {
        id: 'goal-1',
        title: 'Sub-4:00 Marathon',
        category: 'Running',
        targetValue: '3:59:59',
        baselineValue: '4:12:00',
        currentCapability: '4:04:30',
        deadline: new Date(Date.now() + 48 * 24 * 3600 * 1000), // ~7 weeks out
        status: 'In Progress',
        aiStrategy: 'Build long run durability up to 32 km while maintaining Zone 2 aerobic efficiency.',
      },
      {
        id: 'goal-2',
        title: 'Improve Nightly HRV Baseline',
        category: 'Health',
        targetValue: '72.0 ms',
        baselineValue: '64.0 ms',
        currentCapability: '68.0 ms',
        deadline: new Date(Date.now() + 60 * 24 * 3600 * 1000),
        status: 'In Progress',
        aiStrategy: 'Prioritize 8+ hours sleep and avoid late caffeine/meals after 7:30 PM.',
      },
    ],
  });

  // 4. Create Equipment (Shoes)
  await db.equipment.createMany({
    data: [
      {
        id: 'shoe-1',
        name: 'Adidas Boston 12',
        brand: 'Adidas',
        model: 'Boston 12',
        purchaseDate: new Date(Date.now() - 90 * 24 * 3600 * 1000),
        accumulatedDistance: 342.5,
        retirementThreshold: 650.0,
        status: 'Active',
      },
      {
        id: 'shoe-2',
        name: 'Nike Vaporfly Next% 3',
        brand: 'Nike',
        model: 'Vaporfly 3',
        purchaseDate: new Date(Date.now() - 45 * 24 * 3600 * 1000),
        accumulatedDistance: 118.0,
        retirementThreshold: 400.0,
        status: 'Active',
      },
    ],
  });

  // 5. Seed 30 Days of Daily Health & Activities
  const now = new Date();
  const activitiesToInsert = [];
  const dailyHealthsToInsert = [];

  const activityTemplates = [
    { title: 'Aerobic Base Run', type: 'Running', distKm: 10.2, paceSec: 335, hr: 146, load: 115, cad: 174, temp: 24 },
    { title: 'Threshold Tempo Intervals', type: 'Running', distKm: 12.5, paceSec: 295, hr: 168, load: 165, cad: 178, temp: 22 },
    { title: 'Easy Recovery Run + Strides', type: 'Running', distKm: 7.0, paceSec: 360, hr: 138, load: 70, cad: 170, temp: 26 },
    { title: 'Marathon Simulator Long Run', type: 'Running', distKm: 24.0, paceSec: 340, hr: 154, load: 240, cad: 172, temp: 23 },
    { title: 'Indoor Zwift Aerobic Cycling', type: 'Cycling', distKm: 32.0, paceSec: 120, hr: 135, load: 95, cad: 88, temp: 21 },
    { title: '5x1000m VO2Max Intervals', type: 'Running', distKm: 11.0, paceSec: 265, hr: 174, load: 185, cad: 182, temp: 20 },
    { title: 'Progression Run (Zone 2 to Zone 4)', type: 'Running', distKm: 14.2, paceSec: 320, hr: 158, load: 150, cad: 175, temp: 25 },
  ];

  for (let i = 29; i >= 0; i--) {
    const date = new Date(now.getTime() - i * 24 * 3600 * 1000);
    const dayOfWeek = date.getDay(); // 0 = Sun, 6 = Sat

    // Synthesize Sleep & Health metrics
    const sleepHours = 7.0 + Math.sin(i * 0.8) * 0.9 + (i === 1 ? -1.5 : 0.4);
    const sleepDurationSec = Math.round(sleepHours * 3600);
    const sleepScore = Math.max(55, Math.min(98, Math.round(sleepHours * 11.5 + 5)));

    const hrv = Math.round(68 + Math.sin(i * 0.6) * 6 - (i === 2 ? 10 : 0));
    const rhr = Math.round(54 - Math.sin(i * 0.5) * 3 + (i === 2 ? 4 : 0));
    const bodyBattStart = Math.max(70, Math.min(100, Math.round(sleepScore * 0.98)));

    const steps = 8000 + Math.round(Math.abs(Math.sin(i)) * 9000);

    // Calculate deterministic readiness score
    const readinessScore = Math.max(45, Math.min(96, Math.round(sleepScore * 0.35 + (hrv / 70) * 35 + (60 / rhr) * 30)));

    let morningVerdict = `Recovery is balanced today (HRV: ${hrv} ms, Sleep: ${(sleepHours).toFixed(1)}h). Prime for training.`;
    if (readinessScore < 60) {
      morningVerdict = `Noticeable fatigue detected. HRV dropped to ${hrv} ms and resting HR elevated to ${rhr} bpm. Recommended easy active recovery.`;
    }

    const dh = {
      date,
      restingHr: rhr,
      hrvNightlyAvg: hrv,
      hrvStatus: hrv >= 64 ? 'Balanced' : 'Low',
      hrv7DayAvg: 67.5,
      sleepDurationSeconds: sleepDurationSec,
      sleepScore,
      deepSleepSeconds: Math.round(sleepDurationSec * 0.22),
      remSleepSeconds: Math.round(sleepDurationSec * 0.24),
      lightSleepSeconds: Math.round(sleepDurationSec * 0.48),
      awakeSleepSeconds: Math.round(sleepDurationSec * 0.06),
      bodyBatteryStart: bodyBattStart,
      bodyBatteryEnd: Math.max(15, bodyBattStart - 65),
      bodyBatteryMin: 18,
      bodyBatteryMax: bodyBattStart,
      avgStress: Math.round(24 + Math.abs(Math.sin(i)) * 14),
      trainingReadiness: readinessScore,
      steps,
      activeCalories: Math.round(steps * 0.045 + 300),
      floorsClimbed: 14,
      intensityMinutes: dayOfWeek === 1 ? 0 : 55,
      aiMorningVerdict: morningVerdict,
    };

    await db.dailyHealth.create({ data: dh });

    // Rest on Mondays (dayOfWeek 1)
    if (dayOfWeek !== 1) {
      const template = activityTemplates[i % activityTemplates.length];
      const distMeters = template.distKm * 1000;
      const durSec = Math.round(template.distKm * template.paceSec);

      // Generate Lap Splits
      const splits = [];
      for (let k = 1; k <= Math.floor(template.distKm); k++) {
        const splitPace = template.paceSec + (k > template.distKm * 0.7 ? 4 : -2);
        const m = Math.floor(splitPace / 60);
        const s = Math.round(splitPace % 60);
        splits.push({
          km: k,
          pace: `${m}:${s.toString().padStart(2, '0')}`,
          avgHr: template.hr - 5 + k,
          elevationGain: Math.round(3 + (k % 4) * 2),
        });
      }

      await db.activity.create({
        data: {
          garminActivityId: `demo_act_${i}_${Date.now()}`,
          date,
          title: template.title,
          type: template.type,
          distance: distMeters,
          duration: durSec,
          movingTime: Math.round(durSec * 0.97),
          paceSecondsPerKm: template.paceSec,
          speedMs: Number((distMeters / durSec).toFixed(2)),
          elevationGain: template.type === 'Running' ? Math.round(template.distKm * 6.5) : 180,
          elevationLoss: template.type === 'Running' ? Math.round(template.distKm * 6.0) : 175,
          avgHr: template.hr,
          maxHr: template.hr + 14,
          calories: Math.round(template.distKm * 64),
          aerobicTrainingEffect: template.type === 'Running' ? 3.4 : 2.8,
          anaerobicTrainingEffect: template.title.includes('Intervals') ? 2.6 : 0.8,
          trainingLoad: template.load,
          avgCadence: template.cad,
          strideLength: template.type === 'Running' ? 1.12 : null,
          groundContactTime: template.type === 'Running' ? 228 : null,
          verticalOscillation: template.type === 'Running' ? 8.6 : null,
          runningPower: template.type === 'Running' ? 255 : 190,
          temperature: template.temp,
          weatherCondition: 'Clear / Partlands',
          shoeName: template.type === 'Running' ? 'Adidas Boston 12' : null,
          splitsJson: JSON.stringify(splits),
          aiPerformanceScore: Number((8.2 + (i % 3) * 0.4).toFixed(1)),
          aiAnalysisSummary: `Solid execution of ${template.title}. Pacing was well controlled within Zone ${template.hr > 160 ? 4 : 2} target. Aerobic efficiency was 4% higher than 30-day baseline.`,
        },
      });
    }

    // Add Subjective Log every few days
    if (i % 3 === 0) {
      await db.subjectiveLog.create({
        data: {
          date,
          overallFeeling: i === 3 ? 2 : 4,
          perceivedFatigue: i === 3 ? 7 : 4,
          stressLevel: 3,
          quadsSoreness: i === 3 ? 5 : 2,
          calvesSoreness: 2,
          hamstringsSoreness: 1,
          glutesSoreness: 1,
          hipsSoreness: 0,
          kneesSoreness: 0,
          shinsSoreness: 0,
          anklesSoreness: 1,
          feetSoreness: 0,
          painLocation: i === 3 ? 'Right calf tightness' : null,
          painSeverity: i === 3 ? 3 : 0,
          notes: i === 3 ? 'Felt slightly tight after yesterday interval session.' : 'Feeling fresh and well recovered.',
        },
      });
    }
  }

  // 6. Create Adaptive Training Plan
  const plan = await db.trainingPlan.create({
    data: {
      id: 'plan-sub4-marathon',
      title: '12-Week Sub-4 Marathon Blueprint',
      targetGoal: 'Sub-4:00 Marathon',
      targetDate: new Date(Date.now() + 48 * 24 * 3600 * 1000),
      totalWeeks: 12,
      currentWeek: 6,
      status: 'Active',
      aiStrategyNotes: 'Prioritizing weekly long runs with marathon pace finish blocks, combined with mid-week aerobic threshold runs.',
    },
  });

  // Create 7 Days of Prescribed Workouts
  const workoutTemplates = [
    { day: 'Tue', title: '10 km Aerobic Zone 2 Run', cat: 'Easy', dist: 10.0, pace: '5:30 - 5:45 /km', zone: 'Zone 2 (135 - 148 bpm)', purpose: 'Aerobic base maintenance & recovery' },
    { day: 'Wed', title: '12 km Threshold Tempo Run (4x2km @ MP)', cat: 'Tempo', dist: 12.0, pace: '5:05 - 5:15 /km', zone: 'Zone 4 (162 - 172 bpm)', purpose: 'Lactate threshold stimulus & marathon pace economy' },
    { day: 'Thu', title: '8 km Easy Recovery + 6 Strides', cat: 'Easy', dist: 8.0, pace: '5:45 - 6:00 /km', zone: 'Zone 1-2 (128 - 142 bpm)', purpose: 'Active recovery & neuromuscular leg speed' },
    { day: 'Fri', title: 'Rest & Mobility Day', cat: 'Rest', dist: 0.0, pace: 'N/A', zone: 'Rest', purpose: 'Full physiological adaptation & tissue repair' },
    { day: 'Sat', title: '26 km Marathon Simulator Long Run', cat: 'Long Run', dist: 26.0, pace: '5:35 - 5:45 /km', zone: 'Zone 2-3 (142 - 158 bpm)', purpose: 'Fat oxidation efficiency, glycogen storage & mental durability' },
    { day: 'Sun', title: '6 km Easy Flush Run or Swim', cat: 'Easy', dist: 6.0, pace: '6:00 /km', zone: 'Zone 1 (< 135 bpm)', purpose: 'Flush metabolic waste after long run' },
    { day: 'Mon', title: 'Rest & Foam Rolling', cat: 'Rest', dist: 0.0, pace: 'N/A', zone: 'Rest', purpose: 'Complete rest before quality week' },
  ];

  for (let j = 0; j < 7; j++) {
    const wDate = new Date(now.getTime() + (j - 1) * 24 * 3600 * 1000);
    const tmpl = workoutTemplates[j];
    await db.plannedWorkout.create({
      data: {
        trainingPlanId: plan.id,
        scheduledDate: wDate,
        dayOfWeek: tmpl.day,
        title: tmpl.title,
        category: tmpl.cat,
        targetDistanceKm: tmpl.dist,
        targetPaceRange: tmpl.pace,
        targetHrZone: tmpl.zone,
        workoutPurpose: tmpl.purpose,
        isCompleted: j === 0,
      },
    });
  }

  console.log('Seeding completed successfully!');
}
