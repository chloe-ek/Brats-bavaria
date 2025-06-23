import { adminDb } from '@/lib/admin';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Destructure the body
    const { name, email, phone, make, model, year, instagram, questions, photos } = body;

    // Insert basic info into the DB first (without photo_urls)
    const { data, error } = await adminDb.from('submissions').insert([
      {
        name,
        email,
        phone,
        car_make: make,
        car_model: model,
        car_year: year,
        instagram,
        questions,
        photo_urls: photos,
      },
    ]).select('id');

  if (error || !data || !data[0]?.id) {
    console.error('Insert error:', error);
    return NextResponse.json({ message: 'Database insert failed' }, { status: 500 });
  }

  return NextResponse.json({ success: true, submissionId: data[0].id });

} catch (err) {
    console.error('Server error:', err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
