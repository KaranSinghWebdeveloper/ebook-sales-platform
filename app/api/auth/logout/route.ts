import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { TOKEN_NAME } from '@/lib/auth';

export async function POST() {
  const cookieStore = await cookies();
  cookieStore.delete(TOKEN_NAME);
  return NextResponse.json({ success: true });
}