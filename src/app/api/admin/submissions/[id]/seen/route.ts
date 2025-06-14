import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const supabase = createRouteHandlerClient({ cookies });

  const { error } = await supabase
    .from("submissions")
    .update({ seen: true })
    .eq("id", params.id);

  if (error) {
    return NextResponse.json({ error: "Failed to update seen status" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}