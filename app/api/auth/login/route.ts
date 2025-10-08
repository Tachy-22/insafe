import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Simple demo authentication
    if (email === 'admin@wemabank.com' && password === 'admin123') {
      return NextResponse.json({
        success: true,
        message: 'Login successful',
        data: {
          user: {
            id: 'admin_001',
            email: email,
            role: 'ADMIN',
            permissions: ['READ_ALL', 'WRITE_ALL', 'MANAGE_USERS', 'MANAGE_RESTRICTIONS']
          },
          token: 'demo_jwt_token_' + Date.now(),
          expiresIn: 3600
        }
      });
    }

    return NextResponse.json(
      { 
        success: false, 
        error: 'Invalid credentials',
        message: 'Please check your email and password'
      },
      { status: 401 }
    );
  } catch {
    return NextResponse.json(
      { success: false, error: 'Authentication failed' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    success: false,
    error: 'Method not allowed'
  }, { status: 405 });
}