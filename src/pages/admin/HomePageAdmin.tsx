import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Save, Download, LogOut, ChevronLeft, Home, Image as ImageIcon, Upload, X, Plus, Trash2 } from 'lucide-react'

/**
 * 主页内容管理页面
 * 管理首页的所有可配置内容：
 * - Hero Banner: 主标题、副标题、背景图
 * - Features: 3 个特性卡片
 * - BrandStory: 品牌故事内容、统计卡片
 * - Impact: 影响力数据、用户评价
 * - Newsletter: 订阅文案
 */

interface FeatureCard {
  title: string
  description: string
  image: string
}

interface StatCard {
  value: string
  label: string
  bgImage: string
}

interface Testimonial {
  quote: string
  name: string
  role: string
  avatar: string
}

interface BrandStoryBlock {
  title: string
  subtitle: string
  content: string[]
  mainImage: string
  statCard: {
    value: string
    label: string
  }
  values: string[]
}

interface NewsletterBlock {
  title: string
  description: string
  successMessage: string
  footerText: string
}

interface HeroBlock {
  mainTitle: string
  mainTitleHighlight: string
  subtitle: string
  backgroundImage: string
  primaryCta: string
  secondaryCta: string
}

interface HomePageContent {
  hero?: HeroBlock
  features?: FeatureCard[]
  brandStory?: BrandStoryBlock
  impact?: {
    introText: string
    stats: StatCard[]
    testimonials: Testimonial[]
  }
  newsletter?: NewsletterBlock
}

