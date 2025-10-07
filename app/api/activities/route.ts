import { NextResponse } from 'next/server';
import { activities, getActivitiesByEmployeeId } from '@/lib/dummy-data';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const employeeId = searchParams.get('employeeId');
    const type = searchParams.get('type');
    const status = searchParams.get('status');
    const riskLevel = searchParams.get('riskLevel');
    const search = searchParams.get('search');
    const limit = searchParams.get('limit');
    const offset = searchParams.get('offset');

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100));

    let filteredActivities = activities;

    // Filter by employee ID
    if (employeeId) {
      filteredActivities = getActivitiesByEmployeeId(employeeId);
    }

    // Filter by type
    if (type && type !== 'ALL') {
      filteredActivities = filteredActivities.filter(activity => activity.type === type);
    }

    // Filter by status
    if (status && status !== 'ALL') {
      filteredActivities = filteredActivities.filter(activity => activity.status === status);
    }

    // Filter by risk level
    if (riskLevel && riskLevel !== 'ALL') {
      if (riskLevel === 'HIGH_RISK') {
        filteredActivities = filteredActivities.filter(activity => activity.riskScore >= 7);
      } else if (riskLevel === 'MEDIUM_RISK') {
        filteredActivities = filteredActivities.filter(activity => activity.riskScore >= 4 && activity.riskScore < 7);
      } else if (riskLevel === 'LOW_RISK') {
        filteredActivities = filteredActivities.filter(activity => activity.riskScore < 4);
      }
    }

    // Search filter
    if (search) {
      const searchLower = search.toLowerCase();
      filteredActivities = filteredActivities.filter(activity =>
        activity.employee.firstName.toLowerCase().includes(searchLower) ||
        activity.employee.lastName.toLowerCase().includes(searchLower) ||
        activity.employee.employeeId.toLowerCase().includes(searchLower) ||
        activity.description.toLowerCase().includes(searchLower) ||
        activity.action.toLowerCase().includes(searchLower)
      );
    }

    // Sort by timestamp (newest first)
    filteredActivities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    // Apply pagination
    let paginatedActivities = filteredActivities;
    if (limit) {
      const limitNum = parseInt(limit);
      const offsetNum = offset ? parseInt(offset) : 0;
      paginatedActivities = filteredActivities.slice(offsetNum, offsetNum + limitNum);
    }

    return NextResponse.json({
      success: true,
      data: paginatedActivities,
      total: activities.length,
      filtered: filteredActivities.length,
      stats: {
        totalActivities: activities.length,
        blockedActions: activities.filter(a => a.status === 'BLOCKED').length,
        highRiskActivities: activities.filter(a => a.riskScore >= 7).length,
        underReview: activities.filter(a => a.status === 'UNDER_REVIEW').length
      }
    });
  } catch (_error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch activities' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200));

    // In a real app, this would create a new activity record
    const newActivity = {
      id: `activity_${Date.now()}`,
      ...body,
      timestamp: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      message: 'Activity recorded successfully',
      data: newActivity
    });
  } catch (_error) {
    return NextResponse.json(
      { success: false, error: 'Failed to record activity' },
      { status: 500 }
    );
  }
}