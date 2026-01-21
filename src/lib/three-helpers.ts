import * as THREE from 'three'

/**
 * Three.js helper utilities for 3D operations
 * Provides functions for common 3D tasks, optimizations, and accessibility
 */

/**
 * Default camera configuration for 3D scenes
 */
export const DEFAULT_CAMERA_CONFIG = {
  position: [0, 2, 5] as [number, number, number],
  fov: 45,
  near: 0.1,
  far: 1000,
}

/**
 * Default lighting configuration
 */
export const DEFAULT_LIGHTING = {
  ambient: {
    intensity: 0.5,
    color: '#ffffff',
  },
  directional: {
    intensity: 1,
    color: '#ffffff',
    position: [5, 5, 5] as [number, number, number],
    castShadow: true,
  },
  fill: {
    intensity: 0.3,
    color: '#ffeebb',
    position: [-5, 3, -5] as [number, number, number],
  },
}

/**
 * Performance monitoring configuration
 */
export interface PerformanceMetrics {
  fps: number
  memoryUsage?: number
  drawCalls: number
  triangles: number
  textures: number
}

/**
 * Checks if WebGL is available in the current browser
 * @returns true if WebGL is supported
 */
export function isWebGLAvailable(): boolean {
  try {
    const canvas = document.createElement('canvas')
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    )
  } catch {
    return false
  }
}

/**
 * Checks if WebGL2 is available (better performance and features)
 * @returns true if WebGL2 is supported
 */
export function isWebGL2Available(): boolean {
  try {
    const canvas = document.createElement('canvas')
    return !!canvas.getContext('webgl2')
  } catch {
    return false
  }
}

/**
 * Gets the best WebGL context available
 * @returns 'webgl2', 'webgl', or null
 */
export function getWebGLContextType(): 'webgl2' | 'webgl' | null {
  if (isWebGL2Available()) return 'webgl2'
  if (isWebGLAvailable()) return 'webgl'
  return null
}

/**
 * Creates a default camera position for product viewing
 * @param distance - Distance from object
 * @returns Camera position array
 */
export function createProductViewCamera(distance: number = 3): [number, number, number] {
  return [0, 0.5, distance]
}

/**
 * Creates orbit controls constraints for product viewing
 * @returns Object with min/max values
 */
export function createOrbitConstraints() {
  return {
    minDistance: 2,
    maxDistance: 10,
    minPolarAngle: Math.PI / 6, // 30 degrees
    maxPolarAngle: Math.PI / 1.5, // 120 degrees
    enableDamping: true,
    dampingFactor: 0.05,
    enableZoom: true,
    enablePan: false, // Disable pan for product viewing
  }
}

/**
 * Optimizes texture size based on device pixel ratio
 * @param originalSize - Original texture size
 * @param maxTextureSize - Maximum allowed texture size
 * @returns Optimized texture size
 */
export function optimizeTextureSize(
  originalSize: number,
  maxTextureSize: number = 2048
): number {
  const dpr = Math.min(window.devicePixelRatio, 2)
  const targetSize = originalSize * dpr
  return Math.min(targetSize, maxTextureSize)
}

/**
 * Generates level of detail (LOD) distances
 * @param baseDistance - Base distance for LOD
 * @param levels - Number of LOD levels
 * @returns Array of distances for each LOD level
 */
export function generateLODDistances(baseDistance: number, levels: number = 3): number[] {
  const distances: number[] = []
  for (let i = 0; i < levels; i++) {
    distances.push(baseDistance * Math.pow(2, i))
  }
  return distances
}

/**
 * Calculates memory usage for textures
 * @param width - Texture width
 * @param height - Texture height
 * @param format - Texture format (default RGBA)
 * @returns Memory usage in bytes
 */
export function calculateTextureMemory(
  width: number,
  height: number,
  format: 'rgb' | 'rgba' = 'rgba'
): number {
  const bytesPerPixel = format === 'rgba' ? 4 : 3
  return width * height * bytesPerPixel
}

/**
 * Disposes of Three.js resources to prevent memory leaks
 * @param object - Three.js object to dispose
 */
export function disposeObject(object: THREE.Object3D): void {
  if (!object) return

  // Dispose geometries
  if ('geometry' in object && object.geometry instanceof THREE.BufferGeometry) {
    object.geometry.dispose()
  }

  // Dispose materials
  if ('material' in object) {
    if (Array.isArray(object.material)) {
      object.material.forEach((mat) => {
        if (mat instanceof THREE.Material) {
          disposeMaterial(mat)
        }
      })
    } else if (object.material instanceof THREE.Material) {
      disposeMaterial(object.material)
    }
  }

  // Recursively dispose children
  if ('children' in object) {
    object.children.forEach((child) => {
      disposeObject(child)
    })
  }
}

/**
 * Disposes of a Three.js material
 * @param material - Material to dispose
 */
function disposeMaterial(material: THREE.Material): void {
  material.dispose()

  // Dispose textures
  for (const key in material) {
    const value = (material as any)[key]
    if (value instanceof THREE.Texture) {
      value.dispose()
    }
  }
}

