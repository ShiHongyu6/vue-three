<script setup lang="ts">
import { PUBLIC_STATIC_PATH } from '@/assetsPath';
import { computed, nextTick, onMounted, ref, shallowRef, toRaw, watch } from 'vue';
import type { ButtonBoxImp } from './useButtonGroup'
const emit = defineEmits(['init'])

//#region 和并props
const props = defineProps<{
  hidden?: boolean;
  buttonsOption?: ButtonGroup.ButtonOption[];
}>()
const propsRef = ref<Partial<ButtonGroup.Props>>();
const mergedProps = computed(() => ({
  ...props,
  ...propsRef.value
}));
function setProps(props: Partial<ButtonGroup.Props>) {
  const oldProps = toRaw(propsRef);
  propsRef.value = {
    ...oldProps,
    ...props
  }
}
const buttonsOption = computed(() => mergedProps.value.buttonsOption)
//#endregion

//#region 显示或隐藏的逻辑
const hidden = ref(mergedProps.value.hidden)
async function hide() {
  hidden.value = true
  await nextTick()
  return Promise.resolve()
}
async function open() {
  hidden.value = false
  await nextTick()
  return Promise.resolve()
}
async function toggle() {
  hidden.value = !hidden.value
  await nextTick()
  return Promise.resolve()
}
//#endregion

const currentSelectedRef = ref(-1)
const selected = computed(() => {
  const index = ~currentSelectedRef.value ? currentSelectedRef.value : mergedProps.value.selected;
  return index;
})
function clickHandler(index: number) {
  const buttonOption = buttonsOption.value?.[index] as ButtonGroup.ButtonOption
  if (!buttonOption) {
    return
  }
  buttonOption.onClick?.call(null)

  if(selected.value !== index) {
    buttonOption.onChange?.call(null)
  }
  currentSelectedRef.value = index
}

const buttonBoxImp: ButtonBoxImp = {
  open,
  hide,
  toggle,
  setProps,
}
emit('init', buttonBoxImp)
</script>

<template>
  <div class="button-group-container" :class="[hidden && 'hidden']">
    <div class="hidden-display-container">
      <div class="hidden-display-button" @click="toggle">
        <div class="label">{{ hidden ? '展开菜单' : '收起菜单' }}</div>
        <div class="icon bg-cover bg-x-center" :class="[!hidden && 'flip-y']"
          :style="`background-image: url(${PUBLIC_STATIC_PATH}/double-arrow.png)`">
        </div>
      </div>
    </div>

    <div class="button-box" ref="buttonBox">
      <Transition>
        <div class="button-list" v-if="!hidden">
          <div v-for="(option, index) of buttonsOption" :key="option.display" @click="() => clickHandler(index)"
            class="button-item" :class="[index === selected && 'selected']">
            {{ option.display }}
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>

<style scoped lang="less">
.button-group-container {
  width: 330px;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  bottom: 11px;

  // background-color: #1d1d1d;

  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 11px;
  user-select: none;
  transition: all .5s ease;

  &.hidden {
    transform: translate(-50%, calc(100% - 40.3px));
  }

  .hidden-display-container {
    .hidden-display-button {
      width: 50px;
      display: flex;
      flex-direction: column;
      align-items: center;
      cursor: pointer;

      .label {
        color: #fff;
        height: 16.5px;
        line-height: 16.5px;
        font-size: 12px;
      }

      .icon {
        margin-top: 5px;
        width: 23px;
        height: 12.8px;
      }
    }
  }

  .button-box {
    .button-list {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-around;
      margin-top: 6px;

      .button-item {
        width: 100px;
        height: 35px;
        cursor: pointer;

        border-radius: 17.5px;
        background-color: #000;
        color: #fff;
        margin-top: 11px;

        font-size: 12px;
        font-family: '苹方-简 常规体';
        text-align: center;
        line-height: 35px;

        &.selected {
          box-shadow: 0 0 3px 2px #FFF;
        }
      }

    }
  }
}


.v-enter-active,
.v-leave-active {
  transition: all 0.5s ease;
}
</style>
