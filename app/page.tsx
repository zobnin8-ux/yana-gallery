import { FeaturedArtworks } from "@/components/artworks/FeaturedArtworks";
import { Hero } from "@/components/layout/Hero";
import { PageContainer } from "@/components/layout/PageContainer";
import { Section } from "@/components/layout/Section";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { artworksRepository } from "@/lib/repositories/artworks-repository";

export default function HomePage() {
  const featuredArtworks = artworksRepository.listFeatured();
  const heroArtworks = artworksRepository.listHero().length ? artworksRepository.listHero() : featuredArtworks.slice(0, 2);
  const collections = artworksRepository.listCollections().filter((collection) => collection.featured);

  return (
    <>
      <SiteHeader />
      <main className="home-page">
        <Hero artworks={heroArtworks} />
        <PageContainer>
          <Section className="home-rhythm">
            <div className="home-rhythm-line" />
            <div className="home-rhythm-copy">
              <p className="eyebrow">Curatorial note</p>
              <p className="home-intro-text">
                Это не каталог товаров, а медленное пространство просмотра: каждая работа оставлена с
                воздухом вокруг себя, чтобы зритель сначала почувствовал тишину, а уже потом прочитал детали.
              </p>
            </div>
          </Section>
          <Section className="collection-teaser-section">
            <div className="collection-teaser-heading">
              <p className="eyebrow">Rooms</p>
              <h2 className="section-heading">Экспозиция собрана как последовательность залов</h2>
            </div>
            <div className="collection-teaser-grid">
              {collections.map((collection) => (
                <a className="collection-teaser-card" href={`/gallery#${collection.slug}`} key={collection.id}>
                  <span>{collection.artworks.length} работ</span>
                  <h3>{collection.name}</h3>
                  {collection.description ? <p>{collection.description}</p> : null}
                </a>
              ))}
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
