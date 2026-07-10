<script lang="ts" setup>
import { findCircle } from "~/data/circles";
import { circleDetails } from "~/data/circleDetails";

const route = useRoute();
const id = computed(() => String(route.params.id));
const circle = computed(() => findCircle(id.value));
const detail = computed(() => circleDetails[id.value]);

// 頒布情報の公開ゲート（2026-07-11 00:00 JST〜）。共通ロジックは useReleased に集約
const released = useReleased();

// 前後のサークル（1〜24 でループ。1 の前は 24、24 の次は 1）
const TOTAL = 24;
const prevId = computed(() => {
  const n = Number(id.value);
  return String(n <= 1 ? TOTAL : n - 1);
});
const nextId = computed(() => {
  const n = Number(id.value);
  return String(n >= TOTAL ? 1 : n + 1);
});

// 本番ドメイン。OGP画像・URLは絶対パスで指定する必要がある
const SITE_URL = "https://fanfes.syachi.work";

const pageTitle = computed(() =>
  circle.value
    ? `${circle.value.name} | ソドワファンフェス`
    : "サークル | ソドワファンフェス",
);
const description = computed(() =>
  circle.value
    ? `${circle.value.name}がソドワファンフェスに出展！ ソード・ワールド2.5のオンラインファンイベントです。`
    : "ソード・ワールド2.5のオンラインファンイベント「ソドワファンフェス」の出展サークル紹介ページです。",
);
// サークルごとに生成した紹介画像（/ogp/circle/{id}.png）
const ogImage = computed(() => `${SITE_URL}/ogp/circle/${id.value}.png`);

// X（Twitter）へのツイート用リンク。詳細ページURLを渡すとOGPカードが表示される
const tweetUrl = computed(() => {
  const text = circle.value
    ? `${circle.value.name}がソドワファンフェスに出展！`
    : "ソドワファンフェスに参加しています！";
  const params = new URLSearchParams({
    text,
    url: `${SITE_URL}/2026/circle/${id.value}`,
    hashtags: "ソドワファンフェス",
  });
  return `https://twitter.com/intent/tweet?${params.toString()}`;
});

useHead({ title: pageTitle });
useSeoMeta({
  description: () => description.value,
  ogTitle: () => pageTitle.value,
  ogDescription: () => description.value,
  ogType: "website",
  ogUrl: () => `${SITE_URL}/2026/circle/${id.value}`,
  ogImage: () => ogImage.value,
  ogImageWidth: 1600,
  ogImageHeight: 900,
  twitterCard: "summary_large_image",
  twitterTitle: () => pageTitle.value,
  twitterDescription: () => description.value,
  twitterImage: () => ogImage.value,
});
</script>

