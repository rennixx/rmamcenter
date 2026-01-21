'use client'

import { useEffect, useRef } from 'react'
import { useMotion } from '@/components/providers/MotionProvider'
import { initGsapWithScrollTrigger } from '@/lib/gsap'

/**
 * Custom hook to initialize GSAP ScrollTrigger with Lenis synchronization
 * Should be called once in a parent component to set up scroll-based animations
 *
 * @param lenis - Optional Lenis instance for scroll synchronization
 *
 * @example
 * ```tsx
 * function App() {
 *   const lenisRef = useLenis()
 *   useScrollTrigger(lenisRef.current)
 *
 *   return <PageContent />
 * }
 * ```
 */
export function useScrollTrigger(
  lenis?: { scroll: number; onScroll: (callback: () => void) => void } | null
) {
  const { shouldReduceMotion } = useMotion()
  const cleanupRef = useRef<(() => void) | null>(null)

  useEffect(() => {
    if (shouldReduceMotion) {
      return
    }

    // Initialize GSAP with ScrollTrigger and Lenis integration
    cleanupRef.current = initGsapWithScrollTrigger(lenis || undefined)

    // Cleanup on unmount
    return () => {
      cleanupRef.current?.()
    }
  }, [lenis, shouldReduceMotion])
}

/**
 * Options for scroll-triggered animations
 */
export interface ScrollAnimationOptions {
  /** Start position for ScrollTrigger (default: 'top 80%') */
  start?: string
  /** End position for ScrollTrigger (default: 'bottom 20%') */
  end?: string
  /** Scrub animation to scroll progress (true, false, or number in seconds) */
  scrub?: boolean | number
  /** Pin the element during animation */
  pin?: boolean
  /** Toggle actions string */
  toggleActions?: string
  /** Trigger markers for debugging */
  markers?: boolean
  /** Whether animation should only trigger once */
  once?: boolean
}

/**
 * Hook to create a scroll-triggered animation with automatic cleanup
 *
 * @param callback - Function that receives GSAP context for setting up animations
 * @param options - ScrollTrigger configuration options
 * @param deps - Additional dependencies for re-running the effect
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const containerRef = useScrollAnimation((context) => {
 *     context.from('.fade-in', {
 *       opacity: 0,
 *       y: 50,
 *       scrollTrigger: {
 *         trigger: containerRef.current,
 *         start: 'top 80%',
 *       }
 *     })
 *   })
 *
 *   return <div ref={containerRef}>Content</div>
 * }
 * ```
 */
export function useScrollAnimation(
  callback: (context: any) => void,
  options: ScrollAnimationOptions = {},
  deps: any[] = []
) {
  const { shouldReduceMotion } = useMotion()
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (shouldReduceMotion || !containerRef.current) {
      return
    }

    // Dynamic import to avoid SSR issues
    const setupAnimation = async () => {
      const { gsap } = await import('gsap')
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')

      gsap.registerPlugin(ScrollTrigger)

      const context = gsap.context(() => {
        callback({
          gsap,
          ScrollTrigger,
          container: containerRef.current,
        })
      }, containerRef.current ?? undefined)

      return () => {
        context.revert()
      }
    }

    const cleanupPromise = setupAnimation()

    return () => {
      cleanupPromise.then((cleanup) => cleanup?.())
    }
  }, [shouldReduceMotion, callback, ...deps])

  return containerRef
}
