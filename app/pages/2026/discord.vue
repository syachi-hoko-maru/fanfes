<script lang="ts" setup>
useHead({
  title: "Discord | ソドワファンフェス",
});
</script>

<template>
  <main class="discord">
    <div class="discord__inner">
      <h1 class="discord__title">Discord</h1>
      <p class="discord__lead">
        ソドワファンフェスの Discord サーバーです。<wbr />
        参加者どうしの交流の場としてご活用ください。
      </p>

      <section class="panel">
        <h2 class="panel__heading">Discordでできること</h2>
        <ul class="panel__list">
          <li>ソード・ワールド2.5を好きな人同士での交流</li>
          <li>オンライン同人即売会の出展作品についての質問</li>
          <li>「お祭り」テーマの置きセッション</li>
        </ul>
      </section>

      <section class="panel">
        <h2 class="panel__heading">注意事項</h2>
        <DiscordCautions />
      </section>

      <DiscordInviteButton class="discord__invite" />

      <nav class="discord__nav" aria-label="関連ページへのリンク">
        <NuxtLink class="navButton" to="/2026/circle">サークル一覧へ</NuxtLink>
        <a
          class="navButton"
          href="https://syachihokomaru.booth.pm/items/8328688"
          target="_blank"
          rel="noopener noreferrer"
        >
          パンフレット頒布所（Booth）へ
          <UiIconExternal />
        </a>
      </nav>
    </div>
  </main>
</template>

<style scoped>
.discord {
  padding: 40px 20px 80px;
}

/* ワンカラム: 中央寄せの単一カラム */
.discord__inner {
  max-width: 640px;
  margin: 0 auto;
  color: var(--font-main-color-light);
}

.discord__title {
  margin: 0 0 8px;
  color: var(--main-color-dark);
  font-size: 32px;
  font-weight: bold;
}
.discord__lead {
  margin: 0 0 32px;
  font-size: 15px;
  line-height: 1.8;
}

.panel {
  margin-bottom: 28px;
  padding: 20px 24px 24px;
  background-color: var(--main-color-light);
}
.panel__heading {
  display: inline-block;
  margin: 0 0 16px;
  padding: 5px 18px;
  color: var(--font-main-color);
  font-size: 18px;
  font-weight: bold;
  background-color: var(--main-color);
  box-shadow: 3px 3px 0 0 var(--main-color-dark);
}
.panel__list {
  margin: 0;
  padding-left: 1.4em;
  font-size: 16px;
  line-height: 1.9;
}
.panel__list li {
  margin-bottom: 4px;
}

.discord__invite {
  margin-top: 40px;
}

/*
 * サークル一覧・Booth頒布所への導線。
 * flex-wrap により、幅に余裕がある時（合計約630px以上）は横並び、
 * 狭い時は自動で縦積みになる。各ボタンは border-box + 同一幅で揃える。
 */
.discord__nav {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 14px;
  margin-top: 48px;
}
.navButton {
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  /* 伸びず(grow0)・詰まる(shrink1)・基準300px。3ボタンすべて同じ幅にする */
  flex: 0 1 300px;
  max-width: 300px;
  height: 52px;
  padding: 0 16px;
  color: var(--font-main-color);
  font-size: 16px;
  font-weight: bold;
  text-decoration: none;
  background-color: var(--main-color);
  box-shadow: 4px 4px 0 0 var(--main-color-dark);
}
.navButton:hover {
  box-shadow: 2px 2px 0 0 var(--main-color-dark);
}
</style>
