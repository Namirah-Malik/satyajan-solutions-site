

import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { notifyTeamWhatsApp } from '@/lib/notifyTeam';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      customerName,
      customerPhone,
      customerEmail,
      customerAddress,
      amount,
      items,
    } = body;

    // ── 1. Validate required fields ──────────────────────────────────────────
    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
      return NextResponse.json(
        { success: false, error: 'Missing payment verification fields' },
        { status: 400 }
      );
    }

    // ── 2. Verify Razorpay signature (HMAC-SHA256) ───────────────────────────
    // Razorpay signs: razorpay_order_id + "|" + razorpay_payment_id
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keySecret) {
      console.error('[Razorpay Verify] RAZORPAY_KEY_SECRET not set');
      return NextResponse.json(
        { success: false, error: 'Payment verification configuration error' },
        { status: 500 }
      );
    }

    const expectedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    const isValid = expectedSignature === razorpay_signature;

    if (!isValid) {
      console.error('[Razorpay Verify] Signature mismatch!', {
        expected: expectedSignature,
        received: razorpay_signature,
      });
      return NextResponse.json(
        { success: false, error: 'Payment signature verification failed' },
        { status: 400 }
      );
    }

    // ── 3. Notify team via WhatsApp ──────────────────────────────────────────
    try {
      await notifyTeamWhatsApp({
        orderId:         razorpay_order_id,
        method:          'online',
        status:          'COMPLETED',
        customerName:    customerName    || null,
        customerPhone:   customerPhone   || null,
        customerEmail:   customerEmail   || null,
        customerAddress: customerAddress || null,
        amount:          Number(amount)  || 0,
        items:           items || [],
      });
    } catch (notifyErr) {
      // Don't fail payment verification just because WhatsApp notify failed
      console.error('[Razorpay Verify] WhatsApp notify error:', notifyErr);
    }

    // ── 4. Return success ────────────────────────────────────────────────────
    return NextResponse.json({
      success:   true,
      paymentId: razorpay_payment_id,
      orderId:   razorpay_order_id,
      status:    'COMPLETED',
    });

  } catch (error: any) {
    console.error('[Razorpay Verify] Error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Verification failed' },
      { status: 500 }
    );
  }
}