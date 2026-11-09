import { readFile } from "node:fs/promises";
import satori from "satori";
import sharp from "sharp";

// Local fonts keep Korean titles intact without network requests at build time.
const fontData = Promise.all(
  ["Regular", "Bold"].map(weight =>
    readFile(
      `node_modules/pretendard/dist/public/static/alternative/Pretendard-${weight}.ttf`
    )
  )
);

export async function generateOgImage(title: string, description: string) {
  const [regular, bold] = await fontData;
  const text = (children: string, style: Record<string, string | number>) => ({
    type: "div",
    props: {
      children,
      style: {
        position: "absolute",
        left: 72,
        width: 1056,
        wordBreak: "break-all",
        ...style,
      },
    },
  });
  const svg = await satori(
    {
      type: "div",
      props: {
        style: {
          display: "flex",
          width: 1200,
          height: 630,
          boxSizing: "border-box",
          background: "#fafbf9",
          color: "#202b2b",
          fontFamily: "Pretendard",
          borderTop: "12px solid #087f73",
        },
        children: [
          text("PSL TECH  /  ENGINEERING NOTES", {
            top: 64,
            fontSize: 23,
            color: "#087f73",
            fontWeight: 700,
            letterSpacing: "2px",
          }),
          text(title, {
            top: 166,
            fontSize: title.length > 32 ? 50 : 60,
            fontWeight: 700,
            lineHeight: 1.35,
            maxHeight: 260,
            overflow: "hidden",
          }),
          text(description, {
            top: 418,
            fontSize: 25,
            color: "#64716c",
            lineHeight: 1.6,
            maxHeight: 85,
            overflow: "hidden",
          }),
          text("배우고, 만들고, 기록합니다.   ↗", {
            top: 550,
            fontSize: 21,
            color: "#087f73",
          }),
        ],
      },
    },
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: "Pretendard", data: regular, weight: 400, style: "normal" },
        { name: "Pretendard", data: bold, weight: 700, style: "normal" },
      ],
    }
  );
  const png = await sharp(Buffer.from(svg)).png().toBuffer();
  return new Response(new Uint8Array(png), {
    headers: { "Content-Type": "image/png" },
  });
}
