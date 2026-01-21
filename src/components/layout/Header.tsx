'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Navigation, NavLink } from './Navigation'
import { useMotion } from '@/components/providers/MotionProvider'

// ============================================================================
// HEADER COMPONENT
// ============================================================================

export interface HeaderProps {
  /** Logo element */
  logo?: React.ReactNode
  /** Navigation links */
  navLinks?: NavLink[]
  /** CTA button text */
  ctaText?: string
  /** CTA button href */
  ctaHref?: string
  /** Hide navigation */
  hideNav?: boolean
  /** Additional class names */
  className?: string
  /** Children to render below navigation */
  children?: React.ReactNode
}

/**
 * Header Component
 *
 * Sticky header with scroll-based opacity and blur changes.
 * Integrates with the Navigation component and maintains proper z-index layering.
 *
 * @example
 * ```tsx
 * <Header
 *   logo={<Logo />}
 *   ctaText="Get Started"
 *   ctaHref="/contact"
 * />
 * ```
 */
export function Header({
  logo,
  navLinks,
  ctaText = 'Get Started',
  ctaHref = '/contact',
  hideNav = false,
  className,
  children,
}: HeaderProps) {
  const [scrolled, setScrolled] = useState(false)
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down' | null>(null)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [isHidden, setIsHidden] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      // Determine if scrolled past threshold
      setScrolled(currentScrollY > 20)

      // Determine scroll direction
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down - hide header
        setScrollDirection('down')
        setIsHidden(true)
      } else if (currentScrollY < lastScrollY) {
        // Scrolling up - show header
        setScrollDirection('up')
        setIsHidden(false)
      }

      setLastScrollY(currentScrollY)
    }

    // Throttle scroll events for performance
    let ticking = false
    const scrollHandler = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll()
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', scrollHandler, { passive: true })
    return () => window.removeEventListener('scroll', scrollHandler)
  }, [lastScrollY])

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ease-luxury',
        isHidden && '-translate-y-full',
        className
      )}
    >
      <Navigation
        logo={logo}
        links={navLinks}
        ctaText={ctaText}
        ctaHref={ctaHref}
        scrolled={scrolled}
      />

      {children && (
        <div className="mt-16 lg:mt-20">
          {children}
        </div>
      )}
    </header>
  )
}

// ============================================================================
// HERO HEADER
// ============================================================================

export interface HeroHeaderProps extends Omit<HeaderProps, 'children'> {
  /** Hero section title */
  title?: string
  /** Hero section subtitle */
  subtitle?: string
  /** Hero section description */
  description?: string
  /** Background image URL */
  backgroundImage?: string
  /** Background gradient colors */
  gradient?: string
  /** Hero height */
  height?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  /** Content alignment */
  align?: 'left' | 'center' | 'right'
  /** Action buttons */
  actions?: React.ReactNode
}

const heightClasses = {
  sm: 'min-h-[400px]',
  md: 'min-h-[500px]',
  lg: 'min-h-[600px]',
  xl: 'min-h-[700px]',
  full: 'min-h-screen',
}

const alignClasses = {
  left: 'items-start text-left',
  center: 'items-center text-center',
  right: 'items-end text-right',
}

/**
 * Hero Header Component
 *
 * Extended header component with hero section containing title, subtitle,
 * and action buttons.
 *
 * @example
 * ```tsx
 * <HeroHeader
 *   title="Welcome to MAM Center"
 *   subtitle="Luxury Equestrian Excellence"
 *   description="Experience world-class facilities and premium services."
 *   actions={<GlassButton>Explore</GlassButton>}
 * />
 * ```
 */
