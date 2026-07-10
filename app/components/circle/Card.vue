<script setup lang="ts">
import type { Circle } from "~/types/circle";

defineProps<{
  circle: Circle;
}>();

// 詳細ページと同じ公開ゲート。2026-07-11 00:00 JST 以降にボタンを有効化する
const released = useReleased();
</script>

<template>
  <div class="card">
    <CircleCardHeader :title="circle.name" />
    <CircleTagList :tags="circle.tags" />
    <CircleCardImage
      :src="circle.imgSrc"
      :alt="`ソドワファンフェス出展サークル「${circle.name}」のサークルカット`"
    />
    <!-- 公開前（〜7/11 0:00 JST）は disabled、公開後は詳細ページへ遷移可能に -->
    <CircleCardButton :href="circle.link" :disabled="!released">
      このサークルを見に行く
    </CircleCardButton>
  </div>
</template>

<style scoped>
.card {
  background-color: var(--main-color-light);
}
</style>
