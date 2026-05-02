import { randomBytes, randomUUID } from "node:crypto";

import { galleryStore } from "@/lib/gallery-store";
import { orderArchiveUrl, notifyOrderNotify } from "@/lib/order-notify";
import { getSupabaseAdminClient, isSupabaseConfigured } from "@/lib/supabase";
import { yookassaCreatePayment, yookassaCreateRefund } from "@/lib/yookassa";
import type { OrderRow, OrderStatus } from "@/types/order";

type OrderRecord = {
  id: string;
  display_number: number;
  access_token: string;
  artwork_id: string;
  buyer_name: string;
  buyer_email: string;
  buyer_phone: string | null;
  artwork_amount_value: number;
  currency: string;
  yookassa_artwork_payment_id: string | null;
  yookassa_shipping_payment_id: string | null;
  shipping_amount_value: number | null;
  shipping_confirmation_url: string | null;
  status: OrderStatus;
  artwork_paid_at: string | null;
  confirmed_at: string | null;
  rejected_at: string | null;
  shipping_paid_at: string | null;
  preparing_at: string | null;
  shipped_at: string | null;
  tracking_number: string | null;
  delivered_at: string | null;
  created_at: string;
  updated_at: string;
};

function requireSupabase() {
  if (!isSupabaseConfigured()) {
    throw new Error("Заказы доступны только при подключённом Supabase.");
  }
}

function toRubString(amount: number) {
  return amount.toFixed(2);
}

function mapRow(row: OrderRecord): OrderRow {
  return {
    id: row.id,
    display_number: row.display_number,
    access_token: row.access_token,
    artwork_id: row.artwork_id,
    buyer_name: row.buyer_name,
    buyer_email: row.buyer_email,
    buyer_phone: row.buyer_phone,
    artwork_amount_value: String(row.artwork_amount_value),
    currency: row.currency,
    yookassa_artwork_payment_id: row.yookassa_artwork_payment_id,
    yookassa_shipping_payment_id: row.yookassa_shipping_payment_id,
    shipping_amount_value: row.shipping_amount_value != null ? String(row.shipping_amount_value) : null,
    shipping_confirmation_url: row.shipping_confirmation_url,
    status: row.status,
    artwork_paid_at: row.artwork_paid_at,
    confirmed_at: row.confirmed_at,
    rejected_at: row.rejected_at,
    shipping_paid_at: row.shipping_paid_at,
    preparing_at: row.preparing_at,
    shipped_at: row.shipped_at,
    tracking_number: row.tracking_number,
    delivered_at: row.delivered_at,
    created_at: row.created_at,
    updated_at: row.updated_at
  };
}

