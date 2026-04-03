type ArtworkImageUploaderProps = {
  images?: string[];
};

export function ArtworkImageUploader({ images }: ArtworkImageUploaderProps) {
  return (
    <div className="admin-image-fields">
      <label className="admin-field">
        <span>Главное изображение</span>
        <div className="admin-file-input">
          <input accept="image/*" id="artworkCoverImage" name="artworkCoverImage" type="file" />
          <label className="admin-file-trigger" htmlFor="artworkCoverImage">
            Выбрать файл
          </label>
          <span className="admin-file-placeholder">Файл не выбран</span>
        </div>
      </label>

      <label className="admin-field">
        <span>Дополнительные изображения</span>
        <div className="admin-file-input">
          <input accept="image/*" id="artworkGalleryImages" multiple name="artworkGalleryImages" type="file" />
          <label className="admin-file-trigger" htmlFor="artworkGalleryImages">
            Выбрать файлы
          </label>
          <span className="admin-file-placeholder">Файлы не выбраны</span>
        </div>
      </label>

      {images?.length ? (
        <div className="admin-uploaded-images">
          <span className="admin-uploaded-images-label">Текущие изображения</span>
          <div className="admin-uploaded-images-list">
            {images.map((image) => {
              const filename = image.split("/").pop() ?? image;

              return (
                <div className="admin-uploaded-image-item" key={image}>
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
