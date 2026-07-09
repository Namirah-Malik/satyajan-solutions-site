

import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { notifyTeamWhatsApp } from '@/lib/notifyTeam';

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get('x-razorpay-signature') || '';

    // ── 1. Verify webhook signature ──────────────────────────────────────────
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    if (webhookSecret) {
      const expectedSig = crypto
        .createHmac('sha256', webhookSecret)
        .update(rawBody)
        .digest('hex');

      if (expectedSig !== signature) {
        console.error('[Razorpay Webhook] Invalid signature');
        return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
      }
    } else {
      console.warn('[Razorpay Webhook] RAZORPAY_WEBHOOK_SECRET not set — skipping signature check');
    }

    const event = JSON.parse(rawBody);
    const eventType = event?.event;

    console.log('[Razorpay Webhook] Event:', eventType);

    // ── 2. Handle events ─────────────────────────────────────────────────────
    if (eventType === 'payment.captured' || eventType === 'order.paid') {
      const payment = event?.payload?.payment?.entity;
      const orderId = payment?.order_id || event?.payload?.order?.entity?.id || 'Unknown';
      const amount  = (payment?.amount || 0) / 100; // paise → ₹

      // Extract notes saved during order creation
      const notes = payment?.notes || {};

      try {
        await notifyTeamWhatsApp({
          orderId,
          method:          'online',
          status:          'COMPLETED',
          customerName:    notes.customerName    || null,
          customerPhone:   notes.customerPhone   || null,
          customerEmail:   notes.customerEmail   || null,
          customerAddress: notes.customerAddress || null,
          amount,
          items: notes.items ? JSON.parse(notes.items) : [
            { name: 'Online Payment (Razorpay)', SKU: '', price: amount, quantity: 1 }
          ],
        });
      } catch (notifyErr) {
        console.error('[Razorpay Webhook] WhatsApp notify error:', notifyErr);
      }
    }

    if (eventType === 'payment.failed') {
      const payment = event?.payload?.payment?.entity;
      console.error('[Razorpay Webhook] Payment failed:', {
        id:          payment?.id,
        order_id:    payment?.order_id,
        error_code:  payment?.error_code,
        description: payment?.error_description,
      });
    }

    // Always return 200 to Razorpay so they don't retry
    return NextResponse.json({ success: true });

  } catch (err) {
    console.error('[Razorpay Webhook] Error:', err);
    return NextResponse.json({ success: false }, { status: 200 }); // 200 so Razorpay doesn't retry
  }
}