import type { Circle, CircleTag } from "~/types/circle";

/**
 * サークル1件分のデータを生成するヘルパー。
 * ・id     … サークル詳細ページ（/2026/circle/{id}）で使う通し番号
 * ・img    … サークルカット画像のファイル名（/webp/circle/{img}.webp）
 *            ※ id とは独立。表示順を変えても画像・番号は固定
 * ・link   … サークル詳細ページ（/2026/circle/{id}）へのリンク
 */
function circle(data: {
  id: number;
  img: string;
  name: string;
  tags: CircleTag[];
}): Circle {
  return {
    id: String(data.id),
    name: data.name,
    tags: data.tags,
    imgSrc: `/webp/circle/${data.img}.webp`,
    link: `/2026/circle/${data.id}`,
  };
}

/** 協賛サークル */
export const sponsorCircles: Circle[] = [
  circle({
    id: 1,
    img: "junkai-gakuha",
    name: "巡涯学派",
    tags: [
      "シナリオ/キャンペーン",
      "オリジナルデータ",
      "素材（オンラインセッション用）",
    ],
  }),
  circle({
    id: 6,
    img: "sekka-roten",
    name: "雪花露店",
    tags: ["シナリオ/キャンペーン"],
  }),
  circle({
    id: 7,
    img: "studio-sister",
    name: "studio SISTER",
    tags: ["シナリオ/キャンペーン", "オリジナルデータ"],
  }),
  circle({
    id: 12,
    img: "gensou-shosai",
    name: "幻想書斎",
    tags: ["シナリオ/キャンペーン", "オリジナルデータ"],
  }),
  circle({
    id: 14,
    img: "nanairo-dice",
    name: "ナナイロダイス",
    tags: [
      "シナリオ/キャンペーン",
      "オリジナルデータ",
      "素材（オンラインセッション用）",
    ],
  }),
  circle({
    id: 16,
    img: "thyme",
    name: "Thyme",
    tags: ["シナリオ/キャンペーン", "素材（その他）"],
  }),
  circle({
    id: 17,
    img: "rurou-no-tami",
    name: "流浪の民",
    tags: ["オリジナルデータ"],
  }),
  circle({
    id: 19,
    img: "bang-g",
    name: "BANG-G",
    tags: ["シナリオ/キャンペーン"],
  }),
];

/** 一般出展サークル */
export const generalCircles: Circle[] = [
  circle({
    id: 2,
    img: "yasui-kamo",
    name: "安いかもしれない",
    tags: ["シナリオ/キャンペーン", "素材（立ち絵）"],
  }),
  circle({
    id: 3,
    img: "cremeria",
    name: "クレメリア情報局",
    tags: [
      "シナリオ/キャンペーン",
      "オリジナルデータ",
      "素材（オンラインセッション用）",
    ],
  }),
  circle({
    id: 4,
    img: "momiji-bakufu",
    name: "紅葉幕府",
    tags: ["シナリオ/キャンペーン", "オリジナルデータ"],
  }),
  circle({
    id: 5,
    img: "effective-cartridge",
    name: "イフェクティブカートリッジ工場",
    tags: ["オリジナルデータ"],
  }),
  circle({
    id: 8,
    img: "kuronekotei",
    name: "黒猫亭",
    tags: ["素材（立ち絵）"],
  }),
  circle({
    id: 9,
    img: "wakka-trpg",
    name: "わっかのTRPG部屋",
    tags: [
      "シナリオ/キャンペーン",
      "オリジナルデータ",
      "素材（オンラインセッション用）",
    ],
  }),
  circle({
    id: 10,
    img: "shikakawa-seiniku",
    name: "鹿川精肉店",
    tags: ["素材（立ち絵）", "素材（オンラインセッション用）"],
  }),
  circle({
    id: 11,
    img: "okoru-deshi",
    name: "怒る弟子瑕疵",
    tags: [
      "シナリオ/キャンペーン",
      "オリジナルデータ",
      "素材（オンラインセッション用）",
    ],
  }),
  circle({
    id: 13,
    img: "sabamiso",
    name: "鯖味噌定食屋",
    tags: ["シナリオ/キャンペーン"],
  }),
  circle({
    id: 15,
    img: "komugimochi",
    name: "こむぎもち",
    tags: ["シナリオ/キャンペーン", "素材（立ち絵）"],
  }),
  circle({
    id: 18,
    img: "jirai-hanabi",
    name: "地雷花火",
    tags: ["リプレイ/小説"],
  }),
  circle({
    id: 20,
    img: "inside-rain",
    name: "Inside Rain",
    tags: ["シナリオ/キャンペーン", "素材（立ち絵）", "素材（その他）"],
  }),
  circle({
    id: 21,
    img: "takenokotei",
    name: "たけのこ邸",
    tags: ["シナリオ/キャンペーン"],
  }),
  circle({
    id: 22,
    img: "togakiya",
    name: "トガキヤ",
    tags: [
      "シナリオ/キャンペーン",
      "オリジナルデータ",
      "素材（立ち絵）",
      "素材（オンラインセッション用）",
    ],
  }),
  circle({
    id: 23,
    img: "sea-lounge",
    name: "しーらうんじ",
    tags: ["シナリオ/キャンペーン", "素材（立ち絵）"],
  }),
];

/** 主催サークル。一覧では常に末尾に固定する */
export const hostCircle: Circle = circle({
  id: 24,
  img: "syachihoko",
  name: "しゃちほこの尾びれ亭",
  tags: [
    "シナリオ/キャンペーン",
    "オリジナルデータ",
    "素材（オンラインセッション用）",
  ],
});

/** 全サークル（協賛 → 一般 → 主催）。id からの逆引き等に使う */
export const allCircles: Circle[] = [
  ...sponsorCircles,
  ...generalCircles,
  hostCircle,
];

/** id（"1"〜"24"）からサークルを取得。見つからなければ undefined */
export function findCircle(id: string): Circle | undefined {
  return allCircles.find((c) => c.id === id);
}
