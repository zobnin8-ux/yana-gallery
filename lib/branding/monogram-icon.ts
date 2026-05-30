import { readFile } from "node:fs/promises";
import { join } from "node:path";

const MONOGRAM_PATH = join(process.cwd(), "public/images/branding/yana-monogram-full.png");

export async function loadMonogramDataUrl(): Promise<string> {
  const buffer = await readFile(MONGRAM_PATH);
  return `data:image/png;base64,${buffer.toString("base64")}`;
}

/** Center crop for favicon — monogram only, no butterfly/dragonfly wings. */
export function monogramFaviconCropStyle(size: number) {
  const zoom = size <= 32 ? 3.4 : 2.6;
  const imageSize = Math.round(size * zoom);

  return {
    width: imageSize,
    height: imageSize,
    objectFit: "cover" as const,
    objectPosition: "50% 46%"
  };
}
