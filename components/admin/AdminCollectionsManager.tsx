"use client";

import { useEffect, useMemo, useState } from "react";

import {
  applyCollectionOverrides,
  collectionOverridesStorageKey,
  groupArtworksByCollection,
  type CollectionOverrides
} from "@/lib/collections/collection-overrides";
import type { Artwork } from "@/types/artwork";

type AdminCollectionsManagerProps = {
  artworks: Artwork[];
};

const uncategorizedCollectionName = "Без коллекции";

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

function writeCollectionOverrides(overrides: CollectionOverrides) {
  window.localStorage.setItem(collectionOverridesStorageKey, JSON.stringify(overrides));
  window.dispatchEvent(new Event("yana-collections-updated"));
}

export function AdminCollectionsManager({ artworks }: AdminCollectionsManagerProps) {
  const [overrides, setOverrides] = useState<CollectionOverrides>(() => readCollectionOverrides());
  const [selectedCollection, setSelectedCollection] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const [moveValues, setMoveValues] = useState<Record<string, string>>({});
  const [statusMessage, setStatusMessage] = useState("");

  const currentArtworks = useMemo(() => applyCollectionOverrides(artworks, overrides), [artworks, overrides]);
  const collections = useMemo(() => groupArtworksByCollection(currentArtworks), [currentArtworks]);

  useEffect(() => {
    if (!collections.length) {
      setSelectedCollection(null);
      setRenameValue("");
      return;
    }

    const nextSelected =
      selectedCollection && collections.some((item) => item.name === selectedCollection)
        ? selectedCollection
        : collections[0].name;

    setSelectedCollection(nextSelected);
    setRenameValue(nextSelected === uncategorizedCollectionName ? "" : nextSelected);
  }, [collections, selectedCollection]);

  const activeCollection =
    collections.find((collection) => collection.name === selectedCollection) ?? collections[0] ?? null;

  const saveOverrides = (nextOverrides: CollectionOverrides, nextMessage: string) => {
    setOverrides(nextOverrides);
    writeCollectionOverrides(nextOverrides);
    setStatusMessage(nextMessage);
  };

  const handleSelectCollection = (collectionName: string) => {
    setSelectedCollection(collectionName);
    setRenameValue(collectionName === uncategorizedCollectionName ? "" : collectionName);
    setStatusMessage("");
  };

  const handleRenameCollection = () => {
    if (!activeCollection) {
      return;
    }

    const nextName = renameValue.trim();

    if (!nextName || nextName === activeCollection.name) {
      setStatusMessage("Введи новое название коллекции.");
      return;
    }

    const nextOverrides = { ...overrides };

    currentArtworks.forEach((artwork) => {
      const artworkCollection = artwork.collection?.trim() || uncategorizedCollectionName;

      if (artworkCollection === activeCollection.name) {
        nextOverrides[artwork.id] = nextName;
      }
    });

    setSelectedCollection(nextName);
    saveOverrides(nextOverrides, `Коллекция переименована: ${nextName}`);
  };

  const handleDeleteCollection = () => {
    if (!activeCollection) {
      return;
    }

    const nextOverrides = { ...overrides };

    currentArtworks.forEach((artwork) => {
      const artworkCollection = artwork.collection?.trim() || uncategorizedCollectionName;

      if (artworkCollection === activeCollection.name) {
        nextOverrides[artwork.id] = null;
      }
    });

    setSelectedCollection(uncategorizedCollectionName);
    setRenameValue("");
    saveOverrides(nextOverrides, "Коллекция удалена. Картины перенесены в раздел «Без коллекции». ");
  };

  const handleMoveArtwork = (artworkId: string, fallbackCollection: string | null) => {
    const nextName = moveValues[artworkId]?.trim();
    const normalizedName = nextName || fallbackCollection || null;

    saveOverrides(
      {
        ...overrides,
        [artworkId]: normalizedName
      },
      "Картина перемещена в другую коллекцию."
    );
  };

  if (!collections.length) {
    return null;
  }

  return (
    <div className="admin-collections-manager">
      <div className="admin-collection-selector">
        {collections.map((collection) => {
          const isActive = collection.name === activeCollection?.name;

          return (
            <button
              className={`admin-collection-choice${isActive ? " is-active" : ""}`}
              key={collection.name}
              onClick={() => handleSelectCollection(collection.name)}
              type="button"
            >
              <span className="admin-collection-choice-mark">{isActive ? "✓" : ""}</span>
              <span className="admin-collection-choice-copy">
                <strong>{collection.name}</strong>
                <span>{collection.artworks.length} работ</span>
              </span>
            </button>
          );
        })}
      </div>

      {activeCollection ? (
        <article className="admin-collection-panel">
          <div className="admin-collection-panel-head">
            <div>
              <span className="admin-collection-panel-label">Выбранная коллекция</span>
              <h3 className="admin-collection-panel-title">{activeCollection.name}</h3>
              <p className="admin-collection-panel-meta">{activeCollection.artworks.length} работ</p>
            </div>

            <div className="admin-collection-panel-actions">
              <input
                className="admin-collection-rename-input"
                onChange={(event) => setRenameValue(event.target.value)}
                placeholder="Новое название коллекции"
                type="text"
                value={renameValue}
              />
              <button className="admin-table-link" onClick={handleRenameCollection} type="button">
                Переименовать
              </button>
              <button className="admin-collection-delete" onClick={handleDeleteCollection} type="button">
                Удалить коллекцию
              </button>
            </div>
          </div>

          {statusMessage ? <p className="admin-collection-status">{statusMessage}</p> : null}

          <div className="admin-collection-artworks">
            {activeCollection.artworks.map((artwork) => (
              <div className="admin-collection-artwork-row" key={artwork.id}>
                <div className="admin-collection-artwork-copy">
                  <strong>{artwork.title}</strong>
                  <span>{artwork.year ?? "Без года"}</span>
                </div>

                <div className="admin-collection-artwork-move">
                  <input
                    className="admin-collection-move-input"
                    list={`collections-${artwork.id}`}
                    onChange={(event) =>
                      setMoveValues((current) => ({
                        ...current,
                        [artwork.id]: event.target.value
                      }))
                    }
                    placeholder="Название коллекции"
                    type="text"
                    value={moveValues[artwork.id] ?? artwork.collection ?? ""}
                  />
                  <datalist id={`collections-${artwork.id}`}>
                    {collections.map((item) => (
                      <option key={item.name} value={item.name === uncategorizedCollectionName ? "" : item.name} />
                    ))}
                  </datalist>
                  <button
                    className="admin-table-link"
                    onClick={() => handleMoveArtwork(artwork.id, artwork.collection ?? null)}
                    type="button"
                  >
                    Переместить
                  </button>
                </div>
              </div>
            ))}
          </div>
        </article>
      ) : null}
    </div>
  );
}
