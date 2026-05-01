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

    try {
      const response = await fetch("/api/admin/artworks", {
        method: "POST",
        body: formData
      });
      const result = (await response.json()) as { success: boolean; message?: string; redirectTo?: string };

      if (!response.ok || !result.success) {
        setStatusMessage(result.message ?? "Не удалось сохранить работу.");
        return;
      }

      router.push(result.redirectTo ?? "/admin/artworks");
      router.refresh();
    } catch (error) {
      setStatusMessage(error instanceof Error ? error.message : "Не удалось сохранить работу.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form autoComplete="off" className="admin-form" onSubmit={handleSubmit}>
      <div className="admin-artist-form">
        <section className="admin-form-card admin-form-card-media">
          <div className="admin-form-card-heading">
            <span>1</span>
            <div>
              <h2>Изображения</h2>
              <p>Сначала добавьте главное фото работы. Его увидит посетитель в галерее.</p>
            </div>
          </div>
          <ArtworkImageUploader images={artwork?.images.map((image) => image.url)} />
          <label className="admin-field admin-field-full">
            <span>Фото в интерьере (URL, опционально)</span>
            <input
              defaultValue={artwork?.interiorImageUrl ?? undefined}
              name="artworkInteriorImageUrl"
              placeholder="https://… отдельный кадр для страницы работы"
              type="url"
            />
          </label>
        </section>

        <section className="admin-form-card">
          <div className="admin-form-card-heading">
            <span>2</span>
            <div>
              <h2>Описание работы</h2>
              <p>Минимум: название, коллекция и короткое описание.</p>
            </div>
          </div>
          <div className="admin-form-grid">
            <label className="admin-field admin-field-full">
              <span>Название картины</span>
              <input defaultValue={artwork?.title} name="artworkTitle" placeholder="Например: Vibra" required />
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
              <input name="newCollectionName" placeholder="Если нужной коллекции ещё нет" />
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

            <label className="admin-field admin-field-full">
              <span>Описание</span>
              <textarea
                defaultValue={artwork?.description ?? undefined}
                name="artworkDescription"
                placeholder="Коротко: настроение, техника, серия, история работы"
                rows={5}
              />
            </label>
          </div>
        </section>

        <section className="admin-form-card">
          <div className="admin-form-card-heading">
            <span>3</span>
            <div>
              <h2>Продажа и публикация</h2>
              <p>Эти поля помогают посетителю понять статус картины.</p>
            </div>
          </div>
          <div className="admin-form-grid">
            <label className="admin-field">
              <span>Статус</span>
              <select defaultValue={artwork?.status ?? "available"} name="artworkStatus">
                <option value="available">В продаже</option>
                <option value="reserved">В резерве</option>
                <option value="sold">Продана</option>
              </select>
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
              <span>Размер, см</span>
              <div className="admin-size-fields">
                <input
                  defaultValue={artwork?.width ?? undefined}
                  inputMode="numeric"
                  name="artworkWidthCm"
                  placeholder="Ширина"
                  type="text"
                />
                <input
                  defaultValue={artwork?.height ?? undefined}
                  inputMode="numeric"
                  name="artworkHeightCm"
                  placeholder="Высота"
                  type="text"
                />
              </div>
            </label>

            <label className="admin-field admin-field-full">
              <span>Размер на сайте (текст)</span>
              <input
                defaultValue={artwork?.sizeLabel ?? undefined}
                name="artworkSizeLabel"
                placeholder="Если указано — показывается вместо «Ширина × Высота» в см"
              />
            </label>

            <label className="admin-field admin-field-full">
              <span>Стоимость (текст)</span>
              <input
                defaultValue={artwork?.priceRange ?? undefined}
                name="artworkPriceRange"
                placeholder="Если указано — показывается вместо числа и валюты"
              />
            </label>

            <label className="admin-field admin-field-full">
              <span>Доставка (текст)</span>
              <input
                defaultValue={artwork?.shippingNote ?? undefined}
                name="artworkShippingNote"
                placeholder="Строка «Доставка» на странице работы — только если заполнить"
              />
            </label>

            <div className="admin-field admin-field-full admin-switch-grid">
              <label>
                <input defaultChecked={artwork?.featured ?? true} name="artworkFeatured" type="checkbox" />
                <span>Показывать в галерее и избранном</span>
              </label>
              <label>
                <input defaultChecked={artwork?.hero ?? false} name="artworkHero" type="checkbox" />
                <span>Поставить на главную</span>
              </label>
              <label>
                <input defaultChecked={artwork?.showPrice ?? false} name="artworkShowPrice" type="checkbox" />
                <span>Показывать цену на сайте</span>
              </label>
            </div>
          </div>
        </section>

        <details className="admin-form-card admin-advanced-settings">
          <summary>Дополнительно: SEO и порядок показа</summary>
          <div className="admin-form-grid">
            <label className="admin-field">
              <span>Адрес страницы (латиница)</span>
              <input defaultValue={artwork?.slug} name="artworkSlug" placeholder="strekozy-i-nebo" />
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

            <label className="admin-field admin-field-full">
              <span>SEO-заголовок</span>
              <input
                defaultValue={artwork?.seoTitle ?? undefined}
                name="artworkSeoTitle"
                placeholder="Заголовок для поисковиков"
              />
            </label>

            <label className="admin-field admin-field-full">
              <span>SEO-описание</span>
              <textarea
                defaultValue={artwork?.seoDescription ?? undefined}
                name="artworkSeoDescription"
                placeholder="Краткое описание для Open Graph и поисковиков"
                rows={3}
              />
            </label>
          </div>
        </details>
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
