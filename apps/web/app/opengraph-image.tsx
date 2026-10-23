import { ImageResponse } from "next/og";

export const alt = "ChaiForm • Conversational Form Builder | by Kenil Patel";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "#09090b",
        backgroundImage:
          "radial-gradient(circle at 50% 25%, rgba(245, 158, 11, 0.18) 0%, rgba(9, 9, 11, 0.95) 70%)",
        color: "#fafafa",
        padding: "56px 64px",
        fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        position: "relative",
      }}
    >
      {/* Top Header Badge */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          border: "1px solid rgba(245, 158, 11, 0.35)",
          backgroundColor: "rgba(245, 158, 11, 0.1)",
          padding: "8px 20px",
          borderRadius: "9999px",
          fontSize: "16px",
          fontWeight: 600,
          color: "#fef08a",
        }}
      >
        <span>ChaiForm v2.0 • Conversational Forms &amp; Surveys</span>
      </div>

      {/* Center Main Title & Hero Tagline */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          maxWidth: "960px",
        }}
      >
        <div
          style={{
            fontSize: "64px",
            fontWeight: 900,
            letterSpacing: "-0.03em",
            lineHeight: 1.1,
            marginBottom: "20px",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "16px",
          }}
        >
          <span>Forms that feel like</span>
          <span
            style={{
              color: "#f59e0b",
            }}
          >
            conversations
          </span>
        </div>

        <div
          style={{
            fontSize: "24px",
            color: "#a1a1aa",
            lineHeight: 1.4,
            maxWidth: "800px",
          }}
        >
          1-Question-at-a-time focus, 14 field types, instant QR codes, and real-time response
          analytics.
        </div>
      </div>

      {/* Bottom Bar: Creator Authority & Features */}
      <div
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderTop: "1px solid rgba(255, 255, 255, 0.12)",
          paddingTop: "24px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <div
            style={{
              fontSize: "18px",
              fontWeight: 700,
              color: "#f4f4f5",
            }}
          >
            chaiform.kenilpatel.in
          </div>
          <div style={{ color: "#71717a" }}>•</div>
          <div
            style={{
              fontSize: "16px",
              color: "#d4d4d8",
            }}
          >
            Free Forever Tier
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            fontSize: "16px",
            color: "#fef08a",
            fontWeight: 600,
          }}
        >
          <span>Engineered by Kenil Patel</span>
        </div>
      </div>
    </div>,
    {
      ...size,
    },
  );
}
