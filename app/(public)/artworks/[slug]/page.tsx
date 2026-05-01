import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { ArtworkDescription } from "@/components/artworks/ArtworkDescription";
import { ArtworkHero } from "@/components/artworks/ArtworkHero";
import { ArtworkMeta } from "@/components/artworks/ArtworkMeta";
import { PageContainer } from "@/components/layout/PageContainer";
import { Section } from "@/components/layout/Section";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { getArtworkBySlug } from "@/lib/artworks/get-artwork-by-slug";
import { artworksRepository } from "@/lib/repositories/artworks-repository";

type ArtworkPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({ params }: ArtworkPageProps): Promise<Metadata> {
  const { slug } = await params;
  const artwork = await getArtworkBySlug(slug);
  const image = artwork?.images[0];

  if (!artwork) {
    return {
      title: "Работа не найдена | Галерея Яны Зубаревой"
    };
  }

  return {
    title: artwork.seoTitle ?? `${artwork.title} | Галерея Яны Зубаревой`,
    description: artwork.seoDescription ?? artwork.description ?? "Работа художницы Яны Зубаревой.",
    openGraph: {
      title: artwork.seoTitle ?? artwork.title,
      description: artwork.seoDescription ?? artwork.description ?? undefined,
      images: image ? [{ url: image.url, alt: image.alt }] : undefined
    }
  };
}

export default async function ArtworkPage({ params }: ArtworkPageProps) {
  const { slug } = await params;
  const artwork = await getArtworkBySlug(slug);

  if (!artwork) {
    notFound();
  }

  const collections = await artworksRepository.listCollections();
  const matchedCollection = artwork.collectionId
    ? collections.find((collection) => collection.id === artwork.collectionId)
    : null;
  const collectionGalleryHref = matchedCollection
    ? `/gallery#${matchedCollection.slug}`
    : artwork.collectionId
      ? "/gallery"
      : "/gallery#uncategorized";

  return (
    <>
      <SiteHeader />
      <main className="artwork-page">
        <PageContainer>
          <Section className="artwork-section">
            <div className="artwork-layout">
              <ArtworkHero artwork={artwork} />
              <div className="artwork-panel">
                <ArtworkMeta artwork={artwork} collectionGalleryHref={collectionGalleryHref} />
                <ArtworkDescription artwork={artwork} />
              </div>
            </div>
          </Section>
        </PageContainer>
      </main>
      <SiteFooter />
    </>
  );
}
