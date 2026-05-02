"use client";

import type { FormEvent } from "react";
import { useState } from "react";

type OplataFormProps = {
  artworkId: string;
  artworkTitle: string;
  priceLabel: string;
};

export function OplataForm({ artworkId, artworkTitle, priceLabel }: OplataFormProps) {
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setIsSubmitting(true);
    const form = event.currentTarget;
    const buyerName = String(new FormData(form).get("buyerName") ?? "").trim();
    const buyerEmail = String(new FormData(form).get("buyerEmail") ?? "").trim();
    const buyerPhone = String(new FormData(form).get("buyerPhone") ?? "").trim();

    try {
      const response = await fetch("/api/orders/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          artworkId,
          buyerName,
          buyerEmail,
          buyerPhone: buyerPhone || null
        })
      });
      const data = (await response.json()) as {
        success?: boolean;
        message?: string;
        confirmationUrl?: string;
      };

      if (data.confirmationUrl) {
        window.location.href = data.confirmationUrl;
        return;
      }
      setMessage(data.message ?? "Не удалось перейти к оплате.");
    } catch {
      setMessage("Ошибка сети. Попробуйте позже.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="oplata-form" onSubmit={handleSubmit}>
      <p className="oplata-form-work">
        Работа: <strong>{artworkTitle}</strong>
      </p>
      <p className="oplata-form-price">
        К оплате (резерв): <strong>{priceLabel}</strong>
      </p>
      <p className="oplata-form-hint">
        После оплаты работа переходит в резерв до подтверждения галереи в течение одного рабочего дня.
        Доставка оплачивается отдельной ссылкой после подтверждения.
      </p>

      <label className="oplata-field">
        <span>Имя</span>
        <input name="buyerName" autoComplete="name" required type="text" />
      </label>
      <label className="oplata-field">
        <span>Email</span>
        <input name="buyerEmail" autoComplete="email" required type="email" />
      </label>
      <label className="oplata-field">
        <span>Телефон (необязательно)</span>
        <input name="buyerPhone" autoComplete="tel" type="tel" />
      </label>

      {message ? <p className="oplata-form-status">{message}</p> : null}

      <button className="oplata-submit" disabled={isSubmitting} type="submit">
        {isSubmitting ? "Перенаправляем…" : "Перейти к оплате"}
      </button>
    </form>
  );
}
