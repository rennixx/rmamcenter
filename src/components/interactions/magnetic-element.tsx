'use client'

import React, { useRef, useEffect, useState } from 'react'
import { useMotion } from '@/components/providers/MotionProvider'
import { useCursorPosition } from '@/hooks/use-cursor-position'
import { useMagneticEffect } from '@/hooks/use-magnetic-effect'
import { cn } from '@/lib/utils'

/**
 * Props for MagneticElement component
 */
export interface MagneticElementProps {
  /** Children to wrap with magnetic effect */
  children: React.ReactNode
  /** Strength of magnetic pull (0-1) */
  strength?: number
  /** Radius in pixels for magnetic detection */
  radius?: number
  /** Whether effect is disabled */
  disabled?: boolean
  /** Additional class names */
  className?: string
}

/**
 * Magnetic Element Component
 *
 * Makes child elements subtly move toward the cursor when in proximity,
 * creating a magnetic attraction effect. Uses GSAP for smooth spring animations.
 *
 * @example
 * ```tsx
 * <MagneticElement strength={0.3} radius={100}>
 *   <GlassButton>Hover Near Me</GlassButton>
 * </MagneticElement>
 * ```
 */
export function MagneticElement({
  children,
  strength = 0.3,
  radius = 100,
  disabled = false,
  className,
}: MagneticElementProps) {
  const { shouldReduceMotion } = useMotion()
  const elementRef = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)

  const { x: cursorX, y: cursorY } = useCursorPosition()
  const { position, springTo } = useMagneticEffect({
    strength,
    disabled: disabled || shouldReduceMotion,
  })

  // Calculate distance from cursor to element center
  useEffect(() => {
    if (!elementRef.current || cursorX === null || cursorY === null) return
    if (disabled || shouldReduceMotion) return

    const element = elementRef.current
    const rect = element.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    const distance = Math.sqrt(
      Math.pow(cursorX - centerX, 2) + Math.pow(cursorY - centerY, 2)
    )

    // Check if cursor is within magnetic radius
    const isInMagneticField = distance < radius

    if (isInMagneticField && !isHovered) {
      setIsHovered(true)
      // Calculate angle to cursor
      const angle = Math.atan2(cursorY - centerY, cursorX - centerX)
      const pullStrength = (1 - distance / radius) * strength

      // Set target position
      springTo({
        x: Math.cos(angle) * pullStrength * 20, // Max 20px movement
        y: Math.sin(angle) * pullStrength * 20,
      })
    } else if (!isInMagneticField && isHovered) {
      setIsHovered(false)
      // Return to center
      springTo({ x: 0, y: 0 })
    }
  }, [cursorX, cursorY, radius, strength, disabled, shouldReduceMotion, isHovered, springTo])

  return (
    <div
      ref={elementRef}
      className={cn('inline-block', className)}
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
        willChange: shouldReduceMotion ? undefined : 'transform',
      }}
    >
      {children}
    </div>
  )
}

/**
 * Enhanced Magnetic Button Component
 *
 * Combines magnetic effect with GlassButton for an enhanced button experience.
 *
 * @example
 * ```tsx
 * <MagneticButton strength={0.4}>
 *   Explore
 * </MagneticButton>
 * ```
 */
export function MagneticButton({
  children,
  strength = 0.3,
  radius = 80,
  disabled = false,
  className,
  ...props
}: MagneticElementProps & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <MagneticElement strength={strength} radius={radius} disabled={disabled} className={className}>
      <button
        disabled={disabled}
        className={className}
        {...props}
      >
        {children}
      </button>
    </MagneticElement>
  )
}

/**
 * Magnetic Card Component
 *
 * Applies magnetic effect to cards that also scale slightly when hovered.
 *
 * @example
 * ```tsx
 * <MagneticCard strength={0.2} radius={120}>
 *   <GlassCard>Content</GlassCard>
 * </MagneticCard>
 * ```
 * ```
 */
export function MagneticCard({
  children,
  strength = 0.2,
  radius = 120,
  disabled = false,
  className,
}: MagneticElementProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <MagneticElement strength={strength} radius={radius} disabled={disabled} className={className}>
      <div
        className={cn(
          'transition-transform duration-300',
          isHovered && 'scale-[1.02]'
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {children}
      </div>
    </MagneticElement>
  )
}
