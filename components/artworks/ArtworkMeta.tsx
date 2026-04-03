import Link from "next/link";

import type { Artwork } from "@/types/artwork";

type ArtworkMetaProps = {
  artwork: Artwork;
};

function formatDimensions(artwork: Artwork) {
  const parts = [artwork.width, artwork.height].filter(
    (value): value is number => typeof value === "number"
  );

  return parts.length > 0 ? `${parts.join(" × ")} cm` : "On request";
}

function formatPrice(artwork: Artwork) {
  if (typeof artwork.price !== "number") {
    return "\u041f\u043e \u0437\u0430\u043f\u0440\u043e\u0441\u0443";
  }

  if (!artwork.currency) {
    return `${artwork.price}`;
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: artwork.currency,
    maximumFractionDigits: 0
  }).format(artwork.price);
}

export function ArtworkMeta({ artwork }: ArtworkMetaProps) {
  return (
    <div className="artwork-meta">
      <div className="artwork-meta-heading">
        <h1 className="artwork-meta-title">{artwork.title}</h1>
        {artwork.year ? <p className="artwork-meta-year">{artwork.year}</p> : null}
      </div>

      <dl className="artwork-specs">
        <div className="artwork-spec">
          <dt>{"\u0422\u0435\u0445\u043d\u0438\u043a\u0430"}</dt>
          <dd>{artwork.medium ?? "\u041f\u043e \u0437\u0430\u043f\u0440\u043e\u0441\u0443"}</dd>
        </div>
        <div className="artwork-spec">
          <dt>{"\u0420\u0430\u0437\u043c\u0435\u0440"}</dt>
          <dd>{formatDimensions(artwork)}</dd>
        </div>
        <div className="artwork-spec">
          <dt>{"\u0426\u0435\u043d\u0430"}</dt>
          <dd>{formatPrice(artwork)}</dd>
        </div>
      </dl>

      <Link className="artwork-request-link" href="/contact">
        {"\u0417\u0430\u043f\u0440\u043e\u0441\u0438\u0442\u044c"}
      </Link>
    </div>
  );
}
