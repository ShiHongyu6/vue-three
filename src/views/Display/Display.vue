<script setup lang="ts">
import CircleButton from '@/components/CricleButton.vue';
import ButtonGroup from '@/components/ButtonGroup/ButtonGroup.vue';
import { useButtonGroup } from '@/components/ButtonGroup/useButtonGroup';
import { PUBLIC_STATIC_PATH } from '@/assetsPath';
import { onBeforeUnmount, onMounted } from 'vue';
import { AmbientLight, DirectionalLight, Scene, sRGBEncoding } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import QRCodeModal from '@/components/Modal/QRCodeModal.vue';
import { useModal } from '@/components/Modal/useModal';
import { useThreeManager } from '@/service/three-manager/useThreeManager';
import { useRouter } from 'vue-router';
import { AnimationLoop } from '@/service/three-manager/AnimationLoop';

const { threeManager } = useThreeManager()
const animationManager = threeManager.animationManager
onMounted(() => {
  animationManager.playRepeatByName('daiji', Infinity)
})


const [init, { open: openButtonGroup, hide: closeButtonGroup }] = useButtonGroup([
  {
    display: '全嵌入家装美学',
    onClick: createLazyPlayer('qianru')
  },
  {
    display: '三合一',
    onClick: createLazyPlayer('sanheyi')
  },
  {
    display: '智能手机互联',
    onClick: createLazyPlayer('shouji')
  },
  {
    display: '滤芯进化',
    onClick: createLazyPlayer('jinghua')
  },
  {
    display: '暖心欢喜',
    onClick: createLazyPlayer('zhiyin')
  },
  {
    display: '两路净水',
    onClick: createLazyPlayer('shuiguan')
  },
])
function createLazyPlayer(name: string) {
  return async function () {
    if (!animationManager.getActionByName(name)) {
      await threeManager.loadAnimationModel({
        name,
        url: `${PUBLIC_STATIC_PATH}/animation/SIEMENS_qianyinji_${name}.FBX`
      })
    }

    animationManager.playOnceByName(name, { clampWhenFinished: true })
  }
}

const [initQRCodeModal, { openModal, closeModal }] = useModal()

// threeManager.mockScene()

onMounted(() => {
  const { orbitControls } = setup()
  configLight()

  const scene = threeManager.scene
  const animationLoop = threeManager.animationLoop

  animationLoop.on(orbitControls.update)
  animationLoop.on(threeManager.renderFrame)
  animationLoop.start()
})

onBeforeUnmount(() => {
  const animationLoop = threeManager.animationLoop
  animationLoop.stop()
  animationLoop.clear()
  threeManager.clear()
})

function setup() {
  const renderer = threeManager.renderer
  const contaienr = document.querySelector('#canvas-container') as HTMLElement
  contaienr.appendChild(renderer.domElement)
  threeManager.resize()

  renderer.outputEncoding = sRGBEncoding
  renderer.physicallyCorrectLights = true

  const camera = threeManager.camera
  camera.position.set(0, 50, 280)
  const orbitControls = new OrbitControls(camera, contaienr)


  return { renderer, camera, orbitControls }
}
function configLight() {

  const ambLight = new AmbientLight(0xffffff);
  const light = new DirectionalLight(0xffffff, 0.1);
  light.position.set(0, 20, 250)

  const scene = threeManager.scene
  scene.add(ambLight, light)
}

const router = useRouter()
function backButtonHandler() {
  router.back()
}

</script>

<template>
  <div class="bfc-container">
    <CircleButton class-name="back-button" :background-image-url="`${PUBLIC_STATIC_PATH}/back-button.png`"
      @click="backButtonHandler"></CircleButton>
    <CircleButton class-name="customer-service-button"
      :background-image-url="`${PUBLIC_STATIC_PATH}/customer-service.png`" @click="openModal"></CircleButton>
    <div class="container">
      <div id="canvas-container"></div>
      <ButtonGroup @init="init" :hidden="false" />
    </div>
  </div>
  <QRCodeModal @init="initQRCodeModal" />
</template>

<style scoped lang="less">
.container {
  width: 100%;
  height: 100%;

  #canvas-container {
    width: 100%;
    height: 100%;

    :deep(canvas) {
      width: 100%;
      height: 100%;
    }
  }

}

.back-button {
  top: 24px;
  left: 15px;
}

.customer-service-button {
  top: 24px;
  right: 15px;
}
</style>
