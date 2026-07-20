/*
 * 花火の期間中だけ、サイト全体を夜モードにする。
 * <html> に "festival-dark" クラスを付け外しし、実際の配色は
 * app/assets/css/variables.css の html.festival-dark 側で切り替える。
 *
 * 初期表示のちらつき防止（初回描画から夜モード）は nuxt.config.ts の
 * インラインスクリプトが担当する。このプラグインは主に
 * 「ページを開いたまま開始/終了時刻を跨いだ場合」に自動で切り替える役割。
 * 期間の判定は app/utils/festival.ts の一元管理値を使う。
 */
import {
  FESTIVAL_START,
  FESTIVAL_END,
  FESTIVAL_MAX_TIMEOUT,
  isFestivalNow,
} from "~/utils/festival";

export default defineNuxtPlugin(() => {
  const root = document.documentElement;
  const setDark = (on: boolean) => root.classList.toggle("festival-dark", on);

  const now = Date.now();

  // お祭り後は常にライト
  if (now >= FESTIVAL_END) {
    setDark(false);
    return;
  }

  // 期間中：夜モードにして、終了時刻にライトへ戻す
  if (isFestivalNow(now)) {
    setDark(true);
    const toEnd = FESTIVAL_END - now;
    if (toEnd <= FESTIVAL_MAX_TIMEOUT) setTimeout(() => setDark(false), toEnd);
    return;
  }

  // 開始前：開始時刻に夜モードへ切り替え、その後終了時刻でライトへ戻す
  const toStart = FESTIVAL_START - now;
  if (toStart <= FESTIVAL_MAX_TIMEOUT) {
    setTimeout(() => {
      setDark(true);
      const toEnd = FESTIVAL_END - Date.now();
      if (toEnd <= FESTIVAL_MAX_TIMEOUT) setTimeout(() => setDark(false), toEnd);
    }, toStart);
  }
});
