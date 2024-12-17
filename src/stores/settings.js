import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useSettingsStore = defineStore('settings', {
  state() {
    return {
      locale: navigator.language.toLowerCase(),
    }
  },
  persist: {
    enabled: true,
    strategies: [{ key: 'settings', storage: localStorage }],
  },
})
