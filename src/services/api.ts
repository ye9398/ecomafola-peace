// Use environment variable for API base URL
// In production, leave VITE_API_BASE_URL empty to disable backend API calls
const BASE = import.meta.env.VITE_API_BASE_URL || ''

// Flag to check if backend API is available
const HAS_BACKEND = BASE.length > 0

// Mock products data for fallback when backend is unavailable
const mockProducts: Record<number, any> = {
  1: {
    id: 1,
    sku: 'COCONUT-BOWL-001',
    name: 'Coconut Bowl Set',
    subtitle: 'Hand-polished coconut shell',
    description: 'Each coconut bowl is handcrafted from reclaimed coconut shells, polished to a smooth finish that showcases the natural grain patterns. Perfect for smoothie bowls, salads, or decorative display.',
    price_usd: 38,
    stock: 45,
    category: 'coconut-bowls',
    image_url: 'https://images.unsplash.com/photo-1490818387583-1baba5e638af?w=800&q=80',
    tag: 'Best Seller',
    weight_kg: 0.3,
    dimensions: { width: 12, height: 6, depth: 12 },
    materials: ['Reclaimed coconut shell', 'Coconut oil finish'],
    origin: 'Samoa',
    artisan: 'Tala Village Cooperative',
    care_instructions: 'Hand wash only. Occasionally rub with coconut oil to maintain shine.',
    moq: 1,
    procurement: { source_1688: false, supplier_code: null, cost_cny: null }
  },
  2: {
    id: 2,
    sku: 'WOVEN-BASKET-002',
    name: 'Samoan Woven Basket',
    subtitle: 'Traditional pandanus weaving',
    description: 'Woven using traditional techniques passed down through generations. Made from sustainably harvested pandanus leaves, each basket takes3-5 days to complete.',
    price_usd: 65,
    stock: 28,
    category: 'woven-baskets',
    image_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
    tag: 'Handwoven',
    weight_kg: 0.5,
    dimensions: { width: 25, height: 20, depth: 25 },
    materials: ['Pandanus leaves', 'Natural dyes'],
    origin: 'Samoa',
    artisan: 'Lauaki Weaving Collective',
    care_instructions: 'Dust with soft cloth. Keep away from direct sunlight to preserve colors.',
    moq: 1,
    procurement: { source_1688: false, supplier_code: null, cost_cny: null }
  },
  3: {
    id: 3,
    sku: 'COCONUT-SOAP-003',
    name: 'Natural Coconut Soap',
    subtitle: 'Cold-pressed with island botanicals',
    description: 'Handcrafted using cold-process method with organic coconut oil and island botanicals. Free from synthetic fragrances and preservatives.',
    price_usd: 22,
    stock: 120,
    category: 'natural-soaps',
    image_url: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=800&q=80',
    tag: 'New',
    weight_kg: 0.1,
    dimensions: { width: 8, height: 5, depth: 3 },
    materials: ['Organic coconut oil', 'Island botanicals', 'Essential oils'],
    origin: 'Samoa',
    artisan: 'Pacific Pure Soap Works',
    care_instructions: 'Store in dry place between uses. Allow to drain after each use.',
    moq: 1,
    procurement: { source_1688: false, supplier_code: null, cost_cny: null }
  },
  4: {
    id: 4,
    sku: 'TEAK-FIGURINE-004',
    name: 'Carved Teak Figurine',
    subtitle: 'Traditional Samoan motifs',
    description: 'Hand-carved from reclaimed teak wood featuring traditional Samoan motifs. Each piece is unique and tells a story of island heritage.',
    price_usd: 95,
    stock: 15,
    category: 'wood-carvings',
    image_url: 'https://images.unsplash.com/photo-1604599340287-2042e85a3802?w=800&q=80',
    tag: 'Artisan Made',
    weight_kg: 0.8,
    dimensions: { width: 10, height:25, depth: 8 },
    materials: ['Reclaimed teak wood', 'Natural wood oil'],
    origin: 'Samoa',
    artisan: 'Mataafa Carving Studio',
    care_instructions: 'Dust regularly. Apply wood oil annually to maintain finish.',
    moq: 1,
    procurement: { source_1688: false, supplier_code: null, cost_cny: null }
  },
  5: {
    id: 5,
    sku: 'TAPA-CLOTH-005',
    name: 'Tapa Cloth Wall Art',
    subtitle: 'Authentic bark cloth print',
    description: 'Traditional tapa cloth made from mulberry bark, featuring authentic Samoan designs. Each piece is stamped by hand using carved wooden blocks.',
    price_usd: 120,
    stock: 8,
    category: 'textiles',
    image_url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&q=80',
    tag: 'Limited',
    weight_kg: 0.4,
    dimensions: { width: 60, height: 90, depth: 1 },
    materials: ['Mulberry bark', 'Natural earth pigments'],
    origin: 'Samoa',
    artisan: 'Siapo Arts Collective',
    care_instructions: 'Frame under glass. Do not fold. Keep away from moisture.',
    moq: 1,
    procurement: { source_1688: false, supplier_code: null, cost_cny: null }
  },
  6: {
    id: 6,
    sku: 'SHELL-NECKLACE-006',
    name: 'Shell & Seed Necklace',
    subtitle: 'Ocean-gathered, hand-strung',
    description: 'Each necklace is hand-strung using shells and seeds gathered from Pacific Ocean shores. No two pieces are exactly alike.',
    price_usd: 48,
    stock: 35,
    category: 'shell-jewelry',
    image_url: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80',
    tag: 'Eco Jewelry',
    weight_kg: 0.05,
    dimensions: { width: 2, height: 50, depth: 1 },
    materials: ['Natural shells', 'Seeds', 'Waxed cotton cord'],
    origin: 'Samoa',
    artisan: 'Ocean Treasures Collective',
    care_instructions: 'Avoid water and perfumes. Store flat in dry place.',
    moq: 1,
    procurement: { source_1688: false, supplier_code: null, cost_cny: null }
  }
}

