"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import type { FormEvent } from "react";
import { useState } from "react";

import { isTurnstileEnabledInBrowser, TurnstileField } from "@/components/security/TurnstileField";

export function InquiryForm() {
  const searchParams = useSearchParams();
  const artworkSlug = searchParams.get("artwork") ?? "";
  const artworkId = searchParams.get("id") ?? "";
  const artworkTitle = searchParams.get("title") ?? "";
  const [statusMessage, setStatusMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState("");
  const turnstileRequired = isTurnstileEnabledInBrowser();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (turnstileRequired && !turnstileToken) {
      setStatusMessage("Подтвердите, что вы не робот.");
      return;
    }

    setIsSubmitting(true);
    setStatusMessage("");

    const formData = new FormData(event.currentTarget);
    formData.set("turnstileToken", turnstileToken);

    const response = await fetch("/api/inquiries", {
      method: "POST",
      body: formData
    });
    const result = (await response.json()) as { success: boolean; message?: string };

    setIsSubmitting(false);
    setStatusMessage(result.message ?? (result.success ? "Заявка принята." : "Не удалось отправить запрос."));

    if (result.success) {
      event.currentTarget.reset();
      setTurnstileToken("");
    }
  }

  return (
    <form className="inquiry-form" onSubmit={handleSubmit}>
      <input name="artworkSlug" type="hidden" value={artworkSlug} />
      <input name="artworkId" type="hidden" value={artworkId} />
      <input name="artworkTitle" type="hidden" value={artworkTitle} />

      {artworkTitle ? (
        <p className="inquiry-artwork-context">
          Запрос о работе:{" "}
          {artworkSlug ? (
            <Link href={`/artworks/${artworkSlug}`}>«{artworkTitle}»</Link>
          ) : (
            <>«{artworkTitle}»</>
          )}
        </p>
      ) : null}

      <label className="inquiry-field">
        <span>Имя</span>
        <input autoComplete="name" name="name" placeholder="Ваше имя" required type="text" />
      </label>

      <label className="inquiry-field">
        <span>Почта</span>
        <input autoComplete="email" name="email" placeholder="name@email.com" required type="email" />
      </label>

      <label className="inquiry-field inquiry-field-full">
        <span>Запрос</span>
        <textarea
          defaultValue={artworkTitle ? `Меня заинтересовала работа «${artworkTitle}». ` : undefined}
          minLength={10}
          name="message"
          placeholder="Напишите, какая работа вас заинтересовала."
          required
          rows={7}
        />
      </label>

      <TurnstileField onTokenChange={setTurnstileToken} />

      {statusMessage ? (
        <p aria-live="polite" className="inquiry-status" role="status">
          {statusMessage}
        </p>
      ) : null}

      <button className="inquiry-submit" disabled={isSubmitting} type="submit">
        {isSubmitting ? "Отправляем..." : "Отправить запрос"}
      </button>
    </form>
  );
}
