import Image from "next/image";
import Link from "next/link";

import type { Artwork } from "@/types/artwork";

type HeroProps = {
  artworks: Artwork[];
};

export function Hero({ artworks }: HeroProps) {
  const [primaryArtwork] = artworks;
  const primaryImage = primaryArtwork?.images[0];
  const statusLabel =
    primaryArtwork?.status === "available"
      ? "Доступна"
      : primaryArtwork?.status === "reserved"
        ? "В резерве"
        : primaryArtwork?.status === "sold"
          ? "Продана"
          : "";

  return (
    <section className="hero">
      <div className="hero-inner">
        <div className="hero-copy reveal reveal-delay-1">
          <p className="eyebrow">Частный просмотр / 2026</p>
          <h1 className="hero-title">Яна Зубарева</h1>
          <p className="hero-text">
            Живопись как тихое поле присутствия: свет, воздух, пауза и почти архитектурное чувство пространства.
          </p>
          <div className="hero-actions">
            <Link className="hero-link hero-link-primary" href="/gallery">
              Войти в экспозицию
            </Link>
            <Link className="hero-link" href="/about">
              Текст художника
            </Link>
          </div>
          <div className="hero-proof">
            <span>Авторские работы</span>
            <span>Запросы в студию</span>
            <span>Каталог по запросу</span>
          </div>
        </div>
        <div className="hero-visual reveal reveal-delay-2" aria-hidden="true">
          <div className="hero-art-frame hero-art-frame-large">
            {primaryImage ? (
              <Image
                src={primaryImage.url}
                alt={primaryImage.alt}
                fill
                priority
                sizes="(max-width: 980px) 92vw, 620px"
                className="hero-art-image"
              />
            ) : null}
          </div>
          <div className="hero-caption">
            <span>01</span>
            <div>
              <p>{primaryArtwork?.title ?? "Избранная работа"}</p>
              <span>
                {[primaryArtwork?.year, primaryArtwork?.medium, statusLabel].filter(Boolean).join(" / ")}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
