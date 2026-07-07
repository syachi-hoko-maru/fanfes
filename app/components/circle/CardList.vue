<script setup lang="ts">
import type { Circle } from "~/types/circle";

defineProps<{
  circles: Circle[];
  /** 先頭のトップカードから開く Booth へのリンク */
  boothLink?: string;
}>();
</script>

<template>
  <div class="cardList">
    <CircleCardFeature :booth-link="boothLink" />
    <CircleCard v-for="circle in circles" :key="circle.name" :circle="circle" />
  </div>
</template>

<style scoped>
.cardList {
  display: flex;
  flex-wrap: wrap;
  gap: 30px;
  margin: 30px 30px 0 30px;
}
@media screen and (max-width: 500px) {
  .cardList {
    margin: 30px 20px 0 20px;
  }
}
@media screen and (max-width: 470px) {
  .cardList {
    margin: 30px 10px 0 10px;
  }
}

/* 何列で並べるかはリスト側のレイアウト責務として制御する */
.cardList :deep(.card) {
  width: calc((100% - 90px) / 4);
}
@media screen and (max-width: 1900px) {
  .cardList :deep(.card) {
    width: calc((100% - 60px) / 3);
  }
}
@media screen and (max-width: 1400px) {
  .cardList :deep(.card) {
    width: calc((100% - 30px) / 2);
  }
}
@media screen and (max-width: 950px) {
  .cardList :deep(.card) {
    width: 100%;
  }
}
</style>
