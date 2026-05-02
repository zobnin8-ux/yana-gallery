"use client";

import { useState } from "react";

import type { OrderStatus } from "@/types/order";

type AdminOrderActionsProps = {
  orderId: string;
  status: OrderStatus;
  shippingConfirmationUrl: string | null;
};

export function AdminOrderActions({ orderId, status, shippingConfirmationUrl }: AdminOrderActionsProps) {
  const [shippingRub, setShippingRub] = useState("");
  const [tracking, setTracking] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function postJson(url: string, body?: Record<string, unknown>) {
    setMessage("");
    setBusy(true);
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: body ? JSON.stringify(body) : undefined
      });
      const data = (await response.json()) as { success?: boolean; message?: string };
      if (!data.success) {
        setMessage(data.message ?? "Ошибка");
        return;
      }
      window.location.reload();
    } catch {
      setMessage("Сеть недоступна");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="admin-order-actions">
      {status === "awaiting_confirmation" ? (
        <div className="admin-order-action-block">
          <p className="admin-order-action-title">Подтверждение</p>
          <p className="admin-order-action-hint">
            Укажите стоимость доставки в рублях (0 — без отдельной оплаты доставки).
          </p>
          <label className="admin-field">
            <span>Доставка, ₽</span>
            <input
              inputMode="numeric"
              min={0}
              onChange={(event) => setShippingRub(event.target.value)}
              type="number"
              value={shippingRub}
            />
          </label>
          <div className="admin-order-action-buttons">
            <button
              className="admin-submit-button"
              disabled={busy}
              onClick={() =>
                postJson(`/api/admin/orders/${orderId}/confirm`, {
                  shippingAmountRub: Number(shippingRub) || 0
                })
              }
              type="button"
            >
              Подтвердить
            </button>
            <button
              className="admin-back-link"
              disabled={busy}
              onClick={() => postJson(`/api/admin/orders/${orderId}/reject`)}
              type="button"
            >
              Отклонить и вернуть оплату
            </button>
          </div>
        </div>
      ) : null}

      {status === "awaiting_shipping_payment" && shippingConfirmationUrl ? (
        <div className="admin-order-action-block">
          <p className="admin-order-action-title">Оплата доставки</p>
          <p className="admin-order-action-hint">Отправьте покупателю ссылку из письма или скопируйте:</p>
          <pre className="admin-order-pre">{shippingConfirmationUrl}</pre>
        </div>
      ) : null}

      {status === "preparing" ? (
        <div className="admin-order-action-block">
          <p className="admin-order-action-title">Отправка</p>
          <label className="admin-field">
            <span>Трек-номер (необязательно)</span>
            <input onChange={(event) => setTracking(event.target.value)} type="text" value={tracking} />
          </label>
          <button
            className="admin-submit-button"
            disabled={busy}
            onClick={() => postJson(`/api/admin/orders/${orderId}/shipped`, { trackingNumber: tracking || null })}
            type="button"
          >
            Отметить отправленным
          </button>
        </div>
      ) : null}

      {status === "shipped" ? (
        <div className="admin-order-action-block">
          <button
            className="admin-submit-button"
            disabled={busy}
            onClick={() => postJson(`/api/admin/orders/${orderId}/delivered`)}
            type="button"
          >
            Отметить доставленным (работа → продана)
          </button>
        </div>
      ) : null}

      {message ? <p className="admin-form-status is-error">{message}</p> : null}
    </div>
  );
}
