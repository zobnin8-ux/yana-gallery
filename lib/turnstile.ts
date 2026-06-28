import { getClientIp } from "@/lib/rate-limit";

type TurnstileVerifyResponse = {
  success?: boolean;
  "error-codes"?: string[];
};

export function isTurnstileConfigured() {
  return Boolean(process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim() && process.env.TURNSTILE_SECRET_KEY?.trim());
}

export function isTurnstileRequired() {
  return process.env.NODE_ENV === "production";
}

export async function verifyTurnstileToken(token: string, request: Request) {
  const secret = process.env.TURNSTILE_SECRET_KEY?.trim();

  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      console.error("TURNSTILE_SECRET_KEY is not set in production.");
      return false;
    }
    return true;
  }

  if (!token.trim()) {
    return false;
  }

  const body = new URLSearchParams({
    secret,
    response: token,
    remoteip: getClientIp(request)
  });

  const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body
  });

  if (!response.ok) {
    return false;
  }

  const data = (await response.json()) as TurnstileVerifyResponse;
  return data.success === true;
}
