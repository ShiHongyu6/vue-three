export function forbidTouchMove() {
  document.addEventListener('touchmove', e => {
    e.stopPropagation()
    e.preventDefault()
  }, {
    passive: false,
  })
}