<script setup lang="ts">
import { computed } from 'vue';
const props = defineProps<{
  className?: string;
  backgroundImageUrl?: string;
}>()

const emit = defineEmits(['click'])

const url = computed(() => {
  return props.backgroundImageUrl ?? ''
})
</script>

<template>
  <div class="circle-button bg-cover" :class="[className && className]" :style="`background-image: url(${url});`" @click="$emit('click')"></div>
</template>

<style scoped>
.circle-button {
  width: 42px;
  height: 42px;
  position: absolute;
  border-radius: 50%;
}
</style>
