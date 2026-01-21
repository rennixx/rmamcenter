'use client'

import { useRef, useEffect, useCallback } from 'react'
import Lenis from 'lenis'
import { useMotion } from '@/components/providers/MotionProvider'
import { SCROLL } from '@/lib/constants'

/**
 * Custom React hook that initializes and manages Lenis smooth scrolling.
 * Respects user motion preferences and provides a luxury inertial scroll experience.
 *
 * @returns A ref containing the Lenis instance for potential external control
 *
 * @example
 * ```tsx
 * function App() {
 *   const lenisRef = useLenis()
 *
 *   const handleClick = () => {
 *     lenisRef.current?.scrollTo(0)
 *   }
 *
 *   return <button onClick={handleClick}>Scroll to top</button>
 * }
 * ```
 */
export function useLenis() {
  const { shouldReduceMotion } = useMotion()
  const lenisRef = useRef<Lenis | null>(null)
  const rafIdRef = useRef<number | null>(null)

  useEffect(() => {
    // Skip initialization entirely if reduced motion is preferred
    if (shouldReduceMotion) {
      return
    }

    // Initialize Lenis with luxury configuration
    const lenis = new Lenis({
      duration: SCROLL.DURATION,
      easing: SCROLL.EASING,
      orientation: 'vertical' as const,
      smoothWheel: true,
      wheelMultiplier: SCROLL.SMOOTH_MULTIPLIER,
      touchMultiplier: SCROLL.SMOOTH_TOUCH_MULTIPLIER,
      infinite: false,
    })

    // Store the instance in ref
    lenisRef.current = lenis

    // Start requestAnimationFrame loop
    function raf(time: number) {
      lenis.raf(time)
      rafIdRef.current = requestAnimationFrame(raf)
    }

    rafIdRef.current = requestAnimationFrame(raf)

    // Cleanup function
    return () => {
      // Cancel animation frame
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current)
        rafIdRef.current = null
      }

      // Destroy Lenis instance
      lenis.destroy()
      lenisRef.current = null
    }
  }, [shouldReduceMotion])

  return lenisRef
}

/**
 * Hook that provides programmatic scroll control with Lenis
 * Falls back to native smooth scroll if Lenis is not available
 *
 * @returns Object containing scroll control functions
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { scrollTo, scrollToTop, scrollToElement } = useLenisScroll()
 *
 *   return (
 *     <>
 *       <button onClick={() => scrollTo(500)}>Scroll to 500px</button>
 *       <button onClick={scrollToTop}>Scroll to top</button>
 *       <button onClick={() => scrollToElement('#about')}>Scroll to About</button>
 *     </>
 *   )
 * }
 * ```
 */
export function useLenisScroll() {
  const lenisRef = useLenis()

  /**
   * Scroll to a specific position
   */
  const scrollTo = useCallback(
    (
      target: string | number,
      options?: {
        offset?: number
        duration?: number
        easing?: (t: number) => number
        immediate?: boolean
        lock?: boolean
        onComplete?: () => void
      }
    ) => {
      const lenis = lenisRef.current

      if (!lenis) {
        // Fallback to native scroll
        if (typeof target === 'number') {
          window.scrollTo({ top: target, behavior: 'smooth' })
        } else if (typeof target === 'string') {
          const element = document.querySelector(target)
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' })
          }
        }
        return
      }

      lenis.scrollTo(target, options)
    },
    [lenisRef]
  )

  /**
   * Scroll to the top of the page
   */
  const scrollToTop = useCallback(() => {
    scrollTo(0)
  }, [scrollTo])

  /**
   * Scroll to a specific element by selector
   */
  const scrollToElement = useCallback(
    (selector: string, options?: Parameters<typeof scrollTo>[1]) => {
      scrollTo(selector, options)
    },
    [scrollTo]
  )

  return {
    scrollTo,
    scrollToTop,
    scrollToElement,
    lenis: lenisRef.current,
  }
}
