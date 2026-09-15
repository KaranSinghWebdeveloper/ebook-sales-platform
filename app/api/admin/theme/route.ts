import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { getTheme, saveTheme } from '@/lib/theme';

export async function GET() {
  const theme = await getTheme();
  return NextResponse.json(theme);
}

export async function PATCH(req: Request) {
  try {
    const user = await getSessionUser();
    if (!user || user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Super Admin access required' }, { status: 403 });
    }

    const body = await req.json();
    const updatedTheme = await saveTheme(body);

    return NextResponse.json({ success: true, theme: updatedTheme });
  } catch (error) {
    console.error('Theme update error:', error);
    return NextResponse.json({ error: 'Failed to update theme' }, { status: 500 });
  }
}