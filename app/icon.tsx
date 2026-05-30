import { ImageResponse } from "next/og";

import { loadMonogramDataUrl, monogramFaviconCropStyle } from "@/lib/branding/monogram-icon";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default async function Icon() {
  const src = await loadMonogramDataUrl();
  const crop = monogramFaviconCropStyle(32);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          background: "#f0ebe3"
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img alt="" src={src} width={crop.width} height={crop.height} style={crop} />
      </div>
    ),
    { ...size }
  );
}
