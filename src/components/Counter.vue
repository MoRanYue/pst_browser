<script setup>
import CounterSection from './CounterSection.vue'
import { useI18n } from 'vue-i18n'
import { computed, defineProps } from 'vue'

const props = defineProps({
  name: String,
  value: {
    type: [String, Number, Object, Boolean],
    required: true,
  },
})
const i18n = useI18n()

function convertToText(value) {
  switch (typeof value) {
    case 'string':
      return `stats.${value}`

    case 'number':
      return value.toString()

    case 'boolean':
      return value ? 'site.yes' : 'site.no'
  }
}
function t(key, origin) {
  const text = i18n.t(key)
  return text == key ? origin : text
}
const name = computed(() => t(`stats_name.${props.name}`, props.name))
const value = computed(() => t(convertToText(props.value), props.value))
</script>

<template>
  <li>
    <span class="name">{{ name }}</span>
    <CounterSection class="value" v-if="typeof props.value == 'object'">
      <Counter
        v-for="(v, k, i) in props.value"
        :key="k"
        :name="k"
        :value="v"
        v-motion
        :initial="{ scale: 0 }"
        :visible-once="{ scale: 1 }"
        :delay="120 * i"
        :duration="200"
      />
    </CounterSection>
    <span class="value" v-else>{{ value }}</span>
  </li>
</template>

<style lang="less" scoped>
@import '@/assets/vars.less';

li {
  @gap: 0.5em;
  display: flex;
  align-items: center;
  background-color: @secondary-1;
  font-size: 1.5rem;

  .name {
    display: block;
    padding: @gap;
    background-color: @secondary-2;
    font-weight: bold;
  }
  span.value {
    margin-left: @gap;
  }
  .value {
    padding-right: @gap;
  }
}
</style>
