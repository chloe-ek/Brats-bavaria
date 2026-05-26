import { adminDb } from '@/lib/admin';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, phone, make, model, year, instagram, questions, photos } = body;

    // Upsert applicant by email (updates name/phone/instagram if they reapply)
    const { data: applicantData, error: applicantError } = await adminDb
      .from('applicants')
      .upsert({ name, email, phone, instagram }, { onConflict: 'email' })
      .select('id')
      .single();

    if (applicantError || !applicantData) {
      console.error('Applicant upsert error:', applicantError);
      return NextResponse.json({ message: 'Failed to save applicant' }, { status: 500 });
    }

    // Insert submission
    const { data: submissionData, error: submissionError } = await adminDb
      .from('submissions')
      .insert({
        applicant_id: applicantData.id,
        car_make: make,
        car_model: model,
        car_year: year,
        questions,
      })
      .select('id')
      .single();

    if (submissionError || !submissionData) {
      console.error('Submission insert error:', submissionError);
      return NextResponse.json({ message: 'Database insert failed' }, { status: 500 });
    }

    // Insert photos
    if (photos && photos.length > 0) {
      const photoRows = (photos as string[]).map((url) => ({
        submission_id: submissionData.id,
        url,
      }));

      const { error: photosError } = await adminDb.from('photos').insert(photoRows);
      if (photosError) {
        console.error('Photos insert error:', photosError);
      }
    }

    return NextResponse.json({ success: true, submissionId: submissionData.id });
  } catch (err) {
    console.error('Server error:', err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
