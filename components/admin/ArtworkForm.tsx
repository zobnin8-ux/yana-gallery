"use client";

import { useRouter } from "next/navigation";
import type { FormEvent } from "react";
import { useState } from "react";

import type { Artwork, ArtworkCollectionWithArtworks } from "@/types/artwork";

import { ArtworkImageUploader } from "./ArtworkImageUploader";

type ArtworkFormProps = {
  mode: "create" | "edit";
  artwork?: Artwork;
  collections: ArtworkCollectionWithArtworks[];
};

export function ArtworkForm({ mode, artwork, collections }: ArtworkFormProps) {
  const router = useRouter();
  const [statusMessage, setStatusMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submitLabel = mode === "create" ? "Добавить работу" : "Сохранить изменения";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setStatusMessage("");

    const formData = new FormData(event.currentTarget);

    if (artwork?.id) {
      formData.set("artworkId", artwork.id);
    }

    const response = await fetch("/api/admin/artworks", {
      method: "POST",
      body: formData
    });
    const result = (await response.json()) as { success: boolean; message?: string; redirectTo?: string };

    setIsSubmitting(false);

    if (!response.ok || !result.success) {
      setStatusMessage(result.message ?? "Не удалось сохранить работу.");
      return;
    }

    router.push(result.redirectTo ?? "/admin/artworks");
    router.refresh();
  }

  return (
    <form autoComplete="off" className="admin-form" onSubmit={handleSubmit}>
      <div className="admin-form-grid">
        <label className="admin-field admin-field-full">
          <span>Название</span>
          <input defaultValue={artwork?.title} name="artworkTitle" placeholder="Название работы" required />
        </label>

        <label className="admin-field">
          <span>Slug</span>
          <input defaultValue={artwork?.slug} name="artworkSlug" placeholder="light-composition-1" />
        </label>

        <label className="admin-field">
          <span>Порядок показа</span>
          <input
            defaultValue={artwork?.sortOrder ?? 100}
            inputMode="numeric"
            name="artworkSortOrder"
            placeholder="100"
            type="text"
          />
        </label>

        <label className="admin-field">
          <span>Коллекция</span>
          <select defaultValue={artwork?.collectionId ?? ""} name="artworkCollectionId">
            <option value="">Без коллекции</option>
            {collections
              .filter((collection) => collection.id !== "collection-uncategorized")
              .map((collection) => (
                <option key={collection.id} value={collection.id}>
                  {collection.name}
                </option>
              ))}
          </select>
        </label>

        <label className="admin-field">
          <span>Новая коллекция</span>
          <input name="newCollectionName" placeholder="Создать и привязать к ней" />
        </label>

        <label className="admin-field">
          <span>Год</span>
          <input
            defaultValue={artwork?.year ?? undefined}
            inputMode="numeric"
            name="artworkYear"
            placeholder="2025"
            type="text"
          />
        </label>

        <label className="admin-field">
          <span>Техника</span>
          <input defaultValue={artwork?.medium ?? undefined} name="artworkMedium" placeholder="Холст, масло" />
        </label>

        <label className="admin-field">
          <span>Ширина, см</span>
          <input
            defaultValue={artwork?.width ?? undefined}
            inputMode="numeric"
            name="artworkWidthCm"
            placeholder="80"
            type="text"
          />
        </label>

        <label className="admin-field">
          <span>Высота, см</span>
          <input
            defaultValue={artwork?.height ?? undefined}
            inputMode="numeric"
            name="artworkHeightCm"
            placeholder="100"
            type="text"
          />
        </label>

        <label className="admin-field">
          <span>Цена</span>
          <input
            defaultValue={artwork?.price ?? undefined}
            inputMode="numeric"
            name="artworkPrice"
            placeholder="3200"
            type="text"
          />
        </label>

        <label className="admin-field">
          <span>Валюта</span>
          <select defaultValue={artwork?.currency ?? "EUR"} name="artworkCurrency">
            <option value="EUR">EUR</option>
            <option value="USD">USD</option>
            <option value="RUB">RUB</option>
          </select>
        </label>

        <label className="admin-field">
          <span>Статус</span>
          <select defaultValue={artwork?.status ?? "available"} name="artworkStatus">
            <option value="available">Доступна</option>
            <option value="sold">Продана</option>
            <option value="reserved">В резерве</option>
          </select>
        </label>

        <label className="admin-field admin-field-full">
          <span>Описание</span>
          <textarea
            defaultValue={artwork?.description ?? undefined}
            name="artworkDescription"
            placeholder="Краткое описание работы"
            rows={6}
          />
        </label>

        <label className="admin-field admin-field-full">
          <span>SEO title</span>
          <input defaultValue={artwork?.seoTitle ?? undefined} name="artworkSeoTitle" placeholder="Заголовок для поисковиков" />
        </label>

        <label className="admin-field admin-field-full">
          <span>SEO description</span>
          <textarea
            defaultValue={artwork?.seoDescription ?? undefined}
            name="artworkSeoDescription"
            placeholder="Краткое описание для Open Graph и поисковиков"
            rows={3}
          />
        </label>

        <div className="admin-field admin-field-full admin-switch-grid">
          <label>
            <input defaultChecked={artwork?.featured ?? true} name="artworkFeatured" type="checkbox" />
            <span>Показывать в избранном</span>
          </label>
          <label>
            <input defaultChecked={artwork?.hero ?? false} name="artworkHero" type="checkbox" />
            <span>Использовать в hero</span>
          </label>
          <label>
            <input defaultChecked={artwork?.showPrice ?? false} name="artworkShowPrice" type="checkbox" />
            <span>Показывать цену публично</span>
          </label>
        </div>

        <div className="admin-field-full">
          <ArtworkImageUploader images={artwork?.images.map((image) => image.url)} />
        </div>
      </div>

      {statusMessage ? <p className="admin-form-status is-error">{statusMessage}</p> : null}

      <div className="admin-form-actions">
        <button className="admin-submit-button" disabled={isSubmitting} type="submit">
          {isSubmitting ? "Сохраняем..." : submitLabel}
        </button>
      </div>
    </form>
  );
}
