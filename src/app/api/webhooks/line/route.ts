import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import crypto from "crypto";

function getAdmin() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { cookies: { getAll: () => [], setAll: () => {} } }
  );
}

function verifySignature(body: string, signature: string, secret: string): boolean {
  const hash = crypto.createHmac("SHA256", secret).update(body).digest("base64");
  return hash === signature;
}

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("x-line-signature") || "";

  // We need to find the business by checking all notification_settings
  // LINE sends events to a single webhook URL, so we verify per-business
  const admin = getAdmin();

  const { data: allSettings } = await admin
    .from("notification_settings")
    .select("business_id, line_channel_secret")
    .eq("line_enabled", true)
    .not("line_channel_secret", "is", null);

  // Find which business this webhook belongs to by verifying signature
  const matchedSetting = allSettings?.find((s) =>
    s.line_channel_secret && verifySignature(body, signature, s.line_channel_secret)
  );

  if (!matchedSetting) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const businessId = matchedSetting.business_id;
  const events = JSON.parse(body).events || [];

  for (const event of events) {
    if (event.type === "follow") {
      // User added the LINE Official Account as friend
      // Store the LINE userId — it can be linked to a client later
      const lineUserId = event.source?.userId;
      if (lineUserId) {
        // Check if any client already has this LINE preference
        const { data: existing } = await admin
          .from("notification_preferences")
          .select("id")
          .eq("business_id", businessId)
          .eq("channel", "line")
          .eq("identifier", lineUserId)
          .limit(1);

        if (!existing || existing.length === 0) {
          // Store as unlinked LINE follower — will be matched when client books
          // For now, log it. The linking happens when a client provides their LINE
          // via the booking form or dashboard.
          console.log(`[LINE] New follower: ${lineUserId} for business ${businessId}`);
        }
      }
    } else if (event.type === "unfollow") {
      // User unfriended — opt them out
      const lineUserId = event.source?.userId;
      if (lineUserId) {
        await admin
          .from("notification_preferences")
          .update({ opted_in: false })
          .eq("business_id", businessId)
          .eq("channel", "line")
          .eq("identifier", lineUserId);
      }
    }
  }

  return NextResponse.json({ success: true });
}
