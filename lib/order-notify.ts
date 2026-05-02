export type OrderNotifyPayload = {
  event: string;
  orderId: string;
  displayNumber: number;
  buyerEmail: string;
  archiveUrl: string;
  detail?: string;
};

export function notifyOrderNotify(payload: OrderNotifyPayload) {
  const url = process.env.GALLERY_ORDER_WEBHOOK_URL?.trim();
  if (!url) {
    return;
  }
  fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  }).catch(() => undefined);
}

export function orderArchiveUrl(token: string) {
  const base = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "";
  return `${base}/zakaz/${token}`;
}
