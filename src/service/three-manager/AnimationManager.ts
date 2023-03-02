import { type AnimationAction, type AnimationClip, AnimationMixer, Object3D, Clock, type AnimationActionLoopStyles, LoopOnce, LoopRepeat } from "three";
import type { AnimationLoop } from "./AnimationLoop";
interface ActionOptions {
  loop: AnimationActionLoopStyles;
  clampWhenFinished: boolean;
}

export class AnimationManager {
  private mixer: null | AnimationMixer = null
  private animationLoop: AnimationLoop
  public root: null | Object3D = null
  private clips: Map<string, AnimationClip> = new Map()
  private actions: Map<string, AnimationAction> = new Map()
  private clock = new Clock()
  public loaded = false
  // private activeActions = new Array<AnimationAction>()
  private _activeCnt = 0
  get activeCnt() {
    return this._activeCnt
  }
  set activeCnt(cnt: number) {
    const preCnt = this._activeCnt
    this._activeCnt = cnt
    this.onActiveCntChange(preCnt, cnt)
  }

  constructor(animationLoop: AnimationLoop) {
    this.animationLoop = animationLoop
  }

  clear() {

    this.mixer = null
    this.root = null
    this.clips.clear()
    this.actions.clear()
    this.clock.stop()
    // this.activeActions.splice(0, this.activeActions.length)
    this.loaded = false
  }

  public getActionByName(name: string) {
    return this.actions.get(name)
  }

  /**
   * 
   * @param clips 
   * @param name 重命名为 [name]_[index]
   */
  public add(clips: AnimationClip[], name?: string) {
    const root = this.root
    if (!root) {
      throw 'Please load model before load animation'
    }
    if (!this.mixer) {
      const mixer = new AnimationMixer(root)
      this.mixer = mixer

      mixer.addEventListener('finished', () => {
        this.activeCnt--
      })
    }
    const mixer = this.mixer as AnimationMixer

    clips.forEach((clip, index) => {
      const clipName = name ? name + (index === 0 ? '' : index) : clip.name
      clip.name = clipName

      const action = mixer.clipAction(clip)

      this.clips.set(clipName, clip)
      this.actions.set(clipName, action)
    })

    this.clock.start()
    this.loaded = true
  }

  // public playByName(name: string, options?: Partial<ActionOptions>): void
  // public playByName(names: string[], options?: Partial<ActionOptions>): void
  // public playByName(names: string | string[], options: Partial<ActionOptions> = {}) {
  //   if (!Array.isArray(names)) {
  //     names = [names]
  //   }

  //   names.forEach(name => {
  //     const action = this.actions.get(name)
  //     if (!action) {
  //       return
  //     }
  //     action.play()

  //     if (options.clampWhenFinished !== undefined) {
  //       action.clampWhenFinished = options.clampWhenFinished
  //     }

  //     if (options.loop !== undefined) {
  //       action.loop = options.loop
  //     }
  //   })
  // }

  public playOnceByName(name: string, options: Omit<ActionOptions, 'loop'>) {
    const action = this.getActionByName(name)
    if (!action || !this.mixer) {
      return
    }

    this.stopAll()

    this.activeCnt++
    action
      .reset()
      .setLoop(LoopOnce, 1)
      .play()
    action.clampWhenFinished = options.clampWhenFinished
  }

  public playRepeatByName(name: string, repetitions: number) {
    const action = this.getActionByName(name)
    if (!action || !this.mixer) {
      return
    }

    this.stopAll()

    this.activeCnt++
    action
      .reset()
      .setLoop(LoopRepeat, repetitions)
      .play()
  }

  public stopAll() {
    if (!this.mixer) {
      return
    }

    this.mixer.stopAllAction()
    this.activeCnt = 0
  }

  private onActiveCntChange(preCnt: number, cnt: number) {
    if (preCnt > 0 && cnt > 0) {
      return
    }

    if (preCnt === 0 && cnt > 0) {
      this.animationLoop.on(this.update)
      return
    }

    if (preCnt > 0 && cnt === 0) {
      this.animationLoop.off(this.update)
      return
    }
  }

  private update = (delta?: number) => {
    const d = delta ?? this.clock.getDelta()
    this.mixer?.update(d)
  }
}