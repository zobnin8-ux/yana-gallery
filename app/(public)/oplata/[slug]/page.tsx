import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { OplataForm } from "@/components/checkout/OplataForm";
import { PageContainer } from "@/components/layout/PageContainer";
import { Section } from "@/components/layout/Section";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { isCheckoutEnabled } from "@/lib/checkout-config";
import { artworksRepository } from "@/lib/repositories/artworks-repository";

type OplataPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: OplataPageProps): Promise<Metadata> {
  const { slug } = await params;
  const artwork = await artworksRepository.findBySlug(slug);
  return {
    title: artwork ? `Оплата — ${artwork.title}` : "Оплата",
    robots: { index: false, follow: false }
  };
}

function formatPrice(artwork: NonNullable<Awaited<ReturnType<typeof artworksRepository.findBySlug>>>) {
  if (!artwork.price || !artwork.currency) {
    return "";
  }
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: artwork.currency,
    maximumFractionDigits: 0
  }).format(artwork.price);
}

export default async function OplataPage({ params }: OplataPageProps) {
  const { slug } = await params;
  const artwork = await artworksRepository.findBySlug(slug);

  if (!artwork) {
    notFound();
  }

  const enabled = isCheckoutEnabled();
  const canBuy =
    enabled &&
    artwork.status === "available" &&
    artwork.showPrice &&
    typeof artwork.price === "number" &&
    artwork.price > 0 &&
    artwork.currency === "RUB";

  const priceLabel = formatPrice(artwork);

  return (
    <>
      <SiteHeader />
      <main className="oplata-page">
        <PageContainer>
          <Section className="oplata-section">
            <nav aria-label="Навигация" className="artwork-breadcrumb">
              <Link href="/gallery">Экспозиция</Link>
              <span aria-hidden="true" className="artwork-breadcrumb-sep">
                /
              </span>
              <Link href={`/artworks/${artwork.slug}`}>{artwork.title}</Link>
              <span aria-hidden="true" className="artwork-breadcrumb-sep">
                /
              </span>
              <span className="artwork-breadcrumb-current">Оплата</span>
            </nav>

            <h1 className="oplata-title">Резерв работы онлайн</h1>

            {!enabled ? (
              <p className="oplata-disabled">
                Онлайн-оплата не настроена. Напишите в студию через страницу работы или контакты.
              </p>
            ) : !canBuy ? (
              <p className="oplata-disabled">
                Эта работа сейчас недоступна для онлайн-резерва (нет цены в рублях, не «доступна» или цена
                скрыта). Перейдите к{" "}
                <Link href={`/artworks/${artwork.slug}`}>карточке работы</Link>.
              </p>
            ) : (
              <OplataForm artworkId={artwork.id} artworkTitle={artwork.title} priceLabel={priceLabel} />
            )}
          </Section>
        </PageContainer>
      </main>
      <SiteFooter />
    </>
  );
}
