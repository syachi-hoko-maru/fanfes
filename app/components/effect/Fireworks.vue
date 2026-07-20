<script setup lang="ts">
/*
 * 全ページの空でお祭りの花火が打ち上がり続ける演出。
 * ・canvas のパーティクルで「打ち上げ→爆発→火の粉が飛び散る」を表現
 * ・pointer-events:none で操作の邪魔をしない
 * ・prefers-reduced-motion 指定時は何も出さない
 * ・SSRでは空、マウント後（クライアント）にだけ描画するのでハイドレーション不一致なし
 * ・app.vue 直下（<NuxtPage> の外）にあるため、一度マウントされると SPA 遷移でも
 *   再マウントされず、ループが鳴り続ける＝「全ページで常時」を満たす
 * ・背景が薄いクリーム色(#fcefe0)なので加算合成は使わず、彩度の高い色＋同色グローで
 *   薄背景でもはっきり見えるようにしている
 * ・日本時間 2026-07-20 17:00 〜 2026-07-21 06:00 の期間だけ表示する
 */

const canvas = ref<HTMLCanvasElement | null>(null);

interface Rocket {
  x: number;
  y: number;
  vy: number;
  targetY: number;
  color: string;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  life: number;
  maxLife: number;
  size: number;
}

// クリーム背景(#fcefe0)で映える彩度の高い色
const FIREWORK_COLORS = [
  "#e6394a", // 赤
  "#f25c05", // 橙
  "#f0a500", // 金
  "#12b886", // 緑
  "#2e86ff", // 青
  "#7b2ff7", // 紫
  "#e83e8c", // 桃
];

const GRAVITY = 0.045;
const FRICTION = 0.985;
const PARTICLES_MIN = 40;
const PARTICLES_MAX = 70;
const LAUNCH_MIN = 700; // 打ち上げ間隔(ms)
const LAUNCH_MAX = 1600;
const MAX_PARTICLES = 600; // 同時パーティクル上限（超えたら新規打ち上げを間引く）

// 花火を表示する期間（日本時間 JST=UTC+9 の固定時刻。閲覧者のタイムゾーンに依らず同じ実時刻で判定）
// 2026-07-20 17:00 JST 〜 2026-07-21 06:00 JST
const SHOW_START = Date.UTC(2026, 6, 20, 8, 0, 0); // 2026-07-20 17:00 JST
const SHOW_END = Date.UTC(2026, 6, 20, 21, 0, 0); // 2026-07-21 06:00 JST
const MAX_TIMEOUT = 2_147_483_647; // setTimeout の上限(ms)。これを超える遅延は張らない

const rand = (min: number, max: number) => min + Math.random() * (max - min);
const pick = <T,>(arr: readonly T[]): T =>
  arr[Math.floor(Math.random() * arr.length)]!;