export default function HomePageAdmin() {
  const navigate = useNavigate()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [content, setContent] = useState<HomePageContent>({})
  const [loading, setLoading] = useState(true)
  const [saved, setSaved] = useState(false)
  const [activeSection, setActiveSection] = useState<'hero' | 'features' | 'brandStory' | 'impact' | 'newsletter'>('hero')

  // 图片编辑状态
  const [currentImage, setCurrentImage] = useState<string>('')
  const [editingSection, setEditingSection] = useState<{
    section: string
    index?: number
    field: string
  } | null>(null)

  useEffect(() => {
    const authenticated = localStorage.getItem('admin_authenticated')
    if (!authenticated) {
      navigate('/dashboard/login')
      return
    }
    loadContent()
  }, [navigate])

  const loadContent = async () => {
    try {
      const response = await fetch('/admin-content/homepage-content.json')
      if (response.ok) {
        const data = await response.json()
        setContent(data)
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

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result as string

      if (!editingSection) return

      const { section, index, field } = editingSection

      setContent((prev) => {
        const newContent = { ...prev }

        if (section === 'hero' && field === 'backgroundImage') {
          newContent.hero = { ...newContent.hero!, backgroundImage: result }
        } else if (section === 'features' && index !== undefined) {
          const features = [...(newContent.features || [])]
          features[index] = { ...features[index], image: result }
          newContent.features = features
        } else if (section === 'brandStory') {
          if (field === 'mainImage') {
            newContent.brandStory = { ...newContent.brandStory!, mainImage: result }
          }
        } else if (section === 'impact') {
          if (field === 'avatar' && index !== undefined) {
            const testimonials = [...(newContent.impact?.testimonials || [])]
            testimonials[index] = { ...testimonials[index], avatar: result }
            newContent.impact = { ...newContent.impact!, testimonials }
          } else if (field === 'bgImage' && index !== undefined) {
            const stats = [...(newContent.impact?.stats || [])]
            stats[index] = { ...stats[index], bgImage: result }
            newContent.impact = { ...newContent.impact!, stats }
          }
        }

        return newContent
      })

      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
      setCurrentImage('')
      setEditingSection(null)
    }
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  const triggerImageUpload = (section: string, index?: number, field: string = 'image') => {
    setEditingSection({ section, index, field })
    fileInputRef.current?.click()
  }

  const handleDownload = () => {
    const dataStr = JSON.stringify(content, null, 2)
    const blob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'homepage-content-config.json'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const handleRemoveImage = (section: string, index?: number, field: string = 'image') => {
    setContent((prev) => {
      const newContent = { ...prev }

      if (section === 'hero' && field === 'backgroundImage') {
        newContent.hero = { ...newContent.hero!, backgroundImage: '' }
      } else if (section === 'features' && index !== undefined) {
        const features = [...(newContent.features || [])]
        features[index] = { ...features[index], image: '' }
        newContent.features = features
      } else if (section === 'brandStory' && field === 'mainImage') {
        newContent.brandStory = { ...newContent.brandStory!, mainImage: '' }
      } else if (section === 'impact') {
        if (field === 'avatar' && index !== undefined) {
          const testimonials = [...(newContent.impact?.testimonials || [])]
          testimonials[index] = { ...testimonials[index], avatar: '' }
          newContent.impact = { ...newContent.impact!, testimonials }
        } else if (field === 'bgImage' && index !== undefined) {
          const stats = [...(newContent.impact?.stats || [])]
          stats[index] = { ...stats[index], bgImage: '' }
          newContent.impact = { ...newContent.impact!, stats }
        }
      }

      return newContent
    })
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
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
      <header className="bg-white shadow sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/dashboard')} className="text-gray-600 hover:text-gray-900">
              <ChevronLeft size={24} />
            </button>
            <div className="flex items-center gap-3">
              <Home className="w-6 h-6 text-gray-600" />
              <h1 className="text-2xl font-bold text-gray-900">主页内容管理</h1>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-4 py-2 text-green-600 hover:text-green-700 transition-colors"
            >
              <Download size={20} />
              <span>下载 JSON</span>
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-red-600 transition-colors"
            >
              <LogOut size={20} />
              <span>退出登录</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* 板块选择器 */}
        <div className="flex gap-6 mb-8">
          <div className="w-56 flex-shrink-0">
            <nav className="space-y-1">
              {[
                { id: 'hero', label: '🎯 Hero Banner', icon: '🎯' },
                { id: 'features', label: '✨ 特性亮点', icon: '✨' },
                { id: 'brandStory', label: '📖 品牌故事', icon: '📖' },
                { id: 'impact', label: '🌍 品牌影响', icon: '🌍' },
                { id: 'newsletter', label: '📧 邮件订阅', icon: '📧' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id as any)}
                  className={`w-full text-left px-4 py-3 rounded-lg font-medium text-sm transition-all ${
                    activeSection === item.id
                      ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600'
                      : 'text-gray-600 hover:bg-gray-50 border-l-4 border-transparent'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>
          </div>

          {/* 编辑区域 */}
          <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 p-6">

            {/* Hero Banner 编辑 */}
            {activeSection === 'hero' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b">
                  <h2 className="text-xl font-bold text-gray-900">Hero Banner</h2>
                  <button
                    onClick={() => triggerImageUpload('hero', undefined, 'backgroundImage')}
                    className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <ImageIcon size={18} />
                    <span>{content.hero?.backgroundImage ? '更换背景图' : '添加背景图'}</span>
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    主标题（前半部分）
                  </label>
                  <input
                    type="text"
                    value={content.hero?.mainTitle || 'Where Ocean'}
                    onChange={(e) => setContent({
                      ...content,
                      hero: { ...content.hero!, mainTitle: e.target.value }
                    })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="例如：Where Ocean"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    主标题（高亮部分）
                  </label>
                  <input
                    type="text"
                    value={content.hero?.mainTitleHighlight || 'Meets Craft'}
                    onChange={(e) => setContent({
                      ...content,
                      hero: { ...content.hero!, mainTitleHighlight: e.target.value }
                    })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="例如：Meets Craft"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    副标题
                  </label>
                  <textarea
                    value={content.hero?.subtitle || ''}
                    onChange={(e) => setContent({
                      ...content,
                      hero: { ...content.hero!, subtitle: e.target.value }
                    })}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Handcrafted treasures from Samoa..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      主要 CTA 按钮文字
                    </label>
                    <input
                      type="text"
                      value={content.hero?.primaryCta || 'Shop Now'}
                      onChange={(e) => setContent({
                        ...content,
                        hero: { ...content.hero!, primaryCta: e.target.value }
                      })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      次要 CTA 按钮文字
                    </label>
                    <input
                      type="text"
                      value={content.hero?.secondaryCta || 'Our Story'}
                      onChange={(e) => setContent({
                        ...content,
                        hero: { ...content.hero!, secondaryCta: e.target.value }
                      })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {content.hero?.backgroundImage && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">当前背景图</p>
                    <div className="relative">
                      <img
                        src={content.hero.backgroundImage}
                        alt="Hero Background"
                        className="w-full max-w-md h-48 object-cover rounded-lg shadow-sm"
                      />
                      <button
                        onClick={() => handleRemoveImage('hero', undefined, 'backgroundImage')}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Features 编辑 */}
            {activeSection === 'features' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b">
                  <h2 className="text-xl font-bold text-gray-900">特性亮点</h2>
                  <p className="text-sm text-gray-500">3 个特性卡片</p>
                </div>

                {(content.features || []).map((feature, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <div className="flex justify-between items-start mb-4">
                      <span className="text-sm font-medium text-gray-500">特性卡片 {index + 1}</span>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">标题</label>
                        <input
                          type="text"
                          value={feature.title}
                          onChange={(e) => {
                            const features = [...(content.features || [])]
                            features[index].title = e.target.value
                            setContent({ ...content, features })
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">描述</label>
                        <textarea
                          value={feature.description}
                          onChange={(e) => {
                            const features = [...(content.features || [])]
                            features[index].description = e.target.value
                            setContent({ ...content, features })
                          }}
                          rows={2}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="block text-sm font-medium text-gray-700">配图</label>
                          <div className="flex gap-2">
                            <button
                              onClick={() => triggerImageUpload('features', index, 'image')}
                              className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
                            >
                              <Upload size={14} />
                              {feature.image ? '更换' : '上传'}
                            </button>
                            {feature.image && (
                              <button
                                onClick={() => handleRemoveImage('features', index, 'image')}
                                className="text-sm text-red-500 hover:text-red-700"
                              >
                                <X size={14} />
                              </button>
                            )}
                          </div>
                        </div>
                        {feature.image ? (
                          <div className="relative">
                            <img
                              src={feature.image}
                              alt={feature.title}
                              className="w-full max-w-xs h-32 object-cover rounded-lg shadow-sm"
                            />
                          </div>
                        ) : (
                          <div className="w-full max-w-xs h-32 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400">
                            <ImageIcon size={32} />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Brand Story 编辑 */}
            {activeSection === 'brandStory' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b">
                  <h2 className="text-xl font-bold text-gray-900">品牌故事</h2>
                  <button
                    onClick={() => triggerImageUpload('brandStory', undefined, 'mainImage')}
                    className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <ImageIcon size={18} />
                    <span>{content.brandStory?.mainImage ? '更换主图' : '添加主图'}</span>
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    小标题（Eyebrow）
                  </label>
                  <input
                    type="text"
                    value={content.brandStory?.title || 'Our Story'}
                    onChange={(e) => setContent({
                      ...content,
                      brandStory: { ...content.brandStory!, title: e.target.value }
                    })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    主标题
                  </label>
                  <input
                    type="text"
                    value={content.brandStory?.subtitle || 'Partnership Rooted in the Pacific'}
                    onChange={(e) => setContent({
                      ...content,
                      brandStory: { ...content.brandStory!, subtitle: e.target.value }
                    })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    内容段落（每行一个段落）
                  </label>
                  <textarea
                    value={content.brandStory?.content?.join('\n\n') || ''}
                    onChange={(e) => setContent({
                      ...content,
                      brandStory: {
                        ...content.brandStory!,
                        content: e.target.value.split('\n\n')
                      }
                    })}
                    rows={8}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                    placeholder="输入内容，用空行分隔段落"
                  />
                </div>

                <div className="border-t pt-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">浮动统计卡片</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">数值</label>
                      <input
                        type="text"
                        value={content.brandStory?.statCard?.value || '5+'}
                        onChange={(e) => setContent({
                          ...content,
                          brandStory: { ...content.brandStory!, statCard: { ...content.brandStory!.statCard!, value: e.target.value } }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">说明</label>
                      <input
                        type="text"
                        value={content.brandStory?.statCard?.label || 'Village cooperatives in Samoa'}
                        onChange={(e) => setContent({
                          ...content,
                          brandStory: { ...content.brandStory!, statCard: { ...content.brandStory!.statCard!, label: e.target.value } }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">价值观列表（每行一个）</h3>
                  <textarea
                    value={content.brandStory?.values?.join('\n') || ''}
                    onChange={(e) => setContent({
                      ...content,
                      brandStory: {
                        ...content.brandStory!,
                        values: e.target.value.split('\n').filter(v => v.trim())
                      }
                    })}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                    placeholder="每行一个价值观"
                  />
                </div>

                {content.brandStory?.mainImage && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">当前主图</p>
                    <div className="relative">
                      <img
                        src={content.brandStory.mainImage}
                        alt="Brand Story"
                        className="w-full max-w-md h-64 object-cover rounded-lg shadow-sm"
                      />
                      <button
                        onClick={() => handleRemoveImage('brandStory', undefined, 'mainImage')}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Impact 编辑 */}
            {activeSection === 'impact' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b">
                  <h2 className="text-xl font-bold text-gray-900">品牌影响</h2>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    介绍文字
                  </label>
                  <textarea
                    value={content.impact?.introText || ''}
                    onChange={(e) => setContent({
                      ...content,
                      impact: { ...content.impact!, introText: e.target.value }
                    })}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Stats 编辑 */}
                <div className="border-t pt-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">统计数据卡片</h3>
                  {(content.impact?.stats || []).map((stat, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-3 mb-3 bg-gray-50">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-xs font-medium text-gray-500">卡片 {index + 1}</span>
                        <div className="flex gap-2">
                          <button
                            onClick={() => triggerImageUpload('impact', index, 'bgImage')}
                            className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1"
                          >
                            <ImageIcon size={12} />
                            {stat.bgImage ? '更换' : '上传'}背景
                          </button>
                          {stat.bgImage && (
                            <button
                              onClick={() => handleRemoveImage('impact', index, 'bgImage')}
                              className="text-xs text-red-500 hover:text-red-700"
                            >
                              <X size={12} />
                            </button>
                          )}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={stat.value}
                          onChange={(e) => {
                            const stats = [...(content.impact?.stats || [])]
                            stats[index].value = e.target.value
                            setContent({ ...content, impact: { ...content.impact!, stats } })
                          }}
                          className="px-2 py-1.5 border border-gray-300 rounded text-sm"
                          placeholder="数值 (如：120+)"
                        />
                        <input
                          type="text"
                          value={stat.label}
                          onChange={(e) => {
                            const stats = [...(content.impact?.stats || [])]
                            stats[index].label = e.target.value
                            setContent({ ...content, impact: { ...content.impact!, stats } })
                          }}
                          className="px-2 py-1.5 border border-gray-300 rounded text-sm"
                          placeholder="说明文字"
                        />
                      </div>
                      {stat.bgImage && (
                        <div className="mt-2">
                          <img
                            src={stat.bgImage}
                            alt={stat.label}
                            className="w-full max-w-xs h-20 object-cover rounded"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Testimonials 编辑 */}
                <div className="border-t pt-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">用户评价</h3>
                  {(content.impact?.testimonials || []).map((testimonial, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 mb-3 bg-gray-50">
                      <div className="flex justify-between items-start mb-3">
                        <span className="text-sm font-medium text-gray-500">评价 {index + 1}</span>
                        <button
                          onClick={() => {
                            const testimonials = (content.impact?.testimonials || []).filter((_, i) => i !== index)
                            setContent({ ...content, impact: { ...content.impact!, testimonials } })
                          }}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">评价内容</label>
                          <textarea
                            value={testimonial.quote}
                            onChange={(e) => {
                              const testimonials = [...(content.impact?.testimonials || [])]
                              testimonials[index].quote = e.target.value
                              setContent({ ...content, impact: { ...content.impact!, testimonials } })
                            }}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">姓名</label>
                            <input
                              type="text"
                              value={testimonial.name}
                              onChange={(e) => {
                                const testimonials = [...(content.impact?.testimonials || [])]
                                testimonials[index].name = e.target.value
                                setContent({ ...content, impact: { ...content.impact!, testimonials } })
                              }}
                              className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">角色/职位</label>
                            <input
                              type="text"
                              value={testimonial.role}
                              onChange={(e) => {
                                const testimonials = [...(content.impact?.testimonials || [])]
                                testimonials[index].role = e.target.value
                                setContent({ ...content, impact: { ...content.impact!, testimonials } })
                              }}
                              className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm"
                            />
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <label className="block text-xs font-medium text-gray-600">头像</label>
                            <div className="flex gap-2">
                              <button
                                onClick={() => triggerImageUpload('impact', index, 'avatar')}
                                className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1"
                              >
                                <Upload size={12} />
                                {testimonial.avatar ? '更换' : '上传'}
                              </button>
                              {testimonial.avatar && (
                                <button
                                  onClick={() => handleRemoveImage('impact', index, 'avatar')}
                                  className="text-xs text-red-500 hover:text-red-700"
                                >
                                  <X size={12} />
                                </button>
                              )}
                            </div>
                          </div>
                          {testimonial.avatar ? (
                            <img
                              src={testimonial.avatar}
                              alt={testimonial.name}
                              className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                            />
                          ) : (
                            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center text-gray-400">
                              <ImageIcon size={24} />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}

                  <button
                    onClick={() => {
                      const newTestimonial: Testimonial = {
                        quote: '',
                        name: '',
                        role: '',
                        avatar: '',
                      }
                      setContent({
                        ...content,
                        impact: {
                          ...content.impact!,
                          testimonials: [...(content.impact?.testimonials || []), newTestimonial]
                        }
                      })
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    <Plus size={16} />
                    <span>添加评价</span>
                  </button>
                </div>
              </div>
            )}

            {/* Newsletter 编辑 */}
            {activeSection === 'newsletter' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b">
                  <h2 className="text-xl font-bold text-gray-900">邮件订阅</h2>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    标题
                  </label>
                  <input
                    type="text"
                    value={content.newsletter?.title || 'Join Our Community'}
                    onChange={(e) => setContent({
                      ...content,
                      newsletter: { ...content.newsletter!, title: e.target.value }
                    })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    描述文字
                  </label>
                  <textarea
                    value={content.newsletter?.description || ''}
                    onChange={(e) => setContent({
                      ...content,
                      newsletter: { ...content.newsletter!, description: e.target.value }
                    })}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Be the first to discover..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    提交成功提示
                  </label>
                  <input
                    type="text"
                    value={content.newsletter?.successMessage || 'Welcome to the EcoMafola family! Check your inbox.'}
                    onChange={(e) => setContent({
                      ...content,
                      newsletter: { ...content.newsletter!, successMessage: e.target.value }
                    })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    页脚隐私提示
                  </label>
                  <input
                    type="text"
                    value={content.newsletter?.footerText || 'Unsubscribe anytime. We respect your privacy.'}
                    onChange={(e) => setContent({
                      ...content,
                      newsletter: { ...content.newsletter!, footerText: e.target.value }
                    })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            )}

          </div>
        </div>

        {/* 使用说明 */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-bold text-blue-900 mb-2">📋 使用说明</h3>
          <ul className="space-y-2 text-blue-800">
            <li>✅ <strong>板块化编辑：</strong>左侧导航选择要编辑的板块</li>
            <li>✅ <strong>图片上传：</strong>每个板块支持上传配图，实时预览</li>
            <li>✅ <strong>实时保存：</strong>修改后自动保存</li>
            <li>✅ <strong>下载配置：</strong>完成后下载 JSON 文件，用于更新网站内容</li>
            <li>⚠️ <strong>数据隔离：</strong>所有内容存储在独立 JSON 文件，不影响其他数据</li>
          </ul>
        </div>
      </main>

      {/* 隐藏的文件输入 */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileSelect}
      />

      {/* 保存提示 */}
      {saved && (
        <div className="fixed bottom-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-pulse">
          <Save size={20} />
          <span>已保存！</span>
        </div>
      )}
    </div>
  )
}
