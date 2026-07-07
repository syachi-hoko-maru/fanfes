<script setup lang="ts">
import type { CircleTag } from "~/types/circle";

const props = defineProps<{
  tags: CircleTag[];
}>();

const has = (tag: CircleTag) => props.tags.includes(tag);
</script>

<template>
  <div class="tagList">
    <CircleTag :active="has('シナリオ/キャンペーン')">
      シナリオ
      <br />
      キャンペーン
    </CircleTag>
    <CircleTag :active="has('リプレイ/小説')">
      リプレイ
      <br />
      小説
    </CircleTag>
    <CircleTag :active="has('オリジナルデータ')">
      独自データ
    </CircleTag>
    <CircleTag :active="has('素材（立ち絵）')">
      素材
      <br />
      立ち絵
    </CircleTag>
    <CircleTag :active="has('素材（オンラインセッション用）')">
      素材
      <br />
      オンライン<wbr />セッション
    </CircleTag>
    <CircleTag :active="has('素材（その他）')">
      素材
      <br />
      その他
    </CircleTag>
  </div>
</template>

<style scoped>
.tagList {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  padding: 3px 10px 0 10px;
  cursor: default;
}
</style>
