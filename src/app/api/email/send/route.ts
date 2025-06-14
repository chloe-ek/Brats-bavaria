import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const { email, name } = await req.json();

  try {
    await resend.emails.send({
      from: 'onboarding@resend.dev', // TODO : Add verified domain and change this
      to: email,
      subject: 'You’ve been approved!',
      html: `
        <p>Hi ${name},</p>
        <p>Congratulations – your car has been approved for the event!</p>
        <p>We’ll contact you with more details soon. </p>
        <p>Thanks!</p>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Email send failed:', err);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}
