'use client'

import React, { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useMotion } from '@/components/providers/MotionProvider'
import { CanvasWrapper } from './canvas-wrapper'
import { generateAriaLabel } from '@/lib/three-helpers'

/**
 * Animation mapping from scroll progress to object properties
 */
export interface ScrollAnimation {
  /** Target object ref */
  target: React.RefObject<THREE.Object3D | null>
  /** Property to animate */
  property: 'rotation' | 'position' | 'scale'
  /** Axis to animate (x, y, or z) */
  axis: 'x' | 'y' | 'z'
  /** Value at scroll start (progress 0) */
  startValue: number
  /** Value at scroll end (progress 1) */
  endValue: number
}

/**
 * Props for ScrollControlled3D component
 */
export interface ScrollControlled3DProps {
  /** 3D content to render */
  children: React.ReactNode
  /** Scroll range in pixels (height of scroll section) */
  scrollRange?: number
  /** Animations to apply based on scroll progress */
  animations?: ScrollAnimation[]
  /** GSAP ScrollTrigger start position */
  startPosition?: string
  /** GSAP ScrollTrigger end position */
  endPosition?: string
  /** Whether to pin the 3D scene during scroll */
  pin?: boolean
  /** Additional class names */
  className?: string
  /** Custom height */
  height?: string
  /** Accessibility description */
  description?: string
}

/**
 * Scroll Animation Controller
 * Manages object animations based on scroll progress
 */
function ScrollAnimationController({
  scrollProgress,
  animations,
}: {
  scrollProgress: number
  animations?: ScrollAnimation[]
}) {
  const { shouldReduceMotion } = useMotion()

  useFrame(() => {
    if (shouldReduceMotion || !animations) return

    animations.forEach((animation) => {
      const { target, property, axis, startValue, endValue } = animation

      if (!target.current) return

      // Calculate interpolated value based on scroll progress
      const value = startValue + (endValue - startValue) * scrollProgress

      // Apply to target
      if (property === 'rotation') {
        target.current.rotation[axis] = value
      } else if (property === 'position') {
        target.current.position[axis] = value
      } else if (property === 'scale') {
        target.current.scale[axis] = value
      }
    })
  })

  return null
}

/**
 * 3D Scene Container
 * Wraps 3D content and manages scroll progress state
 */
function ScrollControlledScene({
  children,
  scrollProgress,
  animations,
}: {
  children: React.ReactNode
  scrollProgress: number
  animations?: ScrollAnimation[]
}) {
  return (
    <>
      <ScrollAnimationController scrollProgress={scrollProgress} animations={animations} />
      {children}
    </>
  )
}

/**
 * Scroll Controller Hook
 * Manages scroll progress state from GSAP ScrollTrigger
 */
function useScrollProgress() {
  const scrollProgressRef = useRef<number>(0)
  const progressRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!progressRef.current) return

    let gsap: any
    let ScrollTrigger: any

    const setupScrollTrigger = async () => {
      try {
        const gsapModule = await import('gsap')
        const scrollTriggerModule = await import('gsap/ScrollTrigger')

        gsap = gsapModule.gsap
        ScrollTrigger = scrollTriggerModule.ScrollTrigger

        gsap.registerPlugin(ScrollTrigger)

        // Create a proxy object to track scroll progress
        const proxy = { progress: 0 }

        ScrollTrigger.create({
          trigger: progressRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: true,
          onUpdate: (self: any) => {
            proxy.progress = self.progress
            scrollProgressRef.current = self.progress
          },
        })

        return () => {
          ScrollTrigger.getAll().forEach((trigger: any) => trigger.kill())
        }
      } catch (error) {
        console.error('Failed to setup scroll trigger:', error)
        return () => {}
      }
    }

    const cleanupPromise = setupScrollTrigger()

    return () => {
      cleanupPromise.then((cleanup) => cleanup?.())
    }
  }, [])

  return { scrollProgress: scrollProgressRef.current, progressRef }
}

/**
 * Example: Rotating Horse Component
 * Demonstrates scroll-controlled 3D animation
 */
export function RotatingHorse({
  modelPath,
}: {
  modelPath: string
}) {
  const horseRef = useRef<THREE.Group>(null)

  return (
    <group ref={horseRef} position={[0, 0, 0]}>
      {/* Your horse model would go here */}
      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>
    </group>
  )
}

/**
 * Scroll Controlled 3D Component
 *
 * Synchronizes 3D animations with scroll position using GSAP ScrollTrigger.
 * Objects can rotate, move, or scale based on scroll progress.
 *
 * @example
 * ```tsx
 * const horseRef = useRef<THREE.Group>(null)
 *
 * <ScrollControlled3D
 *   animations={[
 *     {
 *       target: horseRef,
 *       property: 'rotation',
 *       axis: 'y',
 *       startValue: 0,
 *       endValue: Math.PI * 2, // 360 degrees
 *     }
 *   ]}
 * >
 *   <group ref={horseRef}>
 *     <HorseModel modelPath="/models/horse.glb" />
 *   </group>
 * </ScrollControlled3D>
 * ```
 */
