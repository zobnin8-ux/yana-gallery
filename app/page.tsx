import type { Metadata } from "next";
import Link from "next/link";

import { HomeWorkFeed } from "@/components/home/HomeWorkFeed";
import { HomeFrontispiece } from "@/components/layout/HomeFrontispiece";
import { PageContainer } from "@/components/layout/PageContainer";
import { Section } from "@/components/layout/Section";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { homeActualLine } from "@/lib/content/home-actual";
import { artworksRepository } from "@/lib/repositories/artworks-repository";

const HOME_LEDE =
  "Тихий онлайн‑зал: выбранные работы, серии и подробности по запросу в студии.";

export const metadata: Metadata = {
  title: "Яна Зубарева — частная галерея",
  description: "Тихая онлайн‑экспозиция работ: серии, статус и контакт со студией.",
  openGraph: { title: "Яна Зубарева — частная галерея" },
  twitter: { card: "summary_large_image", title: "Яна Зубарева — частная галерея" }
};

export default async function HomePage() {
  const featuredArtworks = await artworksRepository.listFeatured();
  const heroArtworks = await artworksRepository.listHero();
  const heroSource = heroArtworks.length ? heroArtworks : featuredArtworks;
  const heroArtwork = heroSource[0];
  const heroId = heroArtwork?.id;
  const feedArtworks = featuredArtworks.filter((artwork) => artwork.id !== heroId).slice(0, 6);

  return (
    <>
      <SiteHeader />
      <main className="home-page">
        <HomeFrontispiece artwork={heroArtwork} lede={HOME_LEDE} />
        <PageContainer>
          <aside aria-label="Актуальное" className="home-actual">
            <p className="home-actual-text">{homeActualLine}</p>
          </aside>
          {feedArtworks.length ? (
            <Section className="home-featured-section reveal reveal-delay-1">
              <header className="home-featured-header">
                <h2 className="home-featured-heading">Избранное</h2>
                <p className="home-featured-sub">Небольшая выборка из текущей экспозиции. Полный каталог — в разделе «Экспозиция».</p>
              </header>
              <HomeWorkFeed artworks={feedArtworks} />
            </Section>
          ) : heroArtwork ? (
            <Section className="home-feed-section home-feed-section-sparse reveal reveal-delay-1">
              <p className="home-feed-sparse-note">Ещё работы — в полной экспозиции.</p>
            </Section>
          ) : (
            <Section className="home-single-work">
              <h2 className="section-heading">Экспозиция будет расширяться постепенно.</h2>
              <p>Пока в открытом просмотре нет работ — загляните позже или откройте галерею.</p>
            </Section>
          )}
          <p className="home-view-all reveal">
            <Link className="hero-link hero-link-primary" href="/gallery">
              Полная экспозиция →
            </Link>
          </p>
        </PageContainer>
      </main>
      <SiteFooter />
    </>
  );
}
