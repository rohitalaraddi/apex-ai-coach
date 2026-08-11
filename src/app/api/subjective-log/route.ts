import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const date = body.date ? new Date(body.date) : new Date();

    const log = await db.subjectiveLog.upsert({
      where: { date },
      update: {
        overallFeeling: body.overallFeeling || 4,
        perceivedFatigue: body.perceivedFatigue || 3,
        stressLevel: body.stressLevel || 3,
        quadsSoreness: body.quadsSoreness || 0,
        calvesSoreness: body.calvesSoreness || 0,
        hamstringsSoreness: body.hamstringsSoreness || 0,
        glutesSoreness: body.glutesSoreness || 0,
        hipsSoreness: body.hipsSoreness || 0,
        kneesSoreness: body.kneesSoreness || 0,
        shinsSoreness: body.shinsSoreness || 0,
        anklesSoreness: body.anklesSoreness || 0,
        feetSoreness: body.feetSoreness || 0,
        painLocation: body.painLocation || null,
        painSeverity: body.painSeverity || 0,
        painDescription: body.painDescription || null,
        notes: body.notes || null,
      },
      create: {
        date,
        overallFeeling: body.overallFeeling || 4,
        perceivedFatigue: body.perceivedFatigue || 3,
        stressLevel: body.stressLevel || 3,
        quadsSoreness: body.quadsSoreness || 0,
        calvesSoreness: body.calvesSoreness || 0,
        hamstringsSoreness: body.hamstringsSoreness || 0,
        glutesSoreness: body.glutesSoreness || 0,
        hipsSoreness: body.hipsSoreness || 0,
        kneesSoreness: body.kneesSoreness || 0,
        shinsSoreness: body.shinsSoreness || 0,
        anklesSoreness: body.anklesSoreness || 0,
        feetSoreness: body.feetSoreness || 0,
        painLocation: body.painLocation || null,
        painSeverity: body.painSeverity || 0,
        painDescription: body.painDescription || null,
        notes: body.notes || null,
      },
    });

    return NextResponse.json({ success: true, log });
  } catch (error: any) {
    console.error('Subjective Log Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
