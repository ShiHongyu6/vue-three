type Op = () => void

export class AnimationLoop {
  private ops = new Set<Op>()
  private isLooping = false
  private isStarted = false

  on(op: Op) {
    this.ops.add(op)
    if(!this.isLooping) {
      if(this.isStarted) {
        this.startLoop()
        this.isLooping = true
      }
    }
  }

  off(op: Op){
    this.ops.delete(op)
    if(!this.ops.size) {
      this.stopLoop()
      this.isLooping = false
    }
  }

  clear() {
    this.ops.clear()
    this.isStarted = false
  
    if(this.isLooping) {
      this.stopLoop()
      this.isLooping = false
    }
  }

  private raf = 0
  private startLoop() {
    const animate = () => {
      this.ops.forEach(op => op())
      this.raf = requestAnimationFrame(animate)
    }

    this.raf = requestAnimationFrame(animate)
  }

  private stopLoop() {
    cancelAnimationFrame(this.raf)
  }

  public start() {
    this.isStarted = true
    this.startLoop()
  }

  public stop() {
    this.isStarted = false
    this.stopLoop()
  }
}