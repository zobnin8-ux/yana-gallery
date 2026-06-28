import type { Inquiry } from "@/types/inquiry";

/**
 * Email notifications for contact inquiries are disabled for now.
 * Inquiries are saved to Supabase and viewed in /admin/inquiries.
 *
 * Future options: Resend, SMTP, or another provider.
 * Planned env: RESEND_API_KEY, RESEND_FROM, GALLERY_INQUIRY_NOTIFY_TO
 */
export function isInquiryEmailConfigured() {
  return false;
}

export async function notifyInquiryByEmail(_inquiry: Inquiry) {
  // Stub — no email delivery yet.
}
