import { STUDIO_EMAIL } from "@/lib/site-contact";
import type { OrderPublicView } from "@/types/order";

function formatDate(iso: string | null) {
  if (!iso) {
    return "—";
  }
  try {
    return new Intl.DateTimeFormat("ru-RU", {
      dateStyle: "medium",
      timeStyle: "short"
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

type OrderArchiveViewProps = {
  view: OrderPublicView;
};

export function OrderArchiveView({ view }: OrderArchiveViewProps) {
  return (
    <div className="order-archive">
      <header className="order-archive-header">
        <p className="eyebrow">Заказ</p>
        <h1 className="order-archive-title">№ {view.orderNumber}</h1>
        <p className="order-archive-meta">
          Создан: <time dateTime={view.createdAt}>{formatDate(view.createdAt)}</time>
        </p>
      </header>

      {view.banner ? <p className="order-archive-banner">{view.banner}</p> : null}

      <ol className="order-archive-steps">
        {view.steps.map((step) => (
          <li
            className={`order-archive-step${step.date ? " order-archive-step-done" : ""}`}
            key={step.id}
          >
            <span className="order-archive-step-label">{step.label}</span>
            <span className="order-archive-step-date">{formatDate(step.date)}</span>
          </li>
        ))}
      </ol>

      {view.trackingNumber ? (
        <p className="order-archive-tracking">
          Трек-номер: <span>{view.trackingNumber}</span>
        </p>
      ) : null}

      <p className="order-archive-note">
        Страница открывается по ссылке из письма и остаётся доступной как архив заказа. При вопросах
        напишите на{" "}
        <a href={`mailto:${STUDIO_EMAIL}`}>{STUDIO_EMAIL}</a>.
      </p>
    </div>
  );
}
