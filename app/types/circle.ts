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

/** 頒布先・頒布物1件 */
export interface CircleShop {
  /** 頒布先・頒布物の名前 */
  name: string;
  /** 頒布リンク（無い場合は空文字） */
  url: string;
  /** 頒布先・頒布物の説明 */
  description: string;
}

/** サークル詳細ページで公開する情報（頒布先・SNS） */
export interface CircleDetail {
  shops: CircleShop[];
  /** X（Twitter）アカウントのハンドル（@抜き） */
  xAccounts: string[];
}
