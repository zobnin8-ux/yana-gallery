import Image from "next/image";
import Link from "next/link";

import type { Artwork } from "@/types/artwork";

type HeroProps = {
  artworks: Artwork[];
};

export function Hero({ artworks }: HeroProps) {
  const [primaryArtwork, secondaryArtwork] = artworks;
  const primaryImage = primaryArtwork?.images[0];
  const secondaryImage = secondaryArtwork?.images[0];

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
            {primaryImage ? (
              <Image
                src={primaryImage.thumbnailUrl ?? primaryImage.url}
                alt={primaryImage.alt}
                fill
                priority
                sizes="(max-width: 980px) 92vw, 540px"
                className="hero-art-image"
              />
            ) : null}
          </div>
          <div className="hero-art-frame hero-art-frame-small">
            {secondaryImage ? (
              <Image
                src={secondaryImage.thumbnailUrl ?? secondaryImage.url}
                alt={secondaryImage.alt}
                fill
                sizes="(max-width: 980px) 40vw, 280px"
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
