"use client";

import { useEffect, useState } from "react";

import { ArtworkGrid } from "@/components/artworks/ArtworkGrid";
import {
  applyCollectionOverrides,
  collectionOverridesStorageKey,
  groupArtworksByCollection,
  type CollectionOverrides
} from "@/lib/collections/collection-overrides";
import type { Artwork } from "@/types/artwork";

type GalleryCollectionsViewProps = {
  artworks: Artwork[];
};

function readCollectionOverrides() {
  if (typeof window === "undefined") {
    return {};
  }

  try {
    const rawValue = window.localStorage.getItem(collectionOverridesStorageKey);
    return rawValue ? (JSON.parse(rawValue) as CollectionOverrides) : {};
  } catch {
    return {};
  }
}

export function GalleryCollectionsView({ artworks }: GalleryCollectionsViewProps) {
  const [collections, setCollections] = useState(() => groupArtworksByCollection(artworks));

  useEffect(() => {
    const syncCollections = () => {
      const nextArtworks = applyCollectionOverrides(artworks, readCollectionOverrides());
      setCollections(groupArtworksByCollection(nextArtworks));
    };

    syncCollections();
    window.addEventListener("storage", syncCollections);
    window.addEventListener("yana-collections-updated", syncCollections as EventListener);

    return () => {
      window.removeEventListener("storage", syncCollections);
      window.removeEventListener("yana-collections-updated", syncCollections as EventListener);
    };
  }, [artworks]);

  return (
    <div className="gallery-collections">
      {collections.map((collection) => (
        <section className="gallery-collection" key={collection.name}>
          <div className="gallery-collection-heading">
            <p className="gallery-collection-label">Коллекция</p>
            <h2 className="gallery-collection-title">{collection.name}</h2>
          </div>
          <ArtworkGrid artworks={collection.artworks} variant="gallery" />
        </section>
      ))}
    </div>
  );
}
