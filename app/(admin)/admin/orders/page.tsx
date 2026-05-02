import Link from "next/link";

import { SectionTitle } from "@/components/layout/SectionTitle";
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

export default async function AdminOrdersPage() {
  const orders = await ordersStore.listOrders();

  return (
    <section className="admin-section">
      <SectionTitle>Заказы</SectionTitle>
      <p className="admin-copy">
        Резервы и оплаты оригиналов. Подтверждение галереей — в течение одного рабочего дня.
      </p>
      {orders.length === 0 ? (
        <p className="admin-copy">Заказов пока нет. Убедитесь, что в Supabase выполнен скрипт <code>supabase/orders.sql</code>.</p>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-orders-table">
            <thead>
              <tr>
                <th>№</th>
                <th>Статус</th>
                <th>Email</th>
                <th>Сумма</th>
                <th>Создан</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>{order.display_number}</td>
                  <td>{STATUS_LABEL[order.status] ?? order.status}</td>
                  <td>{order.buyer_email}</td>
                  <td>
                    {order.artwork_amount_value} {order.currency}
                  </td>
                  <td>{new Date(order.created_at).toLocaleString("ru-RU")}</td>
                  <td>
                    <Link className="admin-table-link" href={`/admin/orders/${order.id}`}>
                      Открыть
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
