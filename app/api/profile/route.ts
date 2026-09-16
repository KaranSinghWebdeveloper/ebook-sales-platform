import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';

export async function PATCH(req: Request) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { name, storeName, bio, avatar, bankDetails, upiId } = body;

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        name: name !== undefined ? name : undefined,
        storeName: storeName !== undefined ? storeName : undefined,
        bio: bio !== undefined ? bio : undefined,
        avatar: avatar !== undefined ? avatar : undefined,
        bankDetails: bankDetails !== undefined ? bankDetails : undefined,
        upiId: upiId !== undefined ? upiId : undefined,
      },
    });

    return NextResponse.json({
      success: true,
      user: {
        name: updatedUser.name,
        storeName: updatedUser.storeName,
        bio: updatedUser.bio,
        avatar: updatedUser.avatar,
        bankDetails: updatedUser.bankDetails,
        upiId: updatedUser.upiId,
      }
    });
  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}
