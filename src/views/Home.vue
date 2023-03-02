<script setup lang="ts">
import { PUBLIC_STATIC_PATH } from '@/assetsPath';
import { useThreeManager } from '@/service/three-manager/useThreeManager';
import { onBeforeRouteLeave, useRouter } from 'vue-router';
import { ElLoading } from 'element-plus'
import { nextTick } from 'vue';


const router = useRouter()
async function clickHandler() {
  try {
    await load()
    router.push('display')
  } catch(e) {
    console.error(e)
  }
}

const { threeManager } = useThreeManager()
const noop = () => { }
async function load() {
  const loading = ElLoading.service({
    lock: true,
    background: 'rgba(0, 0, 0, 0.5)',
    customClass: 'home-loading-layout'
  })
  const loadingManager = threeManager.loadingManager
  try {
    if (!threeManager.isLoadFinish) {
      const loaded = new Promise((resolve, reject) => {
        //@ts-ignore
        loadingManager.onLoad = resolve
        loadingManager.onError = reject
      })

      await threeManager.loadModel(`${PUBLIC_STATIC_PATH}/model/SIEMENS_qianyinji_Skin.FBX`)
      await threeManager
        .loadAnimationModel({ name: 'daiji', url: `${PUBLIC_STATIC_PATH}/animation/SIEMENS_qianyinji_daiji.FBX`})
      await loaded
    }
  } catch (e) {
    throw e
  } finally {
    loading.close()
  }
}

</script>

<template>
  <div class="scroll-container">
    <div class="container bg-cover bg-x-center" :style="`background-image: url(${PUBLIC_STATIC_PATH}/home.png);`">
      <div class="button-box bg-cover" :style="`background-image: url(${PUBLIC_STATIC_PATH}/home-button.png);`">
        <button @click="clickHandler">3D展示</button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.container {
  display: flex;
  height: 100%;
  min-height: 719.5px;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;

  .button-box {
    width: 129px;
    flex: 0 0 49px;
    margin-bottom: 59.5px;

    button {
      width: 100%;
      height: 100%;
      background-color: transparent;
      border: none;
      color: #fff;
      font-size: 16px;
      font-family: '苹方-简 常规体';
    }
  }
}

:global(body>.home-loading-layout .el-loading-spinner .path) {
  stroke: #fff;
}
</style>
