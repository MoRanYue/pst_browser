<script setup>
import { useSettingsStore } from '@/stores/settings'
import { useI18n } from 'vue-i18n'
import { watch } from 'vue'

const settings = useSettingsStore()
const i18n = useI18n()

watch(settings, (settings) => {
  if (i18n.availableLocales.includes(settings.locale)) {
    i18n.locale.value = settings.locale
  }
})
</script>

<template>
  <div class="language-selector">
    <select v-model="settings.locale">
      <option v-for="locale in $i18n.availableLocales" :key="locale" :value="locale">
        {{ $t(`language.${locale}`) }}
      </option>
    </select>
  </div>
</template>

<style lang="less" scoped>
@import '@/assets/vars.less';

select {
  background-color: @primary-1;
  padding: 0.2em;
  border-radius: 20px;
}
</style>
