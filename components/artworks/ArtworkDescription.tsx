import type { Artwork } from "@/types/artwork";

type ArtworkDescriptionProps = {
  artwork: Artwork;
};

export function ArtworkDescription({ artwork }: ArtworkDescriptionProps) {
  return (
    <div className="artwork-description">
      <p>
        {artwork.description ??
          "\u041e\u043f\u0438\u0441\u0430\u043d\u0438\u0435 \u0440\u0430\u0431\u043e\u0442\u044b \u043f\u043e\u044f\u0432\u0438\u0442\u0441\u044f \u043f\u043e\u0437\u0436\u0435."}
      </p>
    </div>
  );
}
