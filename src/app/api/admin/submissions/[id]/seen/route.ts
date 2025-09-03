import { adminDb } from "@/lib/admin";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const { error } = await adminDb
    .from("submissions")
    .update({ seen: true })
    .eq("id", id);

  if (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: "Failed to update seen status" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
