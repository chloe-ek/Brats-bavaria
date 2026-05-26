import { adminDb } from '@/lib/admin';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const year = searchParams.get('year');

  let query = adminDb
    .from('submissions')
    .select(`
      *,
      applicant:applicants(id, name, email, phone, instagram),
      photos(id, url),
      review:reviews(id, seen, notes),
      payment:payments(id, status, paid_at)
    `)
    .order('submitted_at', { ascending: false });

  if (year) {
    query = query
      .gte('submitted_at', `${year}-01-01`)
      .lt('submitted_at', `${parseInt(year) + 1}-01-01`);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Fetch error:', error);
    return NextResponse.json({ message: 'Failed to fetch submissions' }, { status: 500 });
  }

  return NextResponse.json({ submissions: data });
}
