import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { ArtworkDescription } from "@/components/artworks/ArtworkDescription";
import { ArtworkHero } from "@/components/artworks/ArtworkHero";
import { ArtworkMeta } from "@/components/artworks/ArtworkMeta";
import { ArtworkSeriesNav } from "@/components/artworks/ArtworkSeriesNav";
import { PageContainer } from "@/components/layout/PageContainer";
import { Section } from "@/components/layout/Section";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { primaryArtworkImageAlt } from "@/lib/artwork-image-alt";
import { getSeriesPrevNext } from "@/lib/artwork-series";
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

  const description =
    artwork.seoDescription?.trim() ||
    [artwork.medium?.trim(), artwork.year != null ? String(artwork.year) : null].filter(Boolean).join(". ") ||
    `Работа «${artwork.title}».`;

  return {
    title: artwork.seoTitle ?? `${artwork.title} — живопись Яны Зубаревой`,
    description,
    alternates: {
      canonical: `/artworks/${artwork.slug}`
    },
    openGraph: {
      type: "article",
      title: artwork.seoTitle ?? artwork.title,
      description: artwork.seoDescription?.trim() || description,
      images: image ? [{ url: image.url, alt: primaryArtworkImageAlt(artwork) }] : undefined
    },
    twitter: {
      card: "summary_large_image",
      title: artwork.seoTitle ?? artwork.title,
      description: artwork.seoDescription?.trim() || description,
      images: image ? [image.url] : undefined
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
  const collectionGalleryHref = matchedCollection ? `/gallery#${matchedCollection.slug}` : undefined;
  const { prev, next } = getSeriesPrevNext(artwork, collections);

  return (
    <>
      <SiteHeader />
      <main className="artwork-page">
        <PageContainer>
          <Section className="artwork-section">
            <div className="artwork-layout artwork-layout-spread">
              <div className="artwork-main-column">
                <ArtworkHero artwork={artwork} />
                <ArtworkDescription artwork={artwork} />
                <ArtworkSeriesNav next={next} prev={prev} />
              </div>
              <aside className="artwork-panel">
                <ArtworkMeta artwork={artwork} collectionGalleryHref={collectionGalleryHref} />
              </aside>
            </div>
          </Section>
        </PageContainer>
      </main>
      <SiteFooter />
    </>
  );
}