<template>
  <main class="detail">
    <!-- PC のみ表示する左右の矢印ナビ（前後のサークルへ／ループ） -->
    <NuxtLink
      v-if="circle"
      class="sideNav sideNav--prev"
      :to="`/2026/circle/${prevId}`"
      aria-label="前のサークルへ"
    >
      <svg
        class="sideNav__icon"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="3"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <polyline points="15 5 8 12 15 19" />
      </svg>
    </NuxtLink>
    <NuxtLink
      v-if="circle"
      class="sideNav sideNav--next"
      :to="`/2026/circle/${nextId}`"
      aria-label="次のサークルへ"
    >
      <svg
        class="sideNav__icon"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="3"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <polyline points="9 5 16 12 9 19" />
      </svg>
    </NuxtLink>

    <div class="detail__inner">
      <h1 class="detail__title">{{ circle?.name ?? "サークル" }}</h1>

      <div v-if="circle" class="detail__card">
        <CircleCardImage
          :src="circle.imgSrc"
          :alt="`ソドワファンフェス出展サークル「${circle.name}」のサークルカット`"
        />
        <CircleTagList :tags="circle.tags" />
      </div>

      <!-- 公開前（〜7/11 0:00 JST）は従来の予告表示のまま -->
      <div v-if="!released" class="detail__notice">
        <p class="detail__notice-text">
          このサークル詳細ページは<wbr />
          <strong>2026年7月11日（土）0時頃</strong>に<wbr />公開予定です。
        </p>
        <p class="detail__notice-sub">
          頒布先などの公開まで今しばらくお待ちください。
        </p>
      </div>

      <!-- 公開後（7/11 0:00 JST〜）は頒布情報・SNSを表示 -->
      <template v-else-if="detail">
        <section v-if="detail.shops.length" class="shops">
          <h2 class="shops__title">頒布情報</h2>
          <ul class="shops__list">
            <li v-for="(shop, i) in detail.shops" :key="i" class="shop">
              <p class="shop__name">
                <a
                  v-if="shop.url"
                  class="shop__link"
                  :href="shop.url"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {{ shop.name }}<UiIconExternal />
                </a>
                <span v-else>{{ shop.name }}</span>
              </p>
              <p v-if="shop.description" class="shop__desc">
                {{ shop.description }}
              </p>
            </li>
          </ul>
        </section>

        <section v-if="detail.xAccounts.length" class="sns">
          <h2 class="sns__title">SNS</h2>
          <ul class="sns__list">
            <li v-for="handle in detail.xAccounts" :key="handle">
              <a
                class="sns__link"
                :href="`https://x.com/${handle}`"
                target="_blank"
                rel="noopener noreferrer"
              >
                @{{ handle }}<UiIconExternal />
              </a>
            </li>
          </ul>
        </section>

        <div
          v-if="!detail.shops.length && !detail.xAccounts.length"
          class="detail__notice"
        >
          <p class="detail__notice-sub">
            このサークルの頒布情報は準備中です。<wbr />
            更新時は
            <a href="/2026/discord" target="_blank" rel="noopener noreferrer">
              ソドワファンフェスのDiscordサーバー
            </a>
            や
            <a
              href="https://x.com/syachi_hoko_trp"
              target="_blank"
              rel="noopener noreferrer"
            >
              しゃちほこ丸のX（Twitter）
            </a>
            でお知らせしますので、<wbr />
            ぜひ参加・フォローしてお待ちください。
          </p>
        </div>
      </template>

      <section v-if="circle" class="tweet">
        <h2 class="tweet__title">このサークルについてツイートする</h2>

        <img
          class="tweet__image"
          :src="`/ogp/circle/${id}.png`"
          :alt="`ソドワファンフェス出展サークル「${circle.name}」の紹介画像`"
          width="1600"
          height="900"
        />

        <p class="tweet__lead">
          お祭りです！<br />
          「いいな」と思ったサークルは、<wbr />
          ぜひSNSでポジティブな感想をどんどん発信してください。<wbr />
          あなたのひと言がイベントを、ソード・ワールド2.5をもっと盛り上げます。
        </p>
        <p class="tweet__note">
          もし「自分には合わないかも（not for me）」と感じたら、<wbr />
          それを発信するのはぐっとこらえて、<wbr />
          あなたの好みにぴったり合うサークルを探しにいきましょう。
        </p>

        <a
          class="tweet__button"
          :href="tweetUrl"
          target="_blank"
          rel="noopener noreferrer"
        >
          Xでツイートする
          <UiIconExternal />
        </a>
      </section>

      <nav v-if="circle" class="pageNav">
        <NuxtLink class="pageNav__button" :to="`/2026/circle/${prevId}`">
          <span class="pageNav__arrow" aria-hidden="true">‹</span>前のサークル
        </NuxtLink>
        <NuxtLink class="pageNav__button" :to="`/2026/circle/${nextId}`">
          次のサークル<span class="pageNav__arrow" aria-hidden="true">›</span>
        </NuxtLink>
      </nav>

      <NuxtLink class="detail__back" to="/2026/circle">
        サークル一覧へ戻る
      </NuxtLink>
    </div>
  </main>
</template>

<style scoped>
.detail {
  padding: 40px 20px 80px;
}
.detail__inner {
  max-width: 640px;
  margin: 0 auto;
  color: #333;
  text-align: center;
}

.detail__title {
  margin: 0 0 24px;
  color: var(--main-color-dark);
  font-size: 28px;
  font-weight: bold;
  line-height: 1.4;
  word-break: break-word;
}

/* サークルカット画像とタグ一覧をカードと同じ見た目でまとめる */
.detail__card {
  max-width: 640px;
  margin: 0 auto 32px;
  /* 画像の上下左右・タグの左右下の余白をこの padding で統一する */
  padding: 10px;
  background-color: var(--main-color-light);
}
/* 共有コンポーネント自身の余白は打ち消し、カードの padding に揃える */
.detail__card :deep(.imgWrapper) {
  width: 100%;
  margin: 0;
}
/* インライン画像の余白/中央寄せの影響を消し、左右をカード padding に揃える */
.detail__card :deep(.circleCut) {
  display: block;
  width: 100%;
}
.detail__card :deep(.tagList) {
  /*
   * 画像とタグの間の余白を 10px に揃える。
   * tag の margin-top:4px と、画像下に 3px 落ちる box-shadow を見込んだ値。
   */
  padding: 9px 0 0;
}

.detail__notice {
  margin: 0 auto;
  padding: 32px 24px;
  background-color: var(--main-color-light);
  border-top: 3px solid var(--main-color-dark);
}
.detail__notice-text {
  margin: 0;
  font-size: 17px;
  font-weight: bold;
  line-height: 1.9;
}
.detail__notice-text strong {
  color: var(--main-color-dark);
}
.detail__notice-sub {
  margin: 12px 0 0;
  color: #666;
  font-size: 14px;
  line-height: 1.8;
}

