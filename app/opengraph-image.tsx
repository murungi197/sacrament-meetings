import { ImageResponse } from "next/og";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "center",
          background: "#244337",
          color: "#f8f7f1",
          display: "flex",
          height: "100%",
          justifyContent: "space-between",
          padding: "72px",
          width: "100%",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", maxWidth: 700 }}>
          <div style={{ color: "#c3d0c1", fontSize: 24, letterSpacing: 8 }}>
            CEDAR GROVE WARD
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontFamily: "Georgia",
              fontSize: 76,
              lineHeight: 1.15,
              marginTop: 36,
            }}
          >
            <div>Sunday,</div>
            <div>together.</div>
          </div>
          <div style={{ color: "#d8dfd6", fontSize: 28, marginTop: 30 }}>
            Meeting times, agendas, and messages
          </div>
        </div>
        <div
          style={{
            alignItems: "center",
            border: "2px solid #bdc8bc",
            borderRadius: "50%",
            color: "#f1eee5",
            display: "flex",
            fontFamily: "Georgia",
            fontSize: 150,
            height: 230,
            justifyContent: "center",
            width: 230,
          }}
        >
          C
        </div>
      </div>
    ),
    size,
  );
}
