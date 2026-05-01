import Image from "next/image";

type ArtworkInteriorProps = {
  url: string;
  alt: string;
};

export function ArtworkInterior({ url, alt }: ArtworkInteriorProps) {
  return (
    <figure className="artwork-interior">
      <div className="artwork-interior-frame">
        <Image src={url} alt={alt} fill sizes="(max-width: 980px) 100vw, min(900px, 72vw)" className="artwork-interior-img" />
      </div>
      <figcaption className="artwork-interior-caption">В интерьере</figcaption>
    </figure>
  );
}
