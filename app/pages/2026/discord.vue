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
    </div>
  </main>

  <EventAbout />
</template>

<style scoped>
.discord {
  padding: 40px 20px 80px;
}

/* ワンカラム: 中央寄せの単一カラム */
.discord__inner {
  max-width: 640px;
  margin: 0 auto;
  color: #333;
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
  color: #fff;
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
</style>
