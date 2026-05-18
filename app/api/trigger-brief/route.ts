import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const clientId = body.clientId ?? body.userId;

    if (!clientId) {
      return NextResponse.json(
        { success: false, error: 'Missing clientId or userId' },
        { status: 400 }
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json(
        { success: false, error: 'Missing Supabase environment variables' },
        { status: 500 }
      );
    }

    const response = await fetch(`${supabaseUrl}/functions/v1/generate-brief`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${serviceRoleKey}`,
      },
      body: JSON.stringify({ user_id: clientId }),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({ error: 'Unknown error' }));
      return NextResponse.json(
        { success: false, error: data.error || `Edge function returned ${response.status}` },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export function GET() {
  return NextResponse.json(
    { success: false, error: 'Method not allowed' },
    { status: 405 }
  );
}

export function PUT() {
  return NextResponse.json(
    { success: false, error: 'Method not allowed' },
    { status: 405 }
  );
}

export function DELETE() {
  return NextResponse.json(
    { success: false, error: 'Method not allowed' },
    { status: 405 }
  );
}
