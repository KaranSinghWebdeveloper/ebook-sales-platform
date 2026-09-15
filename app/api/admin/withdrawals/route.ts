import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';

export async function GET() {
  try {
    const user = await getSessionUser();
    if (!user || user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const withdrawals = await prisma.withdrawal.findMany({
      include: {
        seller: {
          select: { id: true, name: true, email: true, storeName: true, walletBalance: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ withdrawals });
  } catch (error) {
    console.error('Admin withdrawals fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch withdrawals' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const user = await getSessionUser();
    if (!user || user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { id, status, adminNote } = await req.json();

    const withdrawal = await prisma.withdrawal.findUnique({
      where: { id },
    });

    if (!withdrawal) {
      return NextResponse.json({ error: 'Withdrawal not found' }, { status: 404 });
    }

    // If rejecting, refund the seller's wallet balance
    if (status === 'REJECTED' && withdrawal.status === 'PENDING') {
      await prisma.$transaction([
        prisma.withdrawal.update({
          where: { id },
          data: { status: 'REJECTED', adminNote: adminNote || 'Rejected by administrator', processedAt: new Date() },
        }),
        prisma.user.update({
          where: { id: withdrawal.sellerId },
          data: { walletBalance: { increment: withdrawal.amount } },
        }),
      ]);
    } else {
      await prisma.withdrawal.update({
        where: { id },
        data: { status: status || 'COMPLETED', adminNote, processedAt: new Date() },
      });
    }

    return NextResponse.json({ success: true, message: `Withdrawal status updated to ${status}` });
  } catch (error) {
    console.error('Update withdrawal error:', error);
    return NextResponse.json({ error: 'Failed to update withdrawal' }, { status: 500 });
  }
}