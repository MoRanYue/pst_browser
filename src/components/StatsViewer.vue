<script setup>
import CounterSection from './CounterSection.vue'
import Counter from './Counter.vue'
import { computed, defineProps } from 'vue'

const props = defineProps({
  content: [Object, Array],
  ignore: { type: Array, required: false },
})

const content = computed(() => {
  if (Array.isArray(props.content)) {
    console.log(props.content)
    return props.content
  } else if (typeof props.content == 'object') {
    const content = { ...props.content }
    if (props.ignore) {
      props.ignore.forEach((k) => delete content[k])
    }
    return content
  }
})
</script>

<template>
  <li class="stats-viewer">
    <div class="sidebar">
      <slot />
    </div>
    <ul class="graphs" v-if="Array.isArray(content)">
      <li v-for="(img, i) in content" :key="i">
        <img
          :src="img.url"
          :alt="$t(img.title)"
          :title="$t(img.title)"
          v-motion
          :initial="{ scale: 0 }"
          :enter="{ scale: 1 }"
          :delay="120 * i"
          :duration="200"
        />
      </li>
    </ul>
    <CounterSection v-else>
      <Counter
        v-for="(v, k, i) in content"
        :key="k"
        :name="k"
        :value="v"
        v-motion
        :initial="{ scale: 0 }"
        :enter="{ scale: 1 }"
        :delay="120 * i"
        :duration="200"
      />
    </CounterSection>
  </li>
</template>

<style lang="less" scoped>
@import '@/assets/vars.less';

.stats-viewer {
  display: flex;
  align-items: center;
  border-radius: 20px;
  background-color: @primary-2;
  overflow: auto;

  .sidebar {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 1em;
    width: 74px;
    height: 74px;
  }

  .graphs {
    display: flex;
    flex-wrap: wrap;
    gap: 0;
    list-style: none;
    padding: 0;
    background-color: white;
  }
}
</style>
