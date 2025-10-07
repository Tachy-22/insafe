import { NextResponse } from 'next/server';
import { employees, getEmployeeById } from '@/lib/dummy-data';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const department = searchParams.get('department');
    const riskLevel = searchParams.get('riskLevel');
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 150));

    // If specific employee requested
    if (id) {
      const employee = getEmployeeById(id);
      if (!employee) {
        return NextResponse.json(
          { success: false, error: 'Employee not found' },
          { status: 404 }
        );
      }
      return NextResponse.json({
        success: true,
        data: employee
      });
    }

    // Filter employees based on query parameters
    let filteredEmployees = employees;

    if (department && department !== 'ALL') {
      filteredEmployees = filteredEmployees.filter(emp => emp.department === department);
    }

    if (riskLevel && riskLevel !== 'ALL') {
      filteredEmployees = filteredEmployees.filter(emp => emp.riskLevel === riskLevel);
    }

    if (status && status !== 'ALL') {
      filteredEmployees = filteredEmployees.filter(emp => emp.status === status);
    }

    if (search) {
      const searchLower = search.toLowerCase();
      filteredEmployees = filteredEmployees.filter(emp =>
        emp.firstName.toLowerCase().includes(searchLower) ||
        emp.lastName.toLowerCase().includes(searchLower) ||
        emp.employeeId.toLowerCase().includes(searchLower) ||
        emp.email.toLowerCase().includes(searchLower) ||
        emp.department.toLowerCase().includes(searchLower) ||
        emp.role.toLowerCase().includes(searchLower)
      );
    }

    return NextResponse.json({
      success: true,
      data: filteredEmployees,
      total: employees.length,
      filtered: filteredEmployees.length
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch employees' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, updates } = body;

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200));

    const employee = getEmployeeById(id);
    if (!employee) {
      return NextResponse.json(
        { success: false, error: 'Employee not found' },
        { status: 404 }
      );
    }

    // In a real app, this would update the database
    // For demo purposes, we just return success
    return NextResponse.json({
      success: true,
      message: 'Employee updated successfully',
      data: { ...employee, ...updates }
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to update employee' },
      { status: 500 }
    );
  }
}