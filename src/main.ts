import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import VueUniversalModal from 'vue-universal-modal';

import './assets/main.css'

import { initViewport } from './utils/initViewPort'
import { forbidTouchMove } from './utils/forbidTouchMove'

import { createThreeManager } from './service/three-manager/createThreeManager';

initViewport()

const app = createApp(App)

const ThreeManager = createThreeManager()
app
  .use(router)
  .use(VueUniversalModal, {
    teleportTarget: 'body',
    modalComponent: 'Modal'
  })
  .use(ThreeManager)

app.mount('#app')
