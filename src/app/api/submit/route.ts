import { adminDb } from '@/lib/admin';
import { cloudinary } from '@/lib/cloudinary';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const formData = await req.formData();

  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const phone = formData.get('phone') as string;
  const make = formData.get('make') as string;
  const model = formData.get('model') as string;
  const year = parseInt(formData.get('year') as string, 10);
  const instagram = formData.get('instagram') as string;
  const questions = formData.get('comments') as string;

  // Insert basic info into the DB first (without photo_urls)
  const { data: insertData, error: insertError } = await adminDb.from('submissions').insert([
    {
      name,
      email,
      phone,
      car_make: make,
      car_model: model,
      car_year: year,
      instagram,
      questions,
      photo_urls: [], // empty for now
    },
  ]).select('id');

  if (insertError || !insertData || !insertData[0]?.id) {
    console.error('Insert error:', insertError);
    return NextResponse.json({ message: 'Database insert failed' }, { status: 500 });
  }

  const submissionId = insertData[0].id;

  // Upload photos to Cloudinary under a folder named after submissionId
  const photoUrls: string[] = [];

  for (let i = 0; i < 5; i++) {
    const file = formData.get(`photo${i}`) as File;
    if (!file) continue;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploadedUrl = await new Promise<string>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: `brats-bavaria/${submissionId}`, 
        },
        (error, result) => {
          if (error || !result) reject(error);
          else resolve(result.secure_url);
        }
      );
      stream.end(buffer);
    });

    photoUrls.push(uploadedUrl);
  }

  // Update the submission row with the uploaded photo URLs
  const { error: updateError } = await adminDb.from('submissions')
    .update({ photo_urls: photoUrls })
    .eq('id', submissionId);

  if (updateError) {
    console.error('Update error:', updateError);
    return NextResponse.json({ message: 'Photo upload failed' }, { status: 500 });
  }

  return NextResponse.json({ success: true, submissionId });
}
