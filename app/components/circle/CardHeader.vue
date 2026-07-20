<script setup lang="ts">
const props = defineProps<{
  /** サークル名。指定時は文字数に応じてフォントサイズを自動調整する */
  title?: string;
  /** トップ（ロゴ）カード用の背の高いヘッダーにする */
  feature?: boolean;
}>();

// サークル名の長さに応じたサイズ調整クラス
const sizeClass = computed(() => {
  const len = props.title?.length ?? 0;
  if (len > 30) return "header--long30";
  if (len > 20) return "header--long20";
  if (len > 15) return "header--long15";
  return "";
});
</script>

<template>
  <h3 class="header" :class="feature ? 'header--feature' : sizeClass">
    <slot>{{ title }}</slot>
  </h3>
</template>

<style scoped>
.header {
  display: flex;
  align-items: center;
  width: 100%;
  height: 39px;
  overflow: hidden;
  color: var(--font-main-color);
  font-size: 20px;
  font-weight: bold;
  background-color: var(--main-color);
  padding: 3px;
  border-bottom: 3px solid var(--main-color-dark);
}
/*
 * トップ（ロゴ）カード用のヘッダー。通常カードよりタグ行が無いぶん、
 * ヘッダーを少し高くして下のボタン位置を他カードと揃える。
 */
.header--feature {
  height: 73px;
  padding-top: 0;
  padding-bottom: 0;
}
.header--long15 {
  font-size: 18px;
}
.header--long20 {
  font-size: 16px;
  line-height: 17px;
}
.header--long30 {
  font-size: 14px;
  line-height: 15px;
}
@media screen and (max-width: 400px) {
  .header--long15,
  .header--long20 {
    font-size: 14px;
    line-height: 15px;
  }
}
</style>
