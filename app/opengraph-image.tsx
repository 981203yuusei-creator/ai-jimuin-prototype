import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          background: "linear-gradient(135deg, #eef4ff 0%, #ffffff 100%)",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            fontSize: 28,
            fontWeight: 700,
            color: "#2563eb",
            marginBottom: 20,
            letterSpacing: 1,
          }}
        >
          現場訪問サービス業の小規模事業者向け事務アシスタント
        </div>
        <div
          style={{
            fontSize: 96,
            fontWeight: 800,
            color: "#1a1a1a",
            display: "flex",
            alignItems: "center",
            gap: 24,
          }}
        >
          <span
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 110,
              height: 110,
              borderRadius: 28,
              background: "#2563eb",
              color: "#fff",
              fontSize: 56,
            }}
          >
            事
          </span>
          ジムアシ
        </div>
        <div
          style={{
            fontSize: 40,
            color: "#334155",
            marginTop: 28,
            fontWeight: 700,
          }}
        >
          現場に集中。事務はAIに。
        </div>
      </div>
    ),
    { ...size }
  );
}
