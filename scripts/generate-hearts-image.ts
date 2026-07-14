/*
 * “ソドワ好き”メッセージ・ハート画像ジェネレーター
 * ------------------------------------------------
 * app/data/heartMessages.ts の全メッセージを 1 つずつハートに載せ、大きめのハートを
 * 少し重ねながら（隙間を詰めて画面から溢れる感じで）1600×900 の PNG に敷き詰める。
 * ハートの色は同じ定義の COLORS から選び、隣り合うハートが同色にならないようにする。
 *
 * FloatingHearts.vue と同じ定義を単一ソースとして参照するので、メッセージや色を足したら
 * このスクリプトを再実行するだけで画像が更新される。
 *
 * 依存: なし（インストール済みの Chrome/Chromium を headless で使ってレンダリングする）。
 * 実行: node scripts/generate-hearts-image.ts [出力パス] [--seed N]
 *       省略時の出力は public/ogp/hearts.png。Chrome のパスは環境変数 CHROME_PATH で上書き可。
 */
import { spawn } from "node:child_process";
import { mkdtempSync, mkdirSync, writeFileSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { COLORS, MESSAGES } from "../app/data/heartMessages.ts";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

// ---- 出力・レイアウト設定（ここを触ると見た目が変わる） ----
const W = 1600;
const H = 900;
const BG = "#fcefe0";
const TEXT_COLOR = "#4a3b30";
// レンダリング解像度（2倍で描いて縮小＝くっきり）
const DSF = 2;
// 上下左右の余白（px）。ハートを並べる“場”を画面からどれだけ内側に取るか。
// 負の値にすると場が画面外へ広がり、端でハートが見切れて“溢れる”感じになる。
// 上を大きく／下を小さく（負に）すると、全体が下に寄る。
const MARGIN_TOP = 24;
const MARGIN_BOTTOM = -24;
const MARGIN_LEFT = -4;
const MARGIN_RIGHT = -4;
// 余白から決まる“場”の大きさ（chooseCols とレイアウトで共用）
const FIELD_W = W - MARGIN_LEFT - MARGIN_RIGHT;
const FIELD_H = H - MARGIN_TOP - MARGIN_BOTTOM;
// 横方向の重なりはこの値だけで決まる（= 1 - 1/OVERSIZE）。小さめにして横の被りを抑える。
const OVERSIZE = 1.2; // セル間隔に対するハートの大きさ（>1 で重なる）
const JITTER = 0.06; // 位置のゆらぎ（セル比）
const ROT = 10; // 回転の振れ幅（度）
const SCALE_MIN = 0.9;
const SCALE_MAX = 1.12;

// サイトと同じハートSVG（viewBox 32×29.6, aspect≈0.925）
const HEART_PATH =
  "M23.6,0c-3.4,0-6.3,2.7-7.6,5.6C14.7,2.7,11.8,0,8.4,0C3.8,0,0,3.8,0,8.4" +
  "c0,9.4,9.5,11.9,16,21.2c6.1-9.3,16-11.8,16-21.2C32,3.8,28.2,0,23.6,0z";
const HEART_ASPECT = 29.6 / 32;

// ---- 乱数（seed 固定で再現可能） ----
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ---- グリッド（横は控えめ・縦を詰めたいので、やや横長セルの列数を選ぶ） ----
// セル比 cw/ch の目標。大きいほど「列少なめ＝行多め」＝縦の重なりが増える。
const CELL_RATIO = 1.75;
function chooseCols(n: number) {
  let best = { cols: Math.ceil(Math.sqrt(n * 1.4)), score: Infinity };
  for (let cols = 6; cols <= 13; cols++) {
    const rows = Math.ceil(n / cols);
    const lastRow = n - cols * (rows - 1); // 最終行の個数
    const cw = FIELD_W / cols;
    const ch = FIELD_H / rows;
    const score = Math.abs(cw / ch - CELL_RATIO) + (cols - lastRow) * 0.12;
    if (score < best.score) best = { cols, score };
  }
  return best.cols;
}

interface Heart {
  cx: number;
  cy: number;
  w: number;
  h: number;
  rot: number;
  color: string;
  message: string;
  z: number;
  row: number;
  col: number;
}

function layout(): Heart[] {
  const n = MESSAGES.length;
  const rng = mulberry32(seed);
  const cols = chooseCols(n);
  const rows = Math.ceil(n / cols);
  const fieldW = FIELD_W;
  const fieldH = FIELD_H;
  const originX = MARGIN_LEFT;
  const originY = MARGIN_TOP;
  const colPitch = fieldW / cols;
  const rowPitch = fieldH / rows;
  const baseW = colPitch * OVERSIZE;

  // 行ごとの個数を均等配分し、不足分は上の行に寄せる＝下の行を満杯にして下側が開かないように
  const base = Math.floor(n / rows);
  const extra = n - base * rows;
  const counts = Array.from(
    { length: rows },
    (_, r) => base + (r >= rows - extra ? 1 : 0),
  );

  // グリッド上で「左・左上・上・右上」と色が被らないよう割り当てる
  const grid: (string | null)[][] = Array.from({ length: rows }, () =>
    Array<string | null>(cols).fill(null),
  );
  const pickColor = (r: number, c: number) => {
    const forbidden = new Set(
      [
        grid[r][c - 1],
        grid[r - 1]?.[c - 1],
        grid[r - 1]?.[c],
        grid[r - 1]?.[c + 1],
      ].filter(Boolean) as string[],
    );
    const allowed = COLORS.filter((col) => !forbidden.has(col));
    const pool = allowed.length ? allowed : COLORS;
    return pool[Math.floor(rng() * pool.length)];
  };

  const hearts: Heart[] = [];
  let i = 0;
  for (let r = 0; r < rows; r++) {
    const inRow = counts[r];
    if (inRow <= 0) break;
    // 各行を水平方向に中央寄せ（間隔は固定のまま）
    const rowW = inRow * colPitch;
    const x0 = originX + (fieldW - rowW) / 2;
    // ヘキサ（千鳥）配置: 偶数行と奇数行を半セルずらす（±1/4 で全体は左右対称）
    const hexShift = (r % 2 === 0 ? -1 : 1) * (colPitch / 4);
    for (let c = 0; c < inRow; c++) {
      const color = pickColor(r, c);
      grid[r][c] = color;
      const jx = (rng() * 2 - 1) * JITTER * colPitch;
      const jy = (rng() * 2 - 1) * JITTER * rowPitch;
      const scale = SCALE_MIN + rng() * (SCALE_MAX - SCALE_MIN);
      const w = baseW * scale;
      hearts.push({
        cx: x0 + colPitch * (c + 0.5) + hexShift + jx,
        cy: originY + rowPitch * (r + 0.5) + jy,
        w,
        h: w * HEART_ASPECT,
        rot: (rng() * 2 - 1) * ROT,
        color,
        message: MESSAGES[i],
        z: i, // 後（下の行）ほど手前。重なって“積もる/溢れる”見え方に
        row: r,
        col: c,
      });
      i++;
    }
  }
  return hearts;
}

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function buildHtml(hearts: Heart[]) {
  const items = hearts
    .map(
      (h) =>
        `<div class="h" style="left:${h.cx.toFixed(1)}px;top:${h.cy.toFixed(1)}px;` +
        `width:${h.w.toFixed(1)}px;height:${h.h.toFixed(1)}px;z-index:${h.z};` +
        `transform:translate(-50%,-50%) rotate(${h.rot.toFixed(2)}deg)">` +
        `<svg viewBox="0 0 32 29.6"><path d="${HEART_PATH}" fill="${h.color}"/></svg>` +
        `<span class="t">${esc(h.message)}</span></div>`,
    )
    .join("");
  return `<!doctype html><meta charset="utf-8"><style>
    html,body{margin:0;padding:0}
    #c{position:relative;width:${W}px;height:${H}px;background:${BG};overflow:hidden;
       font-family:'Hiragino Sans','Hiragino Kaku Gothic ProN','Hiragino Maru Gothic ProN',sans-serif;}
    .h{position:absolute}
    .h svg{position:absolute;inset:0;width:100%;height:100%;
       filter:drop-shadow(0 3px 5px rgba(0,0,0,.10))}
    .t{position:absolute;left:19%;top:13%;width:62%;height:39%;
       display:flex;align-items:center;justify-content:center;text-align:center;
       color:${TEXT_COLOR};font-weight:700;line-height:1.2;word-break:break-word;overflow:hidden}
  </style><div id="c">${items}</div>`;
}

// 各ハートの文字を、はみ出さない最大サイズまで縮める（ページ内で実行）
const AUTOFIT = `(() => {
  document.querySelectorAll('.h').forEach((h) => {
    const t = h.querySelector('.t');
    let fs = h.clientHeight * 0.15;
    t.style.fontSize = fs + 'px';
    let guard = 0;
    while (fs > 7 && (t.scrollHeight > t.clientHeight || t.scrollWidth > t.clientWidth) && guard < 80) {
      fs -= 0.6; t.style.fontSize = fs + 'px'; guard++;
    }
  });
  return document.querySelectorAll('.h').length;
})()`;

// ---- Chrome を探す ----
function findChrome(): string {
  if (process.env.CHROME_PATH && existsSync(process.env.CHROME_PATH))
    return process.env.CHROME_PATH;
  const cands = [
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/Applications/Chromium.app/Contents/MacOS/Chromium",
    "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
    "/usr/bin/google-chrome",
    "/usr/bin/chromium",
    "/usr/bin/chromium-browser",
  ];
  for (const p of cands) if (existsSync(p)) return p;
  throw new Error(
    "Chrome/Chromium が見つかりません。CHROME_PATH で指定してください。",
  );
}

// ---- 最小 CDP クライアント（依存なし） ----
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function main() {
  const hearts = layout();
  const html = buildHtml(hearts);

  const chromePath = findChrome();
  const port = 9200 + Math.floor(Math.random() * 500);
  const udd = mkdtempSync(join(tmpdir(), "hearts-img-"));
  const chrome = spawn(chromePath, [
    `--remote-debugging-port=${port}`,
    "--remote-allow-origins=*",
    "--headless=new",
    "--no-first-run",
    "--no-default-browser-check",
    "--hide-scrollbars",
    `--user-data-dir=${udd}`,
    "about:blank",
  ]);

  let wsUrl = "";
  for (let i = 0; i < 50 && !wsUrl; i++) {
    try {
      const j = await (
        await fetch(`http://127.0.0.1:${port}/json/version`)
      ).json();
      wsUrl = j.webSocketDebuggerUrl;
    } catch {
      await sleep(200);
    }
  }
  if (!wsUrl) throw new Error("CDP エンドポイントに接続できませんでした");

  const ws = new WebSocket(wsUrl);
  await new Promise((r) => (ws.onopen = r));
  let msgId = 0;
  const pending = new Map<number, (v: any) => void>();
  ws.addEventListener("message", (e) => {
    const m = JSON.parse(e.data as string);
    if (m.id && pending.has(m.id)) {
      pending.get(m.id)!(m.result);
      pending.delete(m.id);
    }
  });
  const send = (method: string, params: any = {}, sessionId?: string) =>
    new Promise<any>((res) => {
      const id = ++msgId;
      pending.set(id, res);
      ws.send(JSON.stringify({ id, method, params, sessionId }));
    });

  const { targetInfos } = await send("Target.getTargets");
  const page = targetInfos.find((t: any) => t.type === "page");
  const { sessionId } = await send("Target.attachToTarget", {
    targetId: page.targetId,
    flatten: true,
  });
  const S = (m: string, p: any = {}) => send(m, p, sessionId);

  await S("Page.enable");
  await S("Runtime.enable");
  await S("Emulation.setDeviceMetricsOverride", {
    width: W,
    height: H,
    deviceScaleFactor: DSF, // DSF 倍でレンダリング
    mobile: false,
  });
  const { frameTree } = await S("Page.getFrameTree");
  await S("Page.setDocumentContent", { frameId: frameTree.frame.id, html });
  await sleep(300);
  const fit = await S("Runtime.evaluate", {
    expression: AUTOFIT,
    returnByValue: true,
  });
  console.log("laid out hearts:", fit.result.value);
  await sleep(120);

  const shot = await S("Page.captureScreenshot", {
    format: "png",
    // scale=1/DSF で、DSF倍レンダリングを 1600×900 ちょうどに縮小（＝くっきり）
    clip: { x: 0, y: 0, width: W, height: H, scale: 1 / DSF },
  });
  const buf = Buffer.from(shot.data, "base64");

  const outArg = process.argv.slice(2).find((a) => !a.startsWith("--"));
  const output = outArg
    ? resolve(outArg)
    : join(ROOT, "public", "ogp", "hearts.png");
  mkdirSync(dirname(output), { recursive: true });
  writeFileSync(output, buf);
  const wPng = buf.readUInt32BE(16);
  const hPng = buf.readUInt32BE(20);
  console.log(`saved: ${output} (${wPng}x${hPng})`);

  ws.close();
  chrome.kill();
}

// --seed オプション
const seedArg = process.argv.indexOf("--seed");
const seed = seedArg >= 0 ? Number(process.argv[seedArg + 1]) : 42;

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
