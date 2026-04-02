import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();

    if (!message || !message.trim()) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Option 1: Using Twilio WhatsApp API (requires TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM_PHONE)
    const useTwilio = process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN;

    if (useTwilio) {
      return await sendViaTwilio(message);
    }

    // Option 2: Using a webhook service (simpler for small projects)
    return await sendViaWebhook(message);
  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
}

async function sendViaTwilio(message: string) {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const fromPhone = process.env.TWILIO_FROM_PHONE; // e.g., 'whatsapp:+1234567890'
  const toPhone = 'whatsapp:+918019179159';

  const auth = Buffer.from(`${accountSid}:${authToken}`).toString('base64');

  try {
    const response = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          From: fromPhone || 'whatsapp:+1234567890',
          To: toPhone,
          Body: message,
        }).toString(),
      }
    );

    if (!response.ok) {
      throw new Error(`Twilio API error: ${response.statusText}`);
    }

    return NextResponse.json(
      { success: true, message: 'Message sent successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Twilio error:', error);
    throw error;
  }
}

async function sendViaWebhook(message: string) {
  // Using a simple webhook service like make.com, zapier, or custom server
  const webhookUrl = process.env.WHATSAPP_WEBHOOK_URL;

  if (!webhookUrl) {
    console.warn(
      'WhatsApp integration not configured. Please set TWILIO_ACCOUNT_SID or WHATSAPP_WEBHOOK_URL in environment variables.'
    );
    return NextResponse.json(
      {
        success: true,
        message: 'Message queued (webhook not configured)',
        warning: 'Please configure WhatsApp integration',
      },
      { status: 200 }
    );
  }

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: '+918019179159',
        message: message,
        timestamp: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      throw new Error(`Webhook error: ${response.statusText}`);
    }

    return NextResponse.json(
      { success: true, message: 'Message sent successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Webhook error:', error);
    throw error;
  }
}
