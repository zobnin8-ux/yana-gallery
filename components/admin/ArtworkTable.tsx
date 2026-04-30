"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

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

function formatStatus(artwork: Artwork) {
  if (artwork.status === "available") {
    return "В продаже";
  }

  if (artwork.status === "sold") {
    return "Продана";
  }

  return "В резерве";
}

export function ArtworkTable({ artworks }: ArtworkTableProps) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleDelete(artwork: Artwork) {
    const confirmed = window.confirm(`Удалить работу «${artwork.title}»?`);

    if (!confirmed) {
      return;
    }

    setDeletingId(artwork.id);
    await fetch("/api/admin/artworks", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: artwork.id })
    });
    setDeletingId(null);
    router.refresh();
  }

  return (
    <div className="admin-table-wrap">
      <div className="admin-table-toolbar">
        <div>
          <h2 className="admin-workspace-title">Картины</h2>
          <p className="admin-workspace-copy">Редактируйте карточки, статусы и публикацию работ.</p>
        </div>
        <Link className="admin-action-link" href="/admin/artworks/new">
          Добавить картину
        </Link>
      </div>
      <div className="admin-artwork-card-grid">
        {artworks.map((artwork) => {
          const primaryImage = artwork.images[0];

          return (
            <article className="admin-artwork-card" key={artwork.id}>
              <div className="admin-artwork-card-image">
                {primaryImage ? (
                  <Image
                    src={primaryImage.thumbnailUrl ?? primaryImage.url}
                    alt={primaryImage.alt}
                    fill
                    sizes="(max-width: 760px) 92vw, 320px"
                    className="admin-artwork-card-img"
                  />
                ) : (
                  <span>Добавьте изображение</span>
                )}
              </div>
              <div className="admin-artwork-card-body">
                <div className="admin-artwork-card-head">
                  <span className={`admin-status-pill admin-status-pill-${artwork.status}`}>{formatStatus(artwork)}</span>
                  {artwork.featured ? <span className="admin-status-pill">На главной</span> : null}
                </div>
                <h3>{artwork.title}</h3>
                <dl className="admin-artwork-card-meta">
                  <div>
                    <dt>Коллекция</dt>
                    <dd>{artwork.collection ?? "Без коллекции"}</dd>
                  </div>
                  <div>
                    <dt>Год / размер</dt>
                    <dd>
                      {[artwork.year, artwork.width && artwork.height ? `${artwork.width} × ${artwork.height} см` : null]
                        .filter(Boolean)
                        .join(", ") || "Не указано"}
                    </dd>
                  </div>
                  <div>
                    <dt>Цена</dt>
                    <dd>{formatPrice(artwork)}</dd>
                  </div>
                </dl>
                <div className="admin-artwork-card-actions">
                  <Link className="admin-table-link" href={`/admin/artworks/${artwork.id}/edit`}>
                    Редактировать
                  </Link>
                  <button
                    className="admin-collection-delete"
                    disabled={deletingId === artwork.id}
                    onClick={() => handleDelete(artwork)}
                    type="button"
                  >
                    {deletingId === artwork.id ? "Удаляем..." : "Удалить"}
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
