import { GalleryCollectionsView } from "@/components/gallery/GalleryCollectionsView";
import { PageContainer } from "@/components/layout/PageContainer";
import { Section } from "@/components/layout/Section";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { artworksRepository } from "@/lib/repositories/artworks-repository";

export default async function GalleryPage() {
  const collections = await artworksRepository.listCollections();

  return (
    <>
      <SiteHeader />
      <main className="gallery-page">
        <PageContainer>
          <Section className="gallery-section reveal reveal-delay-1">
            <div className="gallery-heading">
              <div className="gallery-heading-copy">
                <p className="eyebrow">Залы экспозиции</p>
                <h1 className="gallery-title">Экспозиция</h1>
              </div>
              <p className="gallery-intro">
                Откройте зал, затем карточку работы — там крупное фото и подробности.
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
