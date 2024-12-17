<script setup>
import { RouterLink, RouterView, useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

router.afterEach((to, from) => {
  const toDepth = to.path.split('/').length
  const fromDepth = from.path.split('/').length
  if (toDepth == fromDepth) {
    to.meta.transition = 'fade'
    return
  }
  to.meta.transition = toDepth < fromDepth ? 'slide-right' : 'slide-left'
})
</script>

<template>
  <nav v-motion-slide-top></nav>

  <RouterView v-slot="{ Component }">
    <Transition :name="route.meta.transition">
      <component :is="Component" :key="route.path"></component>
    </Transition>
  </RouterView>
</template>

<style lang="less" scoped>
nav {
  height: 2em;
}

.slide-left-enter-active,
.slide-left-leave-active {
  transition:
    transform 0.5s ease,
    opacity 0.5s ease;
}
.slide-left-enter-from {
  transform: translateX(100%);
  opacity: 0;
}
.slide-left-enter-to {
  transform: translateX(0);
  opacity: 1;
}
.slide-left-leave-from {
  transform: translateX(0);
  opacity: 1;
}
.slide-left-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}

.slide-right-enter-active,
.slide-right-leave-active {
  transition:
    transform 0.5s ease,
    opacity 0.5s ease;
}
.slide-right-enter-from {
  transform: translateX(-100%);
  opacity: 0;
}
.slide-right-enter-to {
  transform: translateX(0);
  opacity: 1;
}
.slide-right-leave-from {
  transform: translateX(0);
  opacity: 1;
}
.slide-right-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.fade-enter-to,
.fade-leave-from {
  opacity: 1;
}
</style>
