import { adminDb } from "@/lib/admin";
import { NextResponse } from "next/server";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  
  const { notes } = await request.json();

  const { error } = await adminDb
    .from("submissions")
    .update({ notes })
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: "Failed to update notes" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
