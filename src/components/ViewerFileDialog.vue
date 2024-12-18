<script setup>
import { defineEmits } from 'vue'
import { useMediaQuery } from '@vueuse/core'

const emit = defineEmits(['input', 'open'])

const isLargeScreen = useMediaQuery('(min-width: 1024px)')

function chooseFile(event) {
  const file = event.target.files[0]
  console.log('chosen file: ', file)

  const reader = new FileReader()
  reader.onload = (event) => emit('input', event.target.result)
  reader.readAsText(file)
}
</script>

<template>
  <section class="file-chooser">
    <input
      name="file-chooser"
      type="file"
      accept="text/plain"
      @change="chooseFile"
      @click="emit('open')"
    />

    <label class="tips" for="file-chooser">
      <strong>{{
        isLargeScreen ? $t('viewer.drag_your_files_here_or_choose_ones') : $t('viewer.choose_files')
      }}</strong>
    </label>
  </section>
</template>

<style lang="less" scoped>
@import '@/assets/vars.less';

.file-chooser {
  position: relative;
  width: 100%;
  background-color: @primary-2;
  border: dotted 2px @emphasis-1;
  border-radius: 10px;

  input {
    display: block;
    width: 100%;
    height: 100%;
    opacity: 0;
  }

  &:hover {
    background-color: @primary-3;
    transition-duration: 0.2s;
  }

  .tips {
    display: block;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    user-select: none;
    pointer-events: none;

    strong {
      display: block;
    }
  }

  @media screen and (min-width: 1024px) {
    height: 200px;

    strong {
      font-size: 2rem;
    }
  }
  @media screen and (min-width: 128px) and (max-width: 1024px) {
    height: 100px;

    strong {
      font-size: 1.8rem;
    }
  }
}
</style>
