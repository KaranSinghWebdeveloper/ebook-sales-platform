import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';
import { hashPassword, createToken, TOKEN_NAME } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const { name, email, password, role = 'BUYER', storeName } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Name, email, and password are required' }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();
    const existing = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    if (existing) {
      return NextResponse.json({ error: 'An account with this email already exists' }, { status: 409 });
    }

    const hashedPassword = await hashPassword(password);
    const validRole = role === 'SELLER' ? 'SELLER' : 'BUYER';

    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: cleanEmail,
        password: hashedPassword,
        role: validRole,
        storeName: validRole === 'SELLER' ? (storeName || `${name.trim()}'s Store`) : null,
        isVerified: true,
      },
    });

    const token = createToken({ userId: user.id, role: user.role });
    const cookieStore = await cookies();
    cookieStore.set(TOKEN_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 72,
    });

    const redirectUrl = user.role === 'SELLER' ? '/dashboard' : '/store';

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      redirectUrl,
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Failed to create account' }, { status: 500 });
  }
}