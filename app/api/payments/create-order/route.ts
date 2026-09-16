import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { createOrder } from '@/lib/razorpay';
import { getSessionUser } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const { productId, buyerEmail, buyerName } = await req.json();

    if (!productId || !buyerEmail) {
      return NextResponse.json({ error: 'Product and email are required' }, { status: 400 });
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product || product.status !== 'APPROVED') {
      return NextResponse.json({ error: 'Product is unavailable for sale' }, { status: 404 });
    }

    const sessionUser = await getSessionUser();

    // Fetch active commission split
    const commission = await prisma.commission.findFirst({
      where: { isDefault: true },
    }) || { platformPercent: 15.0, sellerPercent: 85.0 };

    const amount = product.price;
    const platformFee = Number(((amount * commission.platformPercent) / 100).toFixed(2));
    const sellerEarning = Number((amount - platformFee).toFixed(2));

    const tempReceipt = 'rec_' + Date.now().toString().slice(-8);
    const rzpOrder = await createOrder(amount, tempReceipt);

    const order = await prisma.order.create({
      data: {
        productId: product.id,
        buyerId: sessionUser?.id || null,
        buyerEmail: buyerEmail.toLowerCase().trim(),
        buyerName: (buyerName || sessionUser?.name || 'Customer').trim(),
        amount,
        platformFee,
        sellerEarning,
        razorpayOrderId: rzpOrder.id,
        status: 'PENDING',
      },
    });

    return NextResponse.json({
      success: true,
      orderId: order.id,
      razorpayOrderId: rzpOrder.id,
      amount: rzpOrder.amount, // in paise
      currency: 'INR',
      keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '',
      productTitle: product.title,
      isSimulated: false,
    });
  } catch (error) {
    console.error('Payment order creation error:', error);
    return NextResponse.json({ error: 'Failed to initiate payment' }, { status: 500 });
  }
}