import { createRouter, createWebHistory } from 'vue-router'
import ViewerView from '@/views/ViewerView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'Root', redirect: '/viewer' },
    { path: '/viewer', name: 'Viewer', component: ViewerView },
  ],
  scrollBehavior(to, from, savedPosition) {
    // 始终滚动到顶部
    return { top: 0 }
  },
})

export default router
