// src/lib/notifyTeam.ts
// Resend initialized lazily inside function — prevents build-time crash

const TEAM_EMAIL = process.env.TEAM_EMAIL || 'info@satyajan.com';

function inr(n: number) {
  return '₹' + Number(n).toLocaleString('en-IN');
}

export interface NotifyOrderPayload {
  orderId:          string;
  method:           'online' | 'cod';
  status:           'COMPLETED' | 'COD_PLACED' | 'FAILED';
  customerName?:    string | null;
  customerPhone?:   string | null;
  customerEmail?:   string | null;
  customerAddress?: string | null;
  amount:           number;
  items: {
    name:     string;
    SKU?:     string;
    price:    number;
    quantity: number;
  }[];
}

export async function notifyTeamWhatsApp(order: NotifyOrderPayload): Promise<void> {
  try {
    // ✅ Lazy init — only runs at request time, not build time
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.warn('[Email Notify] RESEND_API_KEY not set — skipping email');
      return;
    }
    const { Resend } = await import('resend');
    const resend = new Resend(apiKey);

    const isOnline = order.method === 'online';

    const itemRows = order.items.map((item, i) => `
      <tr style="background:${i % 2 === 0 ? '#ffffff' : '#f9fafb'}">
        <td style="padding:10px 12px;border:1px solid #e5e7eb">${item.name}</td>
        <td style="padding:10px 12px;border:1px solid #e5e7eb;color:#6b7280">${item.SKU || '—'}</td>
        <td style="padding:10px 12px;border:1px solid #e5e7eb;text-align:center">${item.quantity}</td>
        <td style="padding:10px 12px;border:1px solid #e5e7eb;font-weight:600">${inr(item.price)}</td>
        <td style="padding:10px 12px;border:1px solid #e5e7eb;font-weight:700;color:#059669">${inr(item.price * item.quantity)}</td>
      </tr>
    `).join('');

    const headerColor  = isOnline ? '#059669' : '#2563eb';
    const headerEmoji  = isOnline ? '💰' : '📦';
    const headerText   = isOnline ? 'Payment Received' : 'New COD Order';
    const statusBadge  = isOnline
      ? '<span style="background:#d1fae5;color:#065f46;padding:4px 10px;border-radius:9999px;font-size:13px;font-weight:700">✅ PAID via PhonePe</span>'
      : '<span style="background:#dbeafe;color:#1e40af;padding:4px 10px;border-radius:9999px;font-size:13px;font-weight:700">🚚 Cash on Delivery</span>';

    const actionNote = isOnline
      ? '<div style="background:#d1fae5;border-left:4px solid #059669;padding:12px 16px;margin-top:16px;border-radius:4px"><strong style="color:#065f46">✅ Money received in PhonePe account. Arrange delivery ASAP.</strong></div>'
      : '<div style="background:#dbeafe;border-left:4px solid #2563eb;padding:12px 16px;margin-top:16px;border-radius:4px"><strong style="color:#1e40af">⚠️ Collect cash on delivery. Confirm with customer before dispatching.</strong></div>';

    await resend.emails.send({
      from:    `Satyajan Orders <orders@satyajan.com>`,
      to:      TEAM_EMAIL,
      subject: `${headerEmoji} ${headerText} — Order ${order.orderId}`,
      html: `
<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif">
  <div style="max-width:640px;margin:32px auto;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 6px rgba(0,0,0,0.07)">

    <!-- Header -->
    <div style="background:${headerColor};padding:24px 28px">
      <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:700">${headerEmoji} ${headerText}</h1>
      <p style="margin:4px 0 0;color:rgba(255,255,255,0.85);font-size:14px">Satyajan Energy Solutions</p>
    </div>

    <div style="padding:24px 28px">

      <!-- Order Info -->
      <div style="display:flex;gap:12px;margin-bottom:24px;flex-wrap:wrap">
        <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:12px 16px;flex:1;min-width:160px">
          <div style="font-size:11px;color:#6b7280;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:4px">Order ID</div>
          <div style="font-size:14px;font-weight:700;color:#111827">${order.orderId}</div>
        </div>
        <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:12px 16px;flex:1;min-width:160px">
          <div style="font-size:11px;color:#6b7280;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:4px">Payment</div>
          <div style="font-size:14px">${statusBadge}</div>
        </div>
        <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:12px 16px;flex:1;min-width:160px">
          <div style="font-size:11px;color:#6b7280;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:4px">Amount</div>
          <div style="font-size:20px;font-weight:800;color:${headerColor}">${inr(order.amount)}</div>
        </div>
      </div>

      <!-- Customer Details -->
      <h2 style="font-size:16px;font-weight:700;color:#111827;margin:0 0 12px;padding-bottom:8px;border-bottom:2px solid #e5e7eb">👤 Customer Details</h2>
      <table style="width:100%;border-collapse:collapse;margin-bottom:24px">
        <tr>
          <td style="padding:8px 12px;background:#f9fafb;font-weight:600;color:#374151;width:120px;border:1px solid #e5e7eb">Name</td>
          <td style="padding:8px 12px;border:1px solid #e5e7eb;color:#111827">${order.customerName || '—'}</td>
        </tr>
        <tr>
          <td style="padding:8px 12px;background:#f9fafb;font-weight:600;color:#374151;border:1px solid #e5e7eb">Mobile</td>
          <td style="padding:8px 12px;border:1px solid #e5e7eb">
            ${order.customerPhone
              ? `<a href="tel:${order.customerPhone}" style="color:#2563eb;font-weight:600;text-decoration:none">${order.customerPhone}</a>
                 &nbsp;|&nbsp;
                 <a href="https://wa.me/${order.customerPhone?.replace(/\D/g,'')}" style="color:#059669;font-weight:600;text-decoration:none">WhatsApp</a>`
              : '—'}
          </td>
        </tr>
        <tr>
          <td style="padding:8px 12px;background:#f9fafb;font-weight:600;color:#374151;border:1px solid #e5e7eb">Email</td>
          <td style="padding:8px 12px;border:1px solid #e5e7eb;color:#111827">${order.customerEmail || '—'}</td>
        </tr>
        <tr>
          <td style="padding:8px 12px;background:#f9fafb;font-weight:600;color:#374151;border:1px solid #e5e7eb">Address</td>
          <td style="padding:8px 12px;border:1px solid #e5e7eb;color:#111827">${order.customerAddress || '—'}</td>
        </tr>
      </table>

      <!-- Products -->
      <h2 style="font-size:16px;font-weight:700;color:#111827;margin:0 0 12px;padding-bottom:8px;border-bottom:2px solid #e5e7eb">🛒 Products Ordered</h2>
      <table style="width:100%;border-collapse:collapse;margin-bottom:24px">
        <thead>
          <tr style="background:#f3f4f6">
            <th style="padding:10px 12px;border:1px solid #e5e7eb;text-align:left;font-size:12px;text-transform:uppercase;color:#6b7280">Product</th>
            <th style="padding:10px 12px;border:1px solid #e5e7eb;text-align:left;font-size:12px;text-transform:uppercase;color:#6b7280">SKU</th>
            <th style="padding:10px 12px;border:1px solid #e5e7eb;text-align:center;font-size:12px;text-transform:uppercase;color:#6b7280">Qty</th>
            <th style="padding:10px 12px;border:1px solid #e5e7eb;text-align:left;font-size:12px;text-transform:uppercase;color:#6b7280">Unit Price</th>
            <th style="padding:10px 12px;border:1px solid #e5e7eb;text-align:left;font-size:12px;text-transform:uppercase;color:#6b7280">Total</th>
          </tr>
        </thead>
        <tbody>${itemRows}</tbody>
        <tfoot>
          <tr style="background:#f9fafb">
            <td colspan="4" style="padding:12px;border:1px solid #e5e7eb;font-weight:700;text-align:right">Grand Total</td>
            <td style="padding:12px;border:1px solid #e5e7eb;font-weight:800;font-size:16px;color:${headerColor}">${inr(order.amount)}</td>
          </tr>
        </tfoot>
      </table>

      ${actionNote}

    </div>

    <!-- Footer -->
    <div style="background:#f9fafb;padding:16px 28px;border-top:1px solid #e5e7eb;text-align:center">
      <p style="margin:0;font-size:12px;color:#9ca3af">Satyajan Energy Solutions · Auto-generated order notification</p>
    </div>

  </div>
</body>
</html>
      `,
    });

    console.log('[Email Notify] Order notification sent to', TEAM_EMAIL);

  } catch (err) {
    console.error('[Email Notify] Error (non-blocking):', err);
  }
}