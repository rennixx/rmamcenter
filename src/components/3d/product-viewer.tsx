'use client'

import React, { useState, useRef, Suspense } from 'react'
import { useGLTF, OrbitControls, Html, useEnvironment, ContactShadows } from '@react-three/drei'
import * as THREE from 'three'
import { useMotion } from '@/components/providers/MotionProvider'
import { CanvasWrapper } from './canvas-wrapper'
import { createProductViewCamera, createOrbitConstraints, generateAriaLabel } from '@/lib/three-helpers'

/**
 * Hotspot data structure for product feature annotations
 */
export interface Hotspot {
  /** Unique identifier */
  id: string
  /** Position in 3D space [x, y, z] */
  position: [number, number, number]
  /** Title of the feature */
  title: string
  /** Description of the feature */
  description: string
}

/**
 * Props for ProductViewer component
 */
export interface ProductViewerProps {
  /** Path to the 3D model file (.glb or .gltf) */
  modelPath: string
  /** Type of product (saddle, bridle, etc.) */
  productType: string
  /** Product name for accessibility */
  productName: string
  /** Hotspots for feature annotations */
  hotspots?: Hotspot[]
  /** Additional class names */
  className?: string
  /** Custom height */
  height?: string
}

/**
 * Loading Component
 * Displays loading progress while model downloads
 */
function LoadingOverlay() {
  return (
    <Html center>
      <div className="flex flex-col items-center gap-2 bg-midnight/90 px-6 py-4 rounded-lg">
        <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
        <p className="text-white text-sm">Loading 3D model...</p>
      </div>
    </Html>
  )
}

/**
 * Hotspot Component
 * Interactive annotation point on the 3D model
 */
function ProductHotspot({
  position,
  title,
  description,
  onClick,
}: {
  position: [number, number, number]
  title: string
  description: string
  onClick?: () => void
}) {
  const [hovered, setHovered] = useState(false)
  const [selected, setSelected] = useState(false)

  return (
    <group position={position}>
      {/* Visible hotspot marker */}
      <mesh
        onClick={(e) => {
          e.stopPropagation()
          setSelected(!selected)
          onClick?.()
        }}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshStandardMaterial
          color={hovered ? '#d4af37' : '#ffffff'}
          emissive={hovered ? '#d4af37' : '#000000'}
          emissiveIntensity={hovered ? 0.5 : 0}
        />
      </mesh>

      {/* Label on hover/selection */}
      {(hovered || selected) && (
        <Html position={[0, 0.1, 0]} center distanceFactor={10}>
          <div className="bg-midnight/95 px-4 py-2 rounded-lg shadow-xl max-w-xs">
            <h4 className="text-gold font-semibold text-sm mb-1">{title}</h4>
            <p className="text-white text-xs">{description}</p>
          </div>
        </Html>
      )}
    </group>
  )
}

/**
 * Product Model Component
 * Loads and renders the 3D product model
 */
function ProductModel({
  modelPath,
  hotspots = [],
}: {
  modelPath: string
  hotspots?: Hotspot[]
}) {
  const { shouldReduceMotion } = useMotion()
  const groupRef = useRef<THREE.Group>(null)
  const { scene } = useGLTF(modelPath) as any & { scene: THREE.Scene }
  const envMap = useEnvironment({ preset: 'studio' })

  // Apply environment map for realistic reflections
  scene.traverse((child: any) => {
    if (child instanceof THREE.Mesh) {
      child.castShadow = true
      child.receiveShadow = true
      if (child.material) {
        if (Array.isArray(child.material)) {
          child.material.forEach((mat) => {
            mat.envMap = envMap
            mat.envMapIntensity = 1
            mat.needsUpdate = true
          })
        } else {
          child.material.envMap = envMap
          child.material.envMapIntensity = 1
          child.material.needsUpdate = true
        }
      }
    }
  })

  // React to cursor position for subtle interactive lighting
  const handlePointerMove = (event: any) => {
    if (shouldReduceMotion || !groupRef.current) return
    // Subtle rotation based on mouse position
    const x = (event.point?.x || 0) * 0.01
    const y = (event.point?.y || 0) * 0.01
    groupRef.current.rotation.y = x
    groupRef.current.rotation.x = y
  }

  return (
    <group ref={groupRef} onPointerMove={handlePointerMove}>
      <primitive object={scene} />

      {/* Render hotspots */}
      {hotspots.map((hotspot) => (
        <ProductHotspot
          key={hotspot.id}
          position={hotspot.position}
          title={hotspot.title}
          description={hotspot.description}
        />
      ))}
    </group>
  )
}

/**
 * Product Viewer Component
 *
 * Interactive 3D product viewer with orbit controls, zoom, and feature hotspots.
 * Displays equestrian equipment like saddles and bridles in 3D.
 *
 * @example
 * ```tsx
 * <ProductViewer
 *   modelPath="/models/equipment/saddle.glb"
 *   productType="saddle"
 *   productName="English Dressage Saddle"
 *   hotspots={[
 *     { id: '1', position: [0, 0.5, 0], title: 'Seat', description: 'Premium leather seat' }
 *   ]}
 * />
 * ```
 */
export function ProductViewer({
  modelPath,
  productType,
  productName,
  hotspots = [],
  className,
  height = '500px',
}: ProductViewerProps) {
  const { shouldReduceMotion } = useMotion()
  const controlsRef = useRef<any>(null)

  // Generate aria-label for accessibility
  const ariaLabel = generateAriaLabel(
    `3D viewer for ${productName}. Use mouse to rotate, scroll to zoom.`,
    true
  )

  // Reset rotation to default position
  const resetView = () => {
    if (controlsRef.current) {
      controlsRef.current.reset()
    }
  }

  const orbitConstraints = createOrbitConstraints()

  return (
    <div className={className} style={{ height }} role="region" aria-label={ariaLabel}>
      <CanvasWrapper
        cameraPosition={createProductViewCamera()}
        ariaLabel={`${productName} 3D viewer`}
        shadows
      >
        <Suspense fallback={<LoadingOverlay />}>
          {/* Lighting setup */}
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
          <directionalLight position={[-5, 3, -5]} intensity={0.3} color="#ffeebb" />

          {/* 3D Product Model */}
          <ProductModel modelPath={modelPath} hotspots={hotspots} />

          {/* Ground shadow for realism */}
          <ContactShadows
            position={[0, -0.5, 0]}
            opacity={0.5}
            scale={10}
            blur={2}
            far={4}
          />

          {/* Orbit Controls */}
          <OrbitControls
            ref={controlsRef}
            makeDefault
            {...orbitConstraints}
            enableDamping={!shouldReduceMotion}
            dampingFactor={shouldReduceMotion ? 0 : 0.05}
          />

          {/* Reset button */}
          <Html position={[1.5, -0.5, 0]} distanceFactor={10}>
            <button
              onClick={resetView}
              className="bg-midnight/80 hover:bg-gold/80 text-white px-4 py-2 rounded-lg text-sm transition-colors"
              aria-label="Reset view"
            >
              Reset View
            </button>
          </Html>
        </Suspense>
      </CanvasWrapper>

      {/* Keyboard instructions for accessibility */}
      <p className="sr-only">
        Use arrow keys to rotate, plus and minus keys to zoom. Press R to reset view.
      </p>
    </div>
  )
}

// Preload commonly used models for better performance
useGLTF.preload('/models/equipment/saddle.glb')
useGLTF.preload('/models/equipment/bridle.glb')
