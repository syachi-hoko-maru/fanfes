/** サークルが付与できる頒布物カテゴリのタグ */
export type CircleTag =
  | "シナリオ/キャンペーン"
  | "リプレイ/小説"
  | "オリジナルデータ"
  | "素材（立ち絵）"
  | "素材（オンラインセッション用）"
  | "素材（その他）";

/** 出展サークル1件分のデータ */
export interface Circle {
  /** サークル詳細ページ（/2026/circle/{id}）で使う一意なID */
  id: string;
  name: string;
  tags: CircleTag[];
  imgSrc: string;
  link: string;
}
