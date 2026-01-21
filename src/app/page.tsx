'use client'

import React, { useState, useRef } from 'react'
import { Star, ArrowRight, Sparkles, Users, Trophy, ChevronDown, Trees } from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { GlassPanel, GlassPanelSection } from '@/components/ui/GlassPanel'
import { GlassCard, GlassCardGrid } from '@/components/ui/GlassCard'
import { GlassButton, GlassButtonGroup } from '@/components/ui/GlassButton'
import {
  Display,
  Heading,
  Paragraph,
  Text,
  Label,
  Caption,
  Link as TextLink,
} from '@/components/ui/Typography'
import { MotionWrapper, StaggerContainer, ViewportAnimator } from '@/components/motion/MotionWrapper'
import { ParallaxSection } from '@/components/motion/parallax-section'
import { ScrollReveal } from '@/components/motion/scroll-reveal'
import { ScrollControlled3D } from '@/components/3d/scroll-controlled-3d'
import { CanvasWrapper } from '@/components/3d/canvas-wrapper'
import { HeroSection } from '@/components/sections/hero-section'
import { HorsePortfolio } from '@/components/sections/horse-portfolio'
import { EditorialSection, NewsletterSignup } from '@/components/sections/editorial-layouts'
import { useMotion } from '@/components/providers/MotionProvider'
import { useLenisScroll } from '@/hooks/use-lenis'
import { getMockHorses, getMockArticles } from '@/lib/data/mock-data'

