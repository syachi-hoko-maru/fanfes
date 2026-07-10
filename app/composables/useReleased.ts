/**
 * サークル詳細情報の公開時刻ゲート（詳細ページ本文・「見に行く」ボタンで共通利用）。
 *
 * 2026-07-11 00:00（JST）以降に true になる。
 * プリレンダー時（サーバー）は必ず false（＝公開前の表示）とし、
 * クライアントのマウント時に実時刻で判定する（ハイドレーション不一致を避ける）。
 *
 * 公開時刻を変えたいときは下の CIRCLE_RELEASE_MS だけを変更する。
 */
export const CIRCLE_RELEASE_MS = new Date(
  "2026-07-11T00:00:00+09:00",
).getTime();

export function useReleased() {
  const released = ref(false);
  onMounted(() => {
    released.value = Date.now() >= CIRCLE_RELEASE_MS;
  });
  return released;
}
