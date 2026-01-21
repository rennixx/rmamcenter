'use client'

import React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

/**
 * Glass panel variants using class-variance-authority
 */
const glassPanelVariants = cva(
  // Base styles
  [
    'relative rounded-xl overflow-hidden',
    // Base glass effect with backdrop filter
    'backdrop-blur-[16px]',
    // Base borders
    'border border-white/10',
    // Enhanced top/left borders for light catch effect
    'before:absolute before:inset-0 before:rounded-xl before:pointer-events-none',
    'before:border-t before:border-l before:border-white/20',
    // Shadow for depth
    'shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]',
    // Smooth transitions
    'transition-all duration-500',
  ],
  {
    variants: {
      // Visual variant
      variant: {
        // Default: subtle glass with minimal opacity
        default: [
          'bg-white/5',
        ],
        // Elevated: more prominent glass effect
        elevated: [
          'bg-white/[0.08]',
          'shadow-[0_12px_48px_0_rgba(0,0,0,0.4)]',
        ],
        // Dark: deeper opacity for better contrast
        dark: [
          'bg-black/40',
          'border-white/15',
          'before:border-white/25',
        ],
        // Bordered: enhanced light catch effect
        bordered: [
          'bg-white/5',
          'border-white/20',
          'before:border-white/30',
          'shadow-[0_4px_16px_0_rgba(0,0,0,0.2)]',
          'after:absolute after:inset-0 after:rounded-xl after:pointer-events-none',
          'after:border-b after:border-r after:border-white/5',
        ],
      },
      // Hover effect variant
      hover: {
        none: '',
        subtle: [
          'hover:bg-white/[0.07]',
          'hover:border-white/15',
          'hover:shadow-[0_12px_40px_0_rgba(0,0,0,0.35)]',
        ],
        lift: [
          'hover:-translate-y-1',
          'hover:bg-white/[0.09]',
          'hover:border-white/18',
          'hover:shadow-[0_16px_48px_0_rgba(0,0,0,0.45)]',
        ],
      },
    },
    compoundVariants: [
      // Combine elevated + lift for stronger hover effect
      {
        variant: 'elevated',
        hover: 'lift',
        class: 'hover:shadow-[0_20px_60px_0_rgba(0,0,0,0.5)]',
      },
    ],
    defaultVariants: {
      variant: 'default',
      hover: 'none',
    },
  }
)

/**
 * Props for the GlassPanel component
 */
export interface GlassPanelProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof glassPanelVariants> {
  /** Child content to render inside the panel */
  children: React.ReactNode
  /** Whether to add a contrast overlay for better text readability */
  contrastOverlay?: boolean
  /** Additional class names to apply */
  className?: string
}

/**
 * Glass Panel Component
 *
 * A flexible glassmorphic panel component with multiple visual variants.
 * Includes fallback styles for browsers without backdrop-filter support.
 *
 * @example
 * ```tsx
 * <GlassPanel variant="elevated" hover="subtle">
 *   <p>Content here</p>
 * </GlassPanel>
 *
 * <GlassPanel variant="dark" hover="lift" contrastOverlay>
 *   <p>High contrast content</p>
 * </GlassPanel>
 * ```
 */
export function GlassPanel({
  children,
  variant,
  hover,
  contrastOverlay = false,
  className,
  ...props
}: GlassPanelProps) {
  return (
    <div
      className={cn(glassPanelVariants({ variant, hover }), className)}
      {...props}
    >
      {/* Contrast overlay for better text readability */}
      {contrastOverlay && (
        <div className="absolute inset-0 bg-midnight/60 rounded-xl pointer-events-none" />
      )}

      {/* Fallback for browsers without backdrop-filter */}
      <style>{`
        @supports not (backdrop-filter: blur(16px)) {
          .glass-panel-fallback {
            background: rgba(10, 14, 39, 0.95) !important;
          }
        }
      `}</style>

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  )
}

/**
 * Glass Panel Section - A variant with consistent padding
 */
export interface GlassPanelSectionProps extends GlassPanelProps {
  /** Padding size */
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
}

const paddingVariants = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
  xl: 'p-10',
}

export function GlassPanelSection({
  padding = 'md',
  children,
  className,
  ...props
}: GlassPanelSectionProps) {
  return (
    <GlassPanel className={cn(paddingVariants[padding], className)} {...props}>
      {children}
    </GlassPanel>
  )
}
