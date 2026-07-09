<script setup lang="ts">
defineProps<{
  /** パンフレット頒布所（Booth）へのリンク */
  boothLink?: string;
}>();
</script>

<template>
  <div class="card">
    <CircleCardHeader feature>
      <img
        class="logo"
        src="/webp/other/fanfes/logo-white.webp"
        alt="ソード・ワールド2.5 オンラインファンイベント ソドワファンフェス"
      />
    </CircleCardHeader>
    <CircleCardImage
      src="/webp/pam.webp"
      alt="ソドワファンフェス紹介画像"
      pam
    />
    <CircleCardButton href="/2026/discord"> Discordについて </CircleCardButton>
    <CircleCardButton :href="boothLink">
      パンフレット頒布所（Booth）へ
    </CircleCardButton>
  </div>
</template>

<style scoped>
.card {
  background-color: var(--main-color-light);
}

/*
 * ヘッダー内のロゴ。少し高くした feature ヘッダーに収まるサイズで表示する。
 * サークルカット画像（CircleCardImage）は縮めず通常カードと同じ自然サイズの
 * ままにし、ヘッダー高さで下のボタン位置を他カードに揃える。
 */
.logo {
  height: 63px;
  width: auto;
  /* カード幅より広くなる狭い画面では、はみ出さずに縮める */
  max-width: 100%;
  aspect-ratio: 68 / 11;
  object-fit: contain;
}

/*
 * Discordボタン（上）＝2つ並ぶボタンの1つ目。
 * ・Boothボタンとの間隔を通常の半分程度に詰める
 * ・Discordブランドカラーにする
 */
.card :deep(.buttonWrapper:has(+ .buttonWrapper)) .button {
  margin-bottom: 7px;
  background-color: var(--discord-color);
  box-shadow: 3px 3px 0 0 var(--discord-color-dark);
}
.card :deep(.buttonWrapper:has(+ .buttonWrapper)) .button:hover {
  box-shadow: 1px 1px 0 0 var(--discord-color-dark);
}
</style>
