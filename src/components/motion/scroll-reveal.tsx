'use client'

import React, { useRef, useEffect } from 'react'
import { useMotion } from '@/components/providers/MotionProvider'
import { cn } from '@/lib/utils'

/**
 * Props for ScrollReveal component
 */
export interface ScrollRevealProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Delay before animation starts (in ms) */
  delay?: number
  /** Delay between each child animation (in ms) */
  stagger?: number
  /** Viewport percentage required for trigger (0-1) */
  threshold?: number
  /** Child elements */
  children: React.ReactNode
  /** Additional class names */
  className?: string
}

/**
 * Scroll Reveal Component
 *
 * Reveals elements as they enter the viewport with optional staggered timing.
 * Children elements animate from opacity 0 and y-position 50 to opacity 1 and y-position 0.
 *
 * @example
 * ```tsx
 * <ScrollReveal stagger={100} threshold={0.2}>
 *   <div>Item 1</div>
 *   <div>Item 2</div>
 *   <div>Item 3</div>
 * </ScrollReveal>
 *
 * <ScrollReveal delay={200}>
 *   <h2>This fades in with a delay</h2>
 * </ScrollReveal>
 * ```
 */
export function ScrollReveal({
  delay = 0,
  stagger = 0,
  threshold = 0.1,
  children,
  className,
  ...props
}: ScrollRevealProps) {
  const { shouldReduceMotion } = useMotion()
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) {
      return
    }

    // Motion-reduced variant: instantly set opacity to 1
    if (shouldReduceMotion) {
      const children = Array.from(containerRef.current.children)
      children.forEach((child) => {
        if (child instanceof HTMLElement) {
          child.style.opacity = '1'
          child.style.transform = 'translateY(0)'
        }
      })
      return
    }

    const setupReveal = async () => {
      // Dynamic import to avoid SSR issues
      const { gsap } = await import('gsap')
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')

      gsap.registerPlugin(ScrollTrigger)

      const container = containerRef.current
      if (!container) return

      // Convert threshold percentage to ScrollTrigger position
      // threshold 0.1 = 'top 90%' (trigger at 10% from bottom)
      const triggerPosition = `${Math.round((1 - threshold) * 100)}%`

      // Get child elements
      const children = gsap.utils.toArray(container.children)

      if (children.length === 0) return

      // Create the reveal animation
      gsap.from(children, {
        opacity: 0,
        y: 50,
        ease: 'power3.out',
        delay: delay / 1000, // Convert ms to seconds
        stagger: stagger / 1000, // Convert ms to seconds
        scrollTrigger: {
          trigger: container,
          start: `top ${triggerPosition}`,
          toggleActions: 'play none none none', // Animation only plays once
        },
      })
    }

    setupReveal()

    // Cleanup function - kill ScrollTriggers on unmount
    return () => {
      // Dynamic import cleanup
      import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
        ScrollTrigger.getAll().forEach((trigger) => {
          if (trigger.trigger === containerRef.current) {
            trigger.kill()
          }
        })
      })
    }
  }, [delay, stagger, threshold, shouldReduceMotion])

  return (
    <div ref={containerRef} className={cn('scroll-reveal', className)} {...props}>
      {children}
    </div>
  )
}
