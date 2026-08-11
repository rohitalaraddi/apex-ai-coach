import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';

const execAsync = promisify(exec);

export async function POST() {
  try {
    const projectRoot = process.cwd();
    const scriptPath = path.join(projectRoot, 'scripts', 'sync_direct.py');
    const pythonBin = '/Library/Frameworks/Python.framework/Versions/3.12/bin/python3';

    console.log(`Triggering live Garmin Connect sync via script: ${scriptPath}...`);

    const { stdout, stderr } = await execAsync(`${pythonBin} ${scriptPath}`, {
      cwd: projectRoot,
      env: { ...process.env },
    });

    console.log('Live Sync stdout:', stdout);
    if (stderr) console.warn('Live Sync stderr:', stderr);

    return NextResponse.json({
      success: true,
      message: 'Real-time Garmin Connect synchronization complete!',
      output: stdout,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Live Sync Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Garmin sync failed' },
      { status: 500 }
    );
  }
}
