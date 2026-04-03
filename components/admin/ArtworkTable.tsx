"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import {
  applyCollectionOverrides,
  collectionOverridesStorageKey,
  groupArtworksByCollection,
  type CollectionOverrides
} from "@/lib/collections/collection-overrides";
import type { Artwork } from "@/types/artwork";

type ArtworkTableProps = {
  artworks: Artwork[];
};

function formatPrice(artwork: Artwork) {
  if (typeof artwork.price !== "number") {
    return "По запросу";
  }

  return artwork.currency ? `${artwork.price} ${artwork.currency}` : `${artwork.price}`;
}

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

export function ArtworkTable({ artworks }: ArtworkTableProps) {
  const [overrides, setOverrides] = useState<CollectionOverrides>(() => readCollectionOverrides());
  const [creatingForArtwork, setCreatingForArtwork] = useState<Record<string, boolean>>({});
  const [newCollectionNames, setNewCollectionNames] = useState<Record<string, string>>({});
  const currentArtworks = useMemo(() => applyCollectionOverrides(artworks, overrides), [artworks, overrides]);
  const collections = useMemo(() => groupArtworksByCollection(currentArtworks), [currentArtworks]);
  const collectionNames = collections.map((collection) => collection.name).filter((name) => name !== "Без коллекции");

  const handleCollectionChange = (artworkId: string, nextCollection: string) => {
    const normalizedCollection = nextCollection.trim() || null;
    const nextOverrides = {
      ...overrides,
      [artworkId]: normalizedCollection
    };

    setOverrides(nextOverrides);
    writeCollectionOverrides(nextOverrides);
  };

  const handleCollectionSelect = (artworkId: string, nextCollection: string) => {
    if (nextCollection === "__new__") {
      setCreatingForArtwork((current) => ({
        ...current,
        [artworkId]: true
      }));
      return;
    }

    setCreatingForArtwork((current) => ({
      ...current,
      [artworkId]: false
    }));
    handleCollectionChange(artworkId, nextCollection);
  };

  const handleCreateCollection = (artworkId: string) => {
    const nextName = newCollectionNames[artworkId]?.trim();

    if (!nextName) {
      return;
    }

    handleCollectionChange(artworkId, nextName);
    setCreatingForArtwork((current) => ({
      ...current,
      [artworkId]: false
    }));
    setNewCollectionNames((current) => ({
      ...current,
      [artworkId]: ""
    }));
  };

  return (
    <div className="admin-table-wrap">
      <div className="admin-table-toolbar">
        <Link className="admin-action-link" href="/admin/artworks/new">
          Добавить работу
        </Link>
      </div>
      <table className="admin-table">
        <thead>
          <tr>
            <th>Название</th>
            <th>Коллекция</th>
            <th>Год</th>
            <th>Техника</th>
            <th>Статус</th>
            <th>Цена</th>
            <th>Действие</th>
          </tr>
        </thead>
        <tbody>
          {currentArtworks.map((artwork) => (
            <tr key={artwork.id}>
              <td>{artwork.title}</td>
              <td>
                <div className="admin-collection-cell">
                  <select
                    className="admin-collection-select"
                    onChange={(event) => handleCollectionSelect(artwork.id, event.target.value)}
                    value={creatingForArtwork[artwork.id] ? "__new__" : artwork.collection ?? ""}
                  >
                    <option value="">Без коллекции</option>
                    {collectionNames.map((collectionName) => (
                      <option key={collectionName} value={collectionName}>
                        {collectionName}
                      </option>
                    ))}
                    <option value="__new__">+ Новая коллекция...</option>
                  </select>

                  {creatingForArtwork[artwork.id] ? (
                    <div className="admin-collection-create">
                      <input
                        className="admin-collection-create-input"
                        onChange={(event) =>
                          setNewCollectionNames((current) => ({
                            ...current,
                            [artwork.id]: event.target.value
                          }))
                        }
                        placeholder="Название новой коллекции"
                        type="text"
                        value={newCollectionNames[artwork.id] ?? ""}
                      />
                      <button
                        className="admin-table-link"
                        onClick={() => handleCreateCollection(artwork.id)}
                        type="button"
                      >
                        Создать
                      </button>
                    </div>
                  ) : null}
                </div>
              </td>
              <td>{artwork.year ?? "-"}</td>
              <td>{artwork.medium ?? "-"}</td>
              <td>{artwork.status === "available" ? "Доступна" : artwork.status === "sold" ? "Продана" : "В резерве"}</td>
              <td>{formatPrice(artwork)}</td>
              <td>
                <Link className="admin-table-link" href={`/admin/artworks/${artwork.id}/edit`}>
                  Редактировать
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
