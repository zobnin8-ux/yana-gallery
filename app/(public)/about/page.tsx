import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { PageContainer } from "@/components/layout/PageContainer";
import { Section } from "@/components/layout/Section";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { artistBioParagraphs, artistPullquote, artistShowsNote } from "@/lib/content/artist-dossier";
import { getArtistPortraitUrl } from "@/lib/site-settings-store";

export const metadata: Metadata = {
  title: "Художник — Яна Зубарева",
  description:
    "О художнике: практика, серии и заметки о работах. Для стоимости и наличия — запрос в студию.",
  openGraph: { title: "Художник — Яна Зубарева" },
  twitter: { card: "summary_large_image", title: "Художник — Яна Зубарева" }
};

const DEFAULT_ABOUT_IMAGE = "/images/artworks/light-composition-1.svg";

export default async function AboutPage() {
  const portraitUrl = await getArtistPortraitUrl();
  const heroImageSrc = portraitUrl ?? DEFAULT_ABOUT_IMAGE;
  const heroImageAlt = portraitUrl ? "Яна Зубарева" : "Фрагмент работы Яны Зубаревой";

  return (
    <>
      <SiteHeader />
      <main>
        <PageContainer>
          <Section className="about-page artist-dossier">
            <header className="artist-dossier-header">
              <p className="eyebrow">Художник</p>
              <h1 className="artist-dossier-name">Яна Зубарева</h1>
            </header>

            <blockquote className="artist-pullquote">
              <p>{artistPullquote}</p>
            </blockquote>

            <div className="artist-dossier-layout">
              <div className="artist-dossier-visual reveal">
                <div className="artist-dossier-frame">
                  <Image
                    src={heroImageSrc}
                    alt={heroImageAlt}
                    fill
                    sizes="(max-width: 900px) 100vw, 40vw"
                    className="artist-dossier-image"
                  />
                </div>
              </div>
              <div className="artist-dossier-prose reveal reveal-delay-1">
                {artistBioParagraphs.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </div>

            <section aria-labelledby="artist-shows-heading" className="artist-shows">
              <h2 className="artist-shows-title" id="artist-shows-heading">
                Показы и проекты
              </h2>
              <p className="artist-shows-text">{artistShowsNote}</p>
            </section>

            <p className="artist-dossier-cta">
              <Link className="hero-link hero-link-primary" href="/contact">
                Запросить информацию в студии →
              </Link>
            </p>
          </Section>
        </PageContainer>
      </main>
      <SiteFooter />
    </>
  );
}
