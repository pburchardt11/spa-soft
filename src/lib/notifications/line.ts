import type { NotificationEvent } from "@/lib/types";

type BookingDetails = {
  clientName: string;
  serviceName: string;
  staffName: string;
  date: string;
  time: string;
  businessName: string;
  reviewLink?: string;
};

const templates: Record<NotificationEvent, (d: BookingDetails) => string> = {
  booking_confirmed: (d) =>
    `✅ Booking Confirmed\n\nHi ${d.clientName}, your appointment at ${d.businessName} is confirmed!\n\n📋 ${d.serviceName}\n📅 ${d.date} at ${d.time}\n💆 ${d.staffName}\n\nSee you soon!`,
  booking_reminder: (d) =>
    `⏰ Appointment Reminder\n\nHi ${d.clientName}, your appointment is coming up!\n\n📋 ${d.serviceName}\n📅 ${d.date} at ${d.time}\n💆 ${d.staffName}\n\n— ${d.businessName}`,
  booking_cancelled: (d) =>
    `❌ Booking Cancelled\n\nHi ${d.clientName}, your appointment at ${d.businessName} has been cancelled.\n\n📋 ${d.serviceName}\n📅 ${d.date} at ${d.time}\n\nPlease contact us to rebook.`,
  booking_completed: (d) =>
    `🙏 Thank you, ${d.clientName}!\n\nWe hope you enjoyed your ${d.serviceName} at ${d.businessName}. We'd love to see you again!\n\n— ${d.businessName}`,
  welcome: (d) =>
    `🎉 Welcome to ${d.businessName}!\n\nHi ${d.clientName}, thank you for joining us. Book your next appointment anytime!`,
  review_request: (d) =>
    `⭐ How was your visit, ${d.clientName}?\n\nThank you for choosing ${d.businessName}. We'd love your feedback!\n\nLeave a quick review here:\n${d.reviewLink || ""}`,
};

export async function sendLineMessage(
  lineUserId: string,
  channelAccessToken: string,
  event: NotificationEvent,
  details: BookingDetails
): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch("https://api.line.me/v2/bot/message/push", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${channelAccessToken}`,
      },
      body: JSON.stringify({
        to: lineUserId,
        messages: [{ type: "text", text: templates[event](details) }],
      }),
    });

    if (!response.ok) {
      const body = await response.text();
      return { success: false, error: `LINE API ${response.status}: ${body}` };
    }

    return { success: true };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Unknown error" };
  }
}
