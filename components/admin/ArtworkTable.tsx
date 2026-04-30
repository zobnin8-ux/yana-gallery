"use client";

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
          {artworks.map((artwork) => (
            <tr key={artwork.id}>
              <td>{artwork.title}</td>
              <td>{artwork.collection ?? "Без коллекции"}</td>
              <td>{artwork.year ?? "-"}</td>
              <td>{artwork.medium ?? "-"}</td>
              <td>{artwork.status === "available" ? "Доступна" : artwork.status === "sold" ? "Продана" : "В резерве"}</td>
              <td>{formatPrice(artwork)}</td>
              <td>
                <div className="admin-table-actions">
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
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
