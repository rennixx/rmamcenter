'use client'

import React, { useRef, Suspense, useEffect } from 'react'
import { useGLTF, useAnimations, useEnvironment, Environment } from '@react-three/drei'
import { useMotion } from '@/components/providers/MotionProvider'
import { CanvasWrapper } from './canvas-wrapper'
import { generateAriaLabel } from '@/lib/three-helpers'
import * as THREE from 'three'

/**
 * Horse pose types
 */
export type HorsePose = 'standing' | 'jumping' | 'galloping' | 'trotting'

/**
 * Props for HorseModel component
 */
export interface HorseModelProps {
  /** Path to the horse model file */
  modelPath: string
  /** Pose of the horse */
  pose?: HorsePose
  /** Whether to play animations */
  playAnimation?: boolean
  /** Animation playback speed (0.5 = half speed, 1 = normal, 2 = double) */
  animationSpeed?: number
  /** Environment map preset for realistic reflections */
  environmentPreset?: string
  /** Additional class names */
  className?: string
  /** Custom height */
  height?: string
  /** Accessibility description */
  description?: string
}

/**
 * Loading Component
 */
function LoadingOverlay() {
  return (
    <div className="flex items-center justify-center h-full bg-midnight/50">
      <div className="flex flex-col items-center gap-2">
        <div className="w-12 h-12 border-3 border-gold border-t-transparent rounded-full animate-spin" />
        <p className="text-white">Loading horse model...</p>
      </div>
    </div>
  )
}

/**
 * Horse Model Component
 * Loads and renders a 3D horse with animations and materials
 */
function HorseMesh({
  modelPath,
  pose,
  playAnimation,
  animationSpeed,
}: {
  modelPath: string
  pose?: HorsePose
  playAnimation?: boolean
  animationSpeed?: number
}) {
  const groupRef = useRef<THREE.Group>(null)
  const { shouldReduceMotion } = useMotion()
  const { scene, animations } = useGLTF(modelPath) as any & {
    scene: THREE.Scene
    animations: THREE.AnimationClip[]
  }
  const { actions } = useAnimations(animations, groupRef)
  const envMap = useEnvironment({ preset: 'studio' as any })

  // Apply environment map for realistic coat reflections
  useEffect(() => {
    scene.traverse((child: any) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true
        child.receiveShadow = true

        // Apply environment map to materials
        if (child.material) {
          if (Array.isArray(child.material)) {
            child.material.forEach((mat) => {
              mat.envMap = envMap
              mat.envMapIntensity = 0.8
              mat.roughness = 0.7 // Slightly rough for realistic coat
              mat.metalness = 0.1 // Slight metallic for shine
              mat.needsUpdate = true
            })
          } else {
            child.material.envMap = envMap
            child.material.envMapIntensity = 0.8
            child.material.roughness = 0.7
            child.material.metalness = 0.1
            child.material.needsUpdate = true
          }
        }
      }
    })
  }, [scene, envMap])

  // Handle animation playback
  useEffect(() => {
    if (!playAnimation || shouldReduceMotion || !actions) return

    // Find animation matching the pose
    const animationName = Object.keys(actions).find((name) =>
      name.toLowerCase().includes(pose || 'standing')
    )

    if (animationName && actions[animationName]) {
      const action = actions[animationName]
      action.reset().fadeIn(0.5).play()
      action.setEffectiveTimeScale(animationSpeed || 1)

      return () => {
        action.fadeOut(0.5)
      }
    }
  }, [playAnimation, pose, animationSpeed, actions, shouldReduceMotion])

  return (
    <group ref={groupRef} dispose={null}>
      <primitive object={scene} />
    </group>
  )
}

/**
 * Horse Model Component
 *
 * Loads and displays high-quality 3D horse models with skeletal animations,
 * realistic materials, and level-of-detail optimization.
 *
 * @example
 * ```tsx
 * <HorseModel
 *   modelPath="/models/horses/arabian.glb"
 *   pose="galloping"
 *   playAnimation
 *   animationSpeed={1.5}
 *   description="Arabian horse in galloping pose"
 * />
 * ```
 */
export function HorseModel({
  modelPath,
  pose = 'standing',
  playAnimation = false,
  animationSpeed = 1,
  environmentPreset = 'studio',
  className,
  height = '600px',
  description = '3D horse model',
}: HorseModelProps) {
  const { shouldReduceMotion } = useMotion()

  // Generate aria-label for accessibility
  const ariaLabel = generateAriaLabel(
    `${description} ${pose ? `in ${pose} pose` : ''}`,
    !shouldReduceMotion
  )

  return (
    <div
      className={className}
      style={{ height }}
      role="img"
      aria-label={ariaLabel}
    >
      <CanvasWrapper
        cameraPosition={[5, 3, 5]}
        ariaLabel={`${description} 3D viewer`}
        shadows
      >
        <Suspense fallback={<LoadingOverlay />}>
          {/* Environment for realistic reflections */}
          <Environment preset={environmentPreset as any} />

          {/* Horse model */}
          <HorseMesh
            modelPath={modelPath}
            pose={pose}
            playAnimation={playAnimation && !shouldReduceMotion}
            animationSpeed={animationSpeed}
          />

          {/* Ground plane */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
            <planeGeometry args={[20, 20]} />
            <meshStandardMaterial color="#1a3a2e" roughness={1} />
          </mesh>

          {/* Lighting */}
          <ambientLight intensity={0.4} />
          <directionalLight
            position={[10, 10, 5]}
            intensity={1}
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
          />
          <directionalLight position={[-5, 5, -5]} intensity={0.3} color="#ffeebb" />
        </Suspense>
      </CanvasWrapper>

      {/* Static image fallback for screen readers or reduced motion */}
      {shouldReduceMotion && (
        <div className="sr-only">
          <img src="/images/horse-static.jpg" alt={description} />
        </div>
      )}
    </div>
  )
}

// Preload commonly used horse models
useGLTF.preload('/models/horses/arabian-standing.glb')
useGLTF.preload('/models/horses/arabian-galloping.glb')
useGLTF.preload('/models/horses/thoroughbred-jumping.glb')
