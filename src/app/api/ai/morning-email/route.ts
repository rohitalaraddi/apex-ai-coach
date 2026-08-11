import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { calculateReadiness, calculateTrainingLoadMetrics, predictRaceTimes } from '@/lib/analytics/engine';

export async function GET() {
  try {
    const profile = (await db.athleteProfile.findFirst()) || {
      name: 'Rohit',
      hrvBaseline: 68,
      restingHrBaseline: 54,
      sleepBaselineHours: 7.5,
    };
    const latestHealth = await db.dailyHealth.findFirst({ orderBy: { date: 'desc' } });
    const recentActivities = await db.activity.findMany({ orderBy: { date: 'desc' }, take: 15 });
    const latestLog = await db.subjectiveLog.findFirst({ orderBy: { date: 'desc' } });

    const readiness = calculateReadiness(latestHealth, recentActivities, profile as any, latestLog);
    const load = calculateTrainingLoadMetrics(recentActivities);
    const predictions = predictRaceTimes(recentActivities, profile as any);
    const marathonPred = predictions.find((p) => p.distance === 'Marathon');

    const yesterdayActivity = recentActivities[0];

    const sleepHours = latestHealth ? (latestHealth.sleepDurationSeconds / 3600).toFixed(1) : '7.5';
    const hrvDiff = latestHealth ? Math.round(latestHealth.hrvNightlyAvg - profile.hrvBaseline) : 0;
    const rhrDiff = latestHealth ? latestHealth.restingHr - profile.restingHrBaseline : 0;

    const emailSubject = `☀️ Morning Readiness (${readiness.score}/100) — Apex AI Coach`;

    const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #0f172a; color: #f8fafc; margin: 0; padding: 24px; }
          .container { max-width: 600px; margin: 0 auto; background: #1e293b; border-radius: 12px; border: 1px solid #334155; padding: 28px; }
          .header { text-align: center; border-bottom: 1px solid #334155; padding-bottom: 20px; }
          .badge { display: inline-block; padding: 6px 14px; border-radius: 20px; font-weight: bold; font-size: 14px; }
          .optimal { background: #059669; color: #ffffff; }
          .good { background: #0284c7; color: #ffffff; }
          .moderate { background: #d97706; color: #ffffff; }
          .low { background: #dc2626; color: #ffffff; }
          .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin: 20px 0; }
          .card { background: #0f172a; padding: 14px; border-radius: 8px; border: 1px solid #334155; }
          .card-title { font-size: 12px; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px; }
          .card-val { font-size: 20px; font-weight: bold; margin-top: 4px; color: #38bdf8; }
          .directive { background: rgba(56, 189, 248, 0.1); border-left: 4px solid #38bdf8; padding: 14px; border-radius: 4px; margin: 20px 0; }
          .footer { font-size: 12px; color: #64748b; text-align: center; margin-top: 24px; border-top: 1px solid #334155; padding-top: 16px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2 style="margin: 0; color: #f8fafc;">Good Morning, ${profile.name}! 👋</h2>
            <p style="color: #94a3b8; font-size: 14px; margin-top: 6px;">Daily Readiness & Coaching Report • 6:00 AM</p>
            <div style="margin-top: 14px;">
              <span class="badge ${readiness.status.toLowerCase()}">Readiness Score: ${readiness.score}/100 (${readiness.status})</span>
            </div>
          </div>

          <div class="directive">
            <h4 style="margin: 0 0 6px 0; color: #38bdf8;">⚡ AI Coach Recommendation</h4>
            <p style="margin: 0; font-size: 14px; line-height: 1.5; color: #e2e8f0;">${readiness.recommendation}</p>
          </div>

          <h4 style="color: #cbd5e1; margin-bottom: 10px;">📊 Today's Metrics vs Your Baseline</h4>
          <div class="grid">
            <div class="card">
              <div class="card-title">Sleep Total</div>
              <div class="card-val">${sleepHours}h</div>
              <small style="color: ${Number(sleepHours) >= profile.sleepBaselineHours ? '#10b981' : '#f59e0b'};">
                Score: ${latestHealth?.sleepScore || 80}/100
              </small>
            </div>
            <div class="card">
              <div class="card-title">Nightly HRV</div>
              <div class="card-val">${latestHealth?.hrvNightlyAvg || 68} ms</div>
              <small style="color: ${hrvDiff >= 0 ? '#10b981' : '#ef4444'};">
                ${hrvDiff >= 0 ? '+' : ''}${hrvDiff} ms vs Baseline
              </small>
            </div>
            <div class="card">
              <div class="card-title">Resting HR</div>
              <div class="card-val">${latestHealth?.restingHr || 54} bpm</div>
              <small style="color: ${rhrDiff <= 0 ? '#10b981' : '#f59e0b'};">
                ${rhrDiff >= 0 ? '+' : ''}${rhrDiff} bpm vs Baseline
              </small>
            </div>
            <div class="card">
              <div class="card-title">Body Battery</div>
              <div class="card-val">${latestHealth?.bodyBatteryStart || 85}/100</div>
              <small style="color: #38bdf8;">Peak morning level</small>
            </div>
          </div>

          ${
            yesterdayActivity
              ? `
          <div style="background: #0f172a; padding: 14px; border-radius: 8px; border: 1px solid #334155; margin-bottom: 20px;">
            <h5 style="margin: 0 0 6px 0; color: #94a3b8; text-transform: uppercase; font-size: 11px;">Yesterday's Workout Summary</h5>
            <div style="font-weight: bold; font-size: 16px; color: #f8fafc;">${yesterdayActivity.title}</div>
            <div style="font-size: 13px; color: #cbd5e1; margin-top: 4px;">
              ${(yesterdayActivity.distance / 1000).toFixed(1)} km • Avg HR ${yesterdayActivity.avgHr} bpm • Load ${yesterdayActivity.trainingLoad}
            </div>
          </div>
          `
              : ''
          }

          <div style="background: #0f172a; padding: 14px; border-radius: 8px; border: 1px solid #334155;">
            <h5 style="margin: 0 0 6px 0; color: #94a3b8; text-transform: uppercase; font-size: 11px;">🎯 Goal Capability Progress</h5>
            <div style="font-size: 14px; color: #f8fafc; font-weight: bold;">Sub-4:00 Marathon Target</div>
            <div style="font-size: 13px; color: #10b981; margin-top: 2px;">
              Current Estimated Capability: <strong>${marathonPred?.likely || '4:04:30'}</strong> (Trend: Improving)
            </div>
          </div>

          <div class="footer">
            Apex AI Coach • Train smarter. Recover better. Perform at your best.
          </div>
        </div>
      </body>
    </html>
    `;

    return NextResponse.json({
      success: true,
      emailSubject,
      htmlContent,
      readinessScore: readiness.score,
      status: readiness.status,
    });
  } catch (error: any) {
    console.error('Morning Email Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
