<script setup lang="ts">
import { PUBLIC_STATIC_PATH } from '@/assetsPath';
import { onMounted, ref } from 'vue';
import { RouterLink, RouterView } from 'vue-router'
import CricleButton from '../CricleButton.vue';
import ModalWithBackButton from './ModalWithBackButton.vue';
import { useModal } from './useModal';
const emit = defineEmits(['init'])


const url = ref(`${PUBLIC_STATIC_PATH}/QRCode.png`)
const [init, { openModal, closeModal, getInstance }] = useModal()


onMounted(() => {
  emit('init', getInstance())
})
</script>

<template>
  <ModalWithBackButton @init="init">
    <div class="img-container">
      <img :src="url">
    </div>
  </ModalWithBackButton>
</template>

<style scoped lang="less">
.img-container {
  width: 249px;
  height: 345px;

  justify-self: center;
  align-self: center;

  img {
    width: 100%;
    height: 100%;
  }
}
</style>
