import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { MotionProvider } from '@/components/providers/MotionProvider'

// Import font configurations
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
  adjustFontFallback: true,
})

/**
 * Metadata for SEO and social sharing
 */
export const metadata: Metadata = {
  title: {
    default: 'MAM Center | Luxury Equestrian Excellence',
    template: '%s | MAM Center',
  },
  description:
    'Experience the pinnacle of equestrian luxury at MAM Center. World-class facilities, premium services, and exclusive experiences for discerning riders and equine enthusiasts.',
  keywords: [
    'equestrian',
    'luxury',
    'horse riding',
    'equestrian center',
    'premium stables',
    'horse training',
    'equine therapy',
    'luxury experience',
  ],
  authors: [{ name: 'MAM Center' }],
  creator: 'MAM Center',
  publisher: 'MAM Center',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://mamcenter.com',
    title: 'MAM Center | Luxury Equestrian Excellence',
    description:
      'Experience the pinnacle of equestrian luxury at MAM Center. World-class facilities, premium services, and exclusive experiences.',
    siteName: 'MAM Center',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'MAM Center - Luxury Equestrian Excellence',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MAM Center | Luxury Equestrian Excellence',
    description:
      'Experience the pinnacle of equestrian luxury at MAM Center. World-class facilities, premium services, and exclusive experiences.',
    images: ['/og-image.jpg'],
    creator: '@mamcenter',
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/manifest.json',
  metadataBase: new URL('https://mamcenter.com'),
}

/**
 * Viewport configuration for responsive design
 */
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#0a0e27' },
    { media: '(prefers-color-scheme: light)', color: '#0a0e27' },
  ],
  colorScheme: 'dark',
}

/**
 * Root layout component
 * Wraps all pages with font configuration and providers
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={inter.variable}>
        <MotionProvider>
          {children}
        </MotionProvider>
      </body>
    </html>
  )
}
