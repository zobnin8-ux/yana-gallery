"use client";

import { useMemo, useState } from "react";

import { ArtworkCard } from "@/components/artworks/ArtworkCard";
import { worksCountLabel } from "@/lib/ru-plurals";
import type { ArtworkCollectionWithArtworks, ArtworkStatus } from "@/types/artwork";

type GalleryCollectionsViewProps = {
  collections: ArtworkCollectionWithArtworks[];
};

const statusLabels: Record<ArtworkStatus | "all", string> = {
  all: "все",
  available: "доступные",
  reserved: "в резерве",
  sold: "проданные"
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
      <div className="gallery-filters-line" role="navigation" aria-label="Фильтры галереи">
        <span className="gallery-filters-label">Серия:</span>
        <button
          className={`gallery-filter-anchor${activeCollectionId === "all" ? " is-active" : ""}`}
          onClick={() => setActiveCollectionId("all")}
          type="button"
        >
          все
        </button>
        {collections.map((collection) => (
          <button
            className={`gallery-filter-anchor${activeCollectionId === collection.id ? " is-active" : ""}`}
            key={collection.id}
            onClick={() => setActiveCollectionId(collection.id)}
            type="button"
          >
            {collection.name}
          </button>
        ))}
        <span className="gallery-filters-sep" aria-hidden="true">
          ·
        </span>
        <span className="gallery-filters-label">Статус:</span>
        {(Object.keys(statusLabels) as Array<ArtworkStatus | "all">).map((status) => (
          <button
            className={`gallery-filter-anchor${activeStatus === status ? " is-active" : ""}`}
            key={status}
            onClick={() => setActiveStatus(status)}
            type="button"
          >
            {statusLabels[status]}
          </button>
        ))}
      </div>

      <div className="gallery-collections gallery-collections-salon">
        {visibleCollections.length === 0 ? (
          <div className="gallery-empty">
            <p className="gallery-empty-title">Для выбранных фильтров работ нет.</p>
            <button
              className="gallery-filter-anchor is-active"
              onClick={() => {
                setActiveCollectionId("all");
                setActiveStatus("all");
              }}
              type="button"
            >
              Сбросить фильтры
            </button>
          </div>
        ) : (
          visibleCollections.map((collection) => (
            <section className="gallery-collection gallery-collection-salon" id={collection.slug} key={collection.id}>
              <header className="gallery-series-header">
                <h2 className="gallery-series-title">{collection.name}</h2>
                <p className="gallery-series-meta">{worksCountLabel(collection.artworks.length)}</p>
                {collection.description ? <p className="gallery-series-lede">{collection.description}</p> : null}
              </header>
              <div className="artwork-grid artwork-grid-gallery gallery-salon-grid">
                {collection.artworks.map((artwork) => (
                  <ArtworkCard artwork={artwork} key={artwork.id} variant="gallery" />
                ))}
              </div>
            </section>
          ))
        )}
      </div>
    </div>
  );
}
