'use client'

import React, { useRef, useMemo, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useMotion } from '@/components/providers/MotionProvider'
import {
  isWebGLAvailable,
  getOptimalPixelRatio,
  generateAriaLabel,
  DEFAULT_CAMERA_CONFIG,
  DEFAULT_LIGHTING,
  PerformanceMonitor,
} from '@/lib/three-helpers'

/**
 * Props for CanvasWrapper component
 */
export interface CanvasWrapperProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Camera position [x, y, z] */
  cameraPosition?: [number, number, number]
  /** Field of view */
  fov?: number
  /** Child components (3D scene content) */
  children: React.ReactNode
  /** Additional class names */
  className?: string
  /** ARIA label for accessibility */
  ariaLabel?: string
  /** Fallback content for no WebGL support */
  fallback?: React.ReactNode
  /** Custom lighting setup */
  customLighting?: boolean
  /** Background color */
  background?: string
  /** Whether to enable shadows */
  shadows?: boolean
  /** Performance monitoring callback */
  onPerformanceUpdate?: (fps: number) => void
}

/**
 * Default Lighting Component
 * Provides ambient and directional lights for the scene
 */
function DefaultLighting() {
  return (
    <>
      <ambientLight
        intensity={DEFAULT_LIGHTING.ambient.intensity}
        color={DEFAULT_LIGHTING.ambient.color}
      />
      <directionalLight
        position={DEFAULT_LIGHTING.directional.position}
        intensity={DEFAULT_LIGHTING.directional.intensity}
        color={DEFAULT_LIGHTING.directional.color}
        castShadow={DEFAULT_LIGHTING.directional.castShadow}
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <directionalLight
        position={DEFAULT_LIGHTING.fill.position}
        intensity={DEFAULT_LIGHTING.fill.intensity}
        color={DEFAULT_LIGHTING.fill.color}
      />
    </>
  )
}

/**
 * Performance Monitor Component
 * Tracks FPS and reports performance updates
 */
function PerformanceTracker({ onUpdate }: { onUpdate?: (fps: number) => void }) {
  const monitor = useRef(new PerformanceMonitor())

  useFrame(() => {
    monitor.current.update()
    onUpdate?.(monitor.current.getFPS())
  })

  return null
}

/**
 * Canvas Wrapper Component
 *
 * Reusable Three.js canvas wrapper that provides camera configuration,
 * default lighting, responsive behavior, and accessibility support.
 *
 * @example
 * ```tsx
 * <CanvasWrapper ariaLabel="3D horse model viewer">
 *   <mesh>
 *     <boxGeometry />
 *     <meshStandardMaterial />
 *   </mesh>
 * </CanvasWrapper>
 * ```
 */
export function CanvasWrapper({
  cameraPosition = DEFAULT_CAMERA_CONFIG.position,
  fov = DEFAULT_CAMERA_CONFIG.fov,
  children,
  className,
  ariaLabel = 'Interactive 3D scene',
  fallback,
  customLighting = false,
  background,
  shadows = true,
  onPerformanceUpdate,
  ...props
}: CanvasWrapperProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { shouldReduceMotion } = useMotion()

  // Check WebGL availability
  const hasWebGL = useMemo(() => isWebGLAvailable(), [])

  // Get optimal pixel ratio for performance
  const pixelRatio = useMemo(() => getOptimalPixelRatio(), [])

  // Generate aria-label for accessibility
  const ariaLabelGenerated = useMemo(
    () => generateAriaLabel(ariaLabel, true),
    [ariaLabel]
  )

  // Handle window resize for responsive behavior
  useEffect(() => {
    if (!containerRef.current) return

    const resizeObserver = new ResizeObserver(() => {
      // Canvas handles resize automatically, but we can trigger custom behavior here
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect()
        // Custom resize logic if needed
      }
    })

    resizeObserver.observe(containerRef.current)

    return () => {
      resizeObserver.disconnect()
    }
  }, [])

  // Fallback for no WebGL support
  if (!hasWebGL) {
    return (
      <div
        ref={containerRef}
        className={className}
        role="img"
        aria-label={ariaLabel}
        {...props}
      >
        {fallback || (
          <div className="flex items-center justify-center h-full bg-midnight/50">
            <p className="text-white">
              Your browser does not support WebGL. Please try a different browser.
            </p>
          </div>
        )}
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className={className}
      role="img"
      aria-label={ariaLabelGenerated}
      {...props}
    >
      <Canvas
        camera={{
          position: cameraPosition,
          fov,
          near: DEFAULT_CAMERA_CONFIG.near,
          far: DEFAULT_CAMERA_CONFIG.far,
        }}
        gl={{
          alpha: true,
          antialias: !shouldReduceMotion,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1,
          powerPreference: 'high-performance',
          stencil: true,
          depth: true,
        }}
        dpr={pixelRatio}
        style={{ width: '100%', height: '100%' }}
        onCreated={({ gl }) => {
          // Configure renderer
          gl.setClearColor(background || '#000000', background ? 1 : 0)

          // Cleanup on unmount
          return () => {
            gl.dispose()
            gl.forceContextLoss()
          }
        }}
      >
        {/* Default lighting unless overridden */}
        {!customLighting && <DefaultLighting />}

        {/* Performance monitoring */}
        {onPerformanceUpdate && <PerformanceTracker onUpdate={onPerformanceUpdate} />}

        {/* Children (3D scene content) */}
        {children}
      </Canvas>
    </div>
  )
}