export function HeroHeader({
  logo,
  navLinks,
  ctaText = 'Get Started',
  ctaHref = '/contact',
  title,
  subtitle,
  description,
  backgroundImage,
  gradient = 'from-midnight via-hunter to-midnight',
  height = 'lg',
  align = 'center',
  actions,
  className,
}: HeroHeaderProps) {
  const { shouldReduceMotion } = useMotion()

  return (
    <Header
      logo={logo}
      navLinks={navLinks}
      ctaText={ctaText}
      ctaHref={ctaHref}
      className={className}
    >
      {/* Hero Section */}
      <section
        className={cn(
          'relative flex flex-col justify-center px-6 py-24 md:px-12 lg:px-24 overflow-hidden',
          heightClasses[height]
        )}
      >
        {/* Background */}
        {backgroundImage ? (
          <>
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url('${backgroundImage}')` }}
            />
            <div className="absolute inset-0 bg-gradient-to-br from-midnight/90 via-hunter/80 to-midnight/90" />
          </>
        ) : (
          <div className={cn('absolute inset-0 bg-gradient-to-br opacity-50', gradient)} />
        )}

        {/* Decorative elements */}
        <div className="absolute top-20 right-20 h-96 w-96 rounded-full bg-gold/5 blur-3xl" />
        <div className="absolute bottom-20 left-20 h-64 w-64 rounded-full bg-gold/3 blur-3xl" />

        {/* Content */}
        <div className={cn('relative z-10 mx-auto max-w-5xl flex', alignClasses[align])}>
          <div className="max-w-3xl space-y-6">
            {/* Subtitle */}
            {subtitle && (
              <p className="text-gold font-medium tracking-wide uppercase text-sm">
                {subtitle}
              </p>
            )}

            {/* Title */}
            {title && (
              <h1 className="font-serif text-5xl font-bold text-white md:text-6xl lg:text-7xl">
                {title}
              </h1>
            )}

            {/* Description */}
            {description && (
              <p className="mx-auto max-w-2xl text-lg text-gray-300 md:text-xl">
                {description}
              </p>
            )}

            {/* Actions */}
            {actions && (
              <div className="flex flex-wrap items-center gap-4 pt-4">
                {actions}
              </div>
            )}
          </div>
        </div>
      </section>
    </Header>
  )
}

// ============================================================================
// PAGE HEADER
// ============================================================================

export interface PageHeaderProps {
  /** Page title */
  title: string
  /** Page subtitle or description */
  description?: string
  /** Breadcrumb items */
  breadcrumbs?: Array<{ label: string; href?: string }>
  /** Additional actions */
  actions?: React.ReactNode
  /** Background variant */
  variant?: 'default' | 'glass' | 'minimal'
  /** Additional class names */
  className?: string
}

const variantClasses = {
  default: 'bg-midnight border-b border-white/10',
  glass: 'bg-midnight/80 backdrop-blur-4xl border-b border-white/10',
  minimal: 'bg-transparent',
}

/**
 * Page Header Component
 *
 * Standard page header with title, optional description, breadcrumbs,
 * and action buttons.
 *
 * @example
 * ```tsx
 * <PageHeader
 *   title="Our Horses"
 *   description="Meet our world-class horses"
 *   breadcrumbs={[
 *     { label: 'Home', href: '/' },
 *     { label: 'Horses' },
 *   ]}
 * />
 * ```
 */
export function PageHeader({
  title,
  description,
  breadcrumbs,
  actions,
  variant = 'default',
  className,
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        'relative z-40 pt-16 lg:pt-20 pb-12 px-6 md:px-12 lg:px-24',
        variantClasses[variant],
        className
      )}
    >
      <div className="mx-auto max-w-7xl">
        {/* Breadcrumbs */}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav className="flex items-center gap-2 text-sm text-gray-400 mb-4" aria-label="Breadcrumb">
            {breadcrumbs.map((crumb, index) => (
              <React.Fragment key={index}>
                {index > 0 && (
                  <span className="text-white/20">/</span>
                )}
                {crumb.href ? (
                  <Link
                    href={crumb.href}
                    className="hover:text-gold transition-colors duration-150"
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-white/80">{crumb.label}</span>
                )}
              </React.Fragment>
            ))}
          </nav>
        )}

        {/* Header Content */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
          <div className="flex-1">
            <h1 className="font-serif text-4xl font-bold text-white md:text-5xl lg:text-6xl mb-4">
              {title}
            </h1>
            {description && (
              <p className="text-lg text-gray-300 max-w-3xl">
                {description}
              </p>
            )}
          </div>

          {actions && (
            <div className="flex-shrink-0 flex items-center gap-3">
              {actions}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
