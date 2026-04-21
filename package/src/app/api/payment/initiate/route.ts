// src/app/api/payment/initiate/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

// Singleton — reset if env changes between deploys
let phonePeClient: any = null;
let initializedEnv: string | undefined;

async function getPhonePeClient() {
  const currentEnv = process.env.PHONEPE_ENV;

  // Re-init if env changed (e.g. sandbox → production)
  if (phonePeClient && initializedEnv === currentEnv) return phonePeClient;

  try {
    const { StandardCheckoutClient, Env } = await import('pg-sdk-node');

    // PRODUCTION uses Env.PRODUCTION, everything else is SANDBOX
    const env = currentEnv === 'PRODUCTION' ? Env.PRODUCTION : Env.SANDBOX;

    phonePeClient = StandardCheckoutClient.getInstance(
      process.env.PHONEPE_CLIENT_ID!,
      process.env.PHONEPE_CLIENT_SECRET!,
      Number(process.env.PHONEPE_CLIENT_VERSION ?? 1),
      env
    );
    initializedEnv = currentEnv;
    console.log(`[PhonePe] Initialized in ${currentEnv} mode`);
    return phonePeClient;
  } catch (e) {
    console.error('[PhonePe] Client init error:', e);
    return null;
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { amount, customerName, customerPhone, customerEmail, orderId, items } = body;

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
    }

    const client = await getPhonePeClient();
    if (!client) {
      return NextResponse.json({ error: 'Payment service unavailable' }, { status: 503 });
    }

    const merchantOrderId =
      orderId || `SAT-${Date.now()}-${uuidv4().slice(0, 8).toUpperCase()}`;

    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL ||
      (process.env.PHONEPE_ENV === 'PRODUCTION'
        ? 'https://satyajan.com'
        : 'http://localhost:3000');

    const redirectUrl = `${baseUrl}/payment/status?orderId=${merchantOrderId}&method=online`;

    const { StandardCheckoutPayRequest } = await import('pg-sdk-node');
    const request = StandardCheckoutPayRequest.builder()
      .merchantOrderId(merchantOrderId)
      .amount(Math.round(amount * 100)) // paise
      .redirectUrl(redirectUrl)
      .build();
 
    const response = await client.pay(request);

    return NextResponse.json({
      success: true,
      orderId: merchantOrderId,
      redirectUrl: response.redirectUrl,
    });
  } catch (error: any) {
    console.error('[PhonePe] Initiate error:', error);
    return NextResponse.json(
      { error: error?.message || 'Payment initiation failed' },
      { status: 500 }
    );
  }
}