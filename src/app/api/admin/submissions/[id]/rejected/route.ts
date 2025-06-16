import { adminDb } from "@/lib/admin";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    

    const { error } = await adminDb
      .from("submissions")
      .update({ status: "rejected" })
      .eq("id", id);

    if (error) {
      return NextResponse.json({ error: "Failed to reject" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