export function ScrollControlled3D({
  children,
  scrollRange = 1000,
  animations,
  startPosition = 'top top',
  endPosition = 'bottom bottom',
  pin = true,
  className,
  height = '100vh',
  description = 'Scroll-controlled 3D animation',
}: ScrollControlled3DProps) {
  const { shouldReduceMotion } = useMotion()
  const scrollProgressRef = useRef<number>(0)
  const containerRef = useRef<HTMLDivElement>(null)

  // Generate aria-label
  const ariaLabel = generateAriaLabel(description, !shouldReduceMotion)

  // Setup GSAP ScrollTrigger
  useEffect(() => {
    if (shouldReduceMotion || !containerRef.current) return

    let gsap: any
    let ScrollTrigger: any

    const setupScrollTrigger = async () => {
      try {
        const gsapModule = await import('gsap')
        const scrollTriggerModule = await import('gsap/ScrollTrigger')

        gsap = gsapModule.gsap
        ScrollTrigger = scrollTriggerModule.ScrollTrigger

        gsap.registerPlugin(ScrollTrigger)

        // Create ScrollTrigger for progress tracking
        ScrollTrigger.create({
          trigger: containerRef.current,
          start: startPosition,
          end: endPosition,
          scrub: true,
          onUpdate: (self: any) => {
            scrollProgressRef.current = self.progress
          },
        })

        return () => {
          ScrollTrigger.getAll().forEach((trigger: any) => trigger.kill())
        }
      } catch (error) {
        console.error('Failed to setup scroll trigger:', error)
        return () => {}
      }
    }

    const cleanupPromise = setupScrollTrigger()

    return () => {
      cleanupPromise.then((cleanup) => cleanup?.())
    }
  }, [shouldReduceMotion, startPosition, endPosition])

  // Render scroll-controlled 3D scene
  return (
    <div
      ref={containerRef}
      className={className}
      style={{ height: pin ? scrollRange : height }}
      role="region"
      aria-label={ariaLabel}
    >
      {pin ? (
        <div className="sticky top-0" style={{ height }}>
          <CanvasWrapper
            cameraPosition={[0, 2, 5]}
            ariaLabel={`${description} viewer`}
          >
            <ScrollControlledScene
              scrollProgress={scrollProgressRef.current}
              animations={shouldReduceMotion ? undefined : animations}
            >
              {children}
            </ScrollControlledScene>
          </CanvasWrapper>
        </div>
      ) : (
        <CanvasWrapper
          cameraPosition={[0, 2, 5]}
          ariaLabel={`${description} viewer`}
          style={{ height }}
        >
          <ScrollControlledScene
            scrollProgress={scrollProgressRef.current}
            animations={shouldReduceMotion ? undefined : animations}
          >
            {children}
          </ScrollControlledScene>
        </CanvasWrapper>
      )}
    </div>
  )
}

/**
 * Example Scrollytelling Section
 * Demonstrates a horse rotating 360 degrees during scroll
 *
 * @example
 * ```tsx
 * function ExampleScrollytelling() {
 *   const horseRef = useRef<THREE.Group>(null)
 *   const containerRef = useScrollytelling((timeline) => {
 *     // Add GSAP animations to timeline
 *     timeline.to('.background', {
 *       backgroundColor: '#1a3a2e',
 *       duration: 1,
 *     })
 *   }, {
 *     scrub: true,
 *     pin: true,
 *   })
 *
 *   return (
 *     <div ref={containerRef} className="scrollytelling-section">
 *       <ScrollControlled3D
 *         animations={[
 *           {
 *             target: horseRef,
 *             property: 'rotation',
 *             axis: 'y',
 *             startValue: 0,
 *             endValue: Math.PI * 2,
 *           }
 *         ]}
 *       >
 *         <group ref={horseRef}>
 *           <HorseModel modelPath="/models/horse.glb" />
 *         </group>
 *       </ScrollControlled3D>
 *     </div>
 *   )
 * }
 * ```
 */
export function ScrollytellingHorse() {
  const horseRef = useRef<THREE.Group>(null)

  return (
    <ScrollControlled3D
      animations={[
        {
          target: horseRef,
          property: 'rotation',
          axis: 'y',
          startValue: 0,
          endValue: Math.PI * 2, // Full 360 rotation
        },
      ]}
      description="Horse rotating 360 degrees as you scroll"
      scrollRange={2000}
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
      <group ref={horseRef}>
        <mesh castShadow>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="#8B4513" />
        </mesh>
      </group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
        <planeGeometry args={[10, 10]} />
        <meshStandardMaterial color="#1a3a2e" />
      </mesh>
    </ScrollControlled3D>
  )
}
