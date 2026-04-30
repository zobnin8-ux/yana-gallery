"use client";

import { useState } from "react";

type ArtworkImageUploaderProps = {
  images?: string[];
};

export function ArtworkImageUploader({ images }: ArtworkImageUploaderProps) {
  const [selectedFilenames, setSelectedFilenames] = useState<string[]>([]);

  return (
    <div className="admin-image-fields">
      <div className="admin-field">
        <span>Загрузить изображения</span>
        <div className="admin-file-input">
          <input
            accept="image/*"
            id="artworkImages"
            multiple
            name="artworkImages"
            onChange={(event) => {
              setSelectedFilenames(Array.from(event.target.files ?? []).map((file) => file.name));
            }}
            type="file"
          />
          <label className="admin-file-trigger" htmlFor="artworkImages">
            Выбрать файлы
          </label>
          <span className="admin-file-placeholder">
            {selectedFilenames.length
              ? `Выбрано файлов: ${selectedFilenames.length}`
              : "Новые файлы добавятся к текущим изображениям"}
          </span>
        </div>
        {selectedFilenames.length ? (
          <div className="admin-uploaded-images-list">
            {selectedFilenames.map((filename) => (
              <span className="admin-uploaded-image-item" key={filename}>
                {filename}
              </span>
            ))}
          </div>
        ) : null}
      </div>

      {images?.length ? (
        <div className="admin-uploaded-images">
          <span className="admin-uploaded-images-label">Текущие изображения</span>
          <div className="admin-uploaded-images-list">
            {images.map((image) => {
              const filename = image.split("/").pop() ?? image;

              return (
                <div className="admin-uploaded-image-item" key={image}>
                  <input name="existingImages" type="hidden" value={image} />
                  {filename}
                </div>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}
