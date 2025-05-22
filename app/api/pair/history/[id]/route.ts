import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(
  req: NextRequest,
  context: { params: { id: string } }
) {
  const params = await context.params;
  const supabase = await createClient();

  try {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: reading, error: readingError } = await supabase
      .from("pair_readings")
      .select("*")
      .eq("id", params.id)
      .eq("user_id", user.id)
      .single();

    if (readingError || !reading) {
      return NextResponse.json({ error: "Reading not found" }, { status: 404 });
    }

    return NextResponse.json({ reading });
  } catch (error) {
    console.error("Failed to fetch reading", error);
    return NextResponse.json(
      { error: "Failed to fetch reading" },
      { status: 500 }
    );
  }
}