// Countries not supported by 1688 direct shipping
const MOCK_UNSUPPORTED = ['KP', 'IR', 'SY', 'CU', 'SD', 'SS', 'LY', 'YE', 'MM', 'AF', 'RU', 'BY']

// Shipping zone config (mirrors server zones)
const MOCK_ZONES: Record<string, { zone: string; carrier: string; base: number; perKg: number; minDays: number; maxDays: number }> = {
  AU: { zone: 'Zone 1 – Oceania', carrier: 'Australia Post', base:12, perKg: 4, minDays:7, maxDays: 14 },
  NZ: { zone: 'Zone 1 – Oceania', carrier: 'NZ Post', base: 12, perKg: 4, minDays: 7, maxDays:14 },
  WS: { zone: 'Zone 1 – Oceania', carrier: 'Pacific Post', base: 8, perKg: 3, minDays: 5, maxDays: 10 },
  FJ: { zone: 'Zone 1 – Oceania', carrier: 'Pacific Post', base: 8, perKg: 3, minDays: 5, maxDays:10 },
  US: { zone: 'Zone 2 – Americas', carrier: 'USPS / DHL', base: 18, perKg: 6, minDays:10, maxDays: 18 },
  CA: { zone: 'Zone 2 – Americas', carrier: 'Canada Post', base: 18, perKg: 6, minDays: 10, maxDays: 18 },
  GB: { zone: 'Zone 3 – Europe', carrier: 'Royal Mail', base: 20, perKg: 7, minDays: 12, maxDays: 20 },
  DE: { zone: 'Zone 3 – Europe', carrier: 'DHL Europe', base: 20, perKg: 7, minDays: 12, maxDays: 20 },
  FR: { zone: 'Zone 3 – Europe', carrier: 'La Poste', base:20, perKg: 7, minDays: 12, maxDays: 20 },
  JP: { zone: 'Zone 4 – Asia', carrier: 'Japan Post', base: 15, perKg: 5, minDays: 8, maxDays: 14 },
  CN: { zone: 'Zone 4 – Asia', carrier: 'SF Express', base: 10, perKg: 3, minDays: 5, maxDays: 10 },
  SG: { zone: 'Zone 4 – Asia', carrier: 'SingPost', base:14, perKg: 4, minDays:7, maxDays: 12 },
  KR: { zone: 'Zone 4 – Asia', carrier: 'Korea Post', base: 14, perKg: 4, minDays: 7, maxDays:12 },
  ID: { zone: 'Zone 4 – Asia', carrier: 'JNE Express', base: 14, perKg: 4, minDays: 8, maxDays: 14 },
  AE: { zone: 'Zone 5 – Middle East', carrier: 'Aramex', base: 22, perKg: 8, minDays: 10, maxDays: 18 },
}