export default function HomePage() {
  const { shouldReduceMotion, toggleMotion } = useMotion()
  const { scrollTo } = useLenisScroll()
  const [isLoading, setIsLoading] = useState(false)
  const cubeRef = useRef<any>(null)

  const handleLoadingClick = () => {
    setIsLoading(true)
    setTimeout(() => setIsLoading(false), 2000)
  }

  const scrollToIntro = () => {
    scrollTo(window.innerHeight)
  }

  // Get mock data
  const horses = getMockHorses()
  const articles = getMockArticles()
  const breeds = Array.from(new Set(horses.map(h => h.breed)))
  const disciplines = Array.from(new Set(horses.flatMap(h => h.discipline)))

  return (
    <>
      <Header />

      {/* Hero Section with Video Background */}
      <HeroSection
        headline="Luxury Equestrian Excellence"
        subheadline="Welcome to MAM Center"
        description="Experience the pinnacle of equestrian luxury with our world-class facilities, premium services, and exclusive experiences."
        imageSrc="https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=1600"
        ctaText="Explore Our Services"
        onCtaClick={scrollToIntro}
      />

      {/* Introduction */}
      <section className="relative px-6 py-24 bg-midnight">
        <div className="mx-auto max-w-4xl text-center">
          <ViewportAnimator animation="fade-in">
            <Display size="2xl" className="mb-6">
              Discover Excellence
            </Display>
            <Paragraph size="lg" maxWidth="prose">
              Scroll down to explore our collection of championship horses and world-class facilities.
            </Paragraph>
          </ViewportAnimator>
        </div>
      </section>

      {/* Featured Horses Portfolio */}
      <HorsePortfolio
        horses={horses}
        breeds={breeds}
        disciplines={disciplines}
        ageRange={[4, 12]}
        priceRange={[50000, 150000]}
        onHorseClick={(horse) => console.log('Clicked horse:', horse.id)}
      />

      {/* Services Overview with Parallax */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-midnight to-hunter" />

        <ParallaxSection speed={0.3} className="absolute top-20 left-10">
          <GlassPanel variant="dark" className="p-6">
            <Trees className="h-8 w-8 text-gold mb-2" />
            <Heading level={4}>World-Class Horses</Heading>
            <Paragraph size="sm">Premium equestrian facilities</Paragraph>
          </GlassPanel>
        </ParallaxSection>

        <ParallaxSection speed={0.5} className="absolute top-40 right-20">
          <GlassPanel variant="elevated" className="p-6">
            <Trophy className="h-8 w-8 text-gold mb-2" />
            <Heading level={4}>Award Winning</Heading>
            <Paragraph size="sm">Excellence in equine care</Paragraph>
          </GlassPanel>
        </ParallaxSection>

        <ParallaxSection speed={0.2} className="absolute bottom-40 left-20">
          <GlassPanel variant="bordered" className="p-6">
            <Trees className="h-8 w-8 text-gold mb-2" />
            <Heading level={4}>Beautiful Environment</Heading>
            <Paragraph size="sm">60 acres of pristine grounds</Paragraph>
          </GlassPanel>
        </ParallaxSection>

        <div className="relative z-10 text-center px-6">
          <ViewportAnimator animation="slide-up">
            <Display size="2xl" gradient="gold" className="mb-4">
              Premium Services
            </Display>
            <Paragraph size="lg" maxWidth="prose">
              From training to breeding, we offer comprehensive equestrian services
            </Paragraph>
          </ViewportAnimator>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative px-6 py-24 md:px-12 lg:px-24 bg-gradient-to-b from-midnight to-hunter">
        <div className="mx-auto max-w-7xl">
          <ViewportAnimator animation="slide-up">
            <div className="text-center mb-16">
              <Heading level={2} className="mb-4">Why Choose MAM Center</Heading>
              <Paragraph maxWidth="prose">
                Our commitment to excellence in every aspect of equestrian care
              </Paragraph>
            </div>
          </ViewportAnimator>

          <GlassCardGrid cols={3} gap="lg">
            <GlassCard
              icon={<Trophy className="h-6 w-6" />}
              title="Champion Bloodlines"
              description="Our horses come from the finest pedigrees, selected for their exceptional qualities and proven performance."
              noise
            />
            <GlassCard
              icon={<Sparkles className="h-6 w-6" />}
              title="Expert Training"
              description="Customized training programs designed to bring out the best in each horse and rider combination."
              variant="elevated"
              noise
            />
            <GlassCard
              icon={<Users className="h-6 w-6" />}
              title="Dedicated Team"
              description="Our experienced professionals provide unparalleled care and attention to every detail."
              variant="bordered"
              noise
            />
          </GlassCardGrid>
        </div>
      </section>

      {/* 3D Scroll-Controlled Animation Demo */}
      <section className="relative py-32 overflow-hidden bg-midnight">
        <ScrollControlled3D
          scrollRange={2000}
          pin
          animations={[
            {
              target: cubeRef,
              property: 'rotation',
              axis: 'y',
              startValue: 0,
              endValue: Math.PI * 2,
            },
            {
              target: cubeRef,
              property: 'rotation',
              axis: 'x',
              startValue: 0,
              endValue: Math.PI,
            },
          ]}
          description="3D cube rotating as you scroll"
        >
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
          <group ref={cubeRef}>
            <mesh castShadow>
              <boxGeometry args={[2, 2, 2]} />
              <meshStandardMaterial color="#d4af37" metalness={0.3} roughness={0.4} />
            </mesh>
          </group>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]} receiveShadow>
            <planeGeometry args={[20, 20]} />
            <meshStandardMaterial color="#0a0e27" roughness={1} />
          </mesh>
        </ScrollControlled3D>

        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <ViewportAnimator animation="fade-in">
              <Display size="3xl" className="mb-4">
                Interactive Experience
              </Display>
              <Paragraph size="lg">
                Scroll to see our 3D capabilities
              </Paragraph>
            </ViewportAnimator>
          </div>
        </div>
      </section>

      {/* Editorial / Journal Section */}
      <EditorialSection
        articles={articles}
        variant="magazine"
        showFeatured
        onArticleClick={(article) => console.log('Clicked article:', article.id)}
      />

      {/* Newsletter Signup */}
      <section className="relative px-6 py-16 bg-hunter">
        <div className="mx-auto max-w-7xl">
          <NewsletterSignup
            title="Stay Informed"
            description="Subscribe to our newsletter for the latest news, insights, and exclusive offers from MAM Center."
          />
        </div>
      </section>

      {/* Motion Control Section */}
      <section className="relative px-6 py-24 bg-midnight">
        <div className="mx-auto max-w-4xl">
          <ViewportAnimator animation="fade-in">
            <GlassPanel variant="dark" className="p-8">
              <div className="text-center mb-6">
                <Display size="2xl" className="mb-4">
                  Animation Controls
                </Display>
                <Paragraph maxWidth="prose">
                  Toggle between full motion and reduced motion preferences.
                </Paragraph>
              </div>

              <div className="flex items-center justify-center gap-6">
                <div className="text-center">
                  <Caption className="mb-2">Current State</Caption>
                  <Text variant={shouldReduceMotion ? "muted" : "gold"} className="text-lg font-semibold">
                    {shouldReduceMotion ? 'Reduced Motion' : 'Full Motion'}
                  </Text>
                </div>

                <GlassButton
                  variant={shouldReduceMotion ? 'outline' : 'primary'}
                  size="large"
                  onClick={toggleMotion}
                  leftIcon={<Sparkles className="h-4 w-4" />}
                >
                  {shouldReduceMotion ? 'Enable' : 'Reduce'} Motion
                </GlassButton>
              </div>

              <div className="mt-8 pt-8 border-t border-gold/10">
                <Paragraph size="sm" maxWidth="prose" className="text-center">
                  Reduced motion disables smooth scrolling, 3D animations, and transitions
                  while maintaining all functionality.
                </Paragraph>
              </div>
            </GlassPanel>
          </ViewportAnimator>
        </div>
      </section>

      {/* Call to Action */}
      <section className="relative px-6 py-32 bg-gradient-to-br from-hunter to-midnight overflow-hidden">
        <ParallaxSection speed={0.2} className="absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-gold/5 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-gold/3 blur-3xl" />
        </ParallaxSection>

        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <ViewportAnimator animation="slide-up">
            <Display size="3xl" gradient="gold" className="mb-6">
              Ready to Experience Luxury?
            </Display>
            <Paragraph size="lg" maxWidth="prose" className="mb-8">
              Join us at MAM Center and discover the ultimate equestrian experience.
            </Paragraph>
            <GlassButton variant="primary" size="large" rightIcon={<ArrowRight className="h-4 w-4" />}>
              Get Started Today
            </GlassButton>
          </ViewportAnimator>
        </div>
      </section>

      <Footer showNewsletter showMotionToggle />
    </>
  )
}
