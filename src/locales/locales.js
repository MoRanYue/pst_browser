import { createI18n } from 'vue-i18n'
import enUs from './enUs.js'
import zhCn from './zhCn.js'

export default createI18n({
  locale: 'en-us',
  fallbackLocale: 'en-us',
  messages: {
    'en-us': enUs,
    'zh-cn': zhCn,
  },
})
