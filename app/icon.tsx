import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
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
            width: 22,
            height: 26,
            background: "#faf7f1",
            border: "1.5px solid #241f19",
            fontSize: 17,
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
