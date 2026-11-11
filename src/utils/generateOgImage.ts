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
const logoData = readFile("public/brand/pslab-logo.png").then(
  data => `data:image/png;base64,${data.toString("base64")}`
);

export async function generateOgImage(title: string, description: string) {
  const [[regular, bold], logo] = await Promise.all([fontData, logoData]);
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
          background: "#fafbfc",
          color: "#202c3c",
          fontFamily: "Pretendard",
          borderTop: "12px solid #284c82",
        },
        children: [
          {
            type: "img",
            props: {
              src: logo,
              width: 300,
              height: 68,
              style: { position: "absolute", top: 52, left: 72 },
            },
          },
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
            color: "#627087",
            lineHeight: 1.6,
            maxHeight: 85,
            overflow: "hidden",
          }),
          text("PSL NOTES  ·  DEVELOPMENT / EXPERIMENTS / IDEAS", {
            top: 550,
            fontSize: 21,
            color: "#284c82",
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
