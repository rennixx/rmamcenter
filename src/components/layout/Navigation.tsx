'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import * as NavigationMenu from '@radix-ui/react-navigation-menu'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { cn } from '@/lib/utils'
import { ChevronDown, Menu, X } from 'lucide-react'
import { GlassButton } from '@/components/ui/GlassButton'
import { useMotion } from '@/components/providers/MotionProvider'

// ============================================================================
// NAVIGATION LINKS
// ============================================================================

export interface NavLink {
  href: string
  label: string
  /** Sub-navigation items */
  children?: NavLink[]
  /** External link flag */
  external?: boolean
}

const DEFAULT_NAV_LINKS: NavLink[] = [
  { href: '/horses', label: 'Horses' },
  {
    href: '/for-sale',
    label: 'For Sale',
    children: [
      { href: '/for-sale/horses', label: 'Horses' },
      { href: '/for-sale/mares', label: 'Mares' },
      { href: '/for-sale/stallions', label: 'Stallions' },
      { href: '/for-sale/foals', label: 'Foals' },
    ],
  },
  { href: '/breeding', label: 'Breeding Program' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
]

// ============================================================================
// DESKTOP NAVIGATION
// ============================================================================

interface DesktopNavProps {
  links?: NavLink[]
  className?: string
}

function DesktopNav({ links = DEFAULT_NAV_LINKS, className }: DesktopNavProps) {
  const pathname = usePathname()

  return (
    <NavigationMenu.Root
      className={cn('hidden lg:flex items-center gap-1', className)}
      delayDuration={200}
    >
      {links.map((link) => (
        <NavigationMenu.Item key={link.href}>
          {link.children ? (
            <DropdownMenuSubmenu link={link} pathname={pathname} />
          ) : (
            <NavLinkItem link={link} pathname={pathname} />
          )}
        </NavigationMenu.Item>
      ))}
    </NavigationMenu.Root>
  )
}

function NavLinkItem({ link, pathname }: { link: NavLink; pathname: string }) {
  const isActive = pathname === link.href || pathname.startsWith(link.href + '/')

  return (
    <Link
      href={link.href}
      className={cn(
        'group relative px-4 py-2 text-sm font-medium transition-colors duration-200',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold',
        isActive ? 'text-gold' : 'text-white/80 hover:text-white'
      )}
    >
      {link.label}
      {/* Active indicator */}
      <span
        className={cn(
          'absolute bottom-0 left-0 h-0.5 bg-gold transition-all duration-300',
          isActive ? 'w-full' : 'w-0 group-hover:w-2/3'
        )}
      />
    </Link>
  )
}

function DropdownMenuSubmenu({ link, pathname }: { link: NavLink; pathname: string }) {
  const [isOpen, setIsOpen] = useState(false)
  const isActive = pathname === link.href || pathname.startsWith(link.href + '/')

  return (
    <DropdownMenu.Root open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenu.Trigger asChild>
        <button
          className={cn(
            'group flex items-center gap-1 px-4 py-2 text-sm font-medium transition-colors duration-200',
            'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold',
            'cursor-pointer',
            isActive ? 'text-gold' : 'text-white/80 hover:text-white'
          )}
        >
          {link.label}
          <ChevronDown
            className={cn(
              'h-4 w-4 transition-transform duration-200',
              isOpen && 'rotate-180'
            )}
          />
          {/* Active indicator */}
          <span
            className={cn(
              'absolute bottom-0 left-0 h-0.5 bg-gold transition-all duration-300',
              isActive ? 'w-full' : 'w-0 group-hover:w-2/3'
            )}
          />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="start"
          sideOffset={8}
          className={cn(
            'min-w-[200px] rounded-lg border border-white/10 bg-midnight/95',
            'backdrop-blur-xl p-1 shadow-xl',
            'data-[state=open]:animate-in data-[state=closed]:animate-out',
            'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
            'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
            'data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2'
          )}
        >
          {link.children?.map((child) => (
            <DropdownMenu.Item key={child.href} asChild>
              <Link
                href={child.href}
                className={cn(
                  'relative flex items-center gap-2 px-3 py-2 text-sm rounded-md',
                  'transition-colors duration-150',
                  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold',
                  pathname === child.href
                    ? 'bg-gold/20 text-gold'
                    : 'text-white/80 hover:bg-white/5 hover:text-white'
                )}
              >
                {child.label}
                {pathname === child.href && (
                  <span className="absolute right-2 h-1.5 w-1.5 rounded-full bg-gold" />
                )}
              </Link>
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}

// ============================================================================
// MOBILE NAVIGATION
// ============================================================================

interface MobileNavProps {
  links?: NavLink[]
  isOpen: boolean
  onClose: () => void
}

function MobileNav({ links = DEFAULT_NAV_LINKS, isOpen, onClose }: MobileNavProps) {
  const pathname = usePathname()
  const { shouldReduceMotion } = useMotion()
  const navRef = useRef<HTMLDivElement>(null)

  // Close route when clicking a link
  const handleLinkClick = () => {
    onClose()
  }

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  // Focus trap when menu is open
  useEffect(() => {
    if (!isOpen || !navRef.current) return

    const focusableElements = navRef.current.querySelectorAll(
      'a, button'
    ) as NodeListOf<HTMLElement>

    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault()
          lastElement?.focus()
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault()
          firstElement?.focus()
        }
      }
    }

    document.addEventListener('keydown', handleTab)
    firstElement?.focus()

    return () => document.removeEventListener('keydown', handleTab)
  }, [isOpen])

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  return (
    <>
      {/* Overlay */}
      <div
        className={cn(
          'fixed inset-0 bg-midnight/80 backdrop-blur-sm z-40 lg:hidden',
          'transition-opacity duration-300',
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Mobile Menu */}
      <div
        ref={navRef}
        className={cn(
          'fixed inset-y-0 right-0 w-full max-w-sm z-50 lg:hidden',
          'bg-midnight/95 backdrop-blur-xl border-l border-white/10',
          'transition-transform duration-300 ease-luxury',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
        role="navigation"
        aria-label="Mobile navigation"
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <span className="font-serif text-lg text-white">Menu</span>
            <button
              onClick={onClose}
              className={cn(
                'p-2 rounded-lg text-white/80 hover:text-white hover:bg-white/5',
                'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold',
                'transition-colors duration-200'
              )}
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 overflow-y-auto p-4" aria-label="Main navigation">
            <ul className="space-y-1">
              {links.map((link) => (
                <li key={link.href}>
                  {link.children ? (
                    <MobileSubmenu
                      link={link}
                      pathname={pathname}
                      onLinkClick={handleLinkClick}
                    />
                  ) : (
                    <Link
                      href={link.href}
                      onClick={handleLinkClick}
                      className={cn(
                        'block px-4 py-3 rounded-lg text-sm font-medium transition-colors duration-150',
                        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold',
                        pathname === link.href
                          ? 'bg-gold/20 text-gold'
                          : 'text-white/80 hover:bg-white/5 hover:text-white'
                      )}
                    >
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </>
  )
}

// Mobile Submenu
function MobileSubmenu({
  link,
  pathname,
  onLinkClick,
}: {
  link: NavLink
  pathname: string
  onLinkClick: () => void
}) {
  const [isOpen, setIsOpen] = useState(false)
  const isActive = pathname === link.href || pathname.startsWith(link.href + '/')

  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex items-center justify-between w-full px-4 py-3 rounded-lg',
          'text-sm font-medium transition-colors duration-150',
          'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold',
          isActive ? 'bg-gold/20 text-gold' : 'text-white/80 hover:bg-white/5 hover:text-white'
        )}
        aria-expanded={isOpen}
        aria-controls={`submenu-${link.href}`}
      >
        {link.label}
        <ChevronDown
          className={cn(
            'h-4 w-4 transition-transform duration-200',
            isOpen && 'rotate-180'
          )}
        />
      </button>

      {isOpen && (
        <ul
          id={`submenu-${link.href}`}
          className="mt-1 ml-4 space-y-1 border-l border-white/10 pl-4"
        >
          {link.children?.map((child) => (
            <li key={child.href}>
              <Link
                href={child.href}
                onClick={onLinkClick}
                className={cn(
                  'block px-3 py-2 rounded-lg text-sm transition-colors duration-150',
                  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold',
                  pathname === child.href
                    ? 'text-gold'
                    : 'text-white/60 hover:bg-white/5 hover:text-white'
                )}
              >
                {child.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

// ============================================================================
// MAIN NAVIGATION COMPONENT
// ============================================================================

export interface NavigationProps {
  /** Navigation links */
  links?: NavLink[]
  /** CTA button text */
  ctaText?: string
  /** CTA button href */
  ctaHref?: string
  /** Logo element */
  logo?: React.ReactNode
  /** Additional class names */
  className?: string
  /** Scroll state for blur effect */
  scrolled?: boolean
}

/**
 * Navigation Component
 *
 * Glassmorphic navigation with desktop dropdown menu and mobile hamburger menu.
 * Includes keyboard navigation, ARIA labels, and active route highlighting.
 *
 * @example
 * ```tsx
 * <Navigation
 *   logo={<Logo />}
 *   ctaText="Get Started"
 *   ctaHref="/contact"
 * />
 * ```
 */
export function Navigation({
  links = DEFAULT_NAV_LINKS,
  ctaText = 'Get Started',
  ctaHref = '/contact',
  logo,
  className,
  scrolled = false,
}: NavigationProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-midnight/80 backdrop-blur-4xl border-b border-white/10'
          : 'bg-transparent',
        className
      )}
      aria-label="Main navigation"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
            aria-label="MAM Center home"
          >
            {logo || (
              <span className="font-serif text-xl font-bold text-gold">
                MAM Center
              </span>
            )}
          </Link>

          {/* Desktop Navigation */}
          <DesktopNav links={links} />

          {/* Desktop CTA */}
          <div className="hidden lg:block">
            <GlassButton variant="primary" size="small" asChild>
              <Link href={ctaHref}>{ctaText}</Link>
            </GlassButton>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className={cn(
              'lg:hidden p-2 rounded-lg text-white/80 hover:text-white',
              'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold',
              'transition-colors duration-200'
            )}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <MobileNav links={links} isOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
    </nav>
  )
}
