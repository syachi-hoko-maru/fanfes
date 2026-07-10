<script setup lang="ts">
// 各ページ下部の共通フッター。上から「開催概要 → “ソドワ好き”募集 → 諸注意」の順で並べる。
// フォームで集まった声はサイトを流れるハート（FloatingHearts）に反映されるかも、という導線。
const FORM_URL = "https://forms.gle/wkS9Lc73ZpaKgGgs8";
</script>

<template>
  <footer class="siteFooter">
    <!-- 1. 開催概要 -->
    <section class="about about--top">
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
          <dt>協賛</dt>
          <dd>
            <!-- サークル名（左）と協賛者名（右）を2カラムで揃える。複数名は右で縦積み -->
            <div class="sponsors">
              <span class="sponsors__circle">巡涯学派</span>
              <span class="sponsors__people">トーラ<br />屋台</span>
              <span class="sponsors__circle">雪花露店</span>
              <span class="sponsors__people">桜楼</span>
              <span class="sponsors__circle">BANG-G</span>
              <span class="sponsors__people">BANG-G</span>
              <span class="sponsors__circle">ナナイロダイス</span>
              <span class="sponsors__people">Ana</span>
              <span class="sponsors__circle">幻想書斎</span>
              <span class="sponsors__people">DKP</span>
              <span class="sponsors__circle">Thyme</span>
              <span class="sponsors__people">ironashi<br />rosai</span>
              <span class="sponsors__circle">studio SISTER</span>
              <span class="sponsors__people">Jorge</span>
              <span class="sponsors__circle">流浪の民</span>
              <span class="sponsors__people">銀色のかぼちゃ</span>
            </div>
            <p class="sponsors__note">（敬称略）</p>
          </dd>
        </dl>
      </div>
    </section>

    <!-- 2. あなたの“ソドワ好き”を募集 -->
    <section class="cta">
      <div class="cta__inner">
        <svg class="cta__heart" viewBox="0 0 32 29.6" aria-hidden="true">
          <path
            d="M23.6,0c-3.4,0-6.3,2.7-7.6,5.6C14.7,2.7,11.8,0,8.4,0C3.8,0,0,3.8,0,8.4
               c0,9.4,9.5,11.9,16,21.2c6.1-9.3,16-11.8,16-21.2C32,3.8,28.2,0,23.6,0z"
            fill="#fff"
          />
        </svg>
        <p class="cta__title">
          あなたの<wbr />「ソドワ好き」を<wbr />教えてください
        </p>
        <p class="cta__lead">このサイトのハートに現れるかも？</p>
        <a
          class="cta__button"
          :href="FORM_URL"
          target="_blank"
          rel="noopener noreferrer"
        >
          「ソドワ好き」を送る
          <UiIconExternal />
        </a>
      </div>
    </section>

    <!-- 3. 諸注意 -->
    <section class="notes">
      <div class="notes__inner">
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
        <p class="about__note">
          本イベントで頒布される二次創作物は、<wbr />
          各サークルが<wbr />頒布しております。<br />
          内容や制作過程について、本イベント主催のしゃちほこ丸/しゃちほこの尾びれ亭は一切関与しておらず、校閲等もしておりません。
        </p>
      </div>
    </section>
  </footer>
</template>

<style scoped>
/* ===== 共通（開催概要・諸注意の枠） ===== */
.about,
.notes {
  padding: 40px 30px 56px;
  background-color: var(--main-color-light);
  border-top: 3px solid var(--main-color-dark);
}
/* 開催概要はページ本文との間に少し余白を取る */
.about--top {
  margin-top: 60px;
}
.notes {
  padding: 32px 30px 44px;
}
@media screen and (max-width: 500px) {
  .about,
  .notes {
    padding: 30px 20px 40px;
  }
  .about--top {
    margin-top: 40px;
  }
}

.about__inner,
.notes__inner {
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
    /* nowrap にすると長い値（Discord行・主催名）が画面外へはみ出すため折り返す。
       overflow-wrap は英単語がカラム幅を超えたときだけ折る保険（通常は単語ごと折り返し） */
    width: calc(100% - 100px);
    overflow-wrap: break-word;
  }
}

/* 協賛一覧: サークル名（左）と協賛者名（右）を2カラムで揃える */
.sponsors {
  display: grid;
  /* 左列は最長のサークル名にそろえ、右列（協賛者）の開始位置を一定にする */
  grid-template-columns: max-content 1fr;
  align-items: start;
  column-gap: 24px;
  row-gap: 8px;
  margin-top: 4px;
  line-height: 1.2;
}
.sponsors__people {
  overflow-wrap: anywhere;
}
/* 「敬称略」は控えめな注記として右下に表示 */
.sponsors__note {
  margin: 10px 0 0;
  color: #666;
  font-size: 13px;
  text-align: right;
}

/* ===== 諸注意 ===== */
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
  /* break-all だと「Discord」等の英単語が途中で割れるため、はみ出す時だけ折る */
  overflow-wrap: anywhere;
}
.about__link:hover {
  opacity: 0.8;
}
/* リンク文言末尾の外部リンクアイコンを文字に揃える */
.about__link :deep(svg) {
  vertical-align: -0.15em;
  margin-left: 2px;
}

/* ===== “ソドワ好き”募集 CTA ===== */
.cta {
  padding: 44px 24px 56px;
  color: #fff;
  text-align: center;
  background-color: var(--main-color);
  border-top: 3px solid var(--main-color-dark);
}
@media screen and (max-width: 500px) {
  .cta {
    padding: 36px 20px 44px;
  }
}
.cta__inner {
  max-width: 640px;
  margin: 0 auto;
}
.cta__heart {
  width: 34px;
  height: 32px;
  margin-bottom: 10px;
  filter: drop-shadow(0 2px 2px rgba(0, 0, 0, 0.15));
}
.cta__title {
  margin: 0 0 8px;
  font-size: 20px;
  font-weight: bold;
  line-height: 1.6;
}
@media screen and (max-width: 500px) {
  .cta__title {
    font-size: 18px;
  }
}
.cta__lead {
  margin: 0 0 24px;
  font-size: 14px;
  line-height: 1.7;
  opacity: 0.95;
}
.cta__button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  box-sizing: border-box;
  min-width: 260px;
  max-width: 100%;
  height: 54px;
  padding: 0 28px;
  color: var(--main-color-dark);
  font-size: 16px;
  font-weight: bold;
  text-decoration: none;
  background-color: #fff;
  box-shadow: 4px 4px 0 0 var(--main-color-dark);
}
.cta__button:hover {
  box-shadow: 2px 2px 0 0 var(--main-color-dark);
}
.cta__button :deep(svg) {
  vertical-align: -0.1em;
}
</style>
