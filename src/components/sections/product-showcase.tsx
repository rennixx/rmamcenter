'use client'

import React, { useState, useRef, Suspense } from 'react'
import { ShoppingCart, Heart, Share2, Eye, Box, Package, Truck, Shield, Award } from 'lucide-react'
import { GlassCard, GlassCardGrid } from '@/components/ui/GlassCard'
import { GlassPanel } from '@/components/ui/GlassPanel'
import { ScrollReveal } from '@/components/motion/scroll-reveal'
import { ViewportAnimator } from '@/components/motion/MotionWrapper'
import { Display, Heading, Paragraph, Label, Caption, Text } from '@/components/ui/Typography'
import { GlassButton } from '@/components/ui/GlassButton'
import { ProductViewer } from '@/components/3d/product-viewer'
import { CanvasWrapper } from '@/components/3d/canvas-wrapper'
import { cn } from '@/lib/utils'

/**
 * Product data type
 */
export interface Product {
  id: string
  name: string
  category: 'equipment' | 'apparel' | 'accessories' | 'nutrition' | 'care'
  price: number
  currency?: string
  images: string[]
  thumbnail?: string
  description: string
  features: string[]
  specifications?: Record<string, string>
  inStock: boolean
  featured?: boolean
  modelPath?: string // For 3D viewer
  modelType?: 'gltf' | 'glb' | 'obj'
  environmentPreset?: 'studio' | 'outdoor' | 'stable' | 'showground'
  colors?: string[]
  sizes?: string[]
  rating?: number
  reviewCount?: number
}

/**
 * Props for ProductShowcase component
 */
export interface ProductShowcaseProps {
  /** Products to display */
  products: Product[]
  /** Featured product ID for hero display */
  featuredProductId?: string
  /** Category filter */
  category?: Product['category'] | 'all'
  /** Layout variant */
  layout?: 'hero-grid' | 'full-3d' | 'minimal' | 'magazine'
  /** Action callbacks */
  onProductClick?: (product: Product) => void
  onAddToCart?: (product: Product, variant?: { color?: string; size?: string }) => void
  onFavorite?: (product: Product) => void
  onShare?: (product: Product) => void
  /** Additional class names */
  className?: string
}

/**
 * 3D Product Viewer Modal
 */
function ProductViewerModal({
  product,
  isOpen,
  onClose,
}: {
  product: Product
  isOpen: boolean
  onClose: () => void
}) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 rounded-full bg-gold/10 hover:bg-gold/20 transition-colors z-10"
        aria-label="Close viewer"
      >
        <X className="h-6 w-6 text-gold" />
      </button>

      <div className="w-full max-w-6xl h-[80vh] rounded-2xl overflow-hidden border border-gold/20">
        {product.modelPath ? (
          <ProductViewer
            modelPath={product.modelPath}
            productType={product.category}
            productName={product.name}
          />
        ) : (
          <CanvasWrapper
            cameraPosition={[3, 2, 5]}
            ariaLabel={`3D viewer for ${product.name}`}
            className="h-full"
          >
            <ambientLight intensity={0.5} />
            <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
            <mesh castShadow>
              <boxGeometry args={[1, 1, 1]} />
              <meshStandardMaterial color="#d4af37" metalness={0.3} roughness={0.4} />
            </mesh>
          </CanvasWrapper>
        )}
      </div>
    </div>
  )
}

/**
 * Product Card Component
 */
