'use client'

import React from 'react'
import { Calendar, Clock, User, ArrowRight, BookOpen, TrendingUp } from 'lucide-react'
import { GlassPanel } from '@/components/ui/GlassPanel'
import { ScrollReveal } from '@/components/motion/scroll-reveal'
import { ViewportAnimator } from '@/components/motion/MotionWrapper'
import { Display, Heading, Paragraph, Caption, Label, Text } from '@/components/ui/Typography'
import { GlassButton } from '@/components/ui/GlassButton'
import { cn } from '@/lib/utils'

/**
 * Article/Editorial content data
 */
export interface Article {
  id: string
  title: string
  excerpt?: string
  content?: string
  author?: {
    name: string
    avatar?: string
    title?: string
  }
  publishDate: string
  readTime?: string
  category?: string
  tags?: string[]
  image?: string
  featured?: boolean
  layout?: 'full-width' | 'split' | 'centered'
}

/**
 * Editorial section props
 */
export interface EditorialSectionProps {
  articles: Article[]
  variant?: 'magazine' | 'blog' | 'news' | 'minimal'
  showFeatured?: boolean
  onArticleClick?: (article: Article) => void
  className?: string
}

/**
 * Magazine-style article card
 */
function MagazineCard({ article, onClick }: { article: Article; onClick?: () => void }) {
  return (
    <article
      className={cn(
        'group cursor-pointer',
        article.featured && 'md:col-span-2 lg:col-span-3'
      )}
      onClick={onClick}
    >
      <GlassPanel
        variant={article.featured ? 'elevated' : 'bordered'}
        className={cn(
          'overflow-hidden transition-all duration-300 hover:scale-[1.02]',
          article.featured ? 'p-0' : 'p-4'
        )}
      >
        {article.image && (
          <div className={cn(
            'overflow-hidden',
            article.featured ? 'aspect-[21/9]' : 'aspect-[16/10] mb-4'
          )}>
            <img
              src={article.image}
              alt={article.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        )}

        <div className={cn('space-y-3', article.featured && 'p-8')}>
          {/* Category & Meta */}
          <div className="flex items-center gap-3">
            {article.category && (
              <span className="px-3 py-1 rounded-full bg-gold/20 text-gold text-xs font-semibold uppercase tracking-wider">
                {article.category}
              </span>
            )}
            <div className="flex items-center gap-2 text-gold/60">
              <Calendar className="h-3 w-3" />
              <Caption>{article.publishDate}</Caption>
            </div>
            {article.readTime && (
              <div className="flex items-center gap-2 text-gold/60">
                <Clock className="h-3 w-3" />
                <Caption>{article.readTime}</Caption>
              </div>
            )}
          </div>

          {/* Title */}
          <Heading
            level={article.featured ? 2 : 4}
            className="group-hover:text-gold transition-colors"
          >
            {article.title}
          </Heading>

          {/* Excerpt */}
          {article.excerpt && (
            <Paragraph size={article.featured ? 'lg' : 'base'} maxWidth="prose">
              {article.excerpt}
            </Paragraph>
          )}

          {/* Author */}
          {article.author && (
            <div className="flex items-center gap-3 pt-2 border-t border-gold/10">
              {article.author.avatar && (
                <img
                  src={article.author.avatar}
                  alt={article.author.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
              )}
              <div>
                <Text size="sm" className="font-medium">{article.author.name}</Text>
                {article.author.title && (
                  <Caption>{article.author.title}</Caption>
                )}
              </div>
            </div>
          )}

          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {article.tags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 rounded bg-gold/5 text-gold/80 text-xs"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </GlassPanel>
    </article>
  )
}

/**
 * Full article view component
 */
export function FullArticle({ article }: { article: Article }) {
  return (
    <article className="max-w-4xl mx-auto">
      {/* Hero Image */}
      {article.image && (
        <ViewportAnimator animation="fade-in">
          <div className="aspect-[21/9] rounded-2xl overflow-hidden mb-8">
            <img
              src={article.image}
              alt={article.title}
              className="w-full h-full object-cover"
            />
          </div>
        </ViewportAnimator>
      )}

      {/* Meta Info */}
      <ScrollReveal delay={100}>
        <div className="flex flex-wrap items-center gap-4 mb-6">
          {article.category && (
            <span className="px-3 py-1 rounded-full bg-gold/20 text-gold text-xs font-semibold uppercase tracking-wider">
              {article.category}
            </span>
          )}
          <div className="flex items-center gap-2 text-gold/60">
            <Calendar className="h-4 w-4" />
            <Text>{article.publishDate}</Text>
          </div>
          {article.readTime && (
            <div className="flex items-center gap-2 text-gold/60">
              <Clock className="h-4 w-4" />
              <Text>{article.readTime} read</Text>
            </div>
          )}
        </div>
      </ScrollReveal>

      {/* Title */}
      <ViewportAnimator animation="slide-up" delay={200}>
        <Display size="3xl" className="mb-6">
          {article.title}
        </Display>
      </ViewportAnimator>

      {/* Author Box */}
      {article.author && (
        <ScrollReveal delay={300}>
          <GlassPanel variant="dark" className="p-4 mb-8 flex items-center gap-4">
            {article.author.avatar && (
              <img
                src={article.author.avatar}
                alt={article.author.name}
                className="w-16 h-16 rounded-full object-cover"
              />
            )}
            <div>
              <Text className="font-semibold">{article.author.name}</Text>
              {article.author.title && (
                <Caption>{article.author.title}</Caption>
              )}
            </div>
          </GlassPanel>
        </ScrollReveal>
      )}

      {/* Content */}
      <ScrollReveal delay={400}>
        <div className="prose prose-invert prose-lg max-w-none">
          {article.content && (
            <div
              dangerouslySetInnerHTML={{ __html: article.content }}
              className="text-gold/90 leading-relaxed space-y-6"
            />
          )}
        </div>
      </ScrollReveal>

      {/* Tags */}
      {article.tags && article.tags.length > 0 && (
        <ScrollReveal delay={500}>
          <div className="mt-12 pt-8 border-t border-gold/10">
            <Label className="mb-3">Tags</Label>
            <div className="flex flex-wrap gap-2">
              {article.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 rounded-full bg-gold/10 text-gold text-sm"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </ScrollReveal>
      )}
    </article>
  )
}

/**
 * Editorial Magazine Section
 *
 * Magazine-style editorial layouts for blog posts, news, and stories.
 * Features featured article, grid layouts, and sophisticated typography.
 *
 * @example
 * ```tsx
 * <EditorialSection
 *   articles={articles}
 *   variant="magazine"
 *   showFeatured
 *   onArticleClick={(article) => navigateToArticle(article.id)}
 * />
 * ```
 */
export function EditorialSection({
  articles,
  variant = 'magazine',
  showFeatured = true,
  onArticleClick,
  className,
}: EditorialSectionProps) {
  // Separate featured and regular articles
  const featuredArticle = showFeatured ? articles.find((a) => a.featured) : null
  const regularArticles = articles.filter((a) => !a.featured)

  return (
    <section className={cn('px-6 py-16 bg-midnight', className)}>
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <ViewportAnimator animation="fade-in">
          <div className="text-center mb-12">
            <Display size="2xl" className="mb-4">
              Journal & Stories
            </Display>
            <Paragraph size="lg" maxWidth="prose">
              Discover the latest news, insights, and stories from the equestrian world
            </Paragraph>
          </div>
        </ViewportAnimator>

        {/* Featured Article */}
        {featuredArticle && (
          <ScrollReveal delay={100}>
            <div className="mb-12">
              <MagazineCard article={featuredArticle} onClick={() => onArticleClick?.(featuredArticle)} />
            </div>
          </ScrollReveal>
        )}

        {/* Article Grid */}
        {variant === 'magazine' && (
          <ScrollReveal delay={200} stagger={100}>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {regularArticles.map((article) => (
                <MagazineCard
                  key={article.id}
                  article={article}
                  onClick={() => onArticleClick?.(article)}
                />
              ))}
            </div>
          </ScrollReveal>
        )}

        {/* Blog List Variant */}
        {variant === 'blog' && (
          <div className="max-w-3xl mx-auto space-y-6">
            {regularArticles.map((article, index) => (
              <ScrollReveal key={article.id} delay={index * 100}>
                <GlassPanel
                  variant="bordered"
                  className="p-6 cursor-pointer hover:scale-[1.01] transition-all"
                  onClick={() => onArticleClick?.(article)}
                >
                  <div className="flex gap-6">
                    {article.image && (
                      <div className="flex-shrink-0 w-32 h-24 rounded-lg overflow-hidden">
                        <img
                          src={article.image}
                          alt={article.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        {article.category && (
                          <span className="text-gold text-xs font-semibold uppercase">
                            {article.category}
                          </span>
                        )}
                        <Caption>{article.publishDate}</Caption>
                      </div>
                      <Heading level={5} className="mb-2 hover:text-gold transition-colors">
                        {article.title}
                      </Heading>
                      {article.excerpt && (
                        <Paragraph size="sm" className="line-clamp-2">
                          {article.excerpt}
                        </Paragraph>
                      )}
                    </div>
                  </div>
                </GlassPanel>
              </ScrollReveal>
            ))}
          </div>
        )}

        {/* Minimal List Variant */}
        {variant === 'minimal' && (
          <div className="max-w-2xl mx-auto">
            {articles.map((article, index) => (
              <ScrollReveal key={article.id} delay={index * 50}>
                <button
                  onClick={() => onArticleClick?.(article)}
                  className="w-full text-left py-6 border-b border-gold/10 hover:border-gold/30 transition-colors group"
                >
                  <Caption className="text-gold/60 mb-1">{article.publishDate}</Caption>
                  <Heading level={5} className="group-hover:text-gold transition-colors">
                    {article.title}
                  </Heading>
                  {article.excerpt && (
                    <Paragraph size="sm" className="mt-2 text-gold/70 line-clamp-1">
                      {article.excerpt}
                    </Paragraph>
                  )}
                </button>
              </ScrollReveal>
            ))}
          </div>
        )}

        {/* Load More Button */}
        {variant !== 'minimal' && regularArticles.length > 0 && (
          <ScrollReveal delay={400}>
            <div className="mt-12 text-center">
              <GlassButton
                variant="outline"
                size="large"
                rightIcon={<ArrowRight className="h-4 w-4" />}
              >
                Load More Articles
              </GlassButton>
            </div>
          </ScrollReveal>
        )}
      </div>
    </section>
  )
}

/**
 * Insight Card Component
 */
export function InsightCard({
  title,
  description,
  icon,
  trend,
  className,
}: {
  title: string
  description: string
  icon?: React.ReactNode
  trend?: string
  className?: string
}) {
  return (
    <GlassPanel variant="bordered" className={cn('p-6', className)}>
      <div className="flex items-start justify-between mb-4">
        {icon && <div className="text-gold">{icon}</div>}
        {trend && (
          <div className="flex items-center gap-1 text-green-400 text-sm">
            <TrendingUp className="h-3 w-3" />
            <span>{trend}</span>
          </div>
        )}
      </div>
      <Heading level={5} className="mb-2">{title}</Heading>
      <Paragraph size="sm">{description}</Paragraph>
    </GlassPanel>
  )
}

/**
 * Newsletter Signup Component
 */
export function NewsletterSignup({
  title = "Stay Informed",
  description = "Get the latest news, insights, and exclusive content delivered to your inbox.",
  className,
}: {
  title?: string
  description?: string
  className?: string
}) {
  const [email, setEmail] = React.useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle newsletter signup
    console.log('Newsletter signup:', email)
    setEmail('')
  }

  return (
    <ScrollReveal>
      <GlassPanel variant="elevated" className={cn('p-8 md:p-12', className)}>
        <div className="max-w-2xl mx-auto text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-full bg-gold/10">
              <BookOpen className="h-6 w-6 text-gold" />
            </div>
          </div>
          <Display size="1xl" className="mb-4">{title}</Display>
          <Paragraph size="lg" maxWidth="prose" className="mb-8">
            {description}
          </Paragraph>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="flex-1 px-4 py-3 bg-midnight/50 border border-gold/20 rounded-lg text-white placeholder:text-gold/30 focus:outline-none focus:ring-2 focus:ring-gold/50"
            />
            <GlassButton type="submit" variant="primary" size="large">
              Subscribe
            </GlassButton>
          </form>

          <Text size="xs" variant="muted" className="mt-4">
            We respect your privacy. Unsubscribe at any time.
          </Text>
        </div>
      </GlassPanel>
    </ScrollReveal>
  )
}
