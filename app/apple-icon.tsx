import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f0ebe3"
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 120,
            height: 140,
            background: "#faf7f1",
            border: "4px solid #241f19",
            fontSize: 88,
            fontFamily: "Georgia, serif",
            color: "#241f19",
            fontWeight: 500
          }}
        >
          {"\u042F"}
        </div>
      </div>
    ),
    { ...size }
  );
}
