import { FeaturedArtworks } from "@/components/artworks/FeaturedArtworks";
import { Hero } from "@/components/layout/Hero";
import { PageContainer } from "@/components/layout/PageContainer";
import { Section } from "@/components/layout/Section";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { artworksRepository } from "@/lib/repositories/artworks-repository";

export default function HomePage() {
  const featuredArtworks = artworksRepository.listFeatured();
  const heroArtworks = featuredArtworks.slice(0, 2);

  return (
    <>
      <SiteHeader />
      <main className="home-page">
        <Hero artworks={heroArtworks} />
        <PageContainer>
          <Section className="home-rhythm">
            <div className="home-rhythm-line" />
            <div className="home-rhythm-copy">
              <p className="eyebrow">Избранные работы</p>
              <p className="home-intro-text">
                Спокойная онлайн-галерея, построенная вокруг света, пространства, пропорций и
                внимательного, медленного взгляда.
              </p>
            </div>
          </Section>
          <Section>
            <FeaturedArtworks artworks={featuredArtworks.slice(0, 6)} />
          </Section>
        </PageContainer>
      </main>
      <SiteFooter />
    </>
  );
}
