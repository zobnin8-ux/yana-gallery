import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { PageContainer } from "@/components/layout/PageContainer";
import { Section } from "@/components/layout/Section";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { artistBioParagraphs, artistPullquote, artistShowsNote } from "@/lib/content/artist-dossier";

export const metadata: Metadata = {
  title: "Художник — Яна Зубарева",
  description:
    "Живопись как пространство тишины и света. Практика, серии и контакт со студией для запросов по работам.",
  openGraph: { title: "Художник — Яна Зубарева" },
  twitter: { card: "summary_large_image", title: "Художник — Яна Зубарева" }
};

export default function AboutPage() {
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
                    src="/images/artworks/light-composition-1.svg"
                    alt="Фрагмент работы Яны Зубаревой"
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
