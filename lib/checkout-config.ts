import { isSupabaseConfigured } from "@/lib/supabase";

/**
 * Online checkout is disabled until payment integration is configured.
 * Currently gated on optional env vars used by the placeholder payment adapter in `lib/yookassa.ts`.
 */
export function isCheckoutEnabled() {
  return (
    isSupabaseConfigured() &&
    Boolean(process.env.YOOKASSA_SHOP_ID?.trim()) &&
    Boolean(process.env.YOOKASSA_SECRET_KEY?.trim()) &&
    Boolean(process.env.NEXT_PUBLIC_SITE_URL?.trim())
  );
}
