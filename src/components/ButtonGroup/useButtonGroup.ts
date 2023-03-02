import { shallowRef } from "vue";

interface Hiddenable {
  open: () => Promise<void>;
  hide: () => Promise<void>;
  toggle: () => Promise<void>;
}

interface PropsSettable {
  setProps: (props: Partial<ButtonGroup.Props>) => void
}

export type ButtonBoxImp = Hiddenable & PropsSettable

export function useButtonGroup(options: ButtonGroup.ButtonOption[]) {

  const buttonBoxImpRef = shallowRef<ButtonBoxImp>()
  function init(buttonBoxImp: ButtonBoxImp) {
    buttonBoxImpRef.value = buttonBoxImp
    buttonBoxImp.setProps({ buttonsOption: options })
  }

  function open() {
    return Promise.resolve(buttonBoxImpRef.value?.open())
  }
  function hide() {
    return Promise.resolve(buttonBoxImpRef.value?.hide())
  }

  return [init, {
    open,
    hide,
  }] as const
}