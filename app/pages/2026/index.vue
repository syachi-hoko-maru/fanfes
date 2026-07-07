<script setup lang="ts">
// /2026/ は当面サークル一覧（/2026/circle）へ遷移する
await navigateTo('/2026/circle', { redirectCode: 302 })
</script>

<template>
  <p>
    <a href="/2026/circle">/2026/circle へ移動します</a>
  </p>
</template>
