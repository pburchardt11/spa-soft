import { Resend } from "resend";
import type { NotificationEvent } from "@/lib/types";

function getResend() {
  return new Resend(process.env.RESEND_API_KEY);
}

type BookingDetails = {
  clientName: string;
  serviceName: string;
  staffName: string;
  date: string; // formatted date string
  time: string; // formatted time string
  businessName: string;
  reviewLink?: string;
};

const subjects: Record<NotificationEvent, string> = {
  booking_confirmed: "Your booking is confirmed",
  booking_reminder: "Reminder: Your appointment is coming up",
  booking_cancelled: "Your booking has been cancelled",
  booking_completed: "Thank you for your visit!",
  welcome: "Welcome!",
  review_request: "How was your visit? Share your feedback",
};

function buildEmailHtml(event: NotificationEvent, details: BookingDetails): string {
  const { clientName, serviceName, staffName, date, time, businessName } = details;

  const bookingBlock = `
    <div style="background:#f9fafb;border-radius:8px;padding:20px;margin:16px 0;">
      <p style="margin:0 0 8px;color:#6b7280;font-size:14px;">Service</p>
      <p style="margin:0 0 16px;font-size:16px;font-weight:600;">${serviceName}</p>
      <p style="margin:0 0 8px;color:#6b7280;font-size:14px;">Date &amp; Time</p>
      <p style="margin:0 0 16px;font-size:16px;font-weight:600;">${date} at ${time}</p>
      <p style="margin:0 0 8px;color:#6b7280;font-size:14px;">Therapist</p>
      <p style="margin:0;font-size:16px;font-weight:600;">${staffName}</p>
    </div>
  `;

  const templates: Record<NotificationEvent, string> = {
    booking_confirmed: `
      <h2 style="color:#7c3aed;">Booking Confirmed ✓</h2>
      <p>Hi ${clientName},</p>
      <p>Your appointment at <strong>${businessName}</strong> has been confirmed.</p>
      ${bookingBlock}
      <p>We look forward to seeing you!</p>
    `,
    booking_reminder: `
      <h2 style="color:#7c3aed;">Appointment Reminder</h2>
      <p>Hi ${clientName},</p>
      <p>This is a friendly reminder about your upcoming appointment at <strong>${businessName}</strong>.</p>
      ${bookingBlock}
      <p>See you soon!</p>
    `,
    booking_cancelled: `
      <h2 style="color:#ef4444;">Booking Cancelled</h2>
      <p>Hi ${clientName},</p>
      <p>Your appointment at <strong>${businessName}</strong> has been cancelled.</p>
      ${bookingBlock}
      <p>If you'd like to rebook, please visit our booking page or contact us.</p>
    `,
    booking_completed: `
      <h2 style="color:#7c3aed;">Thank You!</h2>
      <p>Hi ${clientName},</p>
      <p>Thank you for visiting <strong>${businessName}</strong>. We hope you enjoyed your session!</p>
      ${bookingBlock}
      <p>We'd love to see you again soon.</p>
    `,
    welcome: `
      <h2 style="color:#7c3aed;">Welcome to ${businessName}!</h2>
      <p>Hi ${clientName},</p>
      <p>Thank you for joining us. We're excited to have you as a client!</p>
      <p>You can book your next appointment anytime through our online booking page.</p>
    `,
    review_request: `
      <h2 style="color:#7c3aed;">How was your visit?</h2>
      <p>Hi ${clientName},</p>
      <p>Thank you for visiting <strong>${businessName}</strong>. We'd love to hear about your experience.</p>
      ${bookingBlock}
      <p style="text-align:center;margin:24px 0;">
        <a href="${details.reviewLink || '#'}" style="display:inline-block;background:#7c3aed;color:#ffffff;text-decoration:none;padding:12px 28px;border-radius:8px;font-weight:600;">
          Leave a Review
        </a>
      </p>
      <p style="color:#6b7280;font-size:13px;">Your feedback helps us improve and helps other clients choose us.</p>
    `,
  };

  return `
    <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:520px;margin:0 auto;padding:24px;color:#111827;">
      ${templates[event]}
      <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0;" />
      <p style="color:#9ca3af;font-size:12px;">${businessName}</p>
    </div>
  `;
}

export async function sendEmail(
  to: string,
  event: NotificationEvent,
  details: BookingDetails,
  fromName?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const from = `${fromName || details.businessName} <notifications@${process.env.RESEND_DOMAIN || "resend.dev"}>`;

    const { error } = await getResend().emails.send({
      from,
      to,
      subject: `${subjects[event]} — ${details.businessName}`,
      html: buildEmailHtml(event, details),
    });

    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Unknown error" };
  }
}
