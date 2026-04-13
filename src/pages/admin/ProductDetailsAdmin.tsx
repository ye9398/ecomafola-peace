import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Save, LogOut, ChevronLeft, Package } from 'lucide-react'
import { getAllProducts } from '../lib/shopify'
import { getProductContent, saveProductContent } from '../lib/contentService'
import { isSupabaseConfigured } from '../lib/supabase'

export default function ProductDetailsAdmin() {
  const navigate = useNavigate()
  const [shopifyProducts, setShopifyProducts] = useState<{ handle: string; name: string }[]>([])
  const [selectedProduct, setSelectedProduct] = useState('')
  const [content, setContent] = useState<any>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const authenticated = localStorage.getItem('admin_authenticated')
    if (!authenticated) {
      navigate('/dashboard/login')
      return
    }
    loadProductsAndContent()
  }, [navigate])

  useEffect(() => {
    if (!saved) return
    const timer = setTimeout(() => setSaved(false), 3000)
    return () => clearTimeout(timer)
  }, [saved])

  const loadProductsAndContent = async () => {
    setLoading(true)
    try {
      const products = await getAllProducts()
      const productList = products.map((p: any) => ({ handle: p.handle, name: p.title }))
      setShopifyProducts(productList)

      // Load existing content from Supabase for all products
      const contentMap: Record<string, any> = {}
      for (const product of productList) {
        const saved = await getProductContent(product.handle)
        if (saved) {
          contentMap[product.handle] = saved
        }
      }
      setContent(contentMap)
    } catch (error) {
      console.error('Error loading products:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('admin_authenticated')
    navigate('/')
  }

  const handleSavePublish = async () => {
    if (!selectedProduct) return
    setSaving(true)
    try {
      await saveProductContent(selectedProduct, content[selectedProduct] || {})
      setSaved(true)
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert('保存失败: ' + err.message)
      } else {
        alert('保存失败，请重试')
      }
    } finally {
      setSaving(false)
    }
  }

  const updateContent = (field: string, value: string) => {
    if (!selectedProduct) return
    setContent({
      ...content,
      [selectedProduct]: {
        ...content[selectedProduct],
        [field]: value,
      },
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">加载中...</div>
      </div>
    )
  }

  const selectedProductInfo = shopifyProducts.find(p => p.handle === selectedProduct)

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/dashboard')} className="text-gray-600 hover:text-gray-900">
              <ChevronLeft size={24} />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">产品详情管理</h1>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={handleSavePublish}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              <Save size={20} />
              <span>{saving ? '保存中...' : '保存并发布'}</span>
            </button>
            {saved && <span className="text-green-600">✓ 已保存</span>}
            {!isSupabaseConfigured() && (
              <span className="text-xs text-red-500">Supabase 未配置</span>
            )}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-red-600 transition-colors"
            >
              <LogOut size={20} />
              <span>退出</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            选择产品
          </label>
          <select
            value={selectedProduct}
            onChange={(e) => setSelectedProduct(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">请选择产品...</option>
            {shopifyProducts.map((product) => (
              <option key={product.handle} value={product.handle}>
                {product.name}
              </option>
            ))}
          </select>
        </div>

        {selectedProduct ? (
          <div className="bg-white rounded-lg shadow p-6 space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b">
              <Package className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-bold text-gray-900">
                {selectedProductInfo?.name}
              </h2>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                品牌故事 (Story)
              </label>
              <textarea
                value={content[selectedProduct]?.story || ''}
                onChange={(e) => updateContent('story', e.target.value)}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="讲述产品的品牌故事..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                环保影响 (Environmental)
              </label>
              <textarea
                value={content[selectedProduct]?.environmental || ''}
                onChange={(e) => updateContent('environmental', e.target.value)}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="描述产品的环保影响..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                合作模式 (Partnership)
              </label>
              <textarea
                value={content[selectedProduct]?.partnership || ''}
                onChange={(e) => updateContent('partnership', e.target.value)}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="描述合作模式..."
              />
            </div>
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            请选择一个产品开始编辑
          </div>
        )}
      </main>
    </div>
  )
}
