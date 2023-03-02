import { shallowRef } from "vue"

interface ModalImp {
  openModal: () => Promise<void>
  closeModal: () => Promise<void>
}

export function useModal() {
  const modalInstanceRef = shallowRef<ModalImp>()
  
  function init(modalInstance: ModalImp) {
    modalInstanceRef.value = modalInstance
  }
  
  function getInstance() {
    return modalInstanceRef.value
  }

  function openModal() {
    return modalInstanceRef.value?.openModal()
  }

  function closeModal() {
    return modalInstanceRef.value?.closeModal
  }


  return [
    init,
    {
      getInstance,
      openModal,
      closeModal
    }
  ] as const
}