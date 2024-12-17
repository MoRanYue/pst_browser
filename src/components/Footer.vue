<script setup>
import LanguageSelector from './LanguageSelector.vue'
</script>

<template>
  <footer>
    <span>PST Viewer | Created by <a href="https://github.com/MoRanYue">MoRanYue</a></span>
    <LanguageSelector />
  </footer>
</template>

<style lang="less" scoped>
@import '@/assets/vars.less';

footer {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  padding: 0.6em;
  margin-top: 2em;
  background-color: @secondary-1;
  border-top: 10px solid @secondary-2;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;

  span {
    margin-right: 2em;
  }
}
</style>
