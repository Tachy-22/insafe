import { NextResponse } from 'next/server';
import { restrictions, getRestrictionsByEmployeeId } from '@/lib/dummy-data';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const employeeId = searchParams.get('employeeId');
    const type = searchParams.get('type');
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100));

    let filteredRestrictions = restrictions;

    // Filter by employee ID
    if (employeeId) {
      filteredRestrictions = getRestrictionsByEmployeeId(employeeId);
    }

    // Filter by type
    if (type && type !== 'ALL') {
      filteredRestrictions = filteredRestrictions.filter(restriction => restriction.type === type);
    }

    // Filter by status
    if (status && status !== 'ALL') {
      filteredRestrictions = filteredRestrictions.filter(restriction => restriction.status === status);
    }

    // Search filter
    if (search) {
      const searchLower = search.toLowerCase();
      filteredRestrictions = filteredRestrictions.filter(restriction =>
        restriction.employee.firstName.toLowerCase().includes(searchLower) ||
        restriction.employee.lastName.toLowerCase().includes(searchLower) ||
        restriction.employee.employeeId.toLowerCase().includes(searchLower) ||
        restriction.service.toLowerCase().includes(searchLower) ||
        restriction.reason.toLowerCase().includes(searchLower)
      );
    }

    // Sort by applied date (newest first)
    filteredRestrictions.sort((a, b) => new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime());

    return NextResponse.json({
      success: true,
      data: filteredRestrictions,
      total: restrictions.length,
      filtered: filteredRestrictions.length,
      stats: {
        totalRestrictions: restrictions.length,
        activeRestrictions: restrictions.filter(r => r.status === 'ACTIVE').length,
        temporaryRestrictions: restrictions.filter(r => r.severity === 'TEMPORARY').length,
        permanentRestrictions: restrictions.filter(r => r.severity === 'PERMANENT').length
      }
    });
  } catch (_error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch restrictions' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { employeeId, type, service, reason, severity, expiresAt } = body;

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200));

    // In a real app, this would create a new restriction
    const newRestriction = {
      id: `restriction_${Date.now()}`,
      employeeId,
      type,
      service,
      status: 'ACTIVE',
      appliedBy: 'Security Admin', // In real app, get from auth context
      appliedAt: new Date().toISOString(),
      reason,
      severity,
      ...(expiresAt && { expiresAt })
    };

    return NextResponse.json({
      success: true,
      message: 'Restriction applied successfully',
      data: newRestriction
    });
  } catch (_error) {
    return NextResponse.json(
      { success: false, error: 'Failed to apply restriction' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, status } = body;

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200));

    const restriction = restrictions.find(r => r.id === id);
    if (!restriction) {
      return NextResponse.json(
        { success: false, error: 'Restriction not found' },
        { status: 404 }
      );
    }

    // In a real app, this would update the database
    const updatedRestriction = {
      ...restriction,
      status
    };

    return NextResponse.json({
      success: true,
      message: 'Restriction updated successfully',
      data: updatedRestriction
    });
  } catch (_error) {
    return NextResponse.json(
      { success: false, error: 'Failed to update restriction' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200));

    const restriction = restrictions.find(r => r.id === id);
    if (!restriction) {
      return NextResponse.json(
        { success: false, error: 'Restriction not found' },
        { status: 404 }
      );
    }

    // In a real app, this would delete from the database
    return NextResponse.json({
      success: true,
      message: 'Restriction removed successfully'
    });
  } catch (_error) {
    return NextResponse.json(
      { success: false, error: 'Failed to remove restriction' },
      { status: 500 }
    );
  }
}