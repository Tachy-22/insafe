import { NextResponse } from 'next/server';
import { alerts, getCriticalAlerts, getAlertsByEmployeeId } from '@/lib/dummy-data';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const employeeId = searchParams.get('employeeId');
    const severity = searchParams.get('severity');
    const status = searchParams.get('status');
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const onlyCritical = searchParams.get('critical');

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 120));

    let filteredAlerts = alerts;

    // Get critical alerts only
    if (onlyCritical === 'true') {
      filteredAlerts = getCriticalAlerts();
    }

    // Filter by employee ID
    if (employeeId) {
      filteredAlerts = getAlertsByEmployeeId(employeeId);
    }

    // Filter by severity
    if (severity && severity !== 'ALL') {
      filteredAlerts = filteredAlerts.filter(alert => alert.severity === severity);
    }

    // Filter by status
    if (status && status !== 'ALL') {
      filteredAlerts = filteredAlerts.filter(alert => alert.status === status);
    }

    // Filter by category
    if (category && category !== 'ALL') {
      filteredAlerts = filteredAlerts.filter(alert => alert.category === category);
    }

    // Search filter
    if (search) {
      const searchLower = search.toLowerCase();
      filteredAlerts = filteredAlerts.filter(alert =>
        alert.employee.firstName.toLowerCase().includes(searchLower) ||
        alert.employee.lastName.toLowerCase().includes(searchLower) ||
        alert.employee.employeeId.toLowerCase().includes(searchLower) ||
        alert.title.toLowerCase().includes(searchLower) ||
        alert.description.toLowerCase().includes(searchLower)
      );
    }

    // Sort by severity and timestamp
    filteredAlerts.sort((a, b) => {
      const severityOrder = { 'CRITICAL': 4, 'HIGH': 3, 'MEDIUM': 2, 'LOW': 1 };
      if (a.severity !== b.severity) {
        return severityOrder[b.severity] - severityOrder[a.severity];
      }
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });

    return NextResponse.json({
      success: true,
      data: filteredAlerts,
      total: alerts.length,
      filtered: filteredAlerts.length,
      stats: {
        totalAlerts: alerts.length,
        criticalHighAlerts: alerts.filter(a => a.severity === 'CRITICAL' || a.severity === 'HIGH').length,
        openAlerts: alerts.filter(a => a.status === 'OPEN' || a.status === 'INVESTIGATING').length,
        resolvedAlerts: alerts.filter(a => a.status === 'RESOLVED').length,
        falsePositives: alerts.filter(a => a.status === 'FALSE_POSITIVE').length
      }
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch alerts' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, status, assignedTo, notes } = body;

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200));

    const alert = alerts.find(a => a.id === id);
    if (!alert) {
      return NextResponse.json(
        { success: false, error: 'Alert not found' },
        { status: 404 }
      );
    }

    // In a real app, this would update the database
    const updatedAlert = {
      ...alert,
      ...(status && { status }),
      ...(assignedTo && { assignedTo }),
      ...(notes && { notes })
    };

    return NextResponse.json({
      success: true,
      message: 'Alert updated successfully',
      data: updatedAlert
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to update alert' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200));

    // In a real app, this would create a new alert
    const newAlert = {
      id: `alert_${Date.now()}`,
      ...body,
      timestamp: new Date().toISOString(),
      status: 'OPEN'
    };

    return NextResponse.json({
      success: true,
      message: 'Alert created successfully',
      data: newAlert
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to create alert' },
      { status: 500 }
    );
  }
}