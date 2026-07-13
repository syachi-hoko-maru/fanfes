<script setup lang="ts">
/*
 * アクセス時、ソード・ワールド2.5への“好き”メッセージを載せたハートが
 * 画面下から上へゆっくり流れていくお祭り演出。
 * ・pointer-events:none で操作の邪魔をしない
 * ・prefers-reduced-motion 指定時は何も出さない
 * ・SSRでは空、マウント後（クライアント）にだけ生成するのでハイドレーション不一致なし
 */

// ハートの色（指定パレットからランダム）
const COLORS = [
  "#f4d2ae",
  "#d5c2da",
  "#f5d646",
  "#e096a7",
  "#cfdcc8",
  "#f5d8de",
  "#e8adb1",
];

// ハートに書かれるメッセージ
const MESSAGES = [
  "世界観が良い！",
  "ルルブが手に入りやすい。",
  "ファンタジー系の王道",
  "いろんな信仰のRPが楽しい！",
  "ルルブが安い",
  "マギシューファイターマルガ＝ハーリは浪漫",
  "魅力的な公式ＮＰＣが多い！",
  "ファンタジーが楽しい",
  "キャンペーンやりやすいね、いいね",
  "成長がとにかく楽しい！！",
  "キャラビルドと戦闘が面白い！",
  "神っていいですよね",
  "低Lv帯の『泥臭い』冒険が最高！",
  "どの種族もドドド魅力的すぎる！！タビット吸いたい…",
  "初期作成から買い物が楽しい！",
  "色んなキャラクターが作れる！",
  "冒険が楽しい！キャラクターが成長していくのが楽しい",
  "ナイトメア、ラルヴァ、アビスボーン好き！",
  "王道ファンタジーこそ至高と信じます！",
  "いろんな魔法が使えて最高！",
  "ファンタジーに飛び込める！",
  "フロウライト大好き…キラキラして儚げ。",
  "人によって大きく構築が分かれるのっていいですよね",
  "固定値盛り盛りで戦うのが気持ち良い！",
  "ファンタジー世界を堪能できる！",
  "種族が沢山あって色々なキャラ作れる！",
  "色々なビルドができるのが楽しい",
  "ラクシアに住みたい！",
  "世界観が素敵！",
  "公式からの供給が多い！ 次のサプリメントも楽しみ！",
  "魔動機文明時代の設定が好きすぎる〜〜〜",
  "最初に遊んだTRPGです！愛してる！",
  "2.0の頃から大好き〜！",
  "世界観重視でのキャラ作成が好き！",
  "ファンタジー最高！",
  "プレイヤー同士で相談して戦闘を考えるの楽しい！",
  "ルーンフォーク最高！",
  "ソレイユの脳筋が大好き！",
  "ナイトメアに厨二心をくすぐられた",
  "ルールブックIだけで無限に遊べる！",
  "魔物がいっぱいでシナリオ作るのも楽しい！",
  "ドラゴンかわいい！コボルドかわいい！ケモ",
  "剣と魔法の世界で自由にできるのが好き！",
  "メリア花の描写とても綺麗で好き!!!",
  "シナジーが美しい",
  "ファンタジーのワクワクを手軽に味わおう！",
  "蛮族、良いよね( ◜ᴗ◝)",
  "タビットもふもふもふもふもふコボルドもふもふ文字数",
  "魔法！魔法！魔法を使おう！！",
  "色々な種族が多くて、楽しい",
  "初期は人間フェンサーでピラー持つんだ。それが浪漫",
  "国産王道系ファンタジーTRPG。正義！",
  "フェアリーテイマーで攻撃、回復、妨害楽し過ぎる！",
  "ファンタジーな世界観大好き！GMもPLも楽しい！",
  "幸福も不条理も、ラクシアは全てを受け入れてくれる",
  "異種族や亜人を演じれる！",
  "無限のキャラクタービルド",
  "ファンタジーの世界で生きていける",
  "武器も魔法も、好きなものを詰め込める",
  "もっと広がれソドワ！！",
  "成長や技能が柔軟に変化するのがいい！",
  "バード最高です(必中呪歌は除く)",
];

interface Heart {
  id: number;
  message: string;
  color: string;
  style: Record<string, string>;
}

const hearts = ref<Heart[]>([]);

let seq = 0;
const cleanupTimers = new Set<ReturnType<typeof setTimeout>>();
// メッセージが偏らないよう、シャッフルした山から順に配る（尽きたら再シャッフル）
let bag: string[] = [];

const rand = (min: number, max: number) => min + Math.random() * (max - min);
const pick = <T,>(arr: readonly T[]): T =>
  arr[Math.floor(Math.random() * arr.length)]!;

