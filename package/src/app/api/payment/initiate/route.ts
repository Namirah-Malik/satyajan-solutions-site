// src/app/api/payment/initiate/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

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
    console.error('PhonePe client init error:', e);
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

    const merchantOrderId = orderId || `SAT-${Date.now()}-${uuidv4().slice(0, 8).toUpperCase()}`;
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const redirectUrl = `${baseUrl}/payment/status?orderId=${merchantOrderId}`;

    const { StandardCheckoutPayRequest } = await import('pg-sdk-node');

    // ── Build request with Net Banking excluded ──────────────────────────────
    const requestBuilder = StandardCheckoutPayRequest.builder()
      .merchantOrderId(merchantOrderId)
      .amount(Math.round(amount * 100)) // paise
      .redirectUrl(redirectUrl);

    // Restrict to UPI + Cards only (exclude NET_BANKING)
    try {
      requestBuilder.paymentFlow({
        type: 'PG_CHECKOUT',
        config: {
          hidePaymentModes: ['NET_BANKING'],
        },
      });
    } catch {
      // Older SDK versions may not support paymentFlow — silently skip
    }

    const request = requestBuilder.build();
    const response = await client.pay(request);

    return NextResponse.json({
      success: true,
      orderId: merchantOrderId,
      redirectUrl: response.redirectUrl,
      checkoutUrl: response.redirectUrl,
    });
  } catch (error: any) {
    console.error('PhonePe initiate error:', error);
    return NextResponse.json(
      { error: error?.message || 'Payment initiation failed' },
      { status: 500 }
    );
  }
}