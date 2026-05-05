import { adminDb } from '@/lib/admin';
import { resend } from '@/utils/resend';
import { stripe } from '@/utils/stripe';
import { NextResponse } from 'next/server';

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { email, name } = await request.json();
    const { id } = await context.params;

    // Update submission status
    const { error } = await adminDb
      .from('submissions')
      .update({ status: 'approved' })
      .eq('id', id);

    if (error) {
      return NextResponse.json({ error: 'Failed to update approval status' }, { status: 500 });
    }

    // Mark review as seen
    await adminDb
      .from('reviews')
      .upsert(
        { submission_id: id, seen: true },
        { onConflict: 'submission_id' }
      );

    // Create Stripe customer
    const customer = await stripe.customers.create({
      email,
      name,
      metadata: { submissionId: id },
    });

    const product = await stripe.products.create({
      name: 'Car Display Ticket',
      description: 'Brats and Bavaria 2026',
      images: ['https://bratsandbavaria.com/approve.png'],
    });

    const price = await stripe.prices.create({
      product: product.id,
      unit_amount: 4200,
      currency: 'cad',
    });

    const paymentLink = await stripe.paymentLinks.create({
      line_items: [{ price: price.id, quantity: 1 }],
      metadata: {
        submissionId: id,
        customerId: customer.id,
        userEmail: email,
        userName: name,
      },
      after_completion: {
        type: 'redirect',
        redirect: { url: 'https://bratsandbavaria.com/payment-success' },
      },
    });

    // Insert payment record
    await adminDb.from('payments').insert({
      submission_id: id,
      status: 'unpaid',
      amount: 4200,
    });

    await resend.emails.send({
      from: 'Brats & Bavaria <events@bratsandbavaria.com>',
      to: email,
      subject: "You've been approved!",
      html: `<p>Hi ${name},</p>
              <p>Congratulations – your car has been approved for the event!</p>
              <p>Please complete your registration by paying the event fee below:</p>
              <p><a href="${paymentLink.url}" style="background:#007cba;color:white;padding:10px 20px;text-decoration:none;border-radius:5px;display:inline-block">Click here to pay $42 CAD</a></p>
              <p>Thanks,<br/>Brats & Bavaria</p>
              <img src="https://bratsandbavaria.com/approve.png" alt="Approved Car" style="max-width:100%;height:auto"/>`,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to process approval workflow' }, { status: 500 });
  }
}
