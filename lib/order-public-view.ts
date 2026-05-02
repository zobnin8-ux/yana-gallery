import type { OrderPublicView, OrderStatus } from "@/types/order";

function iso(d: string | null): string | null {
  return d;
}

export function buildPublicOrderView(input: {
  displayNumber: number;
  createdAt: string;
  status: OrderStatus;
  artworkPaidAt: string | null;
  preparingAt: string | null;
  shippedAt: string | null;
  deliveredAt: string | null;
  trackingNumber: string | null;
}): OrderPublicView {
  const banner = bannerForStatus(input.status);
  return {
    orderNumber: String(input.displayNumber),
    createdAt: input.createdAt,
    status: input.status,
    banner,
    steps: [
      { id: "paid", label: "Оплачено", date: iso(input.artworkPaidAt) },
      { id: "preparing", label: "Готовится к отправке", date: iso(input.preparingAt) },
      { id: "shipped", label: "Отправлено", date: iso(input.shippedAt) },
      { id: "delivered", label: "Доставлено", date: iso(input.deliveredAt) }
    ],
    trackingNumber: input.trackingNumber
  };
}

function bannerForStatus(status: OrderStatus): string | null {
  switch (status) {
    case "pending_payment":
      return "Ожидаем оплату резерва работы.";
    case "awaiting_confirmation":
      return "Ожидаем подтверждения галереи (до одного рабочего дня после оплаты).";
    case "rejected":
      return "Заказ отклонён. Возврат средств инициирован автоматически.";
    case "awaiting_shipping_payment":
      return "Заказ подтверждён. Оплатите доставку по ссылке из письма.";
    case "preparing":
      return null;
    case "shipped":
      return null;
    case "delivered":
      return null;
    default:
      return null;
  }
}
