import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';

export async function GET() {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const seller = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        walletBalance: true,
        upiId: true,
        bankDetails: true,
      },
    });

    const orders = await prisma.order.findMany({
      where: {
        product: { sellerId: user.id },
        status: 'PAID',
      },
      include: {
        product: { select: { title: true, slug: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });

    const withdrawals = await prisma.withdrawal.findMany({
      where: { sellerId: user.id },
      orderBy: { createdAt: 'desc' },
    });

    const commission = await prisma.commission.findFirst({
      where: { isDefault: true },
    }) || { platformPercent: 15.0, sellerPercent: 85.0 };

    const totalEarned = orders.reduce((acc, curr) => acc + curr.sellerEarning, 0);

    return NextResponse.json({
      walletBalance: seller?.walletBalance || 0,
      totalEarned,
      sellerPercent: commission.sellerPercent,
      platformPercent: commission.platformPercent,
      orders,
      withdrawals,
      upiId: seller?.upiId,
      bankDetails: seller?.bankDetails ? JSON.parse(seller.bankDetails) : null,
    });
  } catch (error) {
    console.error('Fetch earnings error:', error);
    return NextResponse.json({ error: 'Failed to fetch earnings' }, { status: 500 });
  }
}