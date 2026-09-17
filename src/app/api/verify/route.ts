import { NextResponse } from 'next/server';
import { runAllAutomatedTests } from '../../../lib/test-suite';

export async function GET() {
  try {
    const report = runAllAutomatedTests();
    return NextResponse.json({
      success: report.failed === 0,
      timestamp: new Date().toISOString(),
      report
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
