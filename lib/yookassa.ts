/**
 * Placeholder payment adapter (YooKassa HTTP API). Replace or wrap when the real provider is chosen.
 * Checkout stays disabled until `isCheckoutEnabled()` passes — see `lib/checkout-config.ts`.
 */
const YK_API = "https://api.yookassa.ru/v3";

function basicAuthHeader() {
  const shopId = process.env.YOOKASSA_SHOP_ID?.trim();
  const secret = process.env.YOOKASSA_SECRET_KEY?.trim();
  if (!shopId || !secret) {
    throw new Error("Для оплаты задайте переменные окружения платёжной интеграции (см. lib/yookassa.ts).");
  }
  const token = Buffer.from(`${shopId}:${secret}`, "utf8").toString("base64");
  return `Basic ${token}`;
}

export async function yookassaCreatePayment(params: {
  amountRub: string;
  returnUrl: string;
  description: string;
  metadata: Record<string, string>;
  idempotenceKey: string;
}) {
  const response = await fetch(`${YK_API}/payments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Idempotence-Key": params.idempotenceKey,
      Authorization: basicAuthHeader()
    },
    body: JSON.stringify({
      amount: { value: params.amountRub, currency: "RUB" },
      confirmation: { type: "redirect", return_url: params.returnUrl },
      capture: true,
      description: params.description,
      metadata: params.metadata
    })
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Создание платежа: ${response.status} ${text}`);
  }

  return response.json() as Promise<{
    id: string;
    status: string;
    confirmation?: { type: string; confirmation_url?: string };
  }>;
}

export async function yookassaCreateRefund(params: {
  paymentId: string;
  amountRub: string;
  idempotenceKey: string;
}) {
  const response = await fetch(`${YK_API}/refunds`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Idempotence-Key": params.idempotenceKey,
      Authorization: basicAuthHeader()
    },
    body: JSON.stringify({
      payment_id: params.paymentId,
      amount: { value: params.amountRub, currency: "RUB" }
    })
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Возврат платежа: ${response.status} ${text}`);
  }

  return response.json() as Promise<{ id: string; status: string }>;
}

export async function yookassaGetPayment(paymentId: string) {
  const response = await fetch(`${YK_API}/payments/${paymentId}`, {
    headers: { Authorization: basicAuthHeader() }
  });
  if (!response.ok) {
    throw new Error(`Получение платежа: ${response.status}`);
  }
  return response.json() as Promise<{
    id: string;
    status: string;
    amount: { value: string; currency: string };
    metadata?: Record<string, string>;
  }>;
}
