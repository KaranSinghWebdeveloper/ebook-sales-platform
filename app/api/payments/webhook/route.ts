import { NextResponse } from 'next/server';
import crypto from 'crypto';
import prisma from '@/lib/prisma';
import { verifyWebhookSignature } from '@/lib/razorpay';

export async function POST(req: Request) {
  try {
    const signature = req.headers.get('x-razorpay-signature');
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET || '';

    if (!signature || !secret) {
      return NextResponse.json({ error: 'Missing signature or webhook secret' }, { status: 400 });
    }

    const payload = await req.text();
    const isValid = verifyWebhookSignature(payload, signature, secret);

    if (!isValid) {
      return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 400 });
    }

    const event = JSON.parse(payload);

    // We only care about successful payment capture
    if (event.event === 'payment.captured') {
      const payment = event.payload.payment.entity;
      const razorpayOrderId = payment.order_id;
      const razorpayPaymentId = payment.id;

      const order = await prisma.order.findUnique({
        where: { razorpayOrderId },
        include: { product: true },
      });

      if (order && order.status === 'PENDING') {
        const tokenString = 'dtk_' + crypto.randomBytes(24).toString('hex');
        const expiresAt = new Date(Date.now() + 72 * 60 * 60 * 1000);

        await prisma.$transaction([
          prisma.order.update({
            where: { id: order.id },
            data: {
              status: 'PAID',
              razorpayPaymentId: razorpayPaymentId,
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
              maxDownloads: 1,
            },
          }),
        ]);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
