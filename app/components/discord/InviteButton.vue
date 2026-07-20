<script setup lang="ts">
/*
 * Discord 招待リンクの露出対策。
 *
 * 招待URLを HTML に直書きすると、クローラーやbotに拾われて荒らし（レイド）を
 * 招きかねない。そのため:
 *   - URLは base64 で難読化して保持し、静的HTMLには平文で出さない
 *   - 「参加」ボタン → 注意事項モーダル → 確認チェック → 「開く」ボタン、という
 *     人間の操作を挟んだ最後の一手でだけ URL を復元する
 *   - 復元した URL は window.open で直接開き、原則 DOM には残さない
 * ことで、単純にHTMLを取得するだけのbotにはURLが渡らないようにしている。
 *
 * ※ 差し替え方法: ブラウザのコンソール等で
 *      btoa('https://discord.gg/あなたの招待コード')
 *    を実行し、得られた文字列を下の ENCODED_INVITE に貼り付ける。
 */
const ENCODED_INVITE = "aHR0cHM6Ly9kaXNjb3JkLmdnL25YRWNLdXRIRA==";

const showModal = ref(false);
const confirmed = ref(false);
// ポップアップがブロックされた場合のフォールバック用（クリック後のみ値が入る）
const fallbackUrl = ref("");

const openModal = () => {
  showModal.value = true;
};
const closeModal = () => {
  showModal.value = false;
  confirmed.value = false;
  fallbackUrl.value = "";
};

const openServer = () => {
  if (!confirmed.value) return;
  // ユーザー操作の瞬間にだけ復元する（静的HTMLには平文URLを残さない）
  const url = atob(ENCODED_INVITE);
  const win = window.open(url, "_blank", "noopener,noreferrer");
  if (win) {
    closeModal();
  } else {
    // ポップアップブロック時はリンクを表示してユーザー自身に開いてもらう
    fallbackUrl.value = url;
  }
};

// Escapeキーで閉じる／モーダル表示中は背面のスクロールを止める
const onKeydown = (e: KeyboardEvent) => {
  if (e.key === "Escape") closeModal();
};
watch(showModal, (open) => {
  if (import.meta.client) {
    document.body.style.overflow = open ? "hidden" : "";
  }
});
onMounted(() => window.addEventListener("keydown", onKeydown));
onBeforeUnmount(() => {
  window.removeEventListener("keydown", onKeydown);
  if (import.meta.client) document.body.style.overflow = "";
});
</script>

<template>
  <div class="invite">
    <button class="invite__button" type="button" @click="openModal">
      Discordに参加する
    </button>
    <p class="invite__note">ボタンを押すと注意事項が表示されます。</p>

    <Teleport to="body">
      <Transition name="fade">
        <div v-if="showModal" class="modal" @click.self="closeModal">
          <div
            class="modal__panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby="discord-modal-title"
          >
            <button
              class="modal__close"
              type="button"
              aria-label="閉じる"
              @click="closeModal"
            >
              ×
            </button>

            <h2 id="discord-modal-title" class="modal__heading">注意事項</h2>
            <DiscordCautions />

            <label class="modal__check">
              <input v-model="confirmed" type="checkbox" />
              <span>注意事項を確認しました</span>
            </label>

            <button
              class="modal__open"
              type="button"
              :disabled="!confirmed"
              @click="openServer"
            >
              Discordサーバーを開く
              <UiIconExternal />
            </button>

            <p v-if="fallbackUrl" class="modal__fallback">
              自動で開かない場合は<wbr />
              <a :href="fallbackUrl" target="_blank" rel="noopener noreferrer">
                こちらのリンク
                <UiIconExternal />
              </a>
              から参加してください。
            </p>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.invite {
  text-align: center;
}
.invite__button {
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  /* サークル一覧・Booth頒布所ボタンと同じ幅(300px)に揃える */
  width: 100%;
  max-width: 300px;
  height: 52px;
  padding: 0 16px;
  color: var(--font-discord-color);
  font-size: 17px;
  font-weight: bold;
  text-decoration: none;
  background-color: var(--discord-color);
  border: 0;
  box-shadow: 4px 4px 0 0 var(--discord-color-dark);
  cursor: pointer;
}
.invite__button:hover {
  box-shadow: 2px 2px 0 0 var(--discord-color-dark);
}
.invite__note {
  margin: 12px 0 0;
  color: var(--font-main-color-superlight);
  font-size: 13px;
}

/* ===== モーダル ===== */
.modal {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background-color: rgba(0, 0, 0, 0.55);
}
.modal__panel {
  position: relative;
  width: 100%;
  max-width: 480px;
  max-height: calc(100vh - 40px);
  overflow-y: auto;
  padding: 28px 26px 30px;
  text-align: left;
  color: var(--font-main-color-superlight);
  background-color: var(--main-color-superlight);
  box-shadow: 6px 6px 0 0 var(--discord-color-dark);
}
.modal__close {
  position: absolute;
  top: 6px;
  right: 12px;
  width: 32px;
  height: 32px;
  color: var(--font-main-color-superlight);
  font-size: 26px;
  line-height: 1;
  background: none;
  border: 0;
  cursor: pointer;
}
.modal__close:hover {
  color: var(--font-main-color-light);
}
.modal__heading {
  display: inline-block;
  margin: 0 0 16px;
  padding: 5px 18px;
  color: var(--font-discord-color);
  font-size: 18px;
  font-weight: bold;
  background-color: var(--discord-color);
  box-shadow: 3px 3px 0 0 var(--discord-color-dark);
}
.modal__check {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 22px 0;
  padding: 12px 14px;
  color: var(--font-main-color-light);
  font-size: 15px;
  font-weight: bold;
  background-color: var(--main-color-light);
  cursor: pointer;
  user-select: none;
}
.modal__check input {
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: var(--discord-color);
}
.modal__open {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  width: 100%;
  height: 52px;
  color: var(--font-discord-color);
  font-size: 16px;
  font-weight: bold;
  background-color: var(--discord-color);
  border: 0;
  box-shadow: 4px 4px 0 0 var(--discord-color-dark);
  cursor: pointer;
}
.modal__open:hover:not(:disabled) {
  box-shadow: 2px 2px 0 0 var(--discord-color-dark);
}
.modal__open:disabled {
  background-color: #c2c2c2;
  box-shadow: 4px 4px 0 0 #9a9a9a;
  cursor: not-allowed;
}
.modal__fallback {
  margin: 16px 0 0;
  color: var(--font-main-color-superlight);
  font-size: 13px;
  line-height: 1.7;
}
.modal__fallback a {
  color: var(--discord-color-dark);
  font-weight: bold;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.18s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
