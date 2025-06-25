import { adminDb } from '@/lib/admin';
import { resend } from '@/utils/resend';
import { stripe } from '@/utils/stripe';
import { NextResponse } from 'next/server';

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  try {

    const { email, name } = await request.json();
    const { id } = await context.params;

    const { error } = await adminDb
      .from('submissions')
      .update({ status: 'approved' })
      .eq('id', id);

    if (error) {
      return NextResponse.json({ error: 'Failed to update approval status' }, { status: 500 });
    }
    
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: 'cad',
            product_data: {
              name: 'Car display ticket',
              description: 'Car display ticket for Brats and Bavaria 2025',
              images: ['https://bratsandbavaria.com/approve.png'],
            },
            unit_amount: 4200,
          },
          quantity: 1,
        },
      ],
      metadata: {
        submissionId: id, 
      },
      success_url: 'https://bratsandbavaria.com/payment-success',
      cancel_url: 'https://bratsandbavaria.com/payment-cancel',
    });
    

    await resend.emails.send({
      from: 'events@bratsandbavaria.com',
      to: email,
      subject: 'You’ve been approved!',
      html: `
        
        <p>Hi ${name},</p>
        <p>Congratulations – your car has been approved for the event!</p>
        <p>Please complete your registration by paying the event fee below:</p>
        <p><a href="${session.url}" style="color: blue;">Click here to pay $40</a></p>
        <p>Thanks,<br />Brats & Bavaria</p>
        <img src="https://bratsandbavaria.com/approve.png" alt="Approved Car" width="500" />

      `,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to process approval workflow' }, { status: 500 });
  }
}
