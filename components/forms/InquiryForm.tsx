"use client";

import { useSearchParams } from "next/navigation";
import type { FormEvent } from "react";
import { useState } from "react";

export function InquiryForm() {
  const searchParams = useSearchParams();
  const selectedArtwork = searchParams.get("artwork") ?? "";
  const [statusMessage, setStatusMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setStatusMessage("");

    const formData = new FormData(event.currentTarget);
    const response = await fetch("/api/inquiries", {
      method: "POST",
      body: formData
    });
    const result = (await response.json()) as { success: boolean; message?: string };

    setIsSubmitting(false);
    setStatusMessage(result.message ?? (result.success ? "Запрос отправлен." : "Не удалось отправить запрос."));

    if (result.success) {
      event.currentTarget.reset();
    }
  }

  return (
    <form className="inquiry-form" onSubmit={handleSubmit}>
      <input name="artworkTitle" type="hidden" value={selectedArtwork} />
      <label className="inquiry-field">
        <span>Имя</span>
        <input name="name" placeholder="Ваше имя" required type="text" />
      </label>

      <label className="inquiry-field">
        <span>Email</span>
        <input name="email" placeholder="name@email.com" required type="email" />
      </label>

      <label className="inquiry-field inquiry-field-full">
        <span>Запрос</span>
        <textarea
          defaultValue={selectedArtwork ? `Меня заинтересовала работа «${selectedArtwork}». ` : undefined}
          name="message"
          placeholder="Напишите, какая работа вас заинтересовала."
          required
          rows={7}
        />
      </label>

      {statusMessage ? <p className="inquiry-status">{statusMessage}</p> : null}

      <button className="inquiry-submit" disabled={isSubmitting} type="submit">
        {isSubmitting ? "Отправляем..." : "Отправить запрос"}
      </button>
    </form>
  );
}
