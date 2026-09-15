import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { amount, method = 'UPI', accountDetails } = await req.json();
    const withdrawAmount = parseFloat(amount);

    if (isNaN(withdrawAmount) || withdrawAmount < 100) {
      return NextResponse.json({ error: 'Minimum withdrawal amount is ₹100' }, { status: 400 });
    }

    const seller = await prisma.user.findUnique({
      where: { id: user.id },
    });

    if (!seller || seller.walletBalance < withdrawAmount) {
      return NextResponse.json({ error: 'Insufficient wallet balance' }, { status: 400 });
    }

    // Deduct immediately and create withdrawal record atomically
    const [withdrawal] = await prisma.$transaction([
      prisma.withdrawal.create({
        data: {
          sellerId: seller.id,
          amount: withdrawAmount,
          method,
          accountDetails: typeof accountDetails === 'string' ? accountDetails : JSON.stringify(accountDetails),
          status: 'PENDING',
        },
      }),
      prisma.user.update({
        where: { id: seller.id },
        data: {
          walletBalance: { decrement: withdrawAmount },
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      message: 'Withdrawal request submitted successfully',
      withdrawal,
    });
  } catch (error) {
    console.error('Withdrawal error:', error);
    return NextResponse.json({ error: 'Failed to process withdrawal request' }, { status: 500 });
  }
}