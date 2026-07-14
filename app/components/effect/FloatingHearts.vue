<script setup lang="ts">
/*
 * アクセス時、ソード・ワールド2.5への“好き”メッセージを載せたハートが
 * 画面下から上へゆっくり流れていくお祭り演出。
 * ・pointer-events:none で操作の邪魔をしない
 * ・prefers-reduced-motion 指定時は何も出さない
 * ・SSRでは空、マウント後（クライアント）にだけ生成するのでハイドレーション不一致なし
 */

// 色とメッセージは別ファイル(app/data/heartMessages.ts)で一元管理する。
// 画像生成スクリプト(scripts/generate-hearts-image.ts)も同じ定義を参照する。
import { COLORS, MESSAGES } from "~/data/heartMessages";

interface Heart {
  id: number;
  message: string;
  color: string;
  style: Record<string, string>;
}

const hearts = ref<Heart[]>([]);

let seq = 0;
const cleanupTimers = new Set<ReturnType<typeof setTimeout>>();
// メッセージが偏らないよう、シャッフルした山から順に配る（尽きたら再シャッフル）
let bag: string[] = [];

const rand = (min: number, max: number) => min + Math.random() * (max - min);
const pick = <T,>(arr: readonly T[]): T =>
  arr[Math.floor(Math.random() * arr.length)]!;

function nextMessage(): string {
  if (bag.length === 0) {
    bag = [...MESSAGES].sort(() => Math.random() - 0.5);
  }
  return bag.pop()!;
}

function spawn() {
  const id = ++seq;
  const dur = rand(4, 8); // 上昇にかかる秒数（短いほど速い）
  hearts.value.push({
    id,
    message: nextMessage(),
    color: pick(COLORS),
    style: {
      left: `${rand(2, 84)}%`, // 開始水平位置
      "--dur": `${dur}s`,
      "--dx": `${rand(-55, 55)}px`, // 横方向へのゆらぎ
      "--scale": `${rand(0.8, 1.12)}`, // 大きさのばらつき
      "--rot0": `${rand(-10, 10)}deg`,
      "--rot1": `${rand(-14, 14)}deg`,
      "--maxop": `${rand(0.85, 1)}`,
    },
  });
  // アニメーション終了後に取り除く
  const t = setTimeout(
    () => {
      hearts.value = hearts.value.filter((h) => h.id !== id);
      cleanupTimers.delete(t);
    },
    dur * 1000 + 300,
  );
  cleanupTimers.add(t);
}

onMounted(() => {
  const reduce =
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
  if (reduce) return;
  /*
   * アクセス直後の2秒間に、ランダムなタイミング・場所でハートを出して終了（以降は出さない）。
   * 個数は画面幅に応じて可変：最低5個＋幅250pxごとに+1（例 375px→6, 1000px→9, 1500px→11）。
   * このコンポーネントは app.vue 直下にあり <NuxtPage> の外側なので、SPA内の画面遷移では
   * 再マウントされない＝発火しない。onMounted はフルロード（初回アクセス・画面更新）でのみ
   * 実行されるため、「更新時は出す・遷移では出さない」を満たす。
   */
  const count = 5 + Math.floor(window.innerWidth / 250);
  for (let i = 0; i < count; i++) {
    const t = setTimeout(spawn, Math.random() * 2000);
    cleanupTimers.add(t);
  }
});

onBeforeUnmount(() => {
  cleanupTimers.forEach((t) => clearTimeout(t));
  cleanupTimers.clear();
});
</script>

<template>
  <div class="hearts" aria-hidden="true">
    <div v-for="h in hearts" :key="h.id" class="heart" :style="h.style">
      <svg class="heart__shape" viewBox="0 0 32 29.6">
        <path
          d="M23.6,0c-3.4,0-6.3,2.7-7.6,5.6C14.7,2.7,11.8,0,8.4,0C3.8,0,0,3.8,0,8.4
             c0,9.4,9.5,11.9,16,21.2c6.1-9.3,16-11.8,16-21.2C32,3.8,28.2,0,23.6,0z"
          :fill="h.color"
        />
      </svg>
      <span class="heart__text">{{ h.message }}</span>
    </div>
  </div>
</template>

<style scoped>
.hearts {
  position: fixed;
  inset: 0;
  /* ヘッダー(100)・モーダル(1000)より下。コンテンツより前面に重ねる */
  z-index: 90;
  overflow: hidden;
  pointer-events: none;
}

.heart {
  position: absolute;
  top: 100%; /* 画面下の外側から出発 */
  width: 190px;
  height: 176px; /* viewBox 32:29.6 のアスペクトに合わせる */
  animation: heartFloat var(--dur) linear forwards;
  will-change: transform, opacity;
}

.heart__shape {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  filter: drop-shadow(0 3px 4px rgba(0, 0, 0, 0.12));
}

.heart__text {
  position: absolute;
  /* ハートの“ふくらみ”の中に文字を収める */
  left: 14%;
  right: 14%;
  top: 24%;
  height: 48%;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: #4a3b30;
  font-size: 12.5px;
  font-weight: 700;
  line-height: 1.35;
  overflow: hidden;
  word-break: break-word;
}

@media screen and (max-width: 500px) {
  .heart {
    width: 150px;
    height: 139px;
  }
  .heart__text {
    font-size: 11px;
  }
}

@keyframes heartFloat {
  0% {
    transform: translate3d(0, 0, 0) scale(var(--scale)) rotate(var(--rot0));
    opacity: 0;
  }
  10% {
    opacity: var(--maxop);
  }
  80% {
    opacity: var(--maxop);
  }
  100% {
    transform: translate3d(var(--dx), calc(-100vh - 260px), 0)
      scale(var(--scale)) rotate(var(--rot1));
    opacity: 0;
  }
}

/* 端末側で「視差効果を減らす」設定なら演出を止める */
@media (prefers-reduced-motion: reduce) {
  .hearts {
    display: none;
  }
}
</style>
