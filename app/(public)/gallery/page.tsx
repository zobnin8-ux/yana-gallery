import { GalleryCollectionsView } from "@/components/gallery/GalleryCollectionsView";
import { PageContainer } from "@/components/layout/PageContainer";
import { Section } from "@/components/layout/Section";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { artworksRepository } from "@/lib/repositories/artworks-repository";

export default function GalleryPage() {
  const collections = artworksRepository.listCollections();

  return (
    <>
      <SiteHeader />
      <main className="gallery-page">
        <PageContainer>
          <Section className="gallery-section reveal reveal-delay-1">
            <div className="gallery-heading">
              <div className="gallery-heading-copy">
                <p className="eyebrow">Viewing room</p>
                <h1 className="gallery-title">Галерея работ</h1>
              </div>
              <p className="gallery-intro">
                Каждая серия собрана как отдельная комната: можно смотреть всё сразу или оставить только
                доступные работы, чтобы выбрать объект для запроса.
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
