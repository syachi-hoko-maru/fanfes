// https://nuxt.com/docs/api/configuration/nuxt-config
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
