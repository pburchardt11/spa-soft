import type { NotificationEvent } from "@/lib/types";

type BookingDetails = {
  clientName: string;
  serviceName: string;
  staffName: string;
  date: string;
  time: string;
  businessName: string;
};

// WhatsApp requires pre-approved message templates.
// You'll need to create these templates in the Meta Business Manager:
//
// Template: booking_confirmation
//   Body: "Hi {{1}}, your {{2}} at {{3}} is confirmed for {{4}} at {{5}} with {{6}}."
//
// Template: booking_reminder
//   Body: "Hi {{1}}, reminder: your {{2}} at {{3}} is on {{4}} at {{5}}."
//
// Template: booking_cancelled
//   Body: "Hi {{1}}, your {{2}} at {{3}} on {{4}} at {{5}} has been cancelled."
//
// Template: booking_completed
//   Body: "Thank you {{1}} for visiting {{2}}! We hope you enjoyed your {{3}}."
//
// Template: welcome_message
//   Body: "Welcome to {{1}}, {{2}}! Book your next appointment anytime."

const templateMap: Record<NotificationEvent, { name: string; params: (d: BookingDetails) => string[] }> = {
  booking_confirmed: {
    name: "booking_confirmation",
    params: (d) => [d.clientName, d.serviceName, d.businessName, d.date, d.time, d.staffName],
  },
  booking_reminder: {
    name: "booking_reminder",
    params: (d) => [d.clientName, d.serviceName, d.businessName, d.date, d.time],
  },
  booking_cancelled: {
    name: "booking_cancelled",
    params: (d) => [d.clientName, d.serviceName, d.businessName, d.date, d.time],
  },
  booking_completed: {
    name: "booking_completed",
    params: (d) => [d.clientName, d.businessName, d.serviceName],
  },
  welcome: {
    name: "welcome_message",
    params: (d) => [d.businessName, d.clientName],
  },
};

export async function sendWhatsAppMessage(
  phone: string, // E.164 format, e.g. "66812345678"
  accessToken: string,
  phoneNumberId: string,
  event: NotificationEvent,
  details: BookingDetails,
  languageCode: string = "en"
): Promise<{ success: boolean; error?: string }> {
  try {
    const template = templateMap[event];
    const parameters = template.params(details).map((text) => ({ type: "text", text }));

    const response = await fetch(
      `https://graph.facebook.com/v21.0/${phoneNumberId}/messages`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to: phone,
          type: "template",
          template: {
            name: template.name,
            language: { code: languageCode },
            components: [{ type: "body", parameters }],
          },
        }),
      }
    );

    if (!response.ok) {
      const body = await response.text();
      return { success: false, error: `WhatsApp API ${response.status}: ${body}` };
    }

    return { success: true };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Unknown error" };
  }
}
