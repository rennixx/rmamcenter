'use client'

import React, { useRef, useState, Suspense, useMemo, useEffect } from 'react'
import * as THREE from 'three'
import { Vector3, MathUtils, Object3D } from 'three'
import { useFrame } from '@react-three/fiber'
import { Html, Text, PerspectiveCamera as DreiPerspectiveCamera } from '@react-three/drei'
import { useMotion } from '@/components/providers/MotionProvider'
import { CanvasWrapper } from './canvas-wrapper'
import { generateAriaLabel } from '@/lib/three-helpers'

/**
 * Camera preset positions for different views
 */
export interface CameraPreset {
  id: string
  name: string
  position: [number, number, number]
  target: [number, number, number]
}

/**
 * Props for EnvironmentScene component
 */
export interface EnvironmentSceneProps {
  /** Type of environment (stable, arena, pasture) */
  environmentType?: 'stable' | 'arena' | 'pasture'
  /** Available camera presets */
  cameraPresets?: CameraPreset[]
  /** Whether user can navigate through environment */
  allowNavigation?: boolean
  /** Additional class names */
  className?: string
  /** Custom height */
  height?: string
  /** Accessibility description */
  description?: string
}

/**
 * Default camera presets
 */
const DEFAULT_CAMERA_PRESETS: CameraPreset[] = [
  {
    id: 'entrance',
    name: 'Entrance View',
    position: [0, 2, 8],
    target: [0, 1, 0],
  },
  {
    id: 'overview',
    name: 'Overview',
    position: [10, 8, 10],
    target: [0, 0, 0],
  },
  {
    id: 'stall',
    name: 'Stall Interior',
    position: [2, 1.5, 3],
    target: [0, 1, -2],
  },
]

/**
 * Instanced Fence Component
 * Optimized rendering of repeated fence posts using instancing
 */
function InstancedFence({
  count = 20,
  length = 20,
}: {
  count?: number
  length?: number
}) {
  const meshRef = useRef<THREE.InstancedMesh>(null)

  const dummy = useMemo(() => new Object3D(), [])

  // Set up instances on mount
  useEffect(() => {
    if (!meshRef.current) return

    const spacing = length / count

    for (let i = 0; i < count; i++) {
      dummy.position.set(i * spacing - length / 2, 0.5, 0)
      dummy.rotation.set(0, 0, 0)
      dummy.updateMatrix()
      meshRef.current.setMatrixAt(i, dummy.matrix)
    }

    meshRef.current.instanceMatrix.needsUpdate = true
  }, [count, length, dummy])

  return (
    <instancedMesh
      ref={meshRef}
      args={[undefined, undefined, count]}
      castShadow
      receiveShadow
    >
      <boxGeometry args={[0.2, 1, 0.2]} />
      <meshStandardMaterial color="#8B4513" />
    </instancedMesh>
  )
}

/**
 * Stable Stall Component
 * Interactive stall door that can be clicked
 */
function StableStall({
  position,
  onDoorClick,
}: {
  position: [number, number, number]
  onDoorClick?: () => void
}) {
  const [doorOpen, setDoorOpen] = useState(false)
  const doorRef = useRef<THREE.Mesh>(null)

  // Animate door opening/closing
  useFrame((state) => {
    if (doorRef.current) {
      const targetRotation = doorOpen ? -Math.PI / 2 : 0
      doorRef.current.rotation.y = MathUtils.lerp(
        doorRef.current.rotation.y,
        targetRotation,
        0.1
      )
    }
  })

  const handleClick = () => {
    setDoorOpen(!doorOpen)
    onDoorClick?.()
  }

  return (
    <group position={position}>
      {/* Stall frame */}
      <mesh position={[0, 1.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[2, 3, 0.1]} />
        <meshStandardMaterial color="#654321" />
      </mesh>

      {/* Door */}
      <mesh
        ref={doorRef}
        position={[0, 1.5, 0.05]}
        onClick={handleClick}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[1.8, 2.8, 0.05]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>

      {/* Label */}
      {!doorOpen && (
        <Text
          position={[0, 2.5, 0.1]}
          fontSize={0.2}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          Stall 1
        </Text>
      )}
    </group>
  )
}

/**
 * Ground Plane Component
 */
function GroundPlane({ size = 50 }: { size?: number }) {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
      <planeGeometry args={[size, size]} />
      <meshStandardMaterial color="#1a3a2e" roughness={0.9} />
    </mesh>
  )
}

/**
 * Sky Dome Component
 */
function SkyDome() {
  return (
    <mesh scale={[50, 50, 50]}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshBasicMaterial color="#0a0e27" side={THREE.BackSide} />
    </mesh>
  )
}

/**
 * Fog Component
 * Adds atmospheric depth
 */
function SceneFog() {
  return <fog attach="fog" args={['#0a0e27', 10, 50]} />
}

/**
 * Environment Scene Content
 */
