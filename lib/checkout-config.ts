import { isSupabaseConfigured } from "@/lib/supabase";

export function isCheckoutEnabled() {
  return (
    isSupabaseConfigured() &&
    Boolean(process.env.YOOKASSA_SHOP_ID?.trim()) &&
    Boolean(process.env.YOOKASSA_SECRET_KEY?.trim()) &&
    Boolean(process.env.NEXT_PUBLIC_SITE_URL?.trim())
  );
}
