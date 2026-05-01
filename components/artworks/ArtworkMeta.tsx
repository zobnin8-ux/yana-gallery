import Link from "next/link";

import type { Artwork } from "@/types/artwork";

type ArtworkMetaProps = {
  artwork: Artwork;
  collectionGalleryHref?: string;
};

const SPECS_FALLBACK =
  "Технические данные и стоимость — по запросу в студии. Напишите в Telegram, отвечаю в течение 24 часов.";

function formatDimensionsFromNumbers(artwork: Artwork) {
  const parts = [artwork.width, artwork.height].filter((value): value is number => typeof value === "number");
  return parts.length > 0 ? `${parts.join(" × ")} см` : null;
}

function resolveSize(artwork: Artwork): string | null {
  const label = artwork.sizeLabel?.trim();
  if (label) {
    return label;
  }
  return formatDimensionsFromNumbers(artwork);
}

function formatNumericPrice(artwork: Artwork): string | null {
  if (!artwork.showPrice || typeof artwork.price !== "number") {
    return null;
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

function resolvePrice(artwork: Artwork): string | null {
  const range = artwork.priceRange?.trim();
  if (range) {
    return range;
  }
  return formatNumericPrice(artwork);
}

function buildSpecs(artwork: Artwork): Array<{ term: string; value: string }> {
  const rows: Array<{ term: string; value: string }> = [];
  const material = artwork.medium?.trim();
  if (material) {
    rows.push({ term: "Материал", value: material });
  }
  const size = resolveSize(artwork);
  if (size) {
    rows.push({ term: "Размер", value: size });
  }
  const price = resolvePrice(artwork);
  if (price) {
    rows.push({ term: "Стоимость", value: price });
  }
  const shipping = artwork.shippingNote?.trim();
  if (shipping) {
    rows.push({ term: "Доставка", value: shipping });
  }
  return rows;
}

export function ArtworkMeta({ artwork, collectionGalleryHref }: ArtworkMetaProps) {
  const statusLabel =
    artwork.status === "available" ? "Доступна" : artwork.status === "reserved" ? "В резерве" : "Продана";
  const specs = buildSpecs(artwork);
  const collectionLabel = artwork.collection ?? "Без коллекции";

  return (
    <div className="artwork-meta">
      <div className="artwork-meta-heading">
        {collectionGalleryHref ? (
          <p className="artwork-meta-collection">
            <Link href={collectionGalleryHref}>{collectionLabel}</Link>
          </p>
        ) : null}
        <p className={`artwork-status artwork-status-${artwork.status}`}>{statusLabel}</p>
        <h1 className="artwork-meta-title">{artwork.title}</h1>
        {artwork.year ? <p className="artwork-meta-year">{artwork.year}</p> : null}
      </div>

      {specs.length > 0 ? (
        <dl className="artwork-specs">
          {specs.map(({ term, value }) => (
            <div className="artwork-spec" key={term}>
              <dt>{term}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
      ) : (
        <p className="artwork-specs-fallback">{SPECS_FALLBACK}</p>
      )}

      <Link className="artwork-request-link" href={`/contact?artwork=${encodeURIComponent(artwork.title)}`}>
        Запросить информацию
      </Link>
    </div>
  );
}
