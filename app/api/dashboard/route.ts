import { NextResponse } from 'next/server';
import { dashboardMetrics } from '@/lib/dummy-data';

export async function GET() {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100));
    
    return NextResponse.json({
      success: true,
      data: dashboardMetrics
    });
  } catch (_error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch dashboard metrics' },
      { status: 500 }
    );
  }
}