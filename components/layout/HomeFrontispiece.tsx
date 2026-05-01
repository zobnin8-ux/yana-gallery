import Image from "next/image";
import Link from "next/link";

import { primaryArtworkImageAlt } from "@/lib/artwork-image-alt";
import type { Artwork } from "@/types/artwork";

type HomeFrontispieceProps = {
  artwork: Artwork | undefined;
  lede: string;
};

export function HomeFrontispiece({ artwork, lede }: HomeFrontispieceProps) {
  const primaryImage = artwork?.images[0];

  if (!artwork || !primaryImage) {
    return (
      <section className="home-frontispiece home-frontispiece-empty">
        <div className="home-frontispiece-inner">
          <div className="home-frontispiece-copy">
            <p className="eyebrow home-frontispiece-eyebrow">Частная галерея</p>
            <h1 className="home-frontispiece-title">Яна Зубарева</h1>
            <p className="home-frontispiece-lede">{lede}</p>
            <div className="home-frontispiece-actions">
              <Link className="hero-link hero-link-primary" href="/gallery">
                Экспозиция
              </Link>
              <Link className="hero-link" href="/contact">
                Студия
              </Link>
            </div>
          </div>
          <div className="home-frontispiece-visual home-frontispiece-visual-empty">
            <p className="home-frontispiece-empty-note">Первые работы для домашней страницы скоро появятся.</p>
            <Link className="hero-link hero-link-primary" href="/gallery">
              Перейти в экспозицию
            </Link>
          </div>
        </div>
      </section>
    );
  }

  const statusLabel =
    artwork.status === "available"
      ? "доступна"
      : artwork.status === "reserved"
        ? "в резерве"
        : artwork.status === "sold"
          ? "продана"
          : "";

  return (
    <section className="home-frontispiece">
      <div className="home-frontispiece-inner">
        <div className="home-frontispiece-copy">
          <p className="eyebrow home-frontispiece-eyebrow">Частная галерея</p>
          <h1 className="home-frontispiece-title">Яна Зубарева</h1>
          <p className="home-frontispiece-lede">{lede}</p>
          <div className="home-frontispiece-actions">
            <Link className="hero-link hero-link-primary" href="/gallery">
              Экспозиция
            </Link>
            <Link className="hero-link" href="/about">
              Художник
            </Link>
            <Link className="hero-link" href="/contact">
              Студия
            </Link>
          </div>
        </div>
        <div className="home-frontispiece-visual">
          <Link className="home-frontispiece-piece" href={`/artworks/${artwork.slug}`}>
            <div className="home-frontispiece-frame">
              <Image
                src={primaryImage.url}
                alt={primaryArtworkImageAlt(artwork)}
                fill
                priority
                sizes="(max-width: 860px) 100vw, 42vw"
                className="home-frontispiece-image"
              />
            </div>
            <div className="home-frontispiece-caption">
              <p className="home-frontispiece-piece-title">{artwork.title}</p>
              <p className="home-frontispiece-piece-meta">
                {[artwork.year != null ? String(artwork.year) : null, statusLabel].filter(Boolean).join(" · ")}
              </p>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
