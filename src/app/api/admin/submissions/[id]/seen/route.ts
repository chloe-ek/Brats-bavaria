import { adminDb } from "@/lib/admin";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  const { error } = await adminDb
    .from("reviews")
    .upsert(
      { submission_id: id, seen: true },
      { onConflict: 'submission_id' }
    );

  if (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: "Failed to update seen status" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
