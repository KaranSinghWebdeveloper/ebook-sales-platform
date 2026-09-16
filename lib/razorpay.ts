import crypto from 'crypto';
import Razorpay from 'razorpay';

const key_id = process.env.RAZORPAY_KEY_ID || '';
const key_secret = process.env.RAZORPAY_KEY_SECRET || '';

let rzpInstance: Razorpay | null = null;
if (key_id && key_secret) {
  try {
    rzpInstance = new Razorpay({
      key_id,
      key_secret,
    });
  } catch {
    rzpInstance = null;
  }
}

export async function createOrder(amountInInr: number, receiptId: string) {
  const amount = Math.round(amountInInr * 100);

  if (!rzpInstance) {
    throw new Error('Razorpay is not configured properly');
  }

  const order = await rzpInstance.orders.create({
    amount,
    currency: 'INR',
    receipt: receiptId,
  });
  
  return {
    id: order.id,
    amount: order.amount,
    currency: order.currency,
    isSimulated: false,
  };
}

export function verifyPaymentSignature(
  orderId: string,
  paymentId: string,
  signature: string
): boolean {
  try {
    const text = `${orderId}|${paymentId}`;
    const expected = crypto
      .createHmac('sha256', key_secret)
      .update(text)
      .digest('hex');
    return expected === signature;
  } catch {
    return false;
  }
}

export function verifyWebhookSignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  try {
    const expected = crypto
      .createHmac('sha256', secret)
      .update(payload)
      .digest('hex');
    return expected === signature;
  } catch {
    return false;
  }
}