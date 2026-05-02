import type { Metadata } from "next";

import { GalleryCollectionsView } from "@/components/gallery/GalleryCollectionsView";
import { PageContainer } from "@/components/layout/PageContainer";
import { Section } from "@/components/layout/Section";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { artworksRepository } from "@/lib/repositories/artworks-repository";

export const metadata: Metadata = {
  title: "Экспозиция — Яна Зубарева",
  description: "Живопись по сериям: просмотр и запрос сведений о работе в студии.",
  openGraph: { title: "Экспозиция — Яна Зубарева" },
  twitter: { card: "summary_large_image", title: "Экспозиция — Яна Зубарева" }
};

export default async function GalleryPage() {
  const collections = await artworksRepository.listCollections();

  return (
    <>
      <SiteHeader />
      <main className="gallery-page">
        <PageContainer>
          <Section className="gallery-section reveal reveal-delay-1">
            <div className="gallery-heading gallery-heading-salon">
              <div className="gallery-heading-copy">
                <p className="eyebrow">Каталог</p>
                <h1 className="gallery-title">Экспозиция</h1>
              </div>
              <p className="gallery-intro">
                Работы сгруппированы по сериям. Выберите фильтры — откройте карточку, чтобы увидеть работу
                полностью и при необходимости написать в студию.
              </p>
            </div>
            <GalleryCollectionsView collections={collections} />
          </Section>
        </PageContainer>
      </main>
      <SiteFooter />
    </>
  );
}
