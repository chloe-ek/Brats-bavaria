import { adminDb } from "@/lib/admin";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  const { error } = await adminDb
    .from("submissions")
    .update({ status: "rejected" })
    .eq("id", id);

  if (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: "Failed to reject" }, { status: 500 });
  }

  await adminDb
    .from("reviews")
    .upsert(
      { submission_id: id, seen: true },
      { onConflict: 'submission_id' }
    );

  return NextResponse.json({ success: true });
}
