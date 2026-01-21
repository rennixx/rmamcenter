/**
 * Data Fetching Utilities
 *
 * Centralized data fetching with caching, error handling, and TypeScript support.
 * Provides both mock data and real API integration patterns.
 */

import type { Horse } from '@/components/sections/horse-portfolio'
import type { HorseDetail } from '@/components/sections/horse-detail'
import type { Product } from '@/components/sections/product-showcase'
import type { Stallion, BreedingInfo } from '@/components/sections/breeding-program'
import type { Article } from '@/components/sections/editorial-layouts'

/**
 * API response wrapper
 */
export interface ApiResponse<T> {
  data: T | null
  error?: string
  status: number
  cached?: boolean
}

/**
 * Fetch options
 */
export interface FetchOptions {
  cache?: 'no-store' | 'force-cache' | 'default'
  revalidate?: number
  tags?: string[]
}

/**
 * Generic fetch function with error handling
 */
async function fetchFromAPI<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(endpoint, {
      cache: options.cache,
      next: {
        revalidate: options.revalidate,
        tags: options.tags,
      },
    })

    if (!response.ok) {
      return {
        data: null,
        error: `HTTP error! status: ${response.status}`,
        status: response.status,
      }
    }

    const data = await response.json()
    return {
      data,
      status: response.status,
      cached: response.headers.get('x-cache') === 'HIT',
    }
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : 'Unknown error',
      status: 500,
    }
  }
}

/**
 * Horse Data API
 */
export const horseAPI = {
  /**
   * Get all horses with optional filtering
   */
  async getAll(params?: {
    breed?: string
    discipline?: string
    minAge?: number
    maxAge?: number
    minPrice?: number
    maxPrice?: number
    search?: string
  }): Promise<ApiResponse<Horse[]>> {
    // In production, this would fetch from your API
    // const query = new URLSearchParams(params as any).toString()
    // return fetchFromAPI<Horse[]>(`/api/horses?${query}`)

    // For now, return mock data
    const { getMockHorses } = await import('@/lib/data/mock-data')
    let horses = getMockHorses()

    // Apply filters
    if (params) {
      if (params.breed) {
        horses = horses.filter(h => h.breed === params.breed)
      }
      if (params.discipline) {
        horses = horses.filter(h => h.discipline.includes(params.discipline!))
      }
      if (params.minAge !== undefined) {
        horses = horses.filter(h => h.age >= params.minAge!)
      }
      if (params.maxAge !== undefined) {
        horses = horses.filter(h => h.age <= params.maxAge!)
      }
      if (params.minPrice !== undefined) {
        horses = horses.filter(h => h.price >= params.minPrice!)
      }
      if (params.maxPrice !== undefined) {
        horses = horses.filter(h => h.price <= params.maxPrice!)
      }
      if (params.search) {
        const query = params.search.toLowerCase()
        horses = horses.filter(h =>
          h.name.toLowerCase().includes(query) ||
          h.breed.toLowerCase().includes(query)
        )
      }
    }

    return { data: horses, status: 200 }
  },

  /**
   * Get horse by ID with full details
   */
  async getById(id: string): Promise<ApiResponse<HorseDetail>> {
    // In production: return fetchFromAPI<HorseDetail>(`/api/horses/${id}`)

    const { getMockHorseDetail } = await import('@/lib/data/mock-data')
    const horse = getMockHorseDetail(id)

    if (!horse) {
      return {
        data: null,
        error: 'Horse not found',
        status: 404,
      }
    }

    return { data: horse, status: 200 }
  },

  /**
   * Get related horses
   */
  async getRelated(id: string, limit = 4): Promise<ApiResponse<Omit<HorseDetail, 'description' | 'pedigree'>[]>> {
    const { getMockHorses } = await import('@/lib/data/mock-data')
    const horses = getMockHorses()
    const related = horses
      .filter(h => h.id !== id)
      .slice(0, limit)
      .map(h => ({
        ...h,
        images: [h.image],
      }))

    return { data: related, status: 200 }
  },

  /**
   * Get available breeds
   */
  async getBreeds(): Promise<ApiResponse<string[]>> {
    const { getMockHorses } = await import('@/lib/data/mock-data')
    const horses = getMockHorses()
    const breeds = Array.from(new Set(horses.map(h => h.breed)))

    return { data: breeds, status: 200 }
  },

  /**
   * Get available disciplines
   */
  async getDisciplines(): Promise<ApiResponse<string[]>> {
    const { getMockHorses } = await import('@/lib/data/mock-data')
    const horses = getMockHorses()
    const disciplines = Array.from(new Set(horses.flatMap(h => h.discipline)))

    return { data: disciplines, status: 200 }
  },
}

/**
 * Product Data API
 */
