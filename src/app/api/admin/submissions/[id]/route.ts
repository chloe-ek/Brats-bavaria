import { adminDb } from '@/lib/admin';
import { NextResponse } from 'next/server';

export async function GET(
  req: Request,
  context: { params: { id: string } }
) {
  const { id } = context.params;

  const { data, error } = await adminDb
    .from('submissions')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) {
    console.error('Fetch error:', error);
    return NextResponse.json({ error: 'Submission not found' }, { status: 404 });
  }

  return NextResponse.json({ submission: data }, { status: 200 });
}
