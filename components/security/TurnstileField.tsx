"use client";

import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";
import { useRef } from "react";

type TurnstileFieldProps = {
  onTokenChange: (token: string) => void;
};

export function TurnstileField({ onTokenChange }: TurnstileFieldProps) {
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim();
  const widgetRef = useRef<TurnstileInstance>(null);

  if (!siteKey) {
    return null;
  }

  return (
    <div className="turnstile-field">
      <Turnstile
        ref={widgetRef}
        siteKey={siteKey}
        onExpire={() => {
          onTokenChange("");
          widgetRef.current?.reset();
        }}
        onSuccess={onTokenChange}
        options={{ theme: "light", size: "normal" }}
      />
    </div>
  );
}

export function isTurnstileEnabledInBrowser() {
  return Boolean(process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim());
}
