'use client'

import React, { useRef, useEffect } from 'react'
import { useMotion } from '@/components/providers/MotionProvider'
import { cn } from '@/lib/utils'

/**
 * Props for ParallaxSection component
 */
export interface ParallaxSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Speed ranging from -1 to 1 where 0 means no movement */
  speed: number
  /** Child elements */
  children: React.ReactNode
  /** Additional class names */
  className?: string
}

/**
 * Parallax Section Component
 *
 * Creates a parallax effect where elements move at different speeds during scroll.
 * Negative speed values move the element up as user scrolls down (slower than scroll).
 * Positive speed values move the element down as user scrolls down (faster than scroll).
 *
 * @example
 * ```tsx
 * <ParallaxSection speed={-0.5}>
 *   <img src="/background.jpg" alt="" />
 * </ParallaxSection>
 *
 * <ParallaxSection speed={0.3}>
 *   <h2>This text moves faster than scroll</h2>
 * </ParallaxSection>
 * ```
 */
export function ParallaxSection({
  speed,
  children,
  className,
  ...props
}: ParallaxSectionProps) {
  const { shouldReduceMotion } = useMotion()
  const elementRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Render static element if motion is reduced
    if (shouldReduceMotion) {
      return
    }

    if (!elementRef.current) {
      return
    }

    const setupParallax = async () => {
      // Dynamic import to avoid SSR issues
      const { gsap } = await import('gsap')
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')

      gsap.registerPlugin(ScrollTrigger)

      const element = elementRef.current
      if (!element) return

      // Calculate y-position based on scroll
      // Speed -1: moves up (opposite to scroll direction)
      // Speed 0: no movement
      // Speed 1: moves down (same as scroll direction)
      const yMovement = speed * 100 // Percentage of viewport height

      // Create the parallax animation
      gsap.to(element, {
        yPercent: yMovement,
        ease: 'none',
        scrollTrigger: {
          trigger: element,
          start: 'top bottom', // When element's top hits viewport bottom
          end: 'bottom top', // When element's bottom hits viewport top
          scrub: true, // Smooth scroll-linked animation
        },
      })
    }

    setupParallax()

    // Cleanup function
    return () => {
      // Kill ScrollTrigger on unmount
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.trigger === elementRef.current) {
          trigger.kill()
        }
      })
    }
  }, [speed, shouldReduceMotion])

  return (
    <div ref={elementRef} className={cn('parallax-section', className)} {...props}>
      {children}
    </div>
  )
}
