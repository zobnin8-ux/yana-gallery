type ArtworkImageUploaderProps = {
  images?: string[];
};

export function ArtworkImageUploader({ images }: ArtworkImageUploaderProps) {
  return (
    <div className="admin-image-fields">
      <label className="admin-field">
        <span>Загрузить изображения</span>
        <div className="admin-file-input">
          <input accept="image/*" id="artworkImages" multiple name="artworkImages" type="file" />
          <label className="admin-file-trigger" htmlFor="artworkImages">
            Выбрать файлы
          </label>
          <span className="admin-file-placeholder">Новые файлы добавятся к текущим изображениям</span>
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
