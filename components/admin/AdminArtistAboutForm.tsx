"use client";

import Image from "next/image";
import type { FormEvent } from "react";
import { useState } from "react";

type AdminArtistAboutFormProps = {
  currentPortraitUrl: string | null;
  defaultIllustrationSrc: string;
};

export function AdminArtistAboutForm({ currentPortraitUrl, defaultIllustrationSrc }: AdminArtistAboutFormProps) {
  const [statusMessage, setStatusMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentPortraitUrl);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setStatusMessage("");

    const form = event.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch("/api/admin/site-settings", {
        method: "POST",
        body: formData
      });
      const result = (await response.json()) as {
        success: boolean;
        message?: string;
        artistPortraitUrl?: string | null;
      };

      if (!response.ok || !result.success) {
        setStatusMessage(result.message ?? "Не удалось сохранить.");
        return;
      }

      setPreviewUrl(result.artistPortraitUrl ?? null);
      setStatusMessage("Сохранено. Страница «Художник» обновится после перезагрузки.");
      form.reset();
    } catch (error) {
      setStatusMessage(error instanceof Error ? error.message : "Не удалось сохранить.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const displayUrl = previewUrl ?? defaultIllustrationSrc;
  const displayAlt = previewUrl ? "Текущий портрет на странице «Художник»" : "Стандартная иллюстрация, если портрет не загружен";

  return (
    <form className="admin-form" onSubmit={handleSubmit}>
      <div className="admin-form-card">
        <div className="admin-form-card-heading">
          <span>◆</span>
          <div>
            <h2>Фото в разделе «Художник»</h2>
            <p>
              Загрузите портрет (JPG, PNG или WebP). На сайте он показывается на странице «Художник» вместо
              стандартной иллюстрации. Можно также вставить прямую ссылку на уже размещённое изображение.
            </p>
          </div>
        </div>

        <div className="admin-artist-portrait-preview">
          <div className="artist-dossier-frame admin-artist-portrait-frame">
            <Image alt={displayAlt} className="artist-dossier-image" fill sizes="280px" src={displayUrl} />
          </div>
          <p className="admin-copy admin-artist-portrait-caption">
            {previewUrl ? "Сейчас на сайте — ваша фотография." : "Сейчас — стандартная иллюстрация (как в макете до загрузки)."}
          </p>
        </div>

        <label className="admin-field admin-field-full admin-field-native-file">
          <span>Новый файл</span>
          <input accept="image/jpeg,image/png,image/webp,image/gif,image/avif" name="portrait" type="file" />
        </label>

        <label className="admin-field admin-field-full">
          <span>Или URL изображения</span>
          <input name="artistPortraitUrl" placeholder="https://…" type="url" />
        </label>

        <label className="admin-field admin-field-checkbox">
          <input name="clearPortrait" type="checkbox" />
          <span>Сбросить: снова показывать стандартную иллюстрацию</span>
        </label>

        {statusMessage ? <p className="admin-form-status">{statusMessage}</p> : null}

        <button className="admin-primary-button" disabled={isSubmitting} type="submit">
          {isSubmitting ? "Сохранение…" : "Сохранить"}
        </button>
      </div>
    </form>
  );
}