export const ordersStore = {
  async createPendingOrder(params: {
    artworkId: string;
    buyerName: string;
    buyerEmail: string;
    buyerPhone: string | null;
    artworkAmountRub: number;
  }) {
    requireSupabase();
    const supabase = getSupabaseAdminClient();
    const accessToken = randomBytes(24).toString("hex");

    const { data, error } = await supabase
      .from("orders")
      .insert({
        access_token: accessToken,
        artwork_id: params.artworkId,
        buyer_name: params.buyerName,
        buyer_email: params.buyerEmail,
        buyer_phone: params.buyerPhone,
        artwork_amount_value: params.artworkAmountRub,
        currency: "RUB",
        status: "pending_payment" satisfies OrderStatus
      })
      .select("*")
      .single();

    if (error) {
      throw error;
    }

    const row = data as OrderRecord;
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "";
    const returnUrl = `${baseUrl}/zakaz/${accessToken}`;

    const payment = await yookassaCreatePayment({
      amountRub: toRubString(params.artworkAmountRub),
      returnUrl,
      description: `Резерв работы, заказ №${row.display_number}`,
      metadata: { order_id: row.id, payment_kind: "artwork" },
      idempotenceKey: randomUUID()
    });

    const confirmationUrl = payment.confirmation?.confirmation_url;
    if (!confirmationUrl) {
      throw new Error("YooKassa не вернула ссылку на оплату.");
    }

    const { error: upErr } = await supabase
      .from("orders")
      .update({ yookassa_artwork_payment_id: payment.id })
      .eq("id", row.id);

    if (upErr) {
      throw upErr;
    }

    notifyOrderNotify({
      event: "order_created",
      orderId: row.id,
      displayNumber: row.display_number,
      buyerEmail: params.buyerEmail,
      archiveUrl: orderArchiveUrl(accessToken),
      detail: "Создан заказ, ожидает оплаты"
    });

    return { confirmationUrl, accessToken, orderId: row.id, displayNumber: row.display_number };
  },

  async findByToken(token: string) {
    if (!isSupabaseConfigured()) {
      return null;
    }
    const { data, error } = await getSupabaseAdminClient()
      .from("orders")
      .select("*")
      .eq("access_token", token)
      .maybeSingle();

    if (error) {
      throw error;
    }
    if (!data) {
      return null;
    }
    return mapRow(data as OrderRecord);
  },

  async findById(id: string) {
    if (!isSupabaseConfigured()) {
      return null;
    }
    const { data, error } = await getSupabaseAdminClient().from("orders").select("*").eq("id", id).maybeSingle();

    if (error) {
      throw error;
    }
    if (!data) {
      return null;
    }
    return mapRow(data as OrderRecord);
  },

  async listOrders() {
    if (!isSupabaseConfigured()) {
      return [];
    }
    const { data, error } = await getSupabaseAdminClient()
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }
    return (data as OrderRecord[]).map(mapRow);
  },

  async onArtworkPaymentSucceeded(orderId: string, ykPaymentId: string) {
    requireSupabase();
    const supabase = getSupabaseAdminClient();
    const order = await this.findById(orderId);
    if (!order) {
      return;
    }
    if (order.yookassa_artwork_payment_id && order.yookassa_artwork_payment_id !== ykPaymentId) {
      return;
    }

    const artwork = await galleryStore.findArtworkById(order.artwork_id);
    if (!artwork || artwork.status !== "available") {
      await yookassaCreateRefund({
        paymentId: ykPaymentId,
        amountRub: toRubString(Number(order.artwork_amount_value)),
        idempotenceKey: randomUUID()
      });
      await supabase
        .from("orders")
        .update({ status: "rejected", rejected_at: new Date().toISOString(), yookassa_artwork_payment_id: ykPaymentId })
        .eq("id", orderId);
      return;
    }

    await galleryStore.updateArtworkStatus(order.artwork_id, "reserved");

    const { error } = await supabase
      .from("orders")
      .update({
        status: "awaiting_confirmation",
        yookassa_artwork_payment_id: ykPaymentId,
        artwork_paid_at: new Date().toISOString()
      })
      .eq("id", orderId)
      .in("status", ["pending_payment"]);

    if (error) {
      throw error;
    }

    notifyOrderNotify({
      event: "artwork_paid",
      orderId,
      displayNumber: order.display_number,
      buyerEmail: order.buyer_email,
      archiveUrl: orderArchiveUrl(order.access_token),
      detail: "Оплачен резерв, ждём подтверждения галереи"
    });
  },

  async onShippingPaymentSucceeded(orderId: string, ykPaymentId: string) {
    requireSupabase();
    const supabase = getSupabaseAdminClient();
    const order = await this.findById(orderId);
    if (!order) {
      return;
    }

    const now = new Date().toISOString();
    const { error } = await supabase
      .from("orders")
      .update({
        status: "preparing",
        yookassa_shipping_payment_id: ykPaymentId,
        shipping_paid_at: now,
        preparing_at: now
      })
      .eq("id", orderId)
      .eq("status", "awaiting_shipping_payment");

    if (error) {
      throw error;
    }

    notifyOrderNotify({
      event: "shipping_paid",
      orderId,
      displayNumber: order.display_number,
      buyerEmail: order.buyer_email,
      archiveUrl: orderArchiveUrl(order.access_token),
      detail: "Оплачена доставка"
    });
  },

  async adminConfirm(orderId: string, shippingAmountRub: number) {
    requireSupabase();
    const supabase = getSupabaseAdminClient();
    const order = await this.findById(orderId);
    if (!order || order.status !== "awaiting_confirmation") {
      throw new Error("Некорректный статус заказа для подтверждения.");
    }

    const now = new Date().toISOString();
    const amount = Math.max(0, shippingAmountRub);

    if (amount <= 0) {
      const { error } = await supabase
        .from("orders")
        .update({
          status: "preparing",
          confirmed_at: now,
          preparing_at: now,
          shipping_amount_value: 0
        })
        .eq("id", orderId);

      if (error) {
        throw error;
      }

      notifyOrderNotify({
        event: "order_confirmed_no_shipping",
        orderId,
        displayNumber: order.display_number,
        buyerEmail: order.buyer_email,
        archiveUrl: orderArchiveUrl(order.access_token),
        detail: "Подтверждено, доставка не требует отдельной оплаты"
      });
      return { kind: "no_shipping" as const };
    }

    const payment = await yookassaCreatePayment({
      amountRub: toRubString(amount),
      returnUrl: orderArchiveUrl(order.access_token),
      description: `Доставка, заказ №${order.display_number}`,
      metadata: { order_id: orderId, payment_kind: "shipping" },
      idempotenceKey: randomUUID()
    });

    const confirmationUrl = payment.confirmation?.confirmation_url;
    if (!confirmationUrl) {
      throw new Error("YooKassa не вернула ссылку на оплату доставки.");
    }

    const { error } = await supabase
      .from("orders")
      .update({
        status: "awaiting_shipping_payment",
        confirmed_at: now,
        shipping_amount_value: amount,
        shipping_confirmation_url: confirmationUrl,
        yookassa_shipping_payment_id: payment.id
      })
      .eq("id", orderId);

    if (error) {
      throw error;
    }

    notifyOrderNotify({
      event: "order_confirmed_shipping_link",
      orderId,
      displayNumber: order.display_number,
      buyerEmail: order.buyer_email,
      archiveUrl: orderArchiveUrl(order.access_token),
      detail: `Ссылка на оплату доставки: ${confirmationUrl}`
    });

    return { kind: "shipping_invoice" as const, shippingConfirmationUrl: confirmationUrl };
  },

  async adminReject(orderId: string) {
    requireSupabase();
    const supabase = getSupabaseAdminClient();
    const order = await this.findById(orderId);
    if (!order || order.status !== "awaiting_confirmation") {
      throw new Error("Отклонение возможно только для заказа на подтверждении.");
    }
    const paymentId = order.yookassa_artwork_payment_id;
    if (!paymentId) {
      throw new Error("Нет платежа для возврата.");
    }

    await yookassaCreateRefund({
      paymentId,
      amountRub: toRubString(Number(order.artwork_amount_value)),
      idempotenceKey: randomUUID()
    });

    await galleryStore.updateArtworkStatus(order.artwork_id, "available");

    const { error } = await supabase
      .from("orders")
      .update({
        status: "rejected",
        rejected_at: new Date().toISOString()
      })
      .eq("id", orderId);

    if (error) {
      throw error;
    }

    notifyOrderNotify({
      event: "order_rejected",
      orderId,
      displayNumber: order.display_number,
      buyerEmail: order.buyer_email,
      archiveUrl: orderArchiveUrl(order.access_token),
      detail: "Заказ отклонён, возврат инициирован"
    });
  },

  async adminMarkShipped(orderId: string, trackingNumber: string | null) {
    requireSupabase();
    const supabase = getSupabaseAdminClient();
    const order = await this.findById(orderId);
    if (!order || order.status !== "preparing") {
      throw new Error("Отправка: заказ должен быть в статусе подготовки.");
    }

    const { error } = await supabase
      .from("orders")
      .update({
        status: "shipped",
        shipped_at: new Date().toISOString(),
        tracking_number: trackingNumber?.trim() || null
      })
      .eq("id", orderId);

    if (error) {
      throw error;
    }

    notifyOrderNotify({
      event: "order_shipped",
      orderId,
      displayNumber: order.display_number,
      buyerEmail: order.buyer_email,
      archiveUrl: orderArchiveUrl(order.access_token),
      detail: trackingNumber ? `Трек: ${trackingNumber}` : "Отправлено без трек-номера"
    });
  },

  async adminMarkDelivered(orderId: string) {
    requireSupabase();
    const supabase = getSupabaseAdminClient();
    const order = await this.findById(orderId);
    if (!order || order.status !== "shipped") {
      throw new Error("Доставлено: заказ должен быть отправлен.");
    }

    const { error } = await supabase
      .from("orders")
      .update({
        status: "delivered",
        delivered_at: new Date().toISOString()
      })
      .eq("id", orderId);

    if (error) {
      throw error;
    }

    await galleryStore.updateArtworkStatus(order.artwork_id, "sold");

    notifyOrderNotify({
      event: "order_delivered",
      orderId,
      displayNumber: order.display_number,
      buyerEmail: order.buyer_email,
      archiveUrl: orderArchiveUrl(order.access_token),
      detail: "Заказ завершён"
    });
  }
};
