import Lenis from 'lenis'
import type { LenisOptions } from 'lenis'
import { prefersReducedMotion } from './utils'
import { SCROLL } from './constants'

/**
 * Lenis smooth scroll configuration for luxury scroll experience
 */

/**
 * Default Lenis configuration
 * Note: Lenis v1 has different options than earlier versions
 */
export const defaultLenisConfig: Partial<LenisOptions> = {
  duration: SCROLL.DURATION,
  easing: SCROLL.EASING,
  smoothWheel: true,
  wheelMultiplier: 1,
  touchMultiplier: SCROLL.SMOOTH_TOUCH_MULTIPLIER,
  infinite: false,
}

/**
 * Creates a new Lenis instance with luxury defaults
 * @param config - Optional configuration overrides
 * @returns Lenis instance or null if reduced motion is preferred
 */
export function createLuxuryLenis(config?: Partial<LenisOptions>): Lenis | null {
  if (prefersReducedMotion()) {
    return null
  }

  const lenis = new Lenis({
    ...defaultLenisConfig,
    ...config,
  })

  return lenis
}

/**
 * Integrates Lenis with the requestAnimationFrame loop
 * Call this in your animation loop or use the provided hook
 * @param lenis - Lenis instance
 * @param time - Current time from requestAnimationFrame
 */
export function rafLoop(lenis: Lenis | null, time: number): void {
  lenis?.raf(time)
}

/**
 * Scrolls to a specific element with smooth animation
 * @param lenis - Lenis instance
 * @param target - Target element ID, selector, or position
 * @param options - Scroll options
 */
export function scrollTo(
  lenis: Lenis | null,
  target: string | number,
  options?: {
    offset?: number
    duration?: number
    easing?: (t: number) => number
    immediate?: boolean
    lock?: boolean
    onComplete?: () => void
  }
): void {
  if (!lenis) {
    // Fallback to native scroll if Lenis is not available
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
}

/**
 * Starts the Lenis scroll animation
 * @param lenis - Lenis instance
 */
export function startScroll(lenis: Lenis | null): void {
  lenis?.start()
}

/**
 * Stops the Lenis scroll animation
 * @param lenis - Lenis instance
 */
export function stopScroll(lenis: Lenis | null): void {
  lenis?.stop()
}

/**
 * Destroys the Lenis instance and cleans up
 * @param lenis - Lenis instance to destroy
 */
export function destroyLenis(lenis: Lenis | null): void {
  lenis?.destroy()
}

/**
 * Gets the current scroll position
 * @param lenis - Lenis instance
 * @returns Current scroll position or 0 if not available
 */
export function getScrollPosition(lenis: Lenis | null): number {
  return lenis?.scroll ?? window.scrollY
}

/**
 * Gets the scroll velocity (pixels per second)
 * @param lenis - Lenis instance
 * @returns Current velocity or 0 if not available
 */
export function getScrollVelocity(lenis: Lenis | null): number {
  return lenis?.velocity ?? 0
}

/**
 * Checks if the scroll is currently animated (not idle)
 * @param lenis - Lenis instance
 * @returns True if scrolling is in progress
 */
export function isScrolling(lenis: Lenis | null): boolean {
  if (!lenis) return false
  return lenis.isScrolling === true
}
