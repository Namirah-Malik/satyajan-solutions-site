// src/app/api/payment/status/route.ts
import { NextRequest, NextResponse } from 'next/server';

let phonePeClient: any = null;
let initializedEnv: string | undefined;

async function getPhonePeClient() {
  const currentEnv = process.env.PHONEPE_ENV;
  if (phonePeClient && initializedEnv === currentEnv) return phonePeClient;

  try {
    const { StandardCheckoutClient, Env } = await import('pg-sdk-node');
    const env = currentEnv === 'PRODUCTION' ? Env.PRODUCTION : Env.SANDBOX;

    phonePeClient = StandardCheckoutClient.getInstance(
      process.env.PHONEPE_CLIENT_ID!,
      process.env.PHONEPE_CLIENT_SECRET!,
      Number(process.env.PHONEPE_CLIENT_VERSION ?? 1),
      env
    );
    initializedEnv = currentEnv;
    return phonePeClient;
  } catch (e) {
    console.error('[PhonePe] Status client init error:', e);
    return null;
  }
}

export async function GET(req: NextRequest) {
  const orderId = req.nextUrl.searchParams.get('orderId');

  if (!orderId) {
    return NextResponse.json({ error: 'orderId is required' }, { status: 400 });
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
      state:          status.state,            // COMPLETED | PENDING | FAILED
      amount:         (status.amount ?? 0) / 100, // paise → ₹
      paymentDetails: status.paymentDetails ?? [],
    });
  } catch (error: any) {
    console.error('[PhonePe] Status check error:', error);
    return NextResponse.json(
      { error: error?.message || 'Status check failed', state: 'FAILED' },
      { status: 500 }
    );
  }
}