// Mock shipping calculation — returns same shape as backend /shipping/calculate
function mockCalculateShipping(countryCode: string, items: any[]) {
  const cc = countryCode.toUpperCase()
  if (MOCK_UNSUPPORTED.includes(cc)) {
    return { supported: false, country_code: cc, message: `We currently do not ship to ${cc}. Contact us for special arrangements.`, alternatives: ['Consider using a package forwarding service', 'Email hello@ecomafola.com'] }
  }
  const zone = MOCK_ZONES[cc] || { zone: 'Standard', carrier: 'International Post', base: 20, perKg: 7, minDays: 14, maxDays: 28 }
  let totalWeight = 0.3
  if (items.length > 0) {
    totalWeight = 0
    items.forEach((item: any) => {
      const product = mockProducts[item.product_id]
      if (product) totalWeight += product.weight_kg * item.quantity
    })
  }
  const weightFee = parseFloat((totalWeight * zone.perKg).toFixed(2))
  const baseTotal = parseFloat((zone.base + weightFee).toFixed(2))

  // Calculate items total for free shipping threshold
  let itemsTotal = 0
  items.forEach((item: any) => {
    const product = mockProducts[item.product_id]
    if (product) itemsTotal += product.price_usd * item.quantity
  })

  // Apply $35 Free Shipping threshold
  const isFree = itemsTotal >= 45
  const total = isFree ? 0 : baseTotal

  return {
    supported: true, country_code: cc, zone: zone.zone, carrier: zone.carrier,
    base_fee_usd: zone.base, weight_fee_usd: weightFee, total_shipping_usd: total,
    estimated_days: `${zone.minDays}–${zone.maxDays} business days`,
    total_weight_kg: parseFloat(totalWeight.toFixed(2)),
  }
}

// Mock IP location
function mockLocateByIP() {
  return {
    ip: '127.0.0.1',
    country: 'United States',
    country_code: 'US',
    region: 'California',
    city: 'San Francisco',
    lat: 37.7749,
    lon: -122.4194
  }
}

function getToken() { return localStorage.getItem('em_token') }

async function request(path: string, opts: RequestInit = {}) {
  const token = getToken()
  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }
    // Merge existing headers
    if (opts.headers) {
      const optHeaders = opts.headers as Record<string, string>
      for (const key in optHeaders) {
        headers[key] = optHeaders[key]
      }
    }
    // Add auth token if available
    if (token) {
      headers.Authorization = `Bearer ${token}`
    }
    const res = await fetch(`${BASE}${path}`, {
      ...opts,
      headers,
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || 'Request failed')
    return data
  } catch (error) {
    // Only log in development, silent fallback in production
    if (import.meta.env.DEV) {
      console.warn(`API request failed for ${path}, using mock data`, error)
    }
    throw error
  }
}

export const api = {
  // Auth
  login: (email: string, password: string) =>
    request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  register: (email: string, password: string, name: string, country: string, phone?: string) =>
    request('/auth/register', { method: 'POST', body: JSON.stringify({ email, password, name, country, phone }) }),
  me: () => request('/auth/me'),

  // Products
  getProducts: async (category?: string) => {
    try {
      return await request(`/products${category ? `?category=${category}` : ''}`)
    } catch {
      // Fallback to mock data when backend is unavailable
      const all = Object.values(mockProducts)
      const filtered = category ? all.filter((p: any) => p.category === category) : all
      return { products: filtered }
    }
  },
  getProduct: async (id: string | number) => {
    try {
      return await request(`/products/${id}`)
    } catch {
      // Fallback to mock data
      const product = mockProducts[Number(id)]
      if (product) {
        return { product }
      }
      throw new Error('Product not found')
    }
  },

  // Shipping
  locateByIP: async () => {
    if (!HAS_BACKEND) return mockLocateByIP()
    try {
      return await request('/shipping/locate')
    } catch {
      return mockLocateByIP()
    }
  },
  calcShipping: async (country_code: string, items: { product_id: number; quantity: number }[]) => {
    if (!HAS_BACKEND) return mockCalculateShipping(country_code, items)
    try {
      return await request('/shipping/calculate', { method: 'POST', body: JSON.stringify({ country_code, items }) })
    } catch {
      return mockCalculateShipping(country_code, items)
    }
  },
  getZones: () => request('/shipping/zones'),

  // 1688
  get1688Quote: (sku: string, quantity = 1) =>
    request(`/1688/quote/${sku}?quantity=${quantity}`),
  fulfill1688: (order_no: string, items: { sku: string; quantity: number }[]) =>
    request('/1688/fulfill', { method: 'POST', body: JSON.stringify({ order_no, items }) }),
  get1688Status: () => request('/1688/status'),

  // Payment
  getPaymentConfig: () => request('/payment/config'),
  getPaymentTerms: (provider: string) => request(`/payment/terms/${provider}`),
  createPaymentIntent: (amount_usd: number, method: string) =>
    request('/payment/intent', { method: 'POST', body: JSON.stringify({ amount_usd, method }) }),

  // Orders
  createOrder: (payload: object) =>
    request('/orders', { method: 'POST', body: JSON.stringify(payload) }),
  getOrders: () => request('/orders'),
  getOrder: (order_no: string) => request(`/orders/${order_no}`),
}
