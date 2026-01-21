'use client'

import { useRef, useEffect, RefObject } from 'react'
import { useMotion } from '@/components/providers/MotionProvider'

/**
 * Options for scrollytelling hook
 */
export interface ScrollytellingOptions {
  /** Start position for ScrollTrigger (default: 'top top') */
  start?: string
  /** End position for ScrollTrigger (default: 'bottom top') */
  end?: string
  /** Scrub animation to scroll progress (true, false, or number in seconds) */
  scrub?: boolean | number
  /** Pin the element during animation */
  pin?: boolean
  /** Trigger markers for debugging */
  markers?: boolean
}

/**
 * Timeline builder function type
 * Receives the GSAP timeline instance to add animations to
 */
export type TimelineBuilder = (timeline: any) => void

/**
 * Custom hook for complex scroll-based animation timelines
 * Creates a GSAP timeline with ScrollTrigger that can be customized
 * via the builder function
 *
 * @param builder - Function that receives the timeline for adding animations
 * @param options - ScrollTrigger configuration options
 * @returns A ref that should be attached to the container element
 *
 * @example
 * ```tsx
 * function ScrollytellingSection() {
 *   const containerRef = useScrollytelling((timeline) => {
 *     timeline.to('.horse-image', {
 *       scale: 2,
 *       rotation: 360,
 *       duration: 1,
 *     })
 *     timeline.to('.title', { opacity: 1 }, 0.25)
 *     timeline.to('.title', { opacity: 0 }, 0.75)
 *   }, {
 *     scrub: true,
 *     pin: true,
 *   })
 *
 *   return (
 *     <div ref={containerRef} className="scrollytelling-section">
 *       <img src="/horse.jpg" className="horse-image" />
 *       <h2 className="title">Animating Title</h2>
 *     </div>
 *   )
 * }
 * ```
 */
export function useScrollytelling(
  builder: TimelineBuilder,
  options: ScrollytellingOptions = {}
): RefObject<HTMLDivElement | null> {
  const { shouldReduceMotion } = useMotion()
  const containerRef = useRef<HTMLDivElement>(null)
  const timelineRef = useRef<any>(null)

  useEffect(() => {
    // Skip setup if motion is reduced
    if (shouldReduceMotion) {
      return
    }

    // Skip if container is not ready
    if (!containerRef.current) {
      return
    }

    const setupTimeline = async () => {
      // Dynamic import to avoid SSR issues
      const { gsap } = await import('gsap')
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')

      gsap.registerPlugin(ScrollTrigger)

      // Create timeline with ScrollTrigger
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: options.start || 'top top',
          end: options.end || 'bottom top',
          scrub: options.scrub !== undefined ? options.scrub : true,
          pin: options.pin || false,
          markers: options.markers || false,
        },
      })

      // Store timeline ref for cleanup
      timelineRef.current = timeline

      // Call the builder function to add animations
      builder(timeline)
    }

    setupTimeline()

    // Cleanup function
    return () => {
      if (timelineRef.current) {
        timelineRef.current.kill()
        // Also kill the associated ScrollTrigger
        const trigger = timelineRef.current.scrollTrigger
        if (trigger) {
          trigger.kill()
        }
        timelineRef.current = null
      }
    }
  }, [builder, shouldReduceMotion, options.end, options.markers, options.pin, options.scrub, options.start])

  return containerRef
}

/**
 * Hook for creating multiple synchronized scrollytelling timelines
 * Useful for complex sections with multiple animated elements
 *
 * @param builders - Array of timeline builder functions
 * @param options - Shared ScrollTrigger configuration options
 * @returns Array of refs that should be attached to container elements
 *
 * @example
 * ```tsx
 * function ComplexSection() {
 *   const [container1Ref, container2Ref] = useScrollytellingGroup([
 *     (timeline) => {
 *       timeline.to('.image-1', { scale: 1.5 })
 *     },
 *     (timeline) => {
 *       timeline.to('.image-2', { rotation: 180 })
 *     }
 *   ], { scrub: true, pin: true })
 *
 *   return (
 *     <>
 *       <div ref={container1Ref}><img className="image-1" /></div>
 *       <div ref={container2Ref}><img className="image-2" /></div>
 *     </>
 *   )
 * }
 * ```
 */
export function useScrollytellingGroup(
  builders: TimelineBuilder[],
  options: ScrollytellingOptions = {}
): RefObject<HTMLDivElement | null>[] {
  const hooks = builders.map((builder) => useScrollytelling(builder, options))
  return hooks
}
