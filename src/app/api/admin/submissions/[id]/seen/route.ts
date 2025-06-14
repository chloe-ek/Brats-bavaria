import { adminDb } from "@/lib/admin";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { error } = await adminDb
    .from("submissions")
    .update({ seen: true })
    .eq("id", params.id);

  if (error) {
    return NextResponse.json({ error: "Failed to update seen status" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
