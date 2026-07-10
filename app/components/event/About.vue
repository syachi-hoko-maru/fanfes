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
        <p class="about__note">
          本イベントで頒布される二次創作物は、<wbr />
          各サークルが<wbr />頒布しております。<br />
          内容や制作過程について、本イベント主催のしゃちほこ丸/しゃちほこの尾びれ亭は一切関与しておらず、校閲等もしておりません。
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
</style>