onMounted(() => {
  const reduce =
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
  if (reduce) return;

  const el = canvas.value;
  const ctx = el?.getContext("2d");
  if (!el || !ctx) return;

  // 期間が完全に終わっていれば何もしない（お祭り後は常にこのケース）
  if (Date.now() >= SHOW_END) return;

  let width = 0;
  let height = 0;

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    el!.width = Math.floor(width * dpr);
    el!.height = Math.floor(height * dpr);
    el!.style.width = `${width}px`;
    el!.style.height = `${height}px`;
    ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  resize();
  window.addEventListener("resize", resize);

  const rockets: Rocket[] = [];
  const particles: Particle[] = [];

  function launch() {
    // 画面下から、上部 15〜55% あたりの高さを目指して打ち上げる
    const targetY = rand(height * 0.15, height * 0.55);
    rockets.push({
      x: rand(width * 0.12, width * 0.88),
      y: height + 10,
      vy: -(rand(9, 12)),
      targetY,
      color: pick(FIREWORK_COLORS),
    });
  }

  function explode(x: number, y: number, color: string) {
    const count = Math.floor(rand(PARTICLES_MIN, PARTICLES_MAX));
    const baseSpeed = rand(2.5, 4.5);
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + rand(-0.1, 0.1);
      const speed = baseSpeed * rand(0.4, 1);
      const life = rand(55, 90);
      particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color,
        life,
        maxLife: life,
        size: rand(1.6, 2.8),
      });
    }
  }

  let rafId = 0;
  let running = false;
  let launchTimer: ReturnType<typeof setTimeout> | undefined;
  let windowTimer: ReturnType<typeof setTimeout> | undefined;

  function scheduleLaunch() {
    launchTimer = setTimeout(
      () => {
        if (particles.length < MAX_PARTICLES) launch();
        scheduleLaunch();
      },
      rand(LAUNCH_MIN, LAUNCH_MAX),
    );
  }

  function frame() {
    ctx!.clearRect(0, 0, width, height);

    // ロケット更新・描画
    for (let i = rockets.length - 1; i >= 0; i--) {
      const r = rockets[i]!;
      r.y += r.vy;
      r.vy += GRAVITY * 1.2; // 徐々に減速
      const reached = r.y <= r.targetY || r.vy >= 0;
      // 上昇中の光の筋
      ctx!.save();
      ctx!.globalAlpha = 0.9;
      ctx!.shadowColor = r.color;
      ctx!.shadowBlur = 8;
      ctx!.fillStyle = r.color;
      ctx!.beginPath();
      ctx!.arc(r.x, r.y, 2.2, 0, Math.PI * 2);
      ctx!.fill();
      ctx!.restore();
      if (reached) {
        explode(r.x, r.y, r.color);
        rockets.splice(i, 1);
      }
    }

    // パーティクル更新・描画
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i]!;
      p.vx *= FRICTION;
      p.vy *= FRICTION;
      p.vy += GRAVITY;
      p.x += p.vx;
      p.y += p.vy;
      p.life -= 1;
      if (p.life <= 0) {
        particles.splice(i, 1);
        continue;
      }
      const alpha = Math.max(0, p.life / p.maxLife);
      ctx!.save();
      ctx!.globalAlpha = alpha;
      ctx!.shadowColor = p.color;
      ctx!.shadowBlur = 10;
      ctx!.fillStyle = p.color;
      ctx!.beginPath();
      ctx!.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx!.fill();
      ctx!.restore();
    }

    rafId = requestAnimationFrame(frame);
  }

  const inWindow = () => {
    const now = Date.now();
    return now >= SHOW_START && now < SHOW_END;
  };

  function start() {
    if (running) return;
    if (!inWindow()) return; // 期間外は動かさない
    running = true;
    rafId = requestAnimationFrame(frame);
    scheduleLaunch();
  }

  function stop() {
    running = false;
    cancelAnimationFrame(rafId);
    if (launchTimer) clearTimeout(launchTimer);
    launchTimer = undefined;
  }

  function onVisibilityChange() {
    // タブ非表示時はループを止めてバッテリーを節約、復帰で再開
    if (document.hidden) stop();
    else start();
  }
  function endShow() {
    stop();
    ctx!.clearRect(0, 0, width, height); // 期間終了時、残った火の粉を消す
  }

  function scheduleEnd() {
    const delay = SHOW_END - Date.now();
    if (delay > 0 && delay <= MAX_TIMEOUT) {
      windowTimer = setTimeout(endShow, delay);
    }
  }

  // 現在時刻に応じて「すぐ開始／開始時刻に自動開始／何もしない」を決める
  function planWindow() {
    const now = Date.now();
    if (now >= SHOW_END) return; // 終了後（ここには来ない想定だが念のため）
    if (now < SHOW_START) {
      // 期間前：ページを開いたまま開始時刻を跨いだら自動で始める
      const delay = SHOW_START - now;
      if (delay <= MAX_TIMEOUT) {
        windowTimer = setTimeout(() => {
          start();
          scheduleEnd();
        }, delay);
      }
      return;
    }
    // 期間中：すぐ始めて、終了時刻に止める
    start();
    scheduleEnd();
  }

  document.addEventListener("visibilitychange", onVisibilityChange);

  planWindow();

  onBeforeUnmount(() => {
    stop();
    if (windowTimer) clearTimeout(windowTimer);
    window.removeEventListener("resize", resize);
    document.removeEventListener("visibilitychange", onVisibilityChange);
  });
});
</script>

<template>
  <canvas ref="canvas" class="fireworks" aria-hidden="true"></canvas>
</template>

<style scoped>
.fireworks {
  position: fixed;
  inset: 0;
  /* ハート(90)の背後・ヘッダー(100)/モーダル(1000)より下・コンテンツより前面 */
  z-index: 89;
  pointer-events: none;
}

/* 端末側で「視差効果を減らす」設定なら演出を止める */
@media (prefers-reduced-motion: reduce) {
  .fireworks {
    display: none;
  }
}
</style>
