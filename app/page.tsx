import { FeaturedArtworks } from "@/components/artworks/FeaturedArtworks";
import { Hero } from "@/components/layout/Hero";
import { PageContainer } from "@/components/layout/PageContainer";
import { Section } from "@/components/layout/Section";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { artworksRepository } from "@/lib/repositories/artworks-repository";
import { worksCountLabel } from "@/lib/ru-plurals";

export default async function HomePage() {
  const featuredArtworks = await artworksRepository.listFeatured();
  const heroArtworks = await artworksRepository.listHero();
  const collections = (await artworksRepository.listCollections()).filter((collection) => collection.featured);
  const displayHeroArtworks = heroArtworks.length ? heroArtworks : featuredArtworks.slice(0, 2);
  const heroArtworkId = displayHeroArtworks[0]?.id;
  const supportingArtworks = featuredArtworks.filter((artwork) => artwork.id !== heroArtworkId);

  return (
    <>
      <SiteHeader />
      <main className="home-page">
        <Hero artworks={displayHeroArtworks} />
        <PageContainer>
          {collections.length ? (
            <Section className="collection-teaser-section">
              <div className="collection-teaser-heading">
                <p className="eyebrow">Залы</p>
                <h2 className="section-heading">Экспозиция собрана как последовательность залов</h2>
              </div>
              <div className="collection-teaser-grid">
                {collections.map((collection) => (
                  <a className="collection-teaser-card" href={`/gallery#${collection.slug}`} key={collection.id}>
                    <span>{worksCountLabel(collection.artworks.length)}</span>
                    <h3>{collection.name}</h3>
                    {collection.description ? <p>{collection.description}</p> : null}
                  </a>
                ))}
              </div>
            </Section>
          ) : null}
          {supportingArtworks.length ? (
            <Section>
              <FeaturedArtworks artworks={supportingArtworks.slice(0, 6)} />
            </Section>
          ) : (
            <Section className="home-single-work">
              <p className="eyebrow">Личный каталог</p>
              <h2 className="section-heading">Экспозиция будет расширяться постепенно.</h2>
              <p>
                Пока в открытом просмотре одна работа, главная страница держит паузу вокруг неё и не имитирует полный каталог.
              </p>
            </Section>
          )}
        </PageContainer>
      </main>
      <SiteFooter />
    </>
  );
}