export const productAPI = {
  /**
   * Get all products with optional filtering
   */
  async getAll(params?: {
    category?: Product['category'] | 'all'
    featured?: boolean
    inStock?: boolean
  }): Promise<ApiResponse<Product[]>> {
    const { getMockProducts } = await import('@/lib/data/mock-data')
    let products = getMockProducts()

    if (params) {
      if (params.category && params.category !== 'all') {
        products = products.filter(p => p.category === params.category)
      }
      if (params.featured !== undefined) {
        products = products.filter(p => p.featured === params.featured)
      }
      if (params.inStock !== undefined) {
        products = products.filter(p => p.inStock === params.inStock)
      }
    }

    return { data: products, status: 200 }
  },

  /**
   * Get product by ID
   */
  async getById(id: string): Promise<ApiResponse<Product>> {
    const { getMockProducts } = await import('@/lib/data/mock-data')
    const product = getMockProducts().find(p => p.id === id)

    if (!product) {
      return {
        data: null,
        error: 'Product not found',
        status: 404,
      }
    }

    return { data: product, status: 200 }
  },

  /**
   * Get featured products
   */
  async getFeatured(limit = 6): Promise<ApiResponse<Product[]>> {
    const { getMockProducts } = await import('@/lib/data/mock-data')
    const products = getMockProducts()
      .filter(p => p.featured)
      .slice(0, limit)

    return { data: products, status: 200 }
  },

  /**
   * Get products by category
   */
  async getByCategory(category: Product['category']): Promise<ApiResponse<Product[]>> {
    return this.getAll({ category })
  },
}

/**
 * Breeding Program API
 */
export const breedingAPI = {
  /**
   * Get all stallions
   */
  async getStallions(params?: {
    bookingStatus?: Stallion['bookingStatus']
  }): Promise<ApiResponse<Stallion[]>> {
    const { getMockStallions } = await import('@/lib/data/mock-data')
    let stallions = getMockStallions()

    if (params?.bookingStatus) {
      stallions = stallions.filter(s => s.bookingStatus === params.bookingStatus)
    }

    return { data: stallions, status: 200 }
  },

  /**
   * Get breeding program info
   */
  async getProgramInfo(): Promise<ApiResponse<BreedingInfo>> {
    const { getMockBreedingInfo } = await import('@/lib/data/mock-data')
    return { data: getMockBreedingInfo(), status: 200 }
  },

  /**
   * Get stallion by ID
   */
  async getStallionById(id: string): Promise<ApiResponse<Stallion>> {
    const { getMockStallions } = await import('@/lib/data/mock-data')
    const stallion = getMockStallions().find(s => s.id === id)

    if (!stallion) {
      return {
        data: null,
        error: 'Stallion not found',
        status: 404,
      }
    }

    return { data: stallion, status: 200 }
  },
}

/**
 * Editorial Content API
 */
export const editorialAPI = {
  /**
   * Get all articles
   */
  async getAll(params?: {
    category?: string
    featured?: boolean
    limit?: number
  }): Promise<ApiResponse<Article[]>> {
    const { getMockArticles } = await import('@/lib/data/mock-data')
    let articles = getMockArticles()

    if (params) {
      if (params.category) {
        articles = articles.filter(a => a.category === params.category)
      }
      if (params.featured !== undefined) {
        articles = articles.filter(a => a.featured === params.featured)
      }
      if (params.limit) {
        articles = articles.slice(0, params.limit)
      }
    }

    return { data: articles, status: 200 }
  },

  /**
   * Get article by ID
   */
  async getById(id: string): Promise<ApiResponse<Article>> {
    const { getMockArticles } = await import('@/lib/data/mock-data')
    const article = getMockArticles().find(a => a.id === id)

    if (!article) {
      return {
        data: null,
        error: 'Article not found',
        status: 404,
      }
    }

    return { data: article, status: 200 }
  },

  /**
   * Get featured articles
   */
  async getFeatured(limit = 3): Promise<ApiResponse<Article[]>> {
    return this.getAll({ featured: true, limit })
  },

  /**
   * Get articles by category
   */
  async getByCategory(category: string, limit = 6): Promise<ApiResponse<Article[]>> {
    return this.getAll({ category, limit })
  },
}

/**
 * Search API
 */
export const searchAPI = {
  /**
   * Global search across all content types
   */
  async search(query: string): Promise<ApiResponse<{
    horses: Horse[]
    products: Product[]
    articles: Article[]
  }>> {
    const q = query.toLowerCase()

    const [horsesResult, productsResult, articlesResult] = await Promise.all([
      horseAPI.getAll({ search: query }),
      productAPI.getAll(),
      editorialAPI.getAll(),
    ])

    const filteredProducts = productsResult.data?.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q)
    ) || []

    const filteredArticles = articlesResult.data?.filter(a =>
      a.title.toLowerCase().includes(q) ||
      a.excerpt?.toLowerCase().includes(q)
    ) || []

    return {
      data: {
        horses: horsesResult.data || [],
        products: filteredProducts,
        articles: filteredArticles,
      },
      status: 200,
    }
  },
}

/**
 * Cache helper functions
 */
export const cache = {
  /**
   * Invalidate cache by tag
   */
  async invalidate(tags: string[]) {
    if (typeof window !== 'undefined') {
      // Client-side cache invalidation
      // In Next.js, this would trigger a revalidation
      console.log('Invalidating cache for tags:', tags)
    }
  },

  /**
   * Prefetch data
   */
  async prefetch<T>(key: string, fetcher: () => Promise<ApiResponse<T>>) {
    // Prefetch data for faster navigation
    return fetcher()
  },
}