function ProductCard({
  product,
  onProductClick,
  onAddToCart,
  onFavorite,
  layout = 'grid',
}: {
  product: Product
  onProductClick?: (product: Product) => void
  onAddToCart?: (product: Product, variant?: { color?: string; size?: string }) => void
  onFavorite?: (product: Product) => void
  layout?: 'grid' | 'magazine'
}) {
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0])
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0])

  return (
    <GlassCard
      title={product.name}
      description={product.description}
      variant={product.featured ? 'elevated' : 'bordered'}
      onClick={() => onProductClick?.(product)}
      className={cn(
        'group transition-all duration-300',
        !product.inStock && 'opacity-60'
      )}
      action={
        <div className="flex items-center gap-2">
          {onFavorite && (
            <GlassButton
              variant="ghost"
              size="small"
              leftIcon={<Heart className="h-4 w-4" />}
              onClick={(e) => {
                e.stopPropagation()
                onFavorite(product)
              }}
              aria-label="Add to favorites"
            >
              <span className="sr-only">Add to favorites</span>
            </GlassButton>
          )}
          {onAddToCart && product.inStock && (
            <GlassButton
              variant="primary"
              size="small"
              leftIcon={<ShoppingCart className="h-4 w-4" />}
              onClick={(e) => {
                e.stopPropagation()
                onAddToCart(product, { color: selectedColor, size: selectedSize })
              }}
            >
              Add to Cart
            </GlassButton>
          )}
        </div>
      }
    >
      {/* Image */}
      <div className="aspect-[4/3] rounded-lg overflow-hidden mb-4 -mt-10 -mx-10">
        <img
          src={product.thumbnail || product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Metadata */}
      <div className="space-y-1 mb-4">
        <Text size="sm">{product.category}</Text>
        <Text size="sm" className="font-semibold">${product.price.toLocaleString()}</Text>
        <Text size="sm" className={product.inStock ? 'text-green-400' : 'text-red-400'}>
          {product.inStock ? 'In Stock' : 'Out of Stock'}
        </Text>
      </div>
      {/* Variant Selectors */}
      {layout === 'grid' && (
        <div className="mt-4 space-y-2">
          {product.colors && product.colors.length > 0 && (
            <div className="flex items-center gap-2">
              <Label>Color:</Label>
              <div className="flex gap-1">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelectedColor(color)
                    }}
                    className={cn(
                      'w-6 h-6 rounded-full border-2 transition-all',
                      selectedColor === color ? 'border-gold scale-110' : 'border-gold/30'
                    )}
                    style={{ backgroundColor: color }}
                    aria-label={`Select ${color}`}
                  />
                ))}
              </div>
            </div>
          )}

          {product.sizes && product.sizes.length > 0 && (
            <div className="flex items-center gap-2">
              <Label>Size:</Label>
              <div className="flex gap-1">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelectedSize(size)
                    }}
                    className={cn(
                      'px-2 py-1 rounded text-xs border transition-all',
                      selectedSize === size
                        ? 'border-gold bg-gold/10 text-gold'
                        : 'border-gold/30 hover:border-gold/60'
                    )}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Rating */}
      {product.rating && (
        <div className="mt-3 flex items-center gap-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className={cn(
                  'h-4 w-4',
                  i < product.rating! ? 'text-gold' : 'text-gold/30'
                )}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          {product.reviewCount && (
            <Text size="xs" variant="muted">({product.reviewCount})</Text>
          )}
        </div>
      )}
    </GlassCard>
  )
}

/**
 * Featured Product Hero Component
 */
function FeaturedProductHero({
  product,
  onViewIn3D,
  onAddToCart,
}: {
  product: Product
  onViewIn3D: () => void
  onAddToCart: (product: Product) => void
}) {
  return (
    <div className="grid lg:grid-cols-2 gap-8 items-center">
      {/* Product Image/3D Preview */}
      <ViewportAnimator animation="fade-in">
        <div className="relative aspect-square rounded-2xl overflow-hidden">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover"
          />

          {/* View in 3D Button */}
          {product.modelPath && (
            <GlassButton
              variant="secondary"
              size="medium"
              className="absolute bottom-4 right-4"
              leftIcon={<Eye className="h-4 w-4" />}
              onClick={onViewIn3D}
            >
              View in 3D
            </GlassButton>
          )}

          {/* Featured Badge */}
          {product.featured && (
            <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-gold/90 text-midnight text-sm font-semibold">
              Featured
            </div>
          )}
        </div>
      </ViewportAnimator>

      {/* Product Details */}
      <div className="space-y-6">
        <ViewportAnimator animation="slide-up" delay={100}>
          <Caption className="text-gold uppercase tracking-widest">
            {product.category}
          </Caption>
          <Display size="3xl" gradient="gold">
            {product.name}
          </Display>
          <Paragraph size="lg" maxWidth="prose">
            {product.description}
          </Paragraph>

          <div className="flex items-baseline gap-3">
            <Display size="2xl" gradient="gold">
              ${product.price.toLocaleString()}
            </Display>
            {product.currency && (
              <Text variant="muted">{product.currency}</Text>
            )}
          </div>
        </ViewportAnimator>

        {/* Features */}
        <ScrollReveal delay={200}>
          <div className="space-y-2">
            <Label>Key Features:</Label>
            <ul className="space-y-1">
              {product.features.slice(0, 4).map((feature, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-gold mt-1">•</span>
                  <Text>{feature}</Text>
                </li>
              ))}
            </ul>
          </div>
        </ScrollReveal>

        {/* CTA Buttons */}
        <ViewportAnimator animation="slide-up" delay={300}>
          <div className="flex flex-wrap gap-3">
            <GlassButton
              variant="primary"
              size="large"
              leftIcon={<ShoppingCart className="h-4 w-4" />}
              onClick={() => onAddToCart(product)}
              disabled={!product.inStock}
            >
              {product.inStock ? 'Add to Cart' : 'Out of Stock'}
            </GlassButton>
            <GlassButton
              variant="outline"
              size="large"
              leftIcon={<Heart className="h-4 w-4" />}
            >
              Add to Wishlist
            </GlassButton>
            <GlassButton
              variant="ghost"
              size="large"
              leftIcon={<Share2 className="h-4 w-4" />}
            >
              Share
            </GlassButton>
          </div>
        </ViewportAnimator>

        {/* Stock Status */}
        <ViewportAnimator animation="fade-in" delay={400}>
          <GlassPanel variant="dark" className="p-4">
            <div className="flex items-center gap-3">
              <div className={cn(
                'w-3 h-3 rounded-full',
                product.inStock ? 'bg-green-500' : 'bg-red-500'
              )} />
              <Text>
                {product.inStock ? 'In Stock' : 'Out of Stock'} - Ships within 2-3 business days
              </Text>
            </div>
          </GlassPanel>
        </ViewportAnimator>
      </div>
    </div>
  )
}