function nextMessage(): string {
  if (bag.length === 0) {
    bag = [...MESSAGES].sort(() => Math.random() - 0.5);
  }
  return bag.pop()!;
}

function spawn() {
  const id = ++seq;
  const dur = rand(4, 8); // 上昇にかかる秒数（短いほど速い）
  hearts.value.push({
    id,
    message: nextMessage(),
    color: pick(COLORS),
    style: {
      left: `${rand(2, 84)}%`, // 開始水平位置
      "--dur": `${dur}s`,
      "--dx": `${rand(-55, 55)}px`, // 横方向へのゆらぎ
      "--scale": `${rand(0.8, 1.12)}`, // 大きさのばらつき
      "--rot0": `${rand(-10, 10)}deg`,
      "--rot1": `${rand(-14, 14)}deg`,
      "--maxop": `${rand(0.85, 1)}`,
    },
  });
  // アニメーション終了後に取り除く
  const t = setTimeout(
    () => {
      hearts.value = hearts.value.filter((h) => h.id !== id);
      cleanupTimers.delete(t);
    },
    dur * 1000 + 300,
  );
  cleanupTimers.add(t);
}

onMounted(() => {
  const reduce =
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
  if (reduce) return;
  /*
   * アクセス直後の2秒間に、ランダムなタイミング・場所でハートを出して終了（以降は出さない）。
   * 個数は画面幅に応じて可変：最低5個＋幅250pxごとに+1（例 375px→6, 1000px→9, 1500px→11）。
   * このコンポーネントは app.vue 直下にあり <NuxtPage> の外側なので、SPA内の画面遷移では
   * 再マウントされない＝発火しない。onMounted はフルロード（初回アクセス・画面更新）でのみ
   * 実行されるため、「更新時は出す・遷移では出さない」を満たす。
   */
  const count = 5 + Math.floor(window.innerWidth / 250);
  for (let i = 0; i < count; i++) {
    const t = setTimeout(spawn, Math.random() * 2000);
    cleanupTimers.add(t);
  }
});

onBeforeUnmount(() => {
  cleanupTimers.forEach((t) => clearTimeout(t));
  cleanupTimers.clear();
});
</script>

<template>
  <div class="hearts" aria-hidden="true">
    <div v-for="h in hearts" :key="h.id" class="heart" :style="h.style">
      <svg class="heart__shape" viewBox="0 0 32 29.6">
        <path
          d="M23.6,0c-3.4,0-6.3,2.7-7.6,5.6C14.7,2.7,11.8,0,8.4,0C3.8,0,0,3.8,0,8.4
             c0,9.4,9.5,11.9,16,21.2c6.1-9.3,16-11.8,16-21.2C32,3.8,28.2,0,23.6,0z"
          :fill="h.color"
        />
      </svg>
      <span class="heart__text">{{ h.message }}</span>
    </div>
  </div>
</template>

<style scoped>
.hearts {
  position: fixed;
  inset: 0;
  /* ヘッダー(100)・モーダル(1000)より下。コンテンツより前面に重ねる */
  z-index: 90;
  overflow: hidden;
  pointer-events: none;
}

.heart {
  position: absolute;
  top: 100%; /* 画面下の外側から出発 */
  width: 190px;
  height: 176px; /* viewBox 32:29.6 のアスペクトに合わせる */
  animation: heartFloat var(--dur) linear forwards;
  will-change: transform, opacity;
}

.heart__shape {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  filter: drop-shadow(0 3px 4px rgba(0, 0, 0, 0.12));
}

.heart__text {
  position: absolute;
  /* ハートの“ふくらみ”の中に文字を収める */
  left: 14%;
  right: 14%;
  top: 24%;
  height: 48%;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: #4a3b30;
  font-size: 12.5px;
  font-weight: 700;
  line-height: 1.35;
  overflow: hidden;
  word-break: break-word;
}

@media screen and (max-width: 500px) {
  .heart {
    width: 150px;
    height: 139px;
  }
  .heart__text {
    font-size: 11px;
  }
}

@keyframes heartFloat {
  0% {
    transform: translate3d(0, 0, 0) scale(var(--scale)) rotate(var(--rot0));
    opacity: 0;
  }
  10% {
    opacity: var(--maxop);
  }
  80% {
    opacity: var(--maxop);
  }
  100% {
    transform: translate3d(var(--dx), calc(-100vh - 260px), 0)
      scale(var(--scale)) rotate(var(--rot1));
    opacity: 0;
  }
}

/* 端末側で「視差効果を減らす」設定なら演出を止める */
@media (prefers-reduced-motion: reduce) {
  .hearts {
    display: none;
  }
}
</style>
