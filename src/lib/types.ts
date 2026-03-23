export type Business = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  timezone: string;
  currency: string;
  plan: string;
  created_at: string;
};

export type Staff = {
  id: string;
  business_id: string;
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
  method: "card" | "cash" | "apple_pay" | "google_pay" | "other";
  status: "pending" | "completed" | "refunded" | "failed";
  stripe_payment_intent_id: string | null;
  created_at: string;
  // Joined fields
  client?: Client;
  booking?: Booking;
};
