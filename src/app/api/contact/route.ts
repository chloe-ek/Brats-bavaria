import { resend } from '@/utils/resend';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { name, email, message } = await req.json();

    const { error } = await resend.emails.send({
    from: 'Brats & Bavaria <noreply@bratsandbavaria.com>',
      to: 'pbe46m3@gmail.com',
      subject: `New Message from ${name}`,
      html: `
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    });

    if (error) {
      console.error('Email send error:', error);
      return NextResponse.json({ message: 'Failed to send email' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Server error:', err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
