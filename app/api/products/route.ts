import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q') || '';
    const category = searchParams.get('category') || '';
    const sort = searchParams.get('sort') || 'popular';

    const where: any = {
      status: 'APPROVED',
    };

    if (query) {
      where.OR = [
        { title: { contains: query } },
        { shortDesc: { contains: query } },
        { description: { contains: query } },
        { tags: { contains: query } },
      ];
    }

    if (category && category !== 'All') {
      where.category = category;
    }

    let orderBy: any = { totalSales: 'desc' };
    if (sort === 'newest') orderBy = { createdAt: 'desc' };
    else if (sort === 'price-low') orderBy = { price: 'asc' };
    else if (sort === 'price-high') orderBy = { price: 'desc' };

    const products = await prisma.product.findMany({
      where,
      orderBy,
      include: {
        seller: {
          select: { name: true, storeName: true, avatar: true },
        },
      },
    });

    return NextResponse.json({ products });
  } catch (error) {
    console.error('Fetch public products error:', error);
    return NextResponse.json({ error: 'Failed to fetch catalog' }, { status: 500 });
  }
}