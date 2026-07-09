// app/api/razorpay/create-order/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { amount, currency = 'INR', receipt, notes } = await req.json();

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
    }

    const keyId     = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      console.error('[Razorpay] Missing API keys in environment');
      return NextResponse.json({ error: 'Payment gateway not configured' }, { status: 500 });
    }

    // Razorpay amount is in paise (1 INR = 100 paise)
    const amountInPaise = Math.round(amount * 100);

    const orderPayload = {
      amount:   amountInPaise,
      currency,
      receipt:  receipt || `SAT-${Date.now()}`,
      notes:    notes   || {},
    };

    const response = await fetch('https://api.razorpay.com/v1/orders', {
      method:  'POST',
      headers: {
        'Content-Type':  'application/json',
        'Authorization': `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString('base64')}`,
      },
      body: JSON.stringify(orderPayload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('[Razorpay] Order creation failed:', errorData);
      return NextResponse.json(
        { error: errorData?.error?.description || 'Failed to create order' },
        { status: response.status }
      );
    }

    const order = await response.json();

    return NextResponse.json({
      orderId:  order.id,
      amount:   order.amount,
      currency: order.currency,
      receipt:  order.receipt,
    });

  } catch (err) {
    console.error('[Razorpay] create-order error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}