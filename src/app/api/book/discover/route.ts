import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function GET() {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { cookies: { getAll: () => [], setAll: () => {} } }
  );

  const { data } = await supabase
    .from("businesses")
    .select("id")
    .limit(1)
    .single();

  if (data) {
    return NextResponse.json({ business_id: data.id });
  }

  return NextResponse.json({ business_id: null });
}
