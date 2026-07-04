import { ImageResponse } from "next/og.js";
import { createElement as h } from "react";
import fs from "fs";
import path from "path";

const GRADIENT = "linear-gradient(155deg, #6E8FD9 0%, #B98FE0 48%, #FF8FC2 100%)";

function badge({ size, radius, padding, sparkle }) {
  return h(
    "div",
    {
      style: {
        width: size,
        height: size,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: GRADIENT,
        borderRadius: radius,
      },
    },
    h(
      "div",
      {
        style: {
          width: size - padding * 2,
          height: size - padding * 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        },
      },
      [
        h(
          "div",
          {
            key: "a",
            style: {
              fontSize: (size - padding * 2) * 0.62,
              fontWeight: 700,
              color: "#FFFFFF",
              fontFamily: "Georgia, serif",
              textShadow: "0 2px 6px rgba(60,30,80,0.25)",
              lineHeight: 1,
            },
          },
          "A"
        ),
        sparkle &&
          h("div", {
            key: "s",
            style: {
              position: "absolute",
              top: size * 0.04,
              right: size * 0.03,
              width: size * 0.13,
              height: size * 0.13,
              background: "#FFFFFF",
              opacity: 0.95,
              borderRadius: size * 0.02,
              transform: "rotate(45deg)",
              boxShadow: "0 2px 6px rgba(60,30,80,0.2)",
            },
          }),
      ]
    )
  );
}

async function render(node, size, outPath) {
  const res = new ImageResponse(node, { width: size, height: size });
  const buf = Buffer.from(await res.arrayBuffer());
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, buf);
  console.log("wrote", outPath, buf.length, "bytes");
}

const root = path.resolve(import.meta.dirname, "..");

await render(badge({ size: 512, radius: 110, padding: 70, sparkle: true }), 512, path.join(root, "src/app/icon.png"));
await render(badge({ size: 180, radius: 38, padding: 22, sparkle: true }), 180, path.join(root, "src/app/apple-icon.png"));
await render(badge({ size: 192, radius: 42, padding: 24, sparkle: true }), 192, path.join(root, "public/icons/icon-192.png"));
await render(badge({ size: 512, radius: 110, padding: 64, sparkle: true }), 512, path.join(root, "public/icons/icon-512.png"));
await render(badge({ size: 512, radius: 0, padding: 96, sparkle: false }), 512, path.join(root, "public/icons/icon-maskable-512.png"));
