<script setup></script>

<template>
  <section>
    <ul>
      <slot />
    </ul>
  </section>
</template>

<style lang="less" scoped>
@import '@/assets/vars.less';

section {
  flex-grow: 1;
  align-self: stretch;
  background-color: @primary-3 !important;

  padding: 1em;

  ul {
    display: flex;
    flex-wrap: wrap;
    gap: 0.2em;
    padding: 0;
    list-style: none;
  }
}
</style>
