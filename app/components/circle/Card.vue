<script setup lang="ts">
import type { Circle } from "~/types/circle";

defineProps<{
  circle: Circle;
}>();
</script>

<template>
  <div class="card">
    <CircleCardHeader :title="circle.name" />
    <CircleTagList :tags="circle.tags" />
    <CircleCardImage
      :src="circle.imgSrc"
      :alt="`ソドワファンフェス出展サークル「${circle.name}」のサークルカット`"
    />
    <!-- サークル詳細ページ（/2026/circle/{id}）は準備中のため一旦 disabled -->
    <CircleCardButton :href="circle.link" disabled>
      このサークルを見に行く
    </CircleCardButton>
  </div>
</template>

<style scoped>
.card {
  background-color: var(--main-color-light);
}
</style>
