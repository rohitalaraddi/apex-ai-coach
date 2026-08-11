import { NextResponse } from 'next/server';
import { seedGarminDemoData } from '@/lib/garmin/seed';

export async function POST() {
  try {
    await seedGarminDemoData();
    return NextResponse.json({ success: true, message: 'Garmin demo data successfully seeded!' });
  } catch (error: any) {
    console.error('Seed Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
