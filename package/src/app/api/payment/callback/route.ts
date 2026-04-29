import { NextRequest, NextResponse } from 'next/server';
import { notifyTeamWhatsApp } from '@/lib/notifyTeam';

// PhonePe POSTs here when payment status changes server-side
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log('[PhonePe Callback]', JSON.stringify(body));

    const { orderId, state, amount } = body;

    if (state === 'COMPLETED') {
      // Payment confirmed server-side — notify team
      // Note: customer details aren't available here since this is server-to-server
      // We log it and rely on the client-side status page for full details
      await notifyTeamWhatsApp({
        orderId:      orderId || 'Unknown',
        method:       'online',
        status:       'COMPLETED',
        customerName: null,
        customerPhone: null,
        customerEmail: null,
        customerAddress: null,
        amount:       (amount ?? 0) / 100,
        items:        [{ name: 'Online Order (details sent separately)', SKU: '', price: (amount ?? 0) / 100, quantity: 1 }],
      });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[PhonePe Callback] Error:', err);
    return NextResponse.json({ success: false }, { status: 200 }); // Always return 200 to PhonePe
  }
}