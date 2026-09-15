import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';

export async function GET() {
  const comm = await prisma.commission.findFirst({
    where: { isDefault: true },
  }) || { platformPercent: 15.0, sellerPercent: 85.0 };

  return NextResponse.json(comm);
}

export async function PATCH(req: Request) {
  try {
    const user = await getSessionUser();
    if (!user || user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Super Admin access required' }, { status: 403 });
    }

    const { platformPercent, sellerPercent } = await req.json();
    const plat = parseFloat(platformPercent);
    const sell = parseFloat(sellerPercent);

    if (isNaN(plat) || isNaN(sell) || Math.round(plat + sell) !== 100) {
      return NextResponse.json({ error: 'Percentages must sum to exactly 100%' }, { status: 400 });
    }

    const comm = await prisma.commission.findFirst({
      where: { isDefault: true },
    });

    let updated;
    if (comm) {
      updated = await prisma.commission.update({
        where: { id: comm.id },
        data: { platformPercent: plat, sellerPercent: sell },
      });
    } else {
      updated = await prisma.commission.create({
        data: { platformPercent: plat, sellerPercent: sell, isDefault: true },
      });
    }

    return NextResponse.json({ success: true, commission: updated });
  } catch (error) {
    console.error('Commission update error:', error);
    return NextResponse.json({ error: 'Failed to update commission' }, { status: 500 });
  }
}