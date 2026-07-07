<script setup lang="ts">
defineProps<{
  src: string;
  alt: string;
  pam?: boolean;
}>();
</script>

<template>
  <div class="imgWrapper">
    <img
      class="circleCut"
      :src="src"
      :alt="alt"
      width="100%"
      :class="pam ? 'pam' : ''"
    />
  </div>
</template>

<style scoped>
.imgWrapper {
  margin: 10px;
  width: calc(100% - 20px);
}
.circleCut {
  width: calc(100% - 3px);
  aspect-ratio: 1799 / 1086;
  box-shadow: 3px 3px 0 0 var(--main-color-dark);
}
.circleCut.pam {
  box-shadow: 3px 3px 0 0 #f0f0f0;
}
</style>
