'use client'

import React, { useRef, useState, useCallback, useEffect, ButtonHTMLAttributes } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'
import { useMotion } from '@/components/providers/MotionProvider'

/**
 * Glass button variants
 */
const glassButtonVariants = cva(
  // Base styles
  [
    'relative inline-flex items-center justify-center',
    'font-medium transition-all duration-300 ease-luxury',
    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold',
    'disabled:pointer-events-none disabled:opacity-50',
    'rounded-lg overflow-hidden',
  ],
  {
    variants: {
      // Visual variant
      variant: {
        // Primary: prominent call-to-action with gold accent
        primary: [
          'bg-gradient-to-r from-gold/90 to-gold/80',
          'text-midnight font-semibold',
          'hover:from-gold hover:to-gold/95',
          'shadow-[0_4px_16px_0_rgba(212,175,55,0.3)]',
          'hover:shadow-[0_6px_20px_0_rgba(212,175,55,0.4)]',
        ],
        // Secondary: glass effect with white text
        secondary: [
          'bg-white/10 backdrop-blur-md',
          'text-white border border-white/20',
          'hover:bg-white/15 hover:border-white/30',
          'shadow-[0_4px_12px_0_rgba(0,0,0,0.2)]',
        ],
        // Ghost: minimal appearance
        ghost: [
          'bg-transparent',
          'text-white/90 hover:text-white',
          'hover:bg-white/5',
        ],
        // Outline: bordered style
        outline: [
          'bg-transparent',
          'text-white border border-gold/50',
          'hover:bg-gold/10 hover:border-gold',
        ],
      },
      // Size variant
      size: {
        small: ['px-3 py-1.5 text-sm', 'gap-1.5'],
        medium: ['px-4 py-2 text-base', 'gap-2'],
        large: ['px-6 py-3 text-lg', 'gap-2.5'],
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'medium',
    },
  }
)

/**
 * Props for the GlassButton component
 */
export interface GlassButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof glassButtonVariants> {
  /** Button content */
  children: React.ReactNode
  /** Icon to display on the left */
  leftIcon?: React.ReactNode
  /** Icon to display on the right */
  rightIcon?: React.ReactNode
  /** Loading state */
  isLoading?: boolean
  /** Enable magnetic cursor effect (non-touch devices only) */
  magnetic?: boolean
  /** Magnetic strength (0-1) */
  magneticStrength?: number
  /** Additional class names */
  className?: string
}

/**
 * Glass Button Component
 *
 * A premium button component with glassmorphic styling, multiple variants,
 * optional icons, loading state, and magnetic cursor effect on non-touch devices.
 *
 * @example
 * ```tsx
 * <GlassButton variant="primary" size="large">
 *   Get Started
 * </GlassButton>
 *
 * <GlassButton
 *   variant="secondary"
 *   leftIcon={<ArrowRight />}
 *   magnetic
 * >
 *   Continue
 * </GlassButton>
 *
 * <GlassButton variant="ghost" isLoading>
 *   Processing...
 * </GlassButton>
 * ```
 */
export function GlassButton({
  children,
  variant,
  size,
  leftIcon,
  rightIcon,
  isLoading = false,
  magnetic = false,
  magneticStrength = 0.3,
  className,
  disabled,
  ...props
}: GlassButtonProps) {
  const { shouldReduceMotion } = useMotion()
  const buttonRef = useRef<HTMLButtonElement>(null)
  const [magneticStyle, setMagneticStyle] = useState({
    transform: '',
  })

  // Check if device supports hover (not touch)
  const [isHoverCapable, setIsHoverCapable] = useState(false)

  useEffect(() => {
    // Detect if device supports hover
    const mediaQuery = window.matchMedia('(hover: hover)')
    setIsHoverCapable(mediaQuery.matches)

    const handleChange = (e: MediaQueryListEvent) => {
      setIsHoverCapable(e.matches)
    }

    mediaQuery.addEventListener?.('change', handleChange)
    return () => mediaQuery.removeEventListener?.('change', handleChange)
  }, [])

  // Magnetic effect handler
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    if (!magnetic || !isHoverCapable || shouldReduceMotion || !buttonRef.current) return

    const button = buttonRef.current
    const rect = button.getBoundingClientRect()

    // Calculate mouse position relative to button center
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const mouseX = e.clientX - centerX
    const mouseY = e.clientY - centerY

    // Apply magnetic pull (constrained by strength)
    const moveX = mouseX * magneticStrength
    const moveY = mouseY * magneticStrength

    setMagneticStyle({
      transform: `translate(${moveX}px, ${moveY}px)`,
    })
  }, [magnetic, isHoverCapable, shouldReduceMotion, magneticStrength])

  const handleMouseLeave = useCallback(() => {
    setMagneticStyle({ transform: '' })
  }, [])

  // Combine disabled states
  const isDisabled = disabled || isLoading

  return (
    <button
      ref={buttonRef}
      className={cn(
        glassButtonVariants({ variant, size }),
        magnetic && !shouldReduceMotion && 'transition-transform duration-300 ease-out',
        className
      )}
      disabled={isDisabled}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={magneticStyle}
      {...props}
    >
      {/* Loading spinner */}
      {isLoading && (
        <Loader2 className="h-4 w-4 animate-spin" />
      )}

      {/* Left icon */}
      {!isLoading && leftIcon && (
        <span className="flex-shrink-0">
          {leftIcon}
        </span>
      )}

      {/* Button content */}
      <span className={cn(isLoading && 'opacity-70')}>
        {children}
      </span>

      {/* Right icon */}
      {!isLoading && rightIcon && (
        <span className="flex-shrink-0">
          {rightIcon}
        </span>
      )}

      {/* Shine effect on hover */}
      {variant !== 'ghost' && !shouldReduceMotion && (
        <span className="absolute inset-0 -translate-x-full group-hover:animate-shine bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      )}
    </button>
  )
}

/**
 * Glass Button Group - For grouping related buttons
 */
export interface GlassButtonGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Child buttons */
  children: React.ReactNode
  /** Orientation */
  orientation?: 'horizontal' | 'vertical'
  /** Gap between buttons */
  gap?: 'sm' | 'md' | 'lg'
}

const groupOrientation = {
  horizontal: 'flex-row',
  vertical: 'flex-col',
}

const groupGap = {
  sm: 'gap-2',
  md: 'gap-3',
  lg: 'gap-4',
}

export function GlassButtonGroup({
  orientation = 'horizontal',
  gap = 'md',
  className,
  children,
  ...props
}: GlassButtonGroupProps) {
  return (
    <div
      className={cn('flex', groupOrientation[orientation], groupGap[gap], className)}
      {...props}
    >
      {children}
    </div>
  )
}

/**
 * Add shine animation to Tailwind
 * This should be added to globals.css:
 *
 * .animate-shine {
 *   animation: shine 1.5s ease-in-out;
 * }
 *
 * @keyframes shine {
 *   0% { transform: translateX(-100%); }
 *   100% { transform: translateX(100%); }
 * }
 */
