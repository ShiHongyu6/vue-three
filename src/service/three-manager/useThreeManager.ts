import { inject } from "vue";
import { threeManagerKey } from "./createThreeManager";

export function useThreeManager() {
  const threeManager = inject(threeManagerKey)
  if(!threeManager) {
    throw 'Please call createThreeManager and app.use before useThreeManager'
  }
  return { threeManager }
}