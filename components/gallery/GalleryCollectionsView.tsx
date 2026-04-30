"use client";

import { useMemo, useState } from "react";

import { ArtworkGrid } from "@/components/artworks/ArtworkGrid";
import { worksCountLabel } from "@/lib/ru-plurals";
import type { ArtworkCollectionWithArtworks, ArtworkStatus } from "@/types/artwork";

type GalleryCollectionsViewProps = {
  collections: ArtworkCollectionWithArtworks[];
};

const statusLabels: Record<ArtworkStatus | "all", string> = {
  all: "Все",
  available: "Доступные",
  reserved: "В резерве",
  sold: "Проданные"
};

export function GalleryCollectionsView({ collections }: GalleryCollectionsViewProps) {
  const [activeCollectionId, setActiveCollectionId] = useState("all");
  const [activeStatus, setActiveStatus] = useState<ArtworkStatus | "all">("all");

  const visibleCollections = useMemo(() => {
    return collections
      .filter((collection) => activeCollectionId === "all" || collection.id === activeCollectionId)
      .map((collection) => ({
        ...collection,
        artworks: collection.artworks.filter((artwork) => activeStatus === "all" || artwork.status === activeStatus)
      }))
      .filter((collection) => collection.artworks.length > 0);
  }, [activeCollectionId, activeStatus, collections]);

  return (
    <div className="gallery-collections-view">
      <div className="gallery-filter-bar" aria-label="Фильтры галереи">
        <button
          className={activeCollectionId === "all" ? "is-active" : ""}
          onClick={() => setActiveCollectionId("all")}
          type="button"
        >
          Все коллекции
        </button>
        {collections.map((collection) => (
          <button
            className={activeCollectionId === collection.id ? "is-active" : ""}
            key={collection.id}
            onClick={() => setActiveCollectionId(collection.id)}
            type="button"
          >
            {collection.name}
          </button>
        ))}
      </div>

      <div className="gallery-filter-bar gallery-filter-bar-secondary" aria-label="Фильтр по статусу">
        {(Object.keys(statusLabels) as Array<ArtworkStatus | "all">).map((status) => (
          <button
            className={activeStatus === status ? "is-active" : ""}
            key={status}
            onClick={() => setActiveStatus(status)}
            type="button"
          >
            {statusLabels[status]}
          </button>
        ))}
      </div>

      <div className="gallery-collections">
        {visibleCollections.map((collection, index) => (
          <section className="gallery-collection" id={collection.slug} key={collection.id}>
            <div className="gallery-collection-heading">
              <div>
                <p className="gallery-collection-label">Зал {String(index + 1).padStart(2, "0")}</p>
                <h2 className="gallery-collection-title">{collection.name}</h2>
              </div>
              <div className="gallery-collection-note">
                <span>{worksCountLabel(collection.artworks.length)}</span>
                {collection.description ? <p>{collection.description}</p> : null}
              </div>
            </div>
            <ArtworkGrid artworks={collection.artworks} variant="gallery" />
          </section>
        ))}
      </div>
    </div>
  );
}
