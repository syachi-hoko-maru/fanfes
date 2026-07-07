<script setup lang="ts">
const props = defineProps<{
  /** 遷移先URL */
  href?: string;
  /** 無効化（遷移させず、押せない見た目にする） */
  disabled?: boolean;
}>();

/** http(s) で始まる外部リンクか */
const isExternal = computed(() => /^https?:\/\//.test(props.href ?? ""));
/** 内部リンク（外部でない、空でないパス）か */
const isInternal = computed(() => !!props.href && !isExternal.value);
</script>

<template>
  <div class="buttonWrapper">
    <!-- 外部リンク：別タブで開き、外部リンクアイコンを表示する -->
    <a
      v-if="isExternal && !disabled"
      :href="href"
      target="_blank"
      rel="noopener noreferrer"
    >
      <button class="button" type="button"><slot /><UiIconExternal /></button>
    </a>

    <!-- 内部リンク：NuxtLink で遷移（アイコンは付けない） -->
    <NuxtLink v-else-if="isInternal && !disabled" :to="href">
      <button class="button" type="button"><slot /></button>
    </NuxtLink>

    <!-- 無効化 / リンク未設定：遷移しないボタン（アイコンは付けない） -->
    <button v-else class="button" type="button" :disabled="disabled">
      <slot />
    </button>
  </div>
</template>

<style scoped>
.buttonWrapper {
  display: flex;
  justify-content: center;
}
a,
:deep(a) {
  width: 100%;
  text-decoration: none;
}
.button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  width: calc(100% - 20px - 3px);
  height: 45px;
  background-color: var(--main-color);
  color: #fff;
  font-size: 16px;
  font-weight: bold;
  padding: 5px 10px;
  border: 0;
  box-shadow: 3px 3px 0 0 var(--main-color-dark);
  margin: 5px 10px 20px 10px;
  cursor: pointer;
}
.button:not(:disabled):hover {
  width: calc(100% - 20px - 1px);
  height: 47px;
  box-shadow: 1px 1px 0 0 var(--main-color-dark);
  margin: 5px 10px 18px 10px;
}
.button:disabled {
  background-color: #c2c2c2;
  box-shadow: 3px 3px 0 0 #9a9a9a;
  cursor: not-allowed;
}
</style>
