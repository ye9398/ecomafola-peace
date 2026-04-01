import productDetailsConfig from '../data/product-details-config.json'

export interface ProductDetailConfig {
  handle: string
  mission: {
    title: string
    content: string
  } | string
  environmental: {
    title: string
    subtitle: string
    content: string
  } | string
  partnership: {
    title: string
    subtitle: string
    content: string
  } | string
  qualityGuarantee: string
  reviews: {
    items: Array<{
      id: string
      name: string
      content: string
      rating: number
      avatar?: string
    }>
  }
}

/**
 * 根据 Shopify handle 获取产品详情配置
 * @param handle - Shopify product handle
 * @returns 产品详情配置对象，如果未找到则返回 null
 */
export async function getProductDetailByHandle(handle: string): Promise<ProductDetailConfig | null> {
  try {
    const config = productDetailsConfig as ProductDetailConfig[]
    return config.find(p => p.handle === handle) || null
  } catch (error) {
    console.error('Failed to load product detail config:', error)
    return null
  }
}

/**
 * 获取所有产品详情配置
 * @returns 所有产品详情配置数组
 */
export async function getAllProductDetails(): Promise<ProductDetailConfig[]> {
  try {
    return productDetailsConfig as ProductDetailConfig[]
  } catch (error) {
    console.error('Failed to load all product details:', error)
    return []
  }
}
