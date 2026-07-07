<template>
  <section class="about">
    <div class="about__inner">
      <h2 class="about__title">開催概要</h2>
      <dl class="about__list">
        <dt>イベント名</dt>
        <dd>ソドワファンフェス</dd>
        <dt>開催場所</dt>
        <dd>
          オンライン<wbr />（本ウェブサイト・
          <a href="/2026/discord" class="about__link"> Discord </a>）
        </dd>
        <dt>開催期間</dt>
        <dd>2026年7月11日（土）<wbr />〜 20日（月・祝）</dd>
        <dt>参加サークル</dt>
        <dd><a href="/2026/circle" class="about__link">24サークル</a></dd>
        <dt>主催</dt>
        <dd>
          しゃちほこ丸 / <wbr />しゃちほこの尾びれ亭<br />
          <a
            href="https://trpg.syachi.work/me/contact/"
            class="about__link"
            target="_blank"
            rel="noopener noreferrer"
          >
            問い合わせ先はこちら
            <UiIconExternal />
          </a>
        </dd>
      </dl>

      <div class="about__notes">
        <p class="about__note">
          本イベント「ソドワファンフェス」は、<wbr />
          『ソード・ワールド2.5』を愛するファン有志が<wbr />
          自主的に開催する非公式のイベントです。<br />
          『ソード・ワールド2.5』の出版元である<wbr />株式会社KADOKAWA、<wbr />
          および著作者であるグループSNEは、<wbr />
          本イベントの企画・運営等に一切関わっていません。
        </p>
        <p class="about__note">
          本イベントで頒布される二次創作物は、<wbr /> 各サークルが<wbr />
          <a
            class="about__link"
            href="https://www.arclight.co.jp/trpg-rights/"
            target="_blank"
            rel="noopener noreferrer"
          >
            「テーブルトークRPGに関する二次創作活動のガイドライン」
            <UiIconExternal />
          </a>
          を確認のうえ、制作・頒布しています。
        </p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.about {
  margin-top: 60px;
  padding: 40px 30px 56px;
  background-color: var(--main-color-light);
  border-top: 3px solid var(--main-color-dark);
}
@media screen and (max-width: 500px) {
  .about {
    margin-top: 40px;
    padding: 30px 20px 40px;
  }
}

.about__inner {
  max-width: 760px;
  margin: 0 auto;
  color: #333;
  font-size: 16px;
  line-height: 20px;
}

.about__title {
  display: inline-block;
  margin: 0 0 20px;
  padding: 5px 18px;
  color: #fff;
  font-size: 18px;
  font-weight: bold;
  background-color: var(--main-color);
  box-shadow: 3px 3px 0 0 var(--main-color-dark);
}

.about__list {
  display: flex;
  flex-wrap: wrap;
  margin: 0;
}
.about__list dt {
  width: 30%;
  padding: 6px 0;
  font-weight: bold;
  border-bottom: 1px dashed var(--main-color-dark);
}
.about__list dd {
  width: 70%;
  margin: 0;
  padding: 6px 0;
  border-bottom: 1px dashed var(--main-color-dark);
}
@media screen and (max-width: 500px) {
  .about__list dt {
    width: 100px;
  }
  .about__list dd {
    width: calc(100% - 100px);
    white-space: nowrap;
  }
}

.about__notes {
  margin-top: 28px;
}
.about__note {
  margin: 0 0 14px;
  color: #555;
  font-size: 14px;
  line-height: 1.9;
}
.about__note:last-child {
  margin-bottom: 0;
}
.about__link {
  color: var(--main-color-dark);
  font-weight: bold;
  text-decoration: underline;
  word-break: break-all;
}
.about__link:hover {
  opacity: 0.8;
}
/* リンク文言末尾の外部リンクアイコンを文字に揃える */
.about__link :deep(svg) {
  vertical-align: -0.15em;
  margin-left: 2px;
}
</style>
