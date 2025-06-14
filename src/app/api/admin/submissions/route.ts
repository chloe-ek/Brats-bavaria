import { adminDb } from '@/lib/admin';
import { NextResponse } from 'next/server';

export async function GET() {
  const { data, error } = await adminDb
    .from('submissions')
    .select('*')
    .order('submitted_at', { ascending: false });

  if (error) {
    console.error('Fetch error:', error);
    return NextResponse.json({ message: 'Failed to fetch submissions' }, { status: 500 });
  }

  return NextResponse.json({ submissions: data });
}