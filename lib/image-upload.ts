export function extensionForArtworkUpload(blob: Blob): string {
  if (typeof File !== "undefined" && blob instanceof File && blob.name.includes(".")) {
    const ext = blob.name.split(".").pop();
    if (ext && /^[a-z0-9]{1,6}$/i.test(ext)) {
      return ext.toLowerCase();
    }
  }
  const t = blob.type.toLowerCase();
  if (t.includes("jpeg") || t === "image/jpg") return "jpg";
  if (t.includes("png")) return "png";
  if (t.includes("webp")) return "webp";
  if (t.includes("gif")) return "gif";
  if (t.includes("avif")) return "avif";
  if (t.includes("svg")) return "svg";
  return "jpg";
}

export function mimeForArtworkExtension(ext: string): string {
  const map: Record<string, string> = {
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    webp: "image/webp",
    gif: "image/gif",
    avif: "image/avif",
    svg: "image/svg+xml"
  };
  return map[ext.toLowerCase()] ?? "application/octet-stream";
}