/**
 * Product Showcase Section
 *
 * Displays products in various layout styles with 3D viewer integration,
 * filtering, and shopping cart functionality.
 *
 * @example
 * ```tsx
 * <ProductShowcase
 *   products={productsData}
 *   featuredProductId="prod-001"
 *   layout="hero-grid"
 *   onAddToCart={(product) => addToCart(product)}
 *   onProductClick={(product) => navigateToProduct(product.id)}
 * />
 * ```
 */
export function ProductShowcase({
  products,
  featuredProductId,
  category = 'all',
  layout = 'hero-grid',
  onProductClick,
  onAddToCart,
  onFavorite,
  onShare,
  className,
}: ProductShowcaseProps) {
  const [is3DViewerOpen, setIs3DViewerOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  // Filter products
  const filteredProducts = category === 'all'
    ? products
    : products.filter((p) => p.category === category)

  // Get featured product
  const featuredProduct = featuredProductId
    ? products.find((p) => p.id === featuredProductId)
    : products.find((p) => p.featured)

  const handleViewIn3D = (product: Product) => {
    setSelectedProduct(product)
    setIs3DViewerOpen(true)
  }

  const handleAddToCart = (product: Product) => {
    onAddToCart?.(product)
  }

  const handleProductClick = (product: Product) => {
    if (product.modelPath) {
      handleViewIn3D(product)
    } else {
      onProductClick?.(product)
    }
  }

  return (
    <section className={`px-6 py-16 bg-midnight ${className || ''}`}>
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <ViewportAnimator animation="fade-in">
          <div className="text-center mb-12">
            <Display size="2xl" className="mb-4">
              Premium Equipment & Apparel
            </Display>
            <Paragraph size="lg" maxWidth="prose">
              Discover our curated collection of premium equestrian products
            </Paragraph>
          </div>
        </ViewportAnimator>

        {/* Benefits Bar */}
        <ScrollReveal delay={100}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {[
              { icon: <Truck className="h-5 w-5" />, label: 'Free Shipping' },
              { icon: <Shield className="h-5 w-5" />, label: 'Quality Guarantee' },
              { icon: <Award className="h-5 w-5" />, label: 'Premium Selection' },
              { icon: <Package className="h-5 w-5" />, label: 'Easy Returns' },
            ].map((benefit, index) => (
              <GlassPanel key={index} variant="dark" className="p-4 text-center">
                <div className="flex justify-center text-gold mb-2">{benefit.icon}</div>
                <Text size="sm" className="font-medium">{benefit.label}</Text>
              </GlassPanel>
            ))}
          </div>
        </ScrollReveal>

        {/* Featured Product Hero */}
        {featuredProduct && layout === 'hero-grid' && (
          <ScrollReveal delay={200}>
            <GlassPanel variant="elevated" className="p-8 mb-12">
              <FeaturedProductHero
                product={featuredProduct}
                onViewIn3D={() => handleViewIn3D(featuredProduct)}
                onAddToCart={handleAddToCart}
              />
            </GlassPanel>
          </ScrollReveal>
        )}

        {/* Product Grid */}
        <ScrollReveal delay={300} stagger={100}>
          <GlassCardGrid cols={3} gap="lg">
            {filteredProducts
              .filter((p) => p.id !== featuredProduct?.id) // Exclude featured from grid
              .map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onProductClick={handleProductClick}
                  onAddToCart={onAddToCart}
                  onFavorite={onFavorite}
                  layout={layout === 'magazine' ? 'magazine' : 'grid'}
                />
              ))}
          </GlassCardGrid>
        </ScrollReveal>

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <ViewportAnimator animation="fade-in">
            <GlassPanel variant="dark" className="p-12 text-center">
              <Box className="h-12 w-12 text-gold/40 mx-auto mb-4" />
              <Heading level={4} className="mb-2">No products found</Heading>
              <Paragraph size="lg">
                Try adjusting your filters to find what you're looking for.
              </Paragraph>
            </GlassPanel>
          </ViewportAnimator>
        )}

        {/* 3D Viewer Modal */}
        {selectedProduct && (
          <Suspense fallback={<div>Loading 3D viewer...</div>}>
            <ProductViewerModal
              product={selectedProduct}
              isOpen={is3DViewerOpen}
              onClose={() => {
                setIs3DViewerOpen(false)
                setSelectedProduct(null)
              }}
            />
          </Suspense>
        )}
      </div>
    </section>
  )
}

// Need to import X icon
import { X } from 'lucide-react'
