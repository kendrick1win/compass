import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(req: NextRequest) {
  const supabase = await createClient();

  try {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: readings, error: readingsError } = await supabase
      .from("pair_readings")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (readingsError) {
      return NextResponse.json(
        { error: "Failed to fetch readings" },
        { status: 500 }
      );
    }

    return NextResponse.json({ readings });
  } catch (error) {
    console.error("Failed to fetch pair readings", error);
    return NextResponse.json(
      { error: "Failed to fetch readings" },
      { status: 500 }
    );
  }
}
