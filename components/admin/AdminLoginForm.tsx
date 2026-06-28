"use client";

import { useRouter, useSearchParams } from "next/navigation";
import type { FormEvent } from "react";
import { useState } from "react";

import { isTurnstileEnabledInBrowser, TurnstileField } from "@/components/security/TurnstileField";

export function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState("");
  const nextPath = searchParams.get("next") ?? "/admin";
  const turnstileRequired = isTurnstileEnabledInBrowser();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (turnstileRequired && !turnstileToken) {
      setMessage("Подтвердите, что вы не робот.");
      return;
    }

    setIsSubmitting(true);
    setMessage("");

    const formData = new FormData(event.currentTarget);
    formData.set("next", nextPath);
    formData.set("turnstileToken", turnstileToken);

    const response = await fetch("/api/admin/login", {
      method: "POST",
      body: formData
    });
    const result = (await response.json()) as { success: boolean; message?: string; redirectTo?: string };

    setIsSubmitting(false);

    if (!response.ok || !result.success) {
      setMessage(result.message ?? "Не удалось войти.");
      return;
    }

    router.replace(result.redirectTo ?? "/admin");
    router.refresh();
  }

  return (
    <form className="admin-login-form" onSubmit={handleSubmit}>
      <label className="admin-field">
        <span>Пароль администратора</span>
        <input autoComplete="current-password" name="password" placeholder="Введите пароль" required type="password" />
      </label>
      <TurnstileField onTokenChange={setTurnstileToken} />
      {message ? (
        <p aria-live="polite" className="admin-form-status is-error" role="status">
          {message}
        </p>
      ) : null}
      <button className="admin-submit-button" disabled={isSubmitting} type="submit">
        {isSubmitting ? "Входим..." : "Войти"}
      </button>
    </form>
  );
}
