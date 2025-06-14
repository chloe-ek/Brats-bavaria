import { adminDb } from "@/lib/admin";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { notes } = await req.json();

  const { error } = await adminDb
    .from("submissions")
    .update({ notes })
    .eq("id", params.id);

  if (error) {
    return NextResponse.json({ error: "Failed to reject" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
