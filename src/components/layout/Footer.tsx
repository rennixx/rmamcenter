'use client'

import React from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Github, Twitter, Instagram, Youtube, Facebook } from 'lucide-react'
import { GlassButton } from '@/components/ui/GlassButton'
import { GlassPanel } from '@/components/ui/GlassPanel'
import { useMotion } from '@/components/providers/MotionProvider'

// ============================================================================
// FOOTER LINKS
// ============================================================================

export interface FooterLink {
  label: string
  href: string
  external?: boolean
}

export interface FooterSection {
  title: string
  links: FooterLink[]
}

const DEFAULT_FOOTER_SECTIONS: FooterSection[] = [
  {
    title: 'Explore',
    links: [
      { label: 'Horses', href: '/horses' },
      { label: 'For Sale', href: '/for-sale' },
      { label: 'Breeding', href: '/breeding' },
      { label: 'About', href: '/about' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Services', href: '/services' },
      { label: 'Facilities', href: '/facilities' },
      { label: 'Training', href: '/training' },
      { label: 'Boarding', href: '/boarding' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'Contact', href: '/contact' },
      { label: 'Careers', href: '/careers' },
      { label: 'Press', href: '/press' },
      { label: 'FAQ', href: '/faq' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Accessibility', href: '/accessibility' },
      { label: 'Cookie Policy', href: '/cookies' },
    ],
  },
]

// ============================================================================
// SOCIAL ICONS
// ============================================================================

const SOCIAL_ICONS = {
  github: Github,
  twitter: Twitter,
  instagram: Instagram,
  youtube: Youtube,
  facebook: Facebook,
}

export interface SocialLink {
  platform: keyof typeof SOCIAL_ICONS
  href: string
  label: string
}

const DEFAULT_SOCIAL_LINKS: SocialLink[] = [
  { platform: 'instagram', href: 'https://instagram.com', label: 'Follow us on Instagram' },
  { platform: 'facebook', href: 'https://facebook.com', label: 'Follow us on Facebook' },
  { platform: 'youtube', href: 'https://youtube.com', label: 'Subscribe on YouTube' },
]

// ============================================================================
// FOOTER COMPONENT
// ============================================================================

export interface FooterProps {
  /** Footer sections with links */
  sections?: FooterSection[]
  /** Social media links */
  socialLinks?: SocialLink[]
  /** Newsletter signup */
  showNewsletter?: boolean
  /** Show motion toggle */
  showMotionToggle?: boolean
  /** Company name */
  companyName?: string
  /** Additional class names */
  className?: string
}

/**
 * Footer Component
 *
 * Glassmorphic footer with site map, social links, and motion toggle control.
 *
 * @example
 * ```tsx
 * <Footer
 *   companyName="MAM Center"
 *   showNewsletter
 *   showMotionToggle
 * />
 * ```
 */
export function Footer({
  sections = DEFAULT_FOOTER_SECTIONS,
  socialLinks = DEFAULT_SOCIAL_LINKS,
  showNewsletter = false,
  showMotionToggle = true,
  companyName = 'MAM Center',
  className,
}: FooterProps) {
  const { shouldReduceMotion, toggleMotion } = useMotion()
  const currentYear = new Date().getFullYear()

  return (
    <footer
      className={cn(
        'relative mt-auto border-t border-white/10 bg-midnight/95 backdrop-blur-4xl',
        className
      )}
    >
      <div className="mx-auto max-w-7xl px-6 py-16 md:px-12 lg:px-24">
        {/* Main Footer Content */}
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Company Info & Newsletter */}
          <div className="lg:col-span-1 space-y-6">
            {/* Logo/Company Name */}
            <div>
              <Link
                href="/"
                className="font-serif text-xl font-bold text-gold hover:text-gold/80 transition-colors"
              >
                {companyName}
              </Link>
              <p className="mt-3 text-sm text-gray-400 leading-relaxed">
                Experience the pinnacle of equestrian luxury with world-class
                facilities and premium services.
              </p>
            </div>

            {/* Newsletter Signup */}
            {showNewsletter && (
              <div>
                <h3 className="text-sm font-semibold text-white mb-3">
                  Stay Updated
                </h3>
                <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className={cn(
                      'flex-1 px-3 py-2 text-sm rounded-lg',
                      'bg-white/5 border border-white/10',
                      'text-white placeholder:text-gray-500',
                      'focus:outline-none focus:ring-2 focus:ring-gold/50',
                      'transition-colors duration-200'
                    )}
                    aria-label="Email address for newsletter"
                  />
                  <GlassButton variant="primary" size="small" type="submit">
                    Subscribe
                  </GlassButton>
                </form>
              </div>
            )}
          </div>

          {/* Footer Sections */}
          {sections.map((section) => (
            <div key={section.title}>
              <h3 className="text-sm font-semibold text-white mb-4">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      target={link.external ? '_blank' : undefined}
                      rel={link.external ? 'noopener noreferrer' : undefined}
                      className={cn(
                        'text-sm text-gray-400 hover:text-gold',
                        'transition-colors duration-200'
                      )}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Left: Copyright & Links */}
            <div className="flex flex-col sm:flex-row items-center gap-4 text-sm text-gray-400">
              <p>
                © {currentYear} {companyName}. All rights reserved.
              </p>
              <div className="flex items-center gap-4">
                <Link
                  href="/accessibility"
                  className="hover:text-gold transition-colors duration-200"
                >
                  Accessibility
                </Link>
              </div>
            </div>

            {/* Middle: Motion Toggle */}
            {showMotionToggle && (
              <MotionToggleControl />
            )}

            {/* Right: Social Links */}
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => {
                const Icon = SOCIAL_ICONS[social.platform]
                return (
                  <Link
                    key={social.href}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className={cn(
                      'p-2 rounded-lg text-gray-400 hover:text-gold',
                      'bg-white/5 hover:bg-white/10',
                      'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold',
                      'transition-all duration-200'
                    )}
                  >
                    <Icon className="h-5 w-5" />
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

// ============================================================================
// MOTION TOGGLE CONTROL
// ============================================================================

/**
 * Motion Toggle Control Component
 *
 * Allows users to manually toggle motion preferences on/off.
 * Displays current state with visual feedback.
 */
function MotionToggleControl() {
  const { shouldReduceMotion, toggleMotion } = useMotion()

  return (
    <GlassPanel
      variant="dark"
      className="flex items-center gap-3 px-4 py-2 rounded-lg"
    >
      <button
        onClick={toggleMotion}
        className={cn(
          'flex items-center gap-2 text-sm transition-colors duration-200',
          'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold'
        )}
        aria-pressed={shouldReduceMotion}
        aria-label={shouldReduceMotion ? 'Enable animations' : 'Reduce motion'}
      >
        {/* Toggle indicator */}
        <span
          className={cn(
            'relative inline-flex h-5 w-9 items-center rounded-full',
            'transition-colors duration-200',
            shouldReduceMotion ? 'bg-white/20' : 'bg-gold/80'
          )}
        >
          <span
            className={cn(
              'inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200',
              shouldReduceMotion ? 'translate-x-0.5' : 'translate-x-5'
            )}
          />
        </span>

        {/* Label */}
        <span className="text-gray-300">
          {shouldReduceMotion ? 'Motion Off' : 'Motion On'}
        </span>
      </button>
    </GlassPanel>
  )
}

// ============================================================================
// MINI FOOTER
// ============================================================================

export interface MiniFooterProps {
  /** Company name */
  companyName?: string
  /** Additional links */
  links?: FooterLink[]
  /** Show motion toggle */
  showMotionToggle?: boolean
  /** Additional class names */
  className?: string
}

/**
 * Mini Footer Component
 *
 * Simplified footer for pages that don't need the full footer.
 *
 * @example
 * ```tsx
 * <MiniFooter
 *   companyName="MAM Center"
 *   links={[
 *     { label: 'Privacy', href: '/privacy' },
 *     { label: 'Terms', href: '/terms' },
 *   ]}
 * />
 * ```
 */
export function MiniFooter({
  companyName = 'MAM Center',
  links = [],
  showMotionToggle = false,
  className,
}: MiniFooterProps) {
  const currentYear = new Date().getFullYear()

  return (
    <footer
      className={cn(
        'border-t border-white/10 bg-midnight/95 backdrop-blur-4xl',
        'py-8 px-6 md:px-12 lg:px-24',
        className
      )}
    >
      <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Copyright */}
        <p className="text-sm text-gray-400">
          © {currentYear} {companyName}
        </p>

        {/* Links */}
        {links.length > 0 && (
          <nav className="flex items-center gap-6" aria-label="Footer navigation">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-gray-400 hover:text-gold transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        )}

        {/* Motion Toggle */}
        {showMotionToggle && <MotionToggleControl />}
      </div>
    </footer>
  )
}
