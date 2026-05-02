import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { OrderArchiveView } from "@/components/order/OrderArchiveView";
import { PageContainer } from "@/components/layout/PageContainer";
import { Section } from "@/components/layout/Section";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { buildPublicOrderView } from "@/lib/order-public-view";
import { ordersStore } from "@/lib/orders-store";

type ZakazPageProps = {
  params: Promise<{ token: string }>;
};

export const metadata: Metadata = {
  title: "Заказ — статус",
  robots: { index: false, follow: false }
};

export default async function ZakazPage({ params }: ZakazPageProps) {
  const { token } = await params;
  const order = await ordersStore.findByToken(token);

  if (!order) {
    notFound();
  }

  const view = buildPublicOrderView({
    displayNumber: order.display_number,
    createdAt: order.created_at,
    status: order.status,
    artworkPaidAt: order.artwork_paid_at,
    preparingAt: order.preparing_at,
    shippedAt: order.shipped_at,
    deliveredAt: order.delivered_at,
    trackingNumber: order.tracking_number
  });

  return (
    <>
      <SiteHeader />
      <main className="zakaz-page">
        <PageContainer>
          <Section className="zakaz-section">
            <OrderArchiveView view={view} />
          </Section>
        </PageContainer>
      </main>
      <SiteFooter />
    </>
  );
}
