/**
 * お祭り演出（花火・夜モード）を出す期間の単一ソース。
 * 花火(EffectFireworks)・夜モード(plugins/festivalTheme.client.ts / nuxt.config のインラインスクリプト)が参照する。
 *
 * 日本時間(JST=UTC+9)の固定時刻を UTC の絶対時刻として持つため、
 * 閲覧者の端末のタイムゾーン設定に依らず、同じ実時刻で切り替わる。
 */

// 2026-07-20 17:00 JST 〜 2026-07-21 06:00 JST
export const FESTIVAL_START = Date.UTC(2026, 6, 20, 8, 0, 0); // 2026-07-20 17:00 JST
export const FESTIVAL_END = Date.UTC(2026, 6, 20, 21, 0, 0); // 2026-07-21 06:00 JST

// setTimeout の遅延上限(ms)。これを超える遅延は張らない（超えると即時発火してしまうため）
export const FESTIVAL_MAX_TIMEOUT = 2_147_483_647;

/** 現在が花火・夜モードの表示期間内か */
export function isFestivalNow(now: number = Date.now()): boolean {
  return now >= FESTIVAL_START && now < FESTIVAL_END;
}
