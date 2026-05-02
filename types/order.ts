export const orderStatuses = [
  "pending_payment",
  "awaiting_confirmation",
  "rejected",
  "awaiting_shipping_payment",
  "preparing",
  "shipped",
  "delivered"
] as const;

export type OrderStatus = (typeof orderStatuses)[number];

export type OrderRow = {
  id: string;
  display_number: number;
  access_token: string;
  artwork_id: string;
  buyer_name: string;
  buyer_email: string;
  buyer_phone: string | null;
  artwork_amount_value: string;
  currency: string;
  /** External payment IDs from the integrated provider (column names historical). */
  yookassa_artwork_payment_id: string | null;
  yookassa_shipping_payment_id: string | null;
  shipping_amount_value: string | null;
  shipping_confirmation_url: string | null;
  status: OrderStatus;
  artwork_paid_at: string | null;
  confirmed_at: string | null;
  rejected_at: string | null;
  shipping_paid_at: string | null;
  preparing_at: string | null;
  shipped_at: string | null;
  tracking_number: string | null;
  delivered_at: string | null;
  created_at: string;
  updated_at: string;
};

export type OrderPublicView = {
  orderNumber: string;
  createdAt: string;
  status: OrderStatus;
  banner: string | null;
  steps: Array<{ id: string; label: string; date: string | null }>;
  trackingNumber: string | null;
};
