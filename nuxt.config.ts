// https://nuxt.com/docs/api/configuration/nuxt-config
import { FESTIVAL_START, FESTIVAL_END } from './app/utils/festival'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  // サイト全体で使うテーマカラー等のグローバルCSS
  css: ['~/assets/css/variables.css'],

  // 独自ドメイン fanfes.syachi.work のルートで配信するため baseURL は "/"
  app: {
    head: {
      title: 'ソドワファンフェス',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'theme-color', content: '#ea903a' },
      ],
      link: [
        // 高解像度向けPNGを優先し、旧ブラウザ向けに .ico をフォールバック
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32.png' },
        { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16.png' },
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
      ],
      script: [
        {
          // 花火の期間中(JST 7/20 17:00〜7/21 6:00)は初回描画から夜モードにして
          // ライト→ダークのちらつきを防ぐ。期間の値は app/utils/festival.ts と連動。
          // 期間をまたいだ切り替えは plugins/festivalTheme.client.ts が担当する。
          innerHTML:
            `(function(){try{var n=Date.now();if(n>=${FESTIVAL_START}&&n<${FESTIVAL_END}){document.documentElement.classList.add('festival-dark');}}catch(e){}})();`,
          tagPosition: 'head',
        },
      ],
    },
  },

  // GitHub Pages 向け静的生成（.nojekyll を自動出力）
  nitro: {
    preset: 'github_pages',
    prerender: {
      crawlLinks: true,
      // サークル詳細ボタンは現在 disabled でクローラーが辿れないため、
      // /2026/circle/1〜24 の詳細ページは明示的にプリレンダー対象へ加える
      routes: [
        '/',
        '/2026/',
        '/2026/circle',
        '/2026/discord',
        ...Array.from({ length: 24 }, (_, i) => `/2026/circle/${i + 1}`),
      ],
    },
  },
})
