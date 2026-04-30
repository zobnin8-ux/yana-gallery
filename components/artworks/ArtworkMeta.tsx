import Link from "next/link";

import type { Artwork } from "@/types/artwork";

type ArtworkMetaProps = {
  artwork: Artwork;
};

function formatDimensions(artwork: Artwork) {
  const parts = [artwork.width, artwork.height].filter(
    (value): value is number => typeof value === "number"
  );

  return parts.length > 0 ? `${parts.join(" × ")} см` : "По запросу";
}

function formatPrice(artwork: Artwork) {
  if (!artwork.showPrice || typeof artwork.price !== "number") {
    return "\u041f\u043e \u0437\u0430\u043f\u0440\u043e\u0441\u0443";
  }

  if (!artwork.currency) {
    return `${artwork.price}`;
  }

  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: artwork.currency,
    maximumFractionDigits: 0
  }).format(artwork.price);
}

export function ArtworkMeta({ artwork }: ArtworkMetaProps) {
  const statusLabel =
    artwork.status === "available" ? "Доступна" : artwork.status === "reserved" ? "В резерве" : "Продана";

  return (
    <div className="artwork-meta">
      <div className="artwork-meta-heading">
        <p className={`artwork-status artwork-status-${artwork.status}`}>{statusLabel}</p>
        <h1 className="artwork-meta-title">{artwork.title}</h1>
        {artwork.year ? <p className="artwork-meta-year">{artwork.year}</p> : null}
      </div>

      <dl className="artwork-specs">
        <div className="artwork-spec">
          <dt>Материал</dt>
          <dd>{artwork.medium ?? "\u041f\u043e \u0437\u0430\u043f\u0440\u043e\u0441\u0443"}</dd>
        </div>
        <div className="artwork-spec">
          <dt>Размер</dt>
          <dd>{formatDimensions(artwork)}</dd>
        </div>
        <div className="artwork-spec">
          <dt>Стоимость</dt>
          <dd>{formatPrice(artwork)}</dd>
        </div>
        <div className="artwork-spec">
          <dt>Доставка</dt>
          <dd>Индивидуально</dd>
        </div>
      </dl>

      <Link className="artwork-request-link" href={`/contact?artwork=${encodeURIComponent(artwork.title)}`}>
        Запросить информацию
      </Link>
    </div>
  );
}