/* 頒布情報・SNS（公開後に表示） */
.shops,
.sns {
  margin: 0 auto 24px;
  padding: 24px;
  text-align: left;
  background-color: var(--main-color-light);
  border-top: 3px solid var(--main-color-dark);
}
.shops__title,
.sns__title {
  display: inline-block;
  margin: 0 0 16px;
  padding-bottom: 6px;
  color: var(--main-color-dark);
  font-size: 20px;
  font-weight: bold;
  border-bottom: 2px solid var(--main-color);
}
.shops__list,
.sns__list {
  margin: 0;
  padding: 0;
  list-style: none;
}
.shop {
  padding: 14px 0;
  border-bottom: 1px dashed var(--main-color-dark);
}
.shop:first-child {
  padding-top: 0;
}
.shop:last-child {
  padding-bottom: 0;
  border-bottom: 0;
}
.shop__name {
  margin: 0 0 6px;
  font-size: 16px;
  font-weight: bold;
  line-height: 1.6;
}
.shop__link,
.sns__link {
  color: var(--main-color-dark);
  text-decoration: underline;
  overflow-wrap: anywhere;
}
.shop__link:hover,
.sns__link:hover {
  opacity: 0.8;
}
.shop__desc {
  margin: 0;
  color: #555;
  font-size: 14px;
  line-height: 1.8;
}
.sns__list li {
  margin-bottom: 6px;
}
.sns__list li:last-child {
  margin-bottom: 0;
}
.sns__link {
  font-weight: bold;
}
.shop__link :deep(svg),
.sns__link :deep(svg) {
  vertical-align: -0.15em;
  margin-left: 2px;
}

/* このサークルについてツイートする */
.tweet {
  margin-top: 40px;
  padding: 28px 24px 32px;
  background-color: var(--main-color-light);
  border-top: 3px solid var(--main-color-dark);
}
.tweet__title {
  display: inline-block;
  margin: 0 0 20px;
  padding-bottom: 8px;
  color: var(--main-color-dark);
  font-size: 25px;
  font-weight: bold;
  line-height: 1.5;
  border-bottom: 4px solid var(--main-color);
}
.tweet__image {
  display: block;
  width: 100%;
  height: auto;
  margin: 0 auto 20px;
  box-shadow: 3px 3px 0 0 var(--main-color-dark);
}
.tweet__lead {
  margin: 0 0 12px;
  font-size: 15px;
  font-weight: bold;
  line-height: 1.9;
  text-align: left;
}
.tweet__note {
  margin: 0 0 24px;
  color: #666;
  font-size: 14px;
  line-height: 1.9;
  text-align: left;
}
.tweet__button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  /* 狭い画面ではコンテナ幅まで縮む（240px を下限にしない） */
  width: min(240px, 100%);
  height: 50px;
  padding: 0 24px;
  box-sizing: border-box;
  color: #fff;
  font-size: 16px;
  font-weight: bold;
  text-decoration: none;
  background-color: #000;
  box-shadow: 4px 4px 0 0 #555;
}
.tweet__button:hover {
  box-shadow: 2px 2px 0 0 #555;
}

/* 前後サークルへの通常ボタン（スマホ・PC共通、戻るボタンの上） */
.pageNav {
  display: flex;
  gap: 12px;
  margin-top: 40px;
}
.pageNav__button {
  flex: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  height: 50px;
  padding: 0 12px;
  white-space: nowrap;
  color: #fff;
  font-size: 15px;
  font-weight: bold;
  text-decoration: none;
  background-color: var(--main-color);
  box-shadow: 4px 4px 0 0 var(--main-color-dark);
}
.pageNav__button:hover {
  box-shadow: 2px 2px 0 0 var(--main-color-dark);
}
.pageNav__arrow {
  font-size: 22px;
  line-height: 1;
}

/* PC のみ表示する左右の矢印ナビ */
.sideNav {
  display: none;
}
@media screen and (min-width: 960px) {
  .sideNav {
    position: fixed;
    top: 50%;
    transform: translateY(-50%);
    display: flex;
    align-items: center;
    justify-content: center;
    width: 60px;
    height: 100px;
    color: var(--main-color);
    transition: color 0.15s ease;
  }
  .sideNav:hover {
    color: var(--main-color-dark);
  }
  .sideNav--prev {
    left: 28px;
  }
  .sideNav--next {
    right: 28px;
  }
  .sideNav__icon {
    width: 52px;
    height: 52px;
  }
}

.detail__back {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 240px;
  height: 50px;
  margin-top: 16px;
  padding: 0 24px;
  color: #fff;
  font-size: 16px;
  font-weight: bold;
  text-decoration: none;
  background-color: var(--main-color);
  box-shadow: 4px 4px 0 0 var(--main-color-dark);
}
.detail__back:hover {
  box-shadow: 2px 2px 0 0 var(--main-color-dark);
}
</style>