function EnvironmentContent({
  environmentType,
  cameraPresets,
  activePreset,
  onPresetChange,
}: {
  environmentType: string
  cameraPresets: CameraPreset[]
  activePreset: number
  onPresetChange: (index: number) => void
}) {
  const { shouldReduceMotion } = useMotion()

  return (
    <>
      {/* Sky and fog */}
      <SkyDome />
      <SceneFog />

      {/* Ground */}
      <GroundPlane />

      {/* Environment-specific elements */}
      {environmentType === 'stable' && (
        <>
          {/* Stable stalls */}
          <group position={[-3, 0, 0]}>
            <StableStall position={[0, 0, 0]} />
            <StableStall position={[0, 0, -3]} />
            <StableStall position={[0, 0, -6]} />
          </group>

          {/* Fencing */}
          <InstancedFence count={20} length={20} />
        </>
      )}

      {environmentType === 'arena' && (
        <>
          {/* Arena railing */}
          <mesh position={[0, 0.5, 10]} castShadow>
            <boxGeometry args={[20, 1, 0.2]} />
            <meshStandardMaterial color="#ffffff" />
          </mesh>
          <mesh position={[0, 0.5, -10]} castShadow>
            <boxGeometry args={[20, 1, 0.2]} />
            <meshStandardMaterial color="#ffffff" />
          </mesh>

          {/* Arena surface */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} receiveShadow>
            <circleGeometry args={[8, 32]} />
            <meshStandardMaterial color="#c4a777" roughness={1} />
          </mesh>
        </>
      )}

      {environmentType === 'pasture' && (
        <>
          {/* Trees (simplified as cones) */}
          {[...Array(5)].map((_, i) => (
            <group
              key={i}
              position={[
                (Math.random() - 0.5) * 20,
                0,
                (Math.random() - 0.5) * 20,
              ]}
            >
              <mesh position={[0, 2, 0]} castShadow>
                <cylinderGeometry args={[0.3, 0.4, 4]} />
                <meshStandardMaterial color="#8B4513" />
              </mesh>
              <mesh position={[0, 4.5, 0]} castShadow>
                <coneGeometry args={[2, 3, 8]} />
                <meshStandardMaterial color="#228B22" />
              </mesh>
            </group>
          ))}
        </>
      )}

      {/* Camera preset buttons */}
      {cameraPresets.map((preset, index) => (
        <Html
          key={preset.id}
          position={[preset.position[0] * 0.8, preset.position[1] + 1, preset.position[2]]}
        >
          <button
            onClick={() => onPresetChange(index)}
            className={`px-3 py-1 rounded text-xs transition-colors ${
              activePreset === index
                ? 'bg-gold text-midnight'
                : 'bg-midnight/80 text-white hover:bg-gold/80'
            }`}
            aria-label={`Switch to ${preset.name}`}
          >
            {preset.name}
          </button>
        </Html>
      ))}

      {/* Lighting */}
      <ambientLight intensity={0.3} />
      <directionalLight
        position={[10, 10, 5]}
        intensity={0.8}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={50}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
      />
    </>
  )
}

/**
 * Environment Scene Component
 *
 * Immersive 3D environment with stable, arena, or pasture settings.
 * Features interactive elements, multiple camera views, and optimized rendering.
 *
 * @example
 * ```tsx
 * <EnvironmentScene
 *   environmentType="stable"
 *   description="Interactive 3D stable environment"
 * />
 * ```
 */
export function EnvironmentScene({
  environmentType = 'stable',
  cameraPresets = DEFAULT_CAMERA_PRESETS,
  allowNavigation = true,
  className,
  height = '600px',
  description = '3D environment scene',
}: EnvironmentSceneProps) {
  const [activePreset, setActivePreset] = useState(0)
  const cameraRef = useRef<THREE.PerspectiveCamera>(null)
  const { shouldReduceMotion } = useMotion()

  // Generate aria-label
  const ariaLabel = generateAriaLabel(description, allowNavigation)

  // Smooth camera transition
  useFrame((state) => {
    if (shouldReduceMotion || !cameraRef.current) return

    const target = cameraPresets[activePreset]
    const targetPosition = new Vector3(...target.position)
    const currentTarget = new Vector3(...target.target)

    // Smooth interpolation
    cameraRef.current.position.lerp(targetPosition, 0.05)
    cameraRef.current.lookAt(currentTarget)
  })

  return (
    <div
      className={className}
      style={{ height }}
      role="region"
      aria-label={ariaLabel}
    >
      <CanvasWrapper
        cameraPosition={cameraPresets[0].position}
        ariaLabel={`${description} viewer`}
        shadows
      >
        <Suspense
          fallback={
            <div className="flex items-center justify-center h-full">
              <p className="text-white">Loading environment...</p>
            </div>
          }
        >
          <DreiPerspectiveCamera ref={cameraRef} makeDefault position={cameraPresets[0].position} />

          <EnvironmentContent
            environmentType={environmentType}
            cameraPresets={cameraPresets}
            activePreset={activePreset}
            onPresetChange={setActivePreset}
          />
        </Suspense>
      </CanvasWrapper>

      {/* Keyboard navigation instructions */}
      {allowNavigation && (
        <p className="sr-only">
          Use camera view buttons to switch between different perspectives.
        </p>
      )}
    </div>
  )
}