/**
 * Creates a loading manager for tracking 3D asset loading
 * @param onLoad - Callback when all assets loaded
 * @param onProgress - Callback with progress (0-1)
 * @param onError - Callback on error
 * @returns THREE.LoadingManager
 */
export function createLoadingManager(
  onLoad?: () => void,
  onProgress?: (progress: number) => void,
  onError?: (error: Error) => void
): THREE.LoadingManager {
  const manager = new THREE.LoadingManager()

  manager.onLoad = () => {
    onLoad?.()
  }

  manager.onProgress = (url, loaded, total) => {
    onProgress?.(loaded / total)
  }

  manager.onError = (url) => {
    onError?.(new Error(`Failed to load: ${url}`))
  }

  return manager
}

/**
 * Converts a color string to THREE.Color
 * @param color - Color string (hex, named, etc.)
 * @returns THREE.Color instance
 */
export function createColor(color: string): THREE.Color {
  return new THREE.Color(color)
}

/**
 * Creates an environment map URL based on quality level
 * @param quality - 'low', 'medium', or 'high'
 * @returns URL to environment map
 */
export function getEnvironmentMapURL(quality: 'low' | 'medium' | 'high' = 'medium'): string {
  const filename = {
    low: 'env_512.hdr',
    medium: 'env_1024.hdr',
    high: 'env_2048.hdr',
  }
  return `/models/environments/${filename[quality]}`
}

/**
 * Gets model path with proper format
 * @param modelType - Type of model (horse, saddle, bridle, etc.)
 * @param modelName - Name of the model file
 * @param compressed - Whether to use Draco-compressed version
 * @returns Full path to model
 */
export function getModelPath(
  modelType: string,
  modelName: string,
  compressed: boolean = true
): string {
  const extension = compressed ? 'glb' : 'gltf'
  const basePath = `/models/${modelType}`
  return `${basePath}/${modelName}.${extension}`
}

/**
 * Performance monitoring class for 3D scenes
 */
export class PerformanceMonitor {
  private fps: number = 60
  private lastTime: number = performance.now()
  private frames: number = 0
  private updateInterval: number = 1000 // Update every second

  /**
   * Updates the FPS counter
   */
  update(): void {
    const now = performance.now()
    this.frames++

    if (now >= this.lastTime + this.updateInterval) {
      this.fps = Math.round((this.frames * 1000) / (now - this.lastTime))
      this.frames = 0
      this.lastTime = now
    }
  }

  /**
   * Gets current FPS
   */
  getFPS(): number {
    return this.fps
  }

  /**
   * Checks if performance is good (60fps or higher)
   */
  isGoodPerformance(): boolean {
    return this.fps >= 55
  }

  /**
   * Checks if performance is acceptable (30fps or higher)
   */
  isAcceptablePerformance(): boolean {
    return this.fps >= 30
  }

  /**
   * Gets performance metrics
   */
  getMetrics(): PerformanceMetrics {
    const info = (THREE as any).WebGLRenderer?.info
    return {
      fps: this.fps,
      memoryUsage: info?.memory?.textures,
      drawCalls: info?.render?.calls || 0,
      triangles: info?.render?.triangles || 0,
      textures: info?.memory?.textures || 0,
    }
  }
}

/**
 * Creates adaptive quality settings based on performance
 * @param fps - Current frames per second
 * @returns Quality settings object
 */
export function getAdaptiveQuality(fps: number) {
  if (fps >= 55) {
    return {
      shadows: true,
      antialias: true,
      pixelRatio: Math.min(window.devicePixelRatio, 2),
      textureQuality: 'high' as const,
      lodBias: 0,
    }
  } else if (fps >= 30) {
    return {
      shadows: true,
      antialias: true,
      pixelRatio: 1,
      textureQuality: 'medium' as const,
      lodBias: 0.5,
    }
  } else {
    return {
      shadows: false,
      antialias: false,
      pixelRatio: 1,
      textureQuality: 'low' as const,
      lodBias: 1,
    }
  }
}

/**
 * Accessibility: Generates aria-label for 3D content
 * @param description - Description of the 3D content
 * @param interactive - Whether the content is interactive
 * @returns Appropriate aria-label string
 */
export function generateAriaLabel(description: string, interactive: boolean = false): string {
  const interactiveLabel = interactive
    ? 'Interactive 3D model. Use mouse or touch to rotate and zoom. '
    : '3D visualization. '
  return `${interactiveLabel}${description}`
}

/**
 * Checks if device is mobile for optimization purposes
 * @returns true if on mobile device
 */
export function isMobileDevice(): boolean {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  )
}

/**
 * Gets appropriate pixel ratio for performance
 * @returns Pixel ratio (1-2)
 */
export function getOptimalPixelRatio(): number {
  if (isMobileDevice()) {
    return 1 // Limit to 1 on mobile for performance
  }
  return Math.min(window.devicePixelRatio, 2) // Max 2 on desktop
}
