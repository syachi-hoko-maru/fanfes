/*
 * サークル紹介（OGP）画像ジェネレーター
 * -----------------------------------
 * ルートの tweet.svg をテンプレートに、24 サークル分の紹介画像（1600×900 PNG）を
 * public/ogp/circle/{id}.png に生成する。
 *   - 左の枠に各サークルのサークルカット（public/webp/circle/{img}.webp）を配置
 *   - 6 つのタグピルを、サークルの該当タグはオレンジ(cls-5)／非該当は淡色(cls-15)に
 *   - 「参加サークル名」をサークル名に差し替え（ヒラギノ角ゴ W8・下線中央に配置）
 * サークル情報は app/data/circles.ts を単一ソースとしてパースする。
 *
 * 依存: playwright（Chromium で SVG をレンダリング。macOS のヒラギノ角ゴ W8 を使用）。
 * 実行: node scripts/generate-ogp.mjs
 * ※ このリポジトリには playwright を入れていないため、下の require パスは
 *    playwright を持つ別プロジェクトを指している。環境に合わせて調整すること。
 */
import { createRequire } from "node:module";
import { readFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const require = createRequire("/Users/sekimototaku/sy/trpg-system/");
const { chromium } = require("playwright");

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
let template = readFileSync(ROOT + "/tweet.svg", "utf-8").replace(/<\?xml[^>]*\?>/, "");

// ヒラギノ角ゴ W8 を確実に使う（Adobe名が無い環境向けのフォールバック）
template = template.replace(
  "font-family: HiraKakuStdN-W8-83pv-RKSJ-H, 'Hiragino Kaku Gothic StdN';",
  "font-family: 'Hiragino Sans', 'Hiragino Kaku Gothic StdN', sans-serif;\n        font-weight: 800;",
);

// circles.ts をパースして 24 サークルを取得
const srcTs = readFileSync(ROOT + "/app/data/circles.ts", "utf-8");
const circles = [];
const reCircle =
  /circle\(\{\s*id:\s*(\d+),\s*img:\s*"([^"]+)",\s*name:\s*"([^"]+)",\s*tags:\s*\[([^\]]*)\]/g;
let m;
while ((m = reCircle.exec(srcTs))) {
  const tags = [...m[4].matchAll(/"([^"]+)"/g)].map((x) => x[1]);
  circles.push({ id: m[1], img: m[2], name: m[3], tags });
}
circles.sort((a, b) => +a.id - +b.id);
console.log("parsed circles:", circles.length);

// タグ → タグピルの d 先頭座標（位置で一意に識別）
const TAG_PILL = {
  "シナリオ/キャンペーン": "M1023.64,427.55",
  "リプレイ/小説": "M1023.64,486.64",
  オリジナルデータ: "M1023.64,545.73",
  "素材（立ち絵）": "M1313.64,427.55",
  "素材（オンラインセッション用）": "M1313.64,486.64",
  "素材（その他）": "M1313.64,545.73",
};

const esc = (s) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function buildSvg(c) {
  let svg = template;
  for (const [tag, sig] of Object.entries(TAG_PILL)) {
    const cls = c.tags.includes(tag) ? "cls-5" : "cls-15";
    const reSig = new RegExp('<path class="cls-(?:5|15)" d="' + sig.replace(/\./g, "\\."));
    svg = svg.replace(reSig, `<path class="${cls}" d="${sig}`);
  }
  const b64 = readFileSync(`${ROOT}/public/webp/circle/${c.img}.webp`).toString("base64");
  const imgTag = `<image x="50" y="50" width="899.5" height="543" preserveAspectRatio="xMidYMid slice" xlink:href="data:image/webp;base64,${b64}"/>`;
  svg = svg.replace(
    '<rect class="cls-5" x="1000" y="249.76"',
    imgTag + '<rect class="cls-5" x="1000" y="249.76"',
  );
  svg = svg.replace(
    '<text class="cls-17" transform="translate(1088.9774 223.4158)"><tspan x="0" y="0">参加サークル名</tspan></text>',
    `<text class="cls-17" text-anchor="middle" transform="translate(1275 223.4158)"><tspan x="0" y="0">${esc(c.name)}</tspan></text>`,
  );
  return svg;
}

const outDir = ROOT + "/public/ogp/circle";
mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch();
for (const c of circles) {
  const svg = buildSvg(c);
  const html = `<!doctype html><meta charset="utf-8"><style>html,body{margin:0;padding:0}#wrap{width:1600px;height:900px}#wrap svg{width:1600px;height:900px;display:block}</style><div id="wrap">${svg}</div>`;
  const page = await browser.newPage({
    viewport: { width: 1600, height: 900 },
    deviceScaleFactor: 1,
  });
  await page.setContent(html, { waitUntil: "networkidle" });
  // 長い名前は下線幅(550)に収まるよう圧縮
  await page.evaluate(() => {
    const t = document.querySelector(".cls-17");
    if (t.getComputedTextLength() > 540) {
      t.setAttribute("textLength", 540);
      t.setAttribute("lengthAdjust", "spacingAndGlyphs");
    }
  });
  await page.waitForTimeout(80);
  await (await page.$("#wrap")).screenshot({ path: `${outDir}/${c.id}.png` });
  console.log(`saved ${c.id} ${c.name}`);
  await page.close();
}
await browser.close();
console.log("done");
