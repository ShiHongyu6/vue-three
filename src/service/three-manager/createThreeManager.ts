import type { App, InjectionKey } from "vue";

import { ThreeManager } from "./ThreeManager";

export const threeManagerKey = Symbol() as InjectionKey<ThreeManager>
export function createThreeManager() {
  const threeManager = new ThreeManager()

  return function(app: App) {
    app.provide(threeManagerKey, threeManager)
  }
}