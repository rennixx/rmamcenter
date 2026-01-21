'use client'

import React, { useRef, useState } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { useMotion } from '@/components/providers/MotionProvider'

/**
 * SVG noise texture data URI for glass card overlay
 * Uses fractal noise filter for subtle grain effect
 */
const NOISE_TEXTURE_URI = `data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E`

/**
 * Glass card variants
 */
const glassCardVariants = cva(
  // Base styles - extends GlassPanel
  [
    'group relative rounded-xl overflow-hidden',
    'backdrop-blur-[16px] saturate-[180%]',
    'border border-white/10',
    'before:absolute before:inset-0 before:rounded-xl before:pointer-events-none',
    'before:border-t before:border-l before:border-white/20',
    'shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]',
    // Card-specific padding
    'p-6',
  ],
  {
    variants: {
      variant: {
        default: 'bg-white/5',
        elevated: 'bg-white/[0.08] shadow-[0_12px_48px_0_rgba(0,0,0,0.4)]',
        dark: 'bg-black/40 border-white/15 before:border-white/25',
        bordered: 'bg-white/5 border-white/20 before:border-white/30',
      },
      size: {
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
)

/**
 * Props for the GlassCard component
 */
export interface GlassCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof glassCardVariants> {
  /** Card title */
  title?: string
  /** Card description */
  description?: string
  /** Action element to render (button, link, etc.) */
  action?: React.ReactNode
  /** Icon to display above the title */
  icon?: React.ReactNode
  /** Whether to show noise texture overlay */
  noise?: boolean
  /** Disable hover effects */
  disableHover?: boolean
  /** Additional class names */
  className?: string
  /** Child content (renders below title/description) */
  children?: React.ReactNode
}

/**
 * Glass Card Component
 *
 * An extended glass panel designed for content cards with hover effects,
 * optional noise texture, and motion-reduced variants.
 *
 * @example
 * ```tsx
 * <GlassCard
 *   title="Welcome"
 *   description="Explore our premium services"
 *   noise
 * >
 *   <p>Additional content here</p>
 * </GlassCard>
 *
 * <GlassCard
 *   variant="elevated"
 *   size="lg"
 *   icon={<Star />}
 *   title="Premium Features"
 *   action={<Button>Learn More</Button>}
 * />
 * ```
 */
export function GlassCard({
  title,
  description,
  action,
  icon,
  noise = false,
  disableHover = false,
  variant,
  size,
  className,
  children,
  ...props
}: GlassCardProps) {
  const { shouldReduceMotion } = useMotion()
  const cardRef = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)

  // Motion-aware hover classes
  const hoverClasses = !disableHover && !shouldReduceMotion
    ? [
        'transition-all duration-500 ease-luxury',
        'hover:scale-[1.02]',
        'hover:bg-white/[0.07]',
        'hover:border-white/15',
        'hover:shadow-[0_12px_40px_0_rgba(0,0,0,0.35),0_0_30px_rgba(212,175,55,0.1)]',
      ]
    : shouldReduceMotion
      ? ['transition-opacity duration-300', 'hover:opacity-90']
      : []

  return (
    <div
      ref={cardRef}
      className={cn(
        glassCardVariants({ variant, size }),
        hoverClasses,
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      {...props}
    >
      {/* Noise texture overlay */}
      {noise && (
        <div
          className="absolute inset-0 opacity-[0.05] pointer-events-none mix-blend-overlay"
          style={{
            backgroundImage: `url('${NOISE_TEXTURE_URI}')`,
            backgroundSize: '200px 200px',
          }}
        />
      )}

      {/* Inner glow effect on hover */}
      {!shouldReduceMotion && !disableHover && (
        <div
          className={cn(
            'absolute inset-0 rounded-xl pointer-events-none transition-opacity duration-500',
            'bg-gradient-to-br from-white/5 via-transparent to-transparent',
            isHovered ? 'opacity-100' : 'opacity-0'
          )}
        />
      )}

      {/* Content */}
      <div className="relative z-10 flex flex-col h-full">
        {/* Icon */}
        {icon && (
          <div className="mb-4 text-gold">{icon}</div>
        )}

        {/* Title */}
        {title && (
          <h3 className="font-serif text-xl font-semibold text-white mb-2">
            {title}
          </h3>
        )}

        {/* Description */}
        {description && (
          <p className="text-gray-300 text-sm mb-4 leading-relaxed">
            {description}
          </p>
        )}

        {/* Additional content */}
        {children && (
          <div className="flex-1 mb-4">
            {children}
          </div>
        )}

        {/* Action */}
        {action && (
          <div className="mt-auto pt-4 border-t border-white/10">
            {action}
          </div>
        )}
      </div>
    </div>
  )
}

/**
 * Glass Card Grid - For displaying multiple cards
 */
export interface GlassCardGridProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Number of columns */
  cols?: 1 | 2 | 3 | 4
  /** Gap between cards */
  gap?: 'sm' | 'md' | 'lg'
  /** Child cards */
  children: React.ReactNode
}

const gridCols = {
  1: 'grid-cols-1',
  2: 'grid-cols-1 md:grid-cols-2',
  3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
}

const gridGap = {
  sm: 'gap-4',
  md: 'gap-6',
  lg: 'gap-8',
}

export function GlassCardGrid({
  cols = 3,
  gap = 'md',
  className,
  children,
  ...props
}: GlassCardGridProps) {
  return (
    <div
      className={cn('grid', gridCols[cols], gridGap[gap], className)}
      {...props}
    >
      {children}
    </div>
  )
}
