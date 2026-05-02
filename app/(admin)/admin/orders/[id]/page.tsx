import Link from "next/link";
import { notFound } from "next/navigation";

import { AdminOrderActions } from "@/components/admin/AdminOrderActions";
import { SectionTitle } from "@/components/layout/SectionTitle";
import { artworksRepository } from "@/lib/repositories/artworks-repository";
import { ordersStore } from "@/lib/orders-store";

const STATUS_LABEL: Record<string, string> = {
  pending_payment: "Ожидает оплату",
  awaiting_confirmation: "Ждём подтверждения",
  rejected: "Отклонён",
  awaiting_shipping_payment: "Ждём оплату доставки",
  preparing: "Готовится к отправке",
  shipped: "Отправлен",
  delivered: "Доставлен"
};

type PageProps = { params: Promise<{ id: string }> };

export default async function AdminOrderDetailPage({ params }: PageProps) {
  const { id } = await params;
  const order = await ordersStore.findById(id);

  if (!order) {
    notFound();
  }

  const artwork = await artworksRepository.findById(order.artwork_id);
  const publicUrl = `${process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "")}/zakaz/${order.access_token}`;

  return (
    <section className="admin-section">
      <p className="admin-eyebrow">
        <Link className="admin-table-link" href="/admin/orders">
          ← Все заказы
        </Link>
      </p>
      <SectionTitle>Заказ №{order.display_number}</SectionTitle>
      <p className="admin-copy">
        Статус: <strong>{STATUS_LABEL[order.status] ?? order.status}</strong>
      </p>
      <p className="admin-copy">
        Работа:{" "}
        {artwork ? (
          <Link className="admin-table-link" href={`/artworks/${artwork.slug}`}>
            {artwork.title}
          </Link>
        ) : (
          order.artwork_id
        )}
      </p>
      <div className="admin-order-meta">
        <p>
          <span>Покупатель:</span> {order.buyer_name}, {order.buyer_email}
          {order.buyer_phone ? `, ${order.buyer_phone}` : ""}
        </p>
        <p>
          <span>Резерв:</span> {order.artwork_amount_value} {order.currency}
        </p>
        {order.shipping_amount_value != null ? (
          <p>
            <span>Доставка:</span> {order.shipping_amount_value} {order.currency}
          </p>
        ) : null}
        <p>
          <span>Архив для клиента:</span>{" "}
          <a href={publicUrl} rel="noreferrer" target="_blank">
            {publicUrl}
          </a>
        </p>
        <p>
          <span>ID платежа (резерв):</span> {order.yookassa_artwork_payment_id ?? "—"}
        </p>
        <p>
          <span>ID платежа (доставка):</span> {order.yookassa_shipping_payment_id ?? "—"}
        </p>
        {order.tracking_number ? (
          <p>
            <span>Трек:</span> {order.tracking_number}
          </p>
        ) : null}
      </div>

      <AdminOrderActions
        orderId={order.id}
        shippingConfirmationUrl={order.shipping_confirmation_url}
        status={order.status}
      />
    </section>
  );
}
