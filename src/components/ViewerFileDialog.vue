<script setup>
import { ref, onMounted, defineEmits, watch } from 'vue'
import { useDropZone, useFileSystemAccess, useMediaQuery } from '@vueuse/core'

const emit = defineEmits(['input', 'open'])

const fileChooserRef = ref()

const fileSystemAccess = useFileSystemAccess()
const isLargeScreen = useMediaQuery('(min-width: 1024px)')

let dropZone = ref(null)
if (isLargeScreen.value) {
  dropZone.value = useDropZone(fileChooserRef, {
    dataTypes: ['text/plain', '.stats'],
  })
}

watch(fileSystemAccess.data, (content) => {
  if (content) {
    emit('input', content)
  }
})

function openDialog() {
  fileSystemAccess.data.value = ''
  emit('open')
  fileSystemAccess.open({
    types: [
      {
        description: 'Stats',
        accept: {
          'text/plain': ['.txt', '.stats'],
        },
      },
    ],
  })
}
</script>

<template>
  <section class="file-chooser" ref="fileChooserRef" @click="openDialog">
    <strong v-if="dropZone && dropZone.isOverDropZone">{{ $t('viewer.release_to_parse') }}</strong>
    <strong v-else>{{
      isLargeScreen ? $t('viewer.drag_your_files_here_or_choose_ones') : $t('viewer.choose_files')
    }}</strong>
  </section>
</template>

<style lang="less" scoped>
@import '@/assets/vars.less';

main {
  height: 100%;
  width: 100%;

  @media screen and (min-width: 1024px) {
    width: 1024px;
  }
}

.file-chooser {
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: center;
  background-color: @primary-2;
  border: dotted 2px @emphasis-1;
  border-radius: 10px;

  &:hover {
    background-color: @primary-3;
    transition-duration: 0.2s;
  }

  * {
    user-select: none;
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
