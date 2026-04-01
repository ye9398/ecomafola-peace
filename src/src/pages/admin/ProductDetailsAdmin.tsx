import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Save, Download, LogOut, ChevronLeft, Package } from 'lucide-react'

/**
 * 产品详情管理页面
 * 零风险设计：
 * - 只编辑补充内容（品牌故事、环保影响等）
 * - 不修改 Shopify 核心数据
 * - 数据存储在独立 JSON 文件
 */

// 产品列表（与 Shopify handle 对应）
const PRODUCTS = [
  { handle: 'samoan-handcrafted-coconut-bowl', name: 'Coconut Bowl' },
  { handle: 'samoan-woven-basket', name: 'Woven Basket' },
  { handle: 'natural-coconut-soap', name: 'Natural Soap' },
]

export default function ProductDetailsAdmin() {
  const navigate = useNavigate()
  const [selectedProduct, setSelectedProduct] = useState('')
  const [content, setContent] = useState<any>({})
  const [loading, setLoading] = useState(true)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const authenticated = localStorage.getItem('admin_authenticated')
    if (!authenticated) {
      navigate('/dashboard/login')
      return
    }

    // 加载已保存的内容
    loadContent()
  }, [navigate])

  const loadContent = async () => {
    try {
      const response = await fetch('/admin-content/ecomafola-content.json')
      if (response.ok) {
        const data = await response.json()
        setContent(data.products || {})
      }
    } catch (error) {
      console.error('Error loading content:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('admin_authenticated')
    navigate('/')
  }

  const handleDownload = () => {
    const dataStr = JSON.stringify({ products: content }, null, 2)
    const blob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'product-details-config.json'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航栏 */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/dashboard')} className="text-gray-600 hover:text-gray-900">
              <ChevronLeft size={24} />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">产品详情管理</h1>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-4 py-2 text-green-600 hover:text-green-700 transition-colors"
            >
              <Download size={20} />
              <span>下载 JSON</span>
            </button>
            {saved && <span className="text-green-600">✓ 已保存</span>}
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

      {/* 主内容区 */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* 产品选择器 */}
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
            {PRODUCTS.map((product) => (
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
                {PRODUCTS.find(p => p.handle === selectedProduct)?.name}
              </h2>
            </div>

            {/* 编辑字段 */}
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

            <div className="pt-4 border-t">
              <p className="text-sm text-gray-500">
                💡 <strong>提示：</strong>点击"下载 JSON"可以保存编辑的内容。下载的文件可以用于后续手动更新网站内容。
              </p>
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
