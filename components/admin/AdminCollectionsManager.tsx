"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { worksCountLabel } from "@/lib/ru-plurals";
import type { Artwork, ArtworkCollectionWithArtworks } from "@/types/artwork";

type AdminCollectionsManagerProps = {
  collections: ArtworkCollectionWithArtworks[];
};

function artworkStatusLabel(status: Artwork["status"]) {
  if (status === "available") {
    return "в продаже";
  }
  if (status === "sold") {
    return "продана";
  }
  return "в резерве";
}

export function AdminCollectionsManager({ collections }: AdminCollectionsManagerProps) {
  const router = useRouter();
  const [statusMessage, setStatusMessage] = useState("");
  const [savingId, setSavingId] = useState<string | null>(null);

  async function saveCollection(formData: FormData) {
    const id = String(formData.get("id") ?? "") || undefined;
    const name = String(formData.get("name") ?? "").trim();

    if (!name) {
      setStatusMessage("Введите название коллекции.");
      return;
    }

    setSavingId(id ?? "new");
    const response = await fetch("/api/admin/collections", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id,
        name,
        description: String(formData.get("description") ?? ""),
        coverArtworkId: String(formData.get("coverArtworkId") ?? "") || null,
        sortOrder: Number(formData.get("sortOrder") ?? 100),
        featured: formData.get("featured") === "on"
      })
    });
    const result = (await response.json()) as { success: boolean; message?: string };

    setSavingId(null);
    setStatusMessage(result.success ? "Коллекция сохранена." : result.message ?? "Не удалось сохранить коллекцию.");
    router.refresh();
  }

  async function deleteCollection(collection: ArtworkCollectionWithArtworks) {
    const confirmed = window.confirm(`Удалить коллекцию «${collection.name}»? Работы останутся без коллекции.`);

    if (!confirmed) {
      return;
    }

    setSavingId(collection.id);
    await fetch("/api/admin/collections", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: collection.id })
    });
    setSavingId(null);
    setStatusMessage("Коллекция удалена.");
    router.refresh();
  }

  return (
    <div className="admin-collections-manager">
      {statusMessage ? <p className="admin-collection-status">{statusMessage}</p> : null}

      <form action={saveCollection} className="admin-collection-panel">
        <div className="admin-form-grid">
          <label className="admin-field">
            <span>Новая коллекция</span>
            <input name="name" placeholder="Название коллекции" />
          </label>
          <label className="admin-field">
            <span>Порядок</span>
            <input defaultValue="100" name="sortOrder" />
          </label>
          <label className="admin-field admin-field-full">
            <span>Описание</span>
            <textarea name="description" placeholder="Короткое описание коллекции" rows={3} />
          </label>
        </div>
        <div className="admin-form-actions">
          <button className="admin-submit-button" disabled={savingId === "new"} type="submit">
            {savingId === "new" ? "Создаём..." : "Создать коллекцию"}
          </button>
        </div>
      </form>

      <div className="admin-collections-stack">
        {collections.map((collection) => (
          <form action={saveCollection} className="admin-collection-panel" key={collection.id}>
            <input name="id" type="hidden" value={collection.id} />
            <div className="admin-collection-panel-head">
              <div>
                <span className="admin-collection-panel-label">Коллекция</span>
                <h3 className="admin-collection-panel-title">{collection.name}</h3>
                <p className="admin-collection-panel-meta">{worksCountLabel(collection.artworks.length)}</p>
              </div>
              <div className="admin-collection-panel-actions">
                <button className="admin-table-link" disabled={savingId === collection.id} type="submit">
                  {savingId === collection.id ? "Сохраняем..." : "Сохранить"}
                </button>
                <button
                  className="admin-collection-delete"
                  disabled={collection.id === "collection-uncategorized" || savingId === collection.id}
                  onClick={() => deleteCollection(collection)}
                  type="button"
                >
                  Удалить
                </button>
              </div>
            </div>
            <div className="admin-form-grid admin-collection-edit-grid">
              <label className="admin-field">
                <span>Название</span>
                <input defaultValue={collection.name} name="name" />
              </label>
              <label className="admin-field">
                <span>Порядок</span>
                <input defaultValue={collection.sortOrder} name="sortOrder" />
              </label>
              <label className="admin-field admin-field-full">
                <span>Описание</span>
                <textarea defaultValue={collection.description ?? ""} name="description" rows={3} />
              </label>
              <label className="admin-field admin-field-full">
                <span>Обложка</span>
                <select defaultValue={collection.coverArtworkId ?? ""} name="coverArtworkId">
                  <option value="">Автоматически</option>
                  {collection.artworks.map((artwork) => (
                    <option key={artwork.id} value={artwork.id}>
                      {artwork.title}
                    </option>
                  ))}
                </select>
              </label>
              <label className="admin-field admin-field-full admin-inline-check">
                <input defaultChecked={collection.featured} name="featured" type="checkbox" />
                <span>Показывать как избранную коллекцию</span>
              </label>
            </div>

            <div className="admin-collection-artworks">
              <span className="admin-collection-panel-label">Работы в коллекции</span>
              {collection.artworks.length ? (
                collection.artworks.map((artwork) => {
                  const primaryImage = artwork.images[0];
                  const meta = [artwork.year != null ? String(artwork.year) : null, artworkStatusLabel(artwork.status)]
                    .filter(Boolean)
                    .join(" · ");

                  return (
                    <div className="admin-collection-artwork-row" key={artwork.id}>
                      <div className="admin-collection-artwork-thumb">
                        {primaryImage ? (
                          <Image
                            alt={primaryImage.alt}
                            className="admin-collection-artwork-thumb-img"
                            fill
                            sizes="56px"
                            src={primaryImage.thumbnailUrl ?? primaryImage.url}
                          />
                        ) : (
                          <span className="admin-collection-artwork-thumb-empty">—</span>
                        )}
                      </div>
                      <div className="admin-collection-artwork-copy">
                        <strong>{artwork.title}</strong>
                        {meta ? <span>{meta}</span> : null}
                      </div>
                      <div className="admin-collection-artwork-move">
                        <Link className="admin-table-link" href={`/admin/artworks/${artwork.id}/edit`}>
                          Редактировать
                        </Link>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="admin-collection-panel-meta">В этой коллекции пока нет работ.</p>
              )}
            </div>
          </form>
        ))}
      </div>
    </div>
  );
}
