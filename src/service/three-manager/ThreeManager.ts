import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment'
import { LoadingManager, Scene, WebGLRenderer, PerspectiveCamera, Object3D, type Camera, BoxGeometry, MeshBasicMaterial, Mesh, Sphere, Box3, AmbientLight, DirectionalLight, TextureLoader, Group, BufferGeometry, MaterialLoader, Material } from 'three'
import { AnimationManager } from './AnimationManager'
import { AnimationLoop } from './AnimationLoop'

interface Renameable {
  name: string
}
interface Fetchable {
  url: string
}
type RenameableAnimationClip = Fetchable & Partial<Renameable>

export class ThreeManager {

  public loadingManager = new LoadingManager()
  private gltfLoader = new GLTFLoader(this.loadingManager)
  private fbxLoader = new FBXLoader(this.loadingManager)

  private modelScene: null | Object3D = null;
  public scene = new Scene()
  public renderer = new WebGLRenderer()
  public camera = new PerspectiveCamera()
  public animationLoop = new AnimationLoop()
  public animationManager = new AnimationManager(this.animationLoop)
  private modelLoaded = false


  get isLoadFinish() {
    return this.modelLoaded && this.animationManager.loaded
  }

  constructor() {
    this.renderer = new WebGLRenderer({
      antialias: true,
      alpha: true,
    })
  }

  resize() {
    const canvas = this.renderer.domElement
    const clientWidth = canvas.clientWidth
    const clientHeight = canvas.clientHeight
    const width = canvas.width
    const height = canvas.height

    const wShouldBe = clientWidth * window.devicePixelRatio
    const hShouldBe = clientHeight * window.devicePixelRatio
    if (width !== wShouldBe || height !== hShouldBe) {
      this.renderer.setSize(wShouldBe, hShouldBe, false)

      this.camera.aspect = wShouldBe / hShouldBe
      this.camera.updateProjectionMatrix()
    }
  }

  resizeBasedWidth() {
    const canvas = this.renderer.domElement
    const clientWidth = canvas.clientWidth
    const width = canvas.width
    const height = canvas.height

    const shouldBe = clientWidth * window.devicePixelRatio
    if (width !== shouldBe || height !== shouldBe) {
      this.renderer.setSize(shouldBe, shouldBe, false)

      this.camera.aspect = 1
      this.camera.updateProjectionMatrix()
    }
  }

  // async loadModel(url: string) {
  //   this.loadingManager.onProgress = () => {
  //     console.log(arguments)
  //   }
  //   const gltf = await this.gltfLoader.loadAsync(url)
  //   this.modelScene = gltf.scene
  //   this.scene.add(this.modelScene)
  // }

  /**
   * 加载模型
   * @param url 
   * @param animationModelUrl 加载动画模型
   */
  public async loadModel(url: string, loadAnimation = false) {
    const fbx = await this.fbxLoader.loadAsync(url)
    this.modelScene = fbx
    this.scene.add(this.modelScene)

    this.animationManager.clear()
    this.animationManager.root = fbx
  
    if (loadAnimation) {
      this.animationManager.add(fbx.animations)
    }

    this.modelLoaded = true
  }

  public async loadAnimationModel(clip: RenameableAnimationClip): Promise<void>
  public async loadAnimationModel(clips: RenameableAnimationClip[]): Promise<void>
  public async loadAnimationModel(clips: RenameableAnimationClip | RenameableAnimationClip[]) {
    if (!this.modelScene) {
      throw 'Please load scene model before load animation model'
    }
  
    if (!Array.isArray(clips)) {
      clips = [clips]
    }

    const fbxs = await Promise.all(clips.map(clip => new Promise((resolve, reject) => {
      const url = clip.url
      this.fbxLoader.loadAsync(url).then(resolve).catch(reject)
    }))) as Group[]

    fbxs.forEach((fbx, index) => {
      // @ts-ignore
      this.animationManager.add(fbx.animations, clips[index].name)
    })
  }

  async loadEnvironmentMap(url: string) {
    const texture = await new TextureLoader().loadAsync(url)
    this.scene.environment = texture
  }

  public clear() {
    this.dispose()
    this.animationManager.clear()
    this.scene.clear()
    this.modelLoaded = false
  }

  public dispose() {
    
    this.scene.traverse(disposeObject)

    function disposeObject(obj: Object3D) {
      //@ts-ignore
      obj.geometry?.dispose()
      //@ts-ignore
      obj.material && disposeMaterial(obj.material)
    }
    function disposeMaterial(material: Material | Material[]) {
      if(Array.isArray(material)) {
        material.forEach(disposeMaterial)
        return
      }

      for(let key in material) {
        //@ts-ignore
        const resource = material[key]
        if(resource && resource.dispose && typeof resource.dispose === 'function') {
          resource.dispose()
          //@ts-ignore
          material[key] = null
        }
      }
      material.dispose()
    }
  }

  public renderFrame = () => {
    if(this.renderer && this.scene && this.camera) {
      this.renderer.render(this.scene, this.camera)
    }
  }
}