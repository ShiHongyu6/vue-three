<script setup lang="ts">
import { PUBLIC_STATIC_PATH } from '@/assetsPath';
import { nextTick, onMounted, ref } from 'vue';
import CricleButton from '../CricleButton.vue';
const emit = defineEmits(['init'])


const isShow = ref(false)
async function openModal() {
  isShow.value = true
  await nextTick()
  return Promise.resolve()
}
async function closeModal() {
  isShow.value = false
  await nextTick()
  return Promise.resolve()
}


const modalImp = {
  openModal,
  closeModal
}
onMounted(() => {
  emit('init', modalImp)
})


</script>

<template>
  <Modal v-model="isShow" :close="closeModal">
    <CricleButton :background-image-url="`${PUBLIC_STATIC_PATH}/back-button.png`" @click="closeModal"></CricleButton>
    <slot></slot>
  </Modal>
</template>

<style scoped lang="less">
.circle-button {
  justify-self: flex-start;
  align-items: flex-start;

  margin-top: 24px;
  margin-left: 15px;
}


:global(.vue-universal-modal) {

  background-color: rgba(0, 0, 0, 0.5);
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
}
:global(.vue-universal-modal-content) {
  width: 100%;
  height: 100%;

  display: grid;
}
</style>
