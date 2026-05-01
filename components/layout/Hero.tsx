import Image from "next/image";
import Link from "next/link";

import { primaryArtworkImageAlt } from "@/lib/artwork-image-alt";
import type { Artwork } from "@/types/artwork";

type HeroProps = {
  artwork: Artwork | undefined;
};

export function Hero({ artwork }: HeroProps) {
  const primaryImage = artwork?.images[0];
  const statusLabel =
    artwork?.status === "available"
      ? "доступна"
      : artwork?.status === "reserved"
        ? "в резерве"
        : artwork?.status === "sold"
          ? "продана"
          : "";

  if (!artwork || !primaryImage) {
    return (
      <section className="home-hero home-hero-empty">
        <div className="home-hero-inner">
          <p className="home-hero-empty-text">Скоро здесь появится первая работа для просмотра.</p>
          <Link className="hero-link hero-link-primary" href="/gallery">
            Перейти в экспозицию
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="home-hero">
      <div className="home-hero-inner">
        <Link className="home-hero-block" href={`/artworks/${artwork.slug}`}>
          <div className="home-hero-frame">
            <Image
              src={primaryImage.url}
              alt={primaryArtworkImageAlt(artwork)}
              fill
              priority
              sizes="100vw"
              className="home-hero-image"
            />
          </div>
          <div className="home-hero-caption">
            <p className="home-hero-piece-title">{artwork.title}</p>
            <p className="home-hero-piece-meta">
              {[artwork.year != null ? String(artwork.year) : null, statusLabel].filter(Boolean).join(" · ")}
            </p>
          </div>
        </Link>
      </div>
    </section>
  );
}
