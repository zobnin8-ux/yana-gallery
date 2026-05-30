import { ImageResponse } from "next/og";

import { loadMonogramDataUrl, monogramFaviconCropStyle } from "@/lib/branding/monogram-icon";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default async function AppleIcon() {
  const src = await loadMonogramDataUrl();
  const crop = monogramFaviconCropStyle(180);

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
