import { GalleryCollectionsView } from "@/components/gallery/GalleryCollectionsView";
import { PageContainer } from "@/components/layout/PageContainer";
import { Section } from "@/components/layout/Section";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { artworksRepository } from "@/lib/repositories/artworks-repository";

export default function GalleryPage() {
  const artworks = artworksRepository.list();

  return (
    <>
      <SiteHeader />
      <main className="gallery-page">
        <PageContainer>
          <Section className="gallery-section reveal reveal-delay-1">
            <div className="gallery-heading">
              <div className="gallery-heading-copy">
                <p className="eyebrow">Collection</p>
                <h1 className="gallery-title">Gallery</h1>
              </div>
              <p className="gallery-intro">
                Работы собраны по коллекциям, чтобы каждая серия сохраняла собственный ритм, настроение и
                внутреннюю логику просмотра.
              </p>
            </div>
            <GalleryCollectionsView artworks={artworks} />
          </Section>
        </PageContainer>
      </main>
      <SiteFooter />
    </>
  );
}
