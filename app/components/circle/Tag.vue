<script setup lang="ts">
defineProps<{
  /** このサークルが該当タグを持つか */
  active?: boolean;
}>();
</script>

<template>
  <div class="tag" :class="{ 'tag--off': !active }">
    <div class="tag__circle"></div>
    <div class="tag__text"><slot /></div>
  </div>
</template>

<style scoped>
.tag {
  width: 32%;
  height: 32px;
  margin-top: 4px;
  display: flex;
  align-items: center;
  background-color: var(--main-color);
  border-radius: 15px 0 0 15px;
}
.tag--off {
  background-color: var(--main-color-superlight);
}
.tag__circle {
  width: 10px;
  height: 10px;
  margin: 10px 5px 10px 10px;
  background-color: var(--main-color-light);
  border-radius: 5px;
}
.tag__text {
  width: calc(100% - 25px);
  color: var(--font-main-color);
  font-size: 12px;
  line-height: 15px;
  font-weight: bold;
  white-space: nowrap;
  overflow: hidden;
}
/* 画面幅が狭いときは行間を詰める（2行タグが窮屈にならないように） */
@media screen and (max-width: 550px) {
  .tag__text {
    font-size: 11px;
    line-height: 11px;
  }
}
</style>
