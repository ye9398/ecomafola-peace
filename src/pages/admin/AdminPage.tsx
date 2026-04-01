import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { LogOut, Package, Home, Layout } from 'lucide-react'

/**
 * 管理后台主页
 * 零风险设计：
 * - 独立路由，不影响前台
 * - 只读模式展示
 * - 可以导航到产品编辑页面
 */
export default function AdminPage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const authenticated = localStorage.getItem('admin_authenticated')
    if (!authenticated) {
      navigate('/dashboard/login')
      return
    }
    setLoading(false)
  }, [navigate])

  const handleLogout = () => {
    localStorage.removeItem('admin_authenticated')
    navigate('/')
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
            <Home className="w-6 h-6 text-gray-600" />
            <h1 className="text-2xl font-bold text-gray-900">EcoMafola 管理后台</h1>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-red-600 transition-colors"
          >
            <LogOut size={20} />
            <span>退出登录</span>
          </button>
        </div>
      </header>

      {/* 主内容区 */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* 主页管理卡片 */}
          <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="flex items-center gap-4 mb-4">
              <Layout className="w-12 h-12 text-green-600" />
              <h2 className="text-xl font-bold text-gray-900">主页内容管理</h2>
            </div>
            <p className="text-gray-600 mb-4">
              编辑首页内容：Hero Banner、特性亮点、品牌故事、影响力数据、邮件订阅
            </p>
            <button
              onClick={() => navigate('/dashboard/home')}
              className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition-colors"
            >
              进入管理
            </button>
          </div>

          {/* 产品详情管理卡片 */}
          <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="flex items-center gap-4 mb-4">
              <Package className="w-12 h-12 text-blue-600" />
              <h2 className="text-xl font-bold text-gray-900">产品完整内容管理</h2>
            </div>
            <p className="text-gray-600 mb-4">
              编辑所有非 Shopify 内容：文字、图片、评价卡片
            </p>
            <button
              onClick={() => navigate('/dashboard/products')}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
            >
              进入管理
            </button>
          </div>

          {/* 更多功能（待开发） */}
          <div className="bg-gray-100 rounded-lg p-6 border-2 border-dashed border-gray-300">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-gray-300 rounded" />
              <h2 className="text-xl font-bold text-gray-500">更多内容管理</h2>
            </div>
            <p className="text-gray-500 mb-4">
              关于我们、联系页面等功能正在开发中...
            </p>
            <div className="w-full bg-gray-300 text-gray-500 py-2 px-4 rounded text-center">
              敬请期待
            </div>
          </div>
        </div>

        {/* 使用说明 */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-bold text-blue-900 mb-2">📋 使用说明</h3>
          <ul className="space-y-2 text-blue-800">
            <li>✅ <strong>零风险设计：</strong>管理后台完全独立，不影响网站前台功能</li>
            <li>✅ <strong>数据隔离：</strong>编辑的内容存储在独立 JSON 文件中</li>
            <li>✅ <strong>Shopify 数据：</strong>产品价格、库存等核心数据继续从 Shopify API 获取</li>
            <li>✅ <strong>下载配置：</strong>在产品管理页面可以下载编辑后的 JSON 文件</li>
            <li>⚠️ <strong>手动应用：</strong>编辑的内容需要手动应用到网站（暂时）</li>
          </ul>
        </div>
      </main>
    </div>
  )
}
