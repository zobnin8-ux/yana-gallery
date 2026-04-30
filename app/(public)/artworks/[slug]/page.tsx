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
      title: "Работа не найдена | Yana Zubareva Gallery"
    };
  }

  return {
    title: artwork.seoTitle ?? `${artwork.title} | Yana Zubareva Gallery`,
    description: artwork.seoDescription ?? artwork.description ?? "Работа художницы Yana Zubareva.",
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

  return (
    <>
      <SiteHeader />
      <main className="artwork-page">
        <PageContainer>
          <Section className="artwork-section">
            <div className="artwork-page-intro reveal reveal-delay-1">
              <p className="eyebrow">Artwork passport</p>
            </div>
            <div className="artwork-layout">
              <ArtworkHero artwork={artwork} />
              <div className="artwork-panel">
                <ArtworkMeta artwork={artwork} />
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
