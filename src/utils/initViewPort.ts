export function initViewport() {
    const width = 375;  // 设计稿宽度
    const scale = window.innerWidth / width
    let meta = document.querySelector('meta[name=viewport]')
    let content = `width=${width}, initial-scale=${scale}, user-scalable=no`
    if(!meta) {
        meta = document.createElement('meta')
        meta.setAttribute('name', 'viewport')
        document.head.appendChild(meta)
    }
    meta.setAttribute('content', content)
}
