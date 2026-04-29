
import { NextRequest, NextResponse } from 'next/server';
import { notifyTeamWhatsApp } from '@/lib/notifyTeam';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    await notifyTeamWhatsApp({
      orderId:         body.orderId,
      method:          body.method   || 'cod',
      status:          body.status   || 'COD_PLACED',
      customerName:    body.customerName    || null,
      customerPhone:   body.customerPhone   || null,
      customerEmail:   body.customerEmail   || null,
      customerAddress: body.customerAddress || null,
      amount:          body.amount,
      items:           body.items    || [],
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('[Notify] Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}