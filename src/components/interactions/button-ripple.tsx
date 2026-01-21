'use client'

import React, { useRef, useState, useCallback } from 'react'
import { useMotion } from '@/components/providers/MotionProvider'
import { cn } from '@/lib/utils'

/**
 * Props for ButtonRipple component
 */
export interface ButtonRippleProps {
  /** Children element to add ripple effect to */
  children: React.ReactElement
  /** Ripple color */
  color?: string
  /** Ripple duration in ms */
  duration?: number
  /** Whether ripple is disabled */
  disabled?: boolean
  /** Additional class names for ripple container */
  className?: string
}

/**
 * Individual ripple state
 */
interface Ripple {
  id: number
  x: number
  y: number
  size: number
}

/**
 * Button Ripple Component
 *
 * Material Design-inspired ripple effect that triggers from the exact
 * cursor position when clicked. Creates circular ripples that expand
 * outward and fade with glassmorphic appearance.
 *
 * @example
 * ```tsx
 * <ButtonRipple>
 *   <GlassButton>Click Me</GlassButton>
 * </ButtonRipple>
 *
 * <ButtonRipple color="rgba(212, 175, 55, 0.4)">
 *   <button className="px-6 py-3">Custom Button</button>
 * </ButtonRipple>
 * ```
 */
export function ButtonRipple({
  children,
  color = 'rgba(212, 175, 55, 0.3)',
  duration = 600,
  disabled = false,
  className,
}: ButtonRippleProps) {
  const [ripples, setRipples] = useState<Ripple[]>([])
  const containerRef = useRef<HTMLDivElement>(null)
  const nextId = useRef(0)
  const { shouldReduceMotion } = useMotion()

  const addRipple = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (disabled || shouldReduceMotion || !containerRef.current) return

      const container = containerRef.current
      const rect = container.getBoundingClientRect()

      // Calculate ripple position relative to click
      const x = event.clientX - rect.left
      const y = event.clientY - rect.top

      // Calculate ripple size to cover the entire button
      const size = Math.max(rect.width, rect.height) * 2.5

      const newRipple: Ripple = {
        id: nextId.current++,
        x,
        y,
        size,
      }

      setRipples((prev) => [...prev, newRipple])

      // Remove ripple after animation completes
      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== newRipple.id))
      }, duration)
    },
    [disabled, shouldReduceMotion, duration]
  )

  // Wrap child in a container div
  return (
    <div className="relative inline-block" onClick={addRipple} ref={containerRef}>
      {React.cloneElement(
        children,
        {
          style: {
            ...(children.props as any).style,
            position: 'relative',
            overflow: 'hidden',
          },
        } as any
      )}

      {/* Ripple container */}
      {!disabled && !shouldReduceMotion && (
        <span
          className={cn(
            'absolute inset-0 pointer-events-none overflow-hidden',
            'rounded-[inherit]', // Inherit border radius from parent
            className
          )}
          aria-hidden="true"
        >
          {ripples.map((ripple) => (
            <span
              key={ripple.id}
              className="absolute rounded-full animate-ripple-expand"
              style={
                {
                  '--ripple-x': `${ripple.x}px`,
                  '--ripple-y': `${ripple.y}px`,
                  '--ripple-size': `${ripple.size}px`,
                  '--ripple-color': color,
                  '--ripple-duration': `${duration}ms`,
                } as React.CSSProperties
              }
            />
          ))}
        </span>
      )}
    </div>
  )
}

/**
 * Props for RippleButton component
 */
export interface RippleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Ripple color */
  rippleColor?: string
  /** Ripple duration in ms */
  rippleDuration?: number
  /** Variant for pre-styled button */
  variant?: 'gold' | 'glass' | 'outline'
  /** Button size */
  size?: 'sm' | 'md' | 'lg'
}

