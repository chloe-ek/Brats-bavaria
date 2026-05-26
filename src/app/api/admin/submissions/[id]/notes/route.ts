import { adminDb } from "@/lib/admin";
import { NextResponse } from "next/server";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const { notes } = await request.json();

  const { error } = await adminDb
    .from("reviews")
    .upsert(
      { submission_id: id, notes },
      { onConflict: 'submission_id' }
    );

  if (error) {
    return NextResponse.json({ error: "Failed to update notes" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
