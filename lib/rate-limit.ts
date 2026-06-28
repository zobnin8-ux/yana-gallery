import { createHash } from "node:crypto";

import { getSupabaseAdminClient, isSupabaseConfigured } from "@/lib/supabase";

const HOURLY_LIMIT = 5;
const WINDOW_MS = 60 * 60 * 1000;
const RETENTION_MS = 24 * 60 * 60 * 1000;

export type RateLimitScope = "inquiry" | "admin-login";

export function getClientIp(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) {
      return first;
    }
  }

  return request.headers.get("x-real-ip")?.trim() || "unknown";
}

function bucketKey(scope: RateLimitScope, ip: string) {
  const digest = createHash("sha256").update(`${scope}:${ip}`).digest("hex");
  return `${scope}:${digest.slice(0, 32)}`;
}

export async function enforceRateLimit(scope: RateLimitScope, request: Request) {
  if (!isSupabaseConfigured()) {
    return { allowed: true as const };
  }

  const bucket = bucketKey(scope, getClientIp(request));
  const windowStart = new Date(Date.now() - WINDOW_MS).toISOString();
  const client = getSupabaseAdminClient();

  const { count, error } = await client
    .from("api_rate_limit_events")
    .select("*", { count: "exact", head: true })
    .eq("bucket", bucket)
    .gte("created_at", windowStart);

  if (error) {
    console.error(`Rate limit check failed (${scope}):`, error);
    return { allowed: true as const };
  }

  if ((count ?? 0) >= HOURLY_LIMIT) {
    return {
      allowed: false as const,
      message: "Слишком много попыток. Попробуйте снова через час."
    };
  }

  const { error: insertError } = await client.from("api_rate_limit_events").insert({ bucket });

  if (insertError) {
    console.error(`Rate limit insert failed (${scope}):`, insertError);
    return { allowed: true as const };
  }

  void client
    .from("api_rate_limit_events")
    .delete()
    .lt("created_at", new Date(Date.now() - RETENTION_MS).toISOString())
    .then(({ error: cleanupError }) => {
      if (cleanupError) {
        console.error(`Rate limit cleanup failed (${scope}):`, cleanupError);
      }
    });

  return { allowed: true as const };
}
