import { NextResponse } from 'next/server';
import crypto from 'crypto';
import prisma from '@/lib/prisma';
import { verifyPaymentSignature } from '@/lib/razorpay';

export async function POST(req: Request) {
  try {
    const { orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = await req.json();

    if (!orderId || !razorpayOrderId) {
      return NextResponse.json({ error: 'Order details missing' }, { status: 400 });
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { product: true },
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    if (order.status === 'PAID') {
      const existingToken = await prisma.downloadToken.findUnique({
        where: { orderId: order.id },
      });
      return NextResponse.json({
        success: true,
        message: 'Order already fulfilled',
        downloadToken: existingToken?.token,
      });
    }

    const isValid = verifyPaymentSignature(
      razorpayOrderId,
      razorpayPaymentId || 'pay_simulated',
      razorpaySignature || 'sig_simulated'
    );

    if (!isValid) {
      await prisma.order.update({
        where: { id: order.id },
        data: { status: 'FAILED' },
      });
      return NextResponse.json({ error: 'Payment signature verification failed' }, { status: 400 });
    }

    // Generate secure 72-hour download token
    const tokenString = 'dtk_' + crypto.randomBytes(24).toString('hex');
    const expiresAt = new Date(Date.now() + 72 * 60 * 60 * 1000);

    // Atomically execute seller wallet credit, sales count, order status, and token creation
    const [, , , downloadTokenRecord] = await prisma.$transaction([
      prisma.order.update({
        where: { id: order.id },
        data: {
          status: 'PAID',
          razorpayPaymentId: razorpayPaymentId || 'pay_simulated_' + Date.now(),
        },
      }),
      prisma.user.update({
        where: { id: order.product.sellerId },
        data: {
          walletBalance: { increment: order.sellerEarning },
        },
      }),
      prisma.product.update({
        where: { id: order.productId },
        data: {
          totalSales: { increment: 1 },
          totalRevenue: { increment: order.amount },
        },
      }),
      prisma.downloadToken.create({
        data: {
          token: tokenString,
          orderId: order.id,
          productId: order.productId,
          expiresAt,
          maxDownloads: 5,
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      message: 'Payment confirmed and digital product unlocked',
      downloadToken: downloadTokenRecord.token,
      sellerEarning: order.sellerEarning,
      platformFee: order.platformFee,
    });
  } catch (error) {
    console.error('Payment verification error:', error);
    return NextResponse.json({ error: 'Failed to verify payment transaction' }, { status: 500 });
  }
}