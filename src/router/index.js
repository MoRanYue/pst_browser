import { createRouter, createWebHistory } from 'vue-router'
import ViewerView from '@/views/ViewerView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'Root', component: ViewerView },
    { path: '/:pathMatch(.*)*', name: 'NotFound', redirect: '/' },
  ],
  scrollBehavior(to, from, savedPosition) {
    // 始终滚动到顶部
    return { top: 0 }
  },
})

export default router
