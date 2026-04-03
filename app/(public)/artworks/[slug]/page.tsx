import { notFound } from "next/navigation";

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

export default async function ArtworkPage({ params }: ArtworkPageProps) {
  const { slug } = await params;
  const artwork = getArtworkBySlug(slug);

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
              <p className="eyebrow">Artwork</p>
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