/**
 * Pre-styled Button with Ripple Effect
 *
 * Convenience component that combines button styling with ripple effect.
 *
 * @example
 * ```tsx
 * <RippleButton variant="gold" size="md">
 *   Click Me
 * </RippleButton>
 *
 * <RippleButton variant="glass" onClick={handleClick}>
 *   Submit
 * </RippleButton>
 * ```
 */
export function RippleButton({
  children,
  rippleColor = 'rgba(212, 175, 55, 0.3)',
  rippleDuration = 600,
  variant = 'gold',
  size = 'md',
  className,
  disabled,
  ...props
}: RippleButtonProps) {
  const variantStyles = {
    gold: 'bg-gradient-to-r from-gold/20 to-gold/10 border border-gold/30 text-gold hover:border-gold/50 hover:from-gold/30 hover:to-gold/20',
    glass: 'bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/15 hover:border-white/30',
    outline: 'bg-transparent border-2 border-gold text-gold hover:bg-gold/10',
  }

  const sizeStyles = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  }

  return (
    <ButtonRipple color={rippleColor} duration={rippleDuration} disabled={disabled}>
      <button
        className={cn(
          'relative overflow-hidden',
          'rounded-lg font-medium',
          'transition-all duration-300',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          'focus:outline-none focus:ring-2 focus:ring-gold/50 focus:ring-offset-2 focus:ring-offset-midnight',
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        disabled={disabled}
        {...props}
      >
        {children}
      </button>
    </ButtonRipple>
  )
}

/**
 * Props for RippleLink component
 */
export interface RippleLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  /** Ripple color */
  rippleColor?: string
  /** Ripple duration in ms */
  rippleDuration?: number
}

/**
 * Link with Ripple Effect
 *
 * Adds ripple effect to anchor tags for navigation links.
 *
 * @example
 * ```tsx
 * <RippleLink href="/about" rippleColor="rgba(255, 255, 255, 0.3)">
 *   About Us
 * </RippleLink>
 * ```
 */
export function RippleLink({
  children,
  rippleColor = 'rgba(212, 175, 55, 0.3)',
  rippleDuration = 600,
  className,
  ...props
}: RippleLinkProps) {
  return (
    <ButtonRipple color={rippleColor} duration={rippleDuration}>
      <a
        className={cn(
          'relative inline-block overflow-hidden',
          'transition-colors duration-200',
          className
        )}
        {...props}
      >
        {children}
      </a>
    </ButtonRipple>
  )
}

/**
 * Ripple effect hook for custom implementations
 */
export function useRipple(options: {
  color?: string
  duration?: number
  disabled?: boolean
}) {
  const { color = 'rgba(212, 175, 55, 0.3)', duration = 600, disabled = false } = options
  const [ripples, setRipples] = useState<Ripple[]>([])
  const nextId = useRef(0)
  const { shouldReduceMotion } = useMotion()

  const createRipple = useCallback(
    (event: React.MouseEvent<HTMLElement>, element: HTMLElement) => {
      if (disabled || shouldReduceMotion) return

      const rect = element.getBoundingClientRect()
      const x = event.clientX - rect.left
      const y = event.clientY - rect.top
      const size = Math.max(rect.width, rect.height) * 2.5

      const newRipple: Ripple = {
        id: nextId.current++,
        x,
        y,
        size,
      }

      setRipples((prev) => [...prev, newRipple])

      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== newRipple.id))
      }, duration)
    },
    [disabled, shouldReduceMotion, duration]
  )

  return {
    ripples,
    createRipple,
    color,
    duration,
  }
}

// Add ripple animation to globals.css:
// @keyframes ripple-expand {
//   0% {
//     width: 0;
//     height: 0;
//     opacity: 0.5;
//   }
//   100% {
//     width: var(--ripple-size);
//     height: var(--ripple-size);
//     opacity: 0;
//   }
// }
// .animate-ripple-expand {
//   animation: ripple-expand var(--ripple-duration) ease-out forwards;
// }
