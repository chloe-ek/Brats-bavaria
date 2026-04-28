import { adminDb } from '@/lib/admin';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const { data, error } = await adminDb
      .from('submissions')
      .select(`
        *,
        applicant:applicants(id, name, email, phone, instagram),
        photos(id, url),
        review:reviews(id, seen, notes),
        payment:payments(id, status, paid_at)
      `)
      .eq('id', id)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: 'Submission not found' }, { status: 404 });
    }

    return NextResponse.json({ submission: data }, { status: 200 });
  } catch (err) {
    console.error('Error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
