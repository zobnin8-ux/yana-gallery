import Image from "next/image";
import Link from "next/link";

import type { Artwork } from "@/types/artwork";

type HeroProps = {
  artworks: Artwork[];
};

export function Hero({ artworks }: HeroProps) {
  const [primaryArtwork, secondaryArtwork] = artworks;

  return (
    <section className="hero">
      <div className="hero-inner">
        <div className="hero-copy reveal reveal-delay-1">
          <p className="eyebrow">LGHT art gallery</p>
          <h1 className="hero-title">Yana Zubareva</h1>
          <p className="hero-text">
            Современная живопись, представленная через тишину, атмосферу и спокойное ощущение пространства.
          </p>
          <div className="hero-actions">
            <Link className="hero-link hero-link-primary" href="/gallery">
              Смотреть галерею
            </Link>
            <Link className="hero-link" href="/about">
              Обо мне
            </Link>
          </div>
        </div>
        <div className="hero-visual reveal reveal-delay-2" aria-hidden="true">
          <div className="hero-art-frame hero-art-frame-large">
            {primaryArtwork?.images[0] ? (
              <Image
                src={primaryArtwork.images[0].url}
                alt={primaryArtwork.images[0].alt}
                fill
                priority
                sizes="(max-width: 980px) 100vw, 40vw"
                className="hero-art-image"
              />
            ) : null}
          </div>
          <div className="hero-art-frame hero-art-frame-small">
            {secondaryArtwork?.images[0] ? (
              <Image
                src={secondaryArtwork.images[0].url}
                alt={secondaryArtwork.images[0].alt}
                fill
                priority
                sizes="(max-width: 980px) 40vw, 20vw"
                className="hero-art-image"
              />
            ) : null}
          </div>
          <div className="hero-caption">
            <p>{primaryArtwork?.title ?? "Избранная работа"}</p>
            <span>{primaryArtwork?.year ?? ""}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
