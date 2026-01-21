import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { prefersReducedMotion } from './utils'
import { ANIMATION } from './constants'

/**
 * GSAP configuration with luxury easing and reduced motion support
 */

/**
 * Default GSAP tween configuration that respects reduced motion preferences
 */
export const defaultTweenConfig = {
  duration: ANIMATION.DURATION_DEFAULT,
  ease: 'luxury' as string,
  overwrite: 'auto' as const,
}

/**
 * GSAP ScrollTrigger configuration (if plugin is loaded)
 * Respects reduced motion by disabling scroll-triggered animations
 */
export const scrollTriggerConfig = {
  start: 'top 80%',
  end: 'bottom 20%',
  toggleActions: 'play none none reverse' as const,
}

/**
 * Creates a GSAP context that respects reduced motion preferences
 * @param scope - The scope element for the context
 * @param callback - Function to execute within the context
 * @returns GSAPContext or null if reduced motion is enabled
 */
export function createLuxuryContext<T>(
  scope: Element | string | object | null | undefined,
  callback: (context: gsap.Context) => T
): gsap.Context | null {
  if (prefersReducedMotion()) {
    // Return a mock context that does nothing
    return null
  }

  return gsap.context(callback, scope ?? undefined)
}

/**
 * Creates a timeline with luxury defaults
 * @param config - Optional timeline configuration
 * @returns GSAP timeline
 */
export function createLuxuryTimeline(config?: gsap.TimelineVars): ReturnType<typeof gsap.timeline> {
  const defaults = {
    ...defaultTweenConfig,
    ...config,
  }

  return gsap.timeline(defaults)
}

/**
 * Creates a quick tween with default luxury configuration
 * @param targets - Target elements or objects
 * @param vars - Animation properties
 * @returns GSAP tween
 */
export function quickTween(
  targets: gsap.TweenTarget,
  vars: gsap.TweenVars = {}
): ReturnType<typeof gsap.to> {
  return gsap.to(targets, {
    ...defaultTweenConfig,
    ...vars,
  })
}

/**
 * Staggers animation for multiple targets with luxury timing
 * @param targets - Target elements or objects
 * @param vars - Animation properties
 * @param staggerAmount - Stagger delay in seconds (defaults to ANIMATION.STAGGER_DEFAULT)
 * @returns GSAP tween
 */
export function staggerTween(
  targets: gsap.TweenTarget,
  vars: gsap.TweenVars = {},
  staggerAmount: number = ANIMATION.STAGGER_DEFAULT
): ReturnType<typeof gsap.to> {
  return gsap.to(targets, {
    ...defaultTweenConfig,
    ...vars,
    stagger: staggerAmount,
  })
}

/**
 * Registers GSAP plugins (optional)
 * Call this during app initialization if you have ScrollTrigger, ScrollTo, etc.
 * @param plugins - Array of GSAP plugins to register
 */
export function registerGsapPlugins(...plugins: gsap.Plugin[]): void {
  gsap.registerPlugin(...plugins)
}

/**
 * Initialize GSAP with ScrollTrigger and Lenis integration
 * Call this in a useEffect hook on component mount
 * @param lenis - Optional Lenis instance for scroll synchronization
 * @returns Cleanup function that kills all ScrollTriggers
 */
export function initGsapWithScrollTrigger(lenis?: { scroll: number; onScroll: (callback: () => void) => void }): () => void {
  if (typeof window === 'undefined') return () => {}

  // Register ScrollTrigger plugin
  gsap.registerPlugin(ScrollTrigger)

  // Set default GSAP animation properties
  gsap.defaults({
    ease: 'power2.out',
    duration: 1,
  })

  // Configure ScrollTrigger to ignore mobile resize events
  ScrollTrigger.config({
    ignoreMobileResize: true,
  })

  // Synchronize ScrollTrigger with Lenis if provided
  if (lenis) {
    ScrollTrigger.scrollerProxy(window, {
      scrollTop(value?: number) {
        if (typeof value === 'number') {
          lenis.scroll = value
        }
        return lenis.scroll
      },
      getBoundingClientRect() {
        return {
          top: 0,
          left: 0,
          width: window.innerWidth,
          height: window.innerHeight,
        } as DOMRect
      },
      pinType: document.body.style.transform ? 'fixed' : 'fixed',
    })

    // Update ScrollTrigger on Lenis scroll
    lenis.onScroll(ScrollTrigger.update)
  }

  // Return cleanup function
  return () => {
    ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
  }
}

/**
 * Custom cubic-bezier easing for luxury animations
 * Matches the Tailwind 'luxury' timing function: cubic-bezier(0.4, 0.0, 0.2, 1)
 */
gsap.registerEase('luxury', (progress: number) => {
  // Cubic bezier approximation for (0.4, 0.0, 0.2, 1)
  const t = progress
  const t2 = t * t
  const t3 = t2 * t
  return -2 * t3 + 3 * t2
})

/**
 * Easing function for luxury-out: cubic-bezier(0.0, 0.0, 0.2, 1)
 */
gsap.registerEase('luxury.out', (progress: number) => {
  const t = progress
  const t2 = t * t
  const t3 = t2 * t
  return 1 + (t3 - 1) * 3
})

/**
 * Easing function for luxury-in: cubic-bezier(0.4, 0.0, 1, 1)
 */
gsap.registerEase('luxury.in', (progress: number) => {
  const t = progress
  const t2 = t * t
  return t2 * (3 - 2 * t)
})

/**
 * Cleanup utility for GSAP contexts in React components
 * @param context - GSAP context to revert
 */
export function cleanupContext(context: gsap.Context | null): void {
  context?.revert()
}
