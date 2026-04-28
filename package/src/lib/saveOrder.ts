// src/lib/saveOrder.ts
// Saves order to DB and sends WhatsApp notification to team

import { notifyTeamWhatsApp, type NotifyOrderPayload } from './notifyTeam';

export interface OrderPayload {
  orderId:          string;
  method:           'online' | 'cod';
  status:           'PENDING' | 'COMPLETED' | 'COD_PLACED' | 'FAILED';
  customerName?:    string;
  customerPhone?:   string;
  customerEmail?:   string;
  customerAddress?: string;
  amount:           number;
  subtotal?:        number;
  discount?:        number;
  items: {
    name:     string;
    SKU:      string;
    price:    number;
    quantity: number;
    image?:   string;
  }[];
}

export async function saveOrder(payload: OrderPayload): Promise<void> {
  try {
    // 1. Save to DB
    await fetch('/api/orders/save', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(payload),
    });

    // 2. Send WhatsApp notification for COD orders
    //    (Online orders are notified from the server-side status route)
    if (payload.method === 'cod' && payload.status === 'COD_PLACED') {
      await fetch('/api/orders/notify', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(payload),
      });
    }
  } catch (err) {
    console.error('[saveOrder] Failed:', err);
  }
}