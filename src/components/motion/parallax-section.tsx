'use client'

import React, { useRef, useEffect, useState } from 'react'
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
 * Uses transform for smooth 60fps performance without GSAP dependency.
 *
 * @example
 * ```tsx
 * <ParallaxSection speed={-0.5}>
 *   <img src="/background.jpg" alt="" />
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
  const [offset, setOffset] = useState(0)

  useEffect(() => {
    // Render static element if motion is reduced
    if (shouldReduceMotion) {
      return
    }

    if (!elementRef.current) {
      return
    }

    let animationFrameId: number
    let currentScroll = 0
    let targetScroll = 0

    // Smooth update loop for buttery smooth parallax
    const updateParallax = () => {
      // Lerp towards target scroll position for smoothness
      const diff = targetScroll - currentScroll
      currentScroll += diff * 0.1 // Smooth easing factor

      // Calculate Y position based on scroll and speed
      const yPosition = currentScroll * speed
      elementRef.current!.style.transform = `translate3d(0, ${yPosition}px, 0)`

      // Continue animation loop
      animationFrameId = requestAnimationFrame(updateParallax)
    }

    // Handle scroll events
    const handleScroll = () => {
      targetScroll = window.scrollY
    }

    // Initial scroll position
    targetScroll = window.scrollY
    currentScroll = window.scrollY

    // Start animation loop
    animationFrameId = requestAnimationFrame(updateParallax)

    // Add scroll listener
    window.addEventListener('scroll', handleScroll, { passive: true })

    // Cleanup function
    return () => {
      window.removeEventListener('scroll', handleScroll)
      cancelAnimationFrame(animationFrameId)
    }
  }, [speed, shouldReduceMotion])

  return (
    <div
      ref={elementRef}
      className={cn('parallax-section', className)}
      style={{ willChange: shouldReduceMotion ? 'auto' : 'transform' }}
      {...props}
    >
      {children}
    </div>
  )
}
