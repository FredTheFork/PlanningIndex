import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret');

  if (!process.env.REVALIDATE_SECRET) {
    return NextResponse.json(
      { revalidated: false, message: 'REVALIDATE_SECRET environment variable is not set' },
      { status: 500 },
    );
  }

  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json(
      { revalidated: false, message: 'Invalid revalidation secret' },
      { status: 401 },
    );
  }

  revalidatePath('/', 'layout');

  return NextResponse.json({
    revalidated: true,
    message: 'Root layout revalidated successfully',
    timestamp: new Date().toISOString(),
  });
}
