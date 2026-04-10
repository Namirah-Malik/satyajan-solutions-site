// src/app/api/payment/status/route.ts
import { NextRequest, NextResponse } from 'next/server';

let phonePeClient: any = null;

async function getPhonePeClient() {
  if (phonePeClient) return phonePeClient;
  try {
    const { StandardCheckoutClient, Env } = await import('pg-sdk-node');
    const env =
      process.env.PHONEPE_ENV === 'PRODUCTION' ? Env.PRODUCTION : Env.SANDBOX;
    phonePeClient = StandardCheckoutClient.getInstance(
      process.env.PHONEPE_CLIENT_ID!,
      process.env.PHONEPE_CLIENT_SECRET!,
      Number(process.env.PHONEPE_CLIENT_VERSION ?? 1),
      env
    );
    return phonePeClient;
  } catch (e) {
    return null;
  }
}

export async function GET(req: NextRequest) {
  const orderId = req.nextUrl.searchParams.get('orderId');
  if (!orderId) {
    return NextResponse.json({ error: 'orderId required' }, { status: 400 });
  }

  try {
    const client = await getPhonePeClient();
    if (!client) {
      return NextResponse.json({ error: 'Payment service unavailable' }, { status: 503 });
    }

    const status = await client.getOrderStatus(orderId);

    return NextResponse.json({
      success: true,
      orderId,
      state: status.state,           // COMPLETED | PENDING | FAILED
      amount: status.amount / 100,   // convert paise → ₹
      paymentDetails: status.paymentDetails ?? [],
    });
  } catch (error: any) {
    console.error('PhonePe status error:', error);
    return NextResponse.json(
      { error: error?.message || 'Status check failed', state: 'FAILED' },
      { status: 500 }
    );
  }
}