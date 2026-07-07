<script setup lang="ts">
// ページ最上部に固定表示するサイト全体のヘッダー
</script>

<template>
  <header class="siteHeader">
    <img
      class="siteHeader__logo"
      src="/webp/other/fanfes/logo-white.webp"
      alt="ソード・ワールド2.5 オンラインファンイベント ソドワファンフェス"
    />
  </header>
</template>

<style scoped>
.siteHeader {
  position: sticky;
  top: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  width: 100%;
  height: 60px;
  padding: 0 24px;
  background-color: var(--main-color);
  border-bottom: 3px solid var(--main-color-dark);
  box-sizing: border-box;
}
.siteHeader__logo {
  height: 38px;
  width: auto;
  aspect-ratio: 68 / 11;
  object-fit: contain;
}
@media screen and (max-width: 500px) {
  .siteHeader {
    height: 52px;
    padding: 0 14px;
  }
  .siteHeader__logo {
    height: 32px;
  }
}
</style>
