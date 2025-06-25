import { adminDb } from '@/lib/admin';
import { stripe } from '@/utils/stripe';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic'; 

export const config = {
    api: {
      bodyParser: false,
    },
  };

export async function POST(req: Request) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature')!;
  const secret = process.env.STRIPE_WEBHOOK_SECRET!;

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, secret);
  } catch (err) {
    console.error('⚠️ Webhook signature failed.', err);
    return new NextResponse('Webhook Error', { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const submissionId = session.metadata?.submissionId;

    if (submissionId) {
      const { error } = await adminDb
        .from('submissions')
        .update({
          payment_status: 'paid',
          paid_at: new Date().toISOString(),
        })
        .eq('id', submissionId);

      if (error) {
        console.error('Failed to update Supabase:', error);
      } else {
        console.log('Supabase updated for submissionId:', submissionId);
      }
    }
  }

  return new NextResponse('Webhook received', { status: 200 });
}
