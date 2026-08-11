import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import {
  calculateReadiness,
  calculateTrainingLoadMetrics,
  predictRaceTimes,
  calculateVo2MaxProgression,
  filterDataByTimeRange,
} from '@/lib/analytics/engine';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const range = searchParams.get('range') || 'all'; // 24h, 72h, 7d, 30d, 90d, all

    let profile = await db.athleteProfile.findFirst();
    const latestDailyHealth = await db.dailyHealth.findFirst({ orderBy: { date: 'desc' } });

    if (!profile) {
      profile = await db.athleteProfile.create({
        data: {
          id: 'default-profile',
          name: 'Rohit',
          age: 30,
          restingHrBaseline: 56,
          hrvBaseline: 54.0,
          vo2Max: 50.0,
          fitnessAge: 24.5,
        },
      });
    }

    // Fetch all health history
    const allHealthHistory = await db.dailyHealth.findMany({
      orderBy: { date: 'asc' },
    });

    // Fetch all activities
    const allActivities = await db.activity.findMany({
      orderBy: { date: 'desc' },
    });

    const latestSubjectiveLog = await db.subjectiveLog.findFirst({
      orderBy: { date: 'desc' },
    });

    const goals = await db.goal.findMany({ orderBy: { createdAt: 'desc' } });
    const equipment = await db.equipment.findMany({ orderBy: { accumulatedDistance: 'desc' } });
    const activePlan = await db.trainingPlan.findFirst({
      where: { status: 'Active' },
      include: { workouts: { orderBy: { scheduledDate: 'asc' } } },
    });

    // Filter health history and activities by selected range
    const filteredHealthHistory = filterDataByTimeRange(allHealthHistory, range);
    let filteredActivities = filterDataByTimeRange(allActivities, range);

    // Fallback if short range (24h or 72h) has no activities recorded
    if (filteredActivities.length === 0 && allActivities.length > 0) {
      filteredActivities = allActivities.slice(0, 5);
    }

    // Calculate Dynamic Timeframe Summary Metrics
    const totalDays = Math.max(1, filteredHealthHistory.length);
    const sumSleepScore = filteredHealthHistory.reduce((acc, h) => acc + (h.sleepScore || 80), 0);
    const sumSleepSec = filteredHealthHistory.reduce((acc, h) => acc + (h.sleepDurationSeconds || 27000), 0);
    const sumSteps = filteredHealthHistory.reduce((acc, h) => acc + (h.steps || 0), 0);
    const sumRhr = filteredHealthHistory.reduce((acc, h) => acc + (h.restingHr || 56), 0);
    const sumDeepSec = filteredHealthHistory.reduce((acc, h) => acc + (h.deepSleepSeconds || 5400), 0);
    const sumRemSec = filteredHealthHistory.reduce((acc, h) => acc + (h.remSleepSeconds || 6480), 0);
    const sumLightSec = filteredHealthHistory.reduce((acc, h) => acc + (h.lightSleepSeconds || 12960), 0);
    const sumAwakeSec = filteredHealthHistory.reduce((acc, h) => acc + (h.awakeSleepSeconds || 2160), 0);

    const timeframeSummary = {
      selectedRange: range,
      totalDays,
      avgSleepScore: Math.round(sumSleepScore / totalDays),
      latestSleepScore: latestDailyHealth?.sleepScore || 86,
      avgSleepHours: Number((sumSleepSec / totalDays / 3600).toFixed(1)),
      latestSleepHours: latestDailyHealth ? (latestDailyHealth.sleepDurationSeconds / 3600).toFixed(1) : '7.9',
      avgSteps: Math.round(sumSteps / totalDays),
      totalSteps: sumSteps,
      latestSteps: latestDailyHealth?.steps || 195,
      stepGoal: 8520,
      avgRestingHr: Math.round(sumRhr / totalDays),
      latestRestingHr: latestDailyHealth?.restingHr || 56,
      minHr: 48,
      maxHr: 188,
      fitnessAge: profile.fitnessAge || 24.5,
      actualAge: profile.age || 30,
      fitnessAgeDiff: Number(((profile.age || 30) - (profile.fitnessAge || 24.5)).toFixed(1)),
      trainingStatus: 'Productive',
      trainingStatusSince: 'Aug 9',
      deepSleepHours: Number((sumDeepSec / totalDays / 3600).toFixed(1)),
      remSleepHours: Number((sumRemSec / totalDays / 3600).toFixed(1)),
      lightSleepHours: Number((sumLightSec / totalDays / 3600).toFixed(1)),
      awakeSleepHours: Number((sumAwakeSec / totalDays / 3600).toFixed(1)),
    };

    // Analytics calculations
    const readiness = calculateReadiness(
      latestDailyHealth,
      allActivities,
      profile,
      latestSubjectiveLog
    );

    const trainingLoad = calculateTrainingLoadMetrics(filteredActivities);
    const racePredictions = predictRaceTimes(allActivities, profile);
    const vo2MaxData = calculateVo2MaxProgression(allActivities, profile);

    return NextResponse.json({
      profile,
      latestDailyHealth,
      healthHistory: filteredHealthHistory,
      allHealthHistory,
      recentActivities: filteredActivities,
      allActivities,
      latestSubjectiveLog,
      readiness,
      trainingLoad,
      racePredictions,
      vo2MaxData,
      timeframeSummary,
      goals,
      equipment,
      activePlan,
      selectedRange: range,
      totalHealthRecords: allHealthHistory.length,
      totalActivityRecords: allActivities.length,
    });
  } catch (error: any) {
    console.error('Dashboard API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
