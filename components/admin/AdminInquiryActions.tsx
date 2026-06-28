"use client";

import { useState } from "react";

import type { Inquiry } from "@/types/inquiry";

type AdminInquiryActionsProps = {
  inquiryId: string;
  status: Inquiry["status"];
};

export function AdminInquiryActions({ inquiryId, status }: AdminInquiryActionsProps) {
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function setStatus(nextStatus: Inquiry["status"]) {
    setMessage("");
    setBusy(true);
    try {
      const response = await fetch(`/api/admin/inquiries/${inquiryId}/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus })
      });
      const data = (await response.json()) as { success?: boolean; message?: string };
      if (!data.success) {
        setMessage(data.message ?? "Не удалось обновить статус.");
        return;
      }
      window.location.reload();
    } catch {
      setMessage("Сеть недоступна.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="admin-inquiry-actions">
      {status === "new" ? (
        <button className="admin-submit-button" disabled={busy} onClick={() => setStatus("read")} type="button">
          Прочитана
        </button>
      ) : null}
      {status !== "archived" ? (
        <button className="admin-back-link" disabled={busy} onClick={() => setStatus("archived")} type="button">
          В архив
        </button>
      ) : (
        <button className="admin-back-link" disabled={busy} onClick={() => setStatus("read")} type="button">
          Вернуть из архива
        </button>
      )}
      {message ? <p className="admin-form-status is-error">{message}</p> : null}
    </div>
  );
}

function inquiryStatusLabel(status: Inquiry["status"]) {
  if (status === "read") {
    return "Прочитана";
  }
  if (status === "archived") {
    return "Архив";
  }
  return "Новая";
}

export function AdminInquiryStatusBadge({ status }: { status: Inquiry["status"] }) {
  return <span className={`admin-inquiry-status admin-inquiry-status-${status}`}>{inquiryStatusLabel(status)}</span>;
}
