<script lang="ts" setup>
import type { Circle } from "~/types/circle";
import { sponsorCircles, generalCircles, hostCircle } from "~/data/circles";

/** Fisher–Yates シャッフル（元配列は破壊しない） */
function shuffle<T>(arr: readonly T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j]!, a[i]!];
  }
  return a;
}

/*
 * 協賛・一般それぞれのグループ内で並び順をランダム化する。
 * useState の初期化はプリレンダー（サーバー）時に一度だけ実行され、
 * 決まった順序が payload に載ってクライアントへ引き継がれるため、
 * Math.random() を使ってもハイドレーション不一致は起きない。
 */
const shuffledSponsors = useState("circle-order-sponsors", () =>
  shuffle(sponsorCircles),
);
const shuffledGenerals = useState("circle-order-generals", () =>
  shuffle(generalCircles),
);

const circleList = computed<Circle[]>(() => [
  ...shuffledSponsors.value,
  ...shuffledGenerals.value,
  hostCircle,
]);
</script>

<template>
  <CircleCardList :circles="circleList" :booth-link="''" />
  <EventAbout />
</template>
