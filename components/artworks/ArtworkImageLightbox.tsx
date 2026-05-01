"use client";

import Image from "next/image";
import { useEffect } from "react";

type ArtworkImageLightboxProps = {
  src: string;
  alt: string;
  isOpen: boolean;
  onClose: () => void;
};

export function ArtworkImageLightbox({ src, alt, isOpen, onClose }: ArtworkImageLightboxProps) {
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="artwork-lightbox" role="dialog" aria-modal="true" aria-label="Просмотр крупно">
      <button type="button" className="artwork-lightbox-backdrop" onClick={onClose} aria-label="Закрыть" />
      <div className="artwork-lightbox-content">
        <button type="button" className="artwork-lightbox-close" onClick={onClose} aria-label="Закрыть">
          ×
        </button>
        <div className="artwork-lightbox-stage">
          <Image src={src} alt={alt} fill sizes="100vw" className="artwork-lightbox-img" />
        </div>
      </div>
    </div>
  );
}
