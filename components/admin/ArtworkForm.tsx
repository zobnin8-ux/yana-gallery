import type { Artwork } from "@/types/artwork";

import { ArtworkImageUploader } from "./ArtworkImageUploader";

type ArtworkFormProps = {
  mode: "create" | "edit";
  artwork?: Artwork;
};

export function ArtworkForm({ mode, artwork }: ArtworkFormProps) {
  const submitLabel = mode === "create" ? "Добавить работу" : "Сохранить изменения";

  return (
    <form autoComplete="off" className="admin-form">
      <div className="admin-form-grid">
        <label className="admin-field admin-field-full">
          <span>Название</span>
          <input defaultValue={artwork?.title} name="artworkTitle" placeholder="Название работы" />
        </label>

        <label className="admin-field admin-field-full">
          <span>Коллекция</span>
          <input
            defaultValue={artwork?.collection ?? undefined}
            name="artworkCollection"
            placeholder="Название коллекции"
          />
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

        <div className="admin-field-full">
          <ArtworkImageUploader images={artwork?.images.map((image) => image.url)} />
        </div>
      </div>

      <div className="admin-form-actions">
        <button className="admin-submit-button" type="submit">
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
