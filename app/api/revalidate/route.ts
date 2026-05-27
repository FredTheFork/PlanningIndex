import { revalidatePath } from 'next/cache';
import { NextResponse, type NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret');

  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ error: 'Invalid secret' }, { status: 401 });
  }

  revalidatePath('/', 'layout');
  return NextResponse.json({ revalidated: true, now: Date.now() });
}
