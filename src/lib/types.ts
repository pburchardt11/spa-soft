export type Business = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  timezone: string;
  currency: string;
  plan: string;
  deposit_enabled: boolean;
  deposit_type: "percentage" | "fixed";
  deposit_value: number;
  created_at: string;
};

export type Branch = {
  id: string;
  business_id: string;
  name: string;
  address: string | null;
  phone: string | null;
  email: string | null;
  timezone: string | null;
  is_primary: boolean;
  active: boolean;
  created_at: string;
};

export type Staff = {
  id: string;
  business_id: string;
  branch_id: string | null;
  auth_user_id: string | null;
  name: string;
  email: string;
  phone: string | null;
  role: "owner" | "manager" | "therapist" | "receptionist";
  color: string;
  active: boolean;
  created_at: string;
};

export type Service = {
  id: string;
  business_id: string;
  name: string;
  description: string | null;
  duration: number;
  price: number;
  category: string | null;
  active: boolean;
  created_at: string;
};

export type Client = {
  id: string;
  business_id: string;
  name: string;
  email: string | null;
  phone: string | null;
  notes: string | null;
  tags: string[];
  created_at: string;
};

export type Booking = {
  id: string;
  business_id: string;
  branch_id: string | null;
  client_id: string | null;
  staff_id: string | null;
  service_id: string | null;
  start_time: string;
  end_time: string;
  status: "pending" | "confirmed" | "completed" | "cancelled" | "no_show";
  notes: string | null;
  created_at: string;
  // Joined fields
  client?: Client;
  staff?: Staff;
  service?: Service;
};

export type Payment = {
  id: string;
  business_id: string;
  booking_id: string | null;
  client_id: string | null;
  amount: number;
  currency: string;
  method: "card" | "cash" | "apple_pay" | "google_pay" | "promptpay" | "airwallex" | "other";
  status: "pending" | "completed" | "refunded" | "failed";
  stripe_payment_intent_id: string | null;
  created_at: string;
  // Joined fields
  client?: Client;
  booking?: Booking;
};

export type Review = {
  id: string;
  business_id: string;
  branch_id: string | null;
  booking_id: string | null;
  client_id: string | null;
  staff_id: string | null;
  rating: number;
  comment: string | null;
  status: "pending" | "approved" | "hidden";
  created_at: string;
  // Joined
  client?: Client;
  staff?: Staff;
  service?: Service;
  booking?: Booking;
};

export type NotificationChannel = "email" | "line" | "whatsapp";

export type NotificationEvent =
  | "booking_confirmed"
  | "booking_reminder"
  | "booking_cancelled"
  | "booking_completed"
  | "welcome"
  | "review_request";

export type NotificationPreference = {
  id: string;
  business_id: string;
  client_id: string;
  channel: NotificationChannel;
  identifier: string;
  opted_in: boolean;
  created_at: string;
  updated_at: string;
};

export type NotificationLog = {
  id: string;
  business_id: string;
  client_id: string | null;
  booking_id: string | null;
  channel: NotificationChannel;
  event: NotificationEvent;
  status: "pending" | "sent" | "failed";
  error_message: string | null;
  sent_at: string | null;
  created_at: string;
};

export type NotificationSettings = {
  id: string;
  business_id: string;
  email_enabled: boolean;
  email_from_name: string | null;
  line_enabled: boolean;
  line_channel_access_token: string | null;
  line_channel_secret: string | null;
  whatsapp_enabled: boolean;
  whatsapp_access_token: string | null;
  whatsapp_phone_number_id: string | null;
  reminder_hours_before: number;
  created_at: string;
  updated_at: string;
};
