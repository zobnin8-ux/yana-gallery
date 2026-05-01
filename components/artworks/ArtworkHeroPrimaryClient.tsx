"use client";

import Image from "next/image";
import { useState } from "react";

import { ArtworkImageLightbox } from "@/components/artworks/ArtworkImageLightbox";
import { primaryArtworkImageAlt } from "@/lib/artwork-image-alt";
import type { Artwork, ArtworkImage } from "@/types/artwork";

type ArtworkHeroPrimaryClientProps = {
  artwork: Artwork;
  primaryImage: ArtworkImage;
};

export function ArtworkHeroPrimaryClient({ artwork, primaryImage }: ArtworkHeroPrimaryClientProps) {
  const [open, setOpen] = useState(false);
  const alt = primaryArtworkImageAlt(artwork);

  return (
    <>
      <button
        type="button"
        className="artwork-hero-zoom"
        onClick={() => setOpen(true)}
        aria-label="Открыть изображение крупно"
      >
        <Image
          src={primaryImage.url}
          alt={alt}
          fill
          priority
          sizes="(max-width: 980px) 100vw, 72vw"
          className="artwork-hero-image"
        />
      </button>
      <ArtworkImageLightbox src={primaryImage.url} alt={alt} isOpen={open} onClose={() => setOpen(false)} />
    </>
  );
}
