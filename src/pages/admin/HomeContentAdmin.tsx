import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Save, Download, LogOut, ChevronLeft, Upload, X, Image as ImageIcon, Plus, Trash2 } from 'lucide-react'

/**
 * 主页内容管理页面
 * 管理首页的 Hero Banner、Features、Impact、Newsletter 等板块
 */

interface HeroBanner {
  title: string
  subtitle: string
  description: string
  ctaText: string
  ctaLink: string
  backgroundImage?: string
}

interface FeatureItem {
  id: string
  icon: string
  title: string
  description: string
}

interface FeaturesSection {
  title: string
  subtitle: string
  items: FeatureItem[]
}

interface ImpactStat {
  id: string
  value: string
  label: string
  icon?: string
}

interface ImpactSection {
  title: string
  subtitle: string
  description: string
  image?: string
  stats: ImpactStat[]
}

interface NewsletterSection {
  title: string
  subtitle: string
  placeholder: string
  buttonText: string
  background?: string
}

interface Testimonial {
  id: string
  author: string
  role: string
  content: string
  avatar?: string
  rating: number
}

interface TestimonialsSection {
  title: string
  subtitle: string
  testimonials: Testimonial[]
}

interface HomeContent {
  hero?: HeroBanner
  features?: FeaturesSection
  impact?: ImpactSection
  testimonials?: TestimonialsSection
  newsletter?: NewsletterSection
}

export default function HomeContentAdmin() {
  const navigate = useNavigate()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [content, setContent] = useState<HomeContent>({
    hero: {
      title: '',
      subtitle: '',
      description: '',
      ctaText: '',
      ctaLink: '',
    },
    features: {
      title: '',
      subtitle: '',
      items: [],
    },
    impact: {
      title: '',
      subtitle: '',
      description: '',
      stats: [],
    },
    testimonials: {
      title: '',
      subtitle: '',
      testimonials: [],
    },
    newsletter: {
      title: '',
      subtitle: '',
      placeholder: '',
      buttonText: '',
    },
  })
  const [loading, setLoading] = useState(true)
  const [saved, setSaved] = useState(false)
  const [activeSection, setActiveSection] = useState<'hero' | 'features' | 'impact' | 'testimonials' | 'newsletter'>('hero')

  // 图片编辑状态
  const [currentImage, setCurrentImage] = useState<string>('')
  const [editingImage, setEditingImage] = useState<'hero' | 'impact' | null>(null)

  useEffect(() => {
    const authenticated = localStorage.getItem('admin_authenticated')
    if (!authenticated) {
      navigate('/dashboard/login')
      return
    }
    loadContent()
  }, [])

  const loadContent = async () => {
    try {
      const response = await fetch('/admin-content/home-content.json')
      if (response.ok) {
        const data = await response.json()
        setContent({ ...content, ...data })
      }
    } catch (error) {
      console.error('Error loading home content:', error)
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
      setCurrentImage(result)

      if (editingImage) {
        if (editingImage === 'hero') {
          setContent({
            ...content,
            hero: { ...content.hero, backgroundImage: result } as HeroBanner,
          })
        } else if (editingImage === 'impact') {
          setContent({
            ...content,
            impact: { ...content.impact, image: result } as ImpactSection,
          })
        }
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
        setEditingImage(null)
      }
    }
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  const handleDownload = () => {
    const dataStr = JSON.stringify(content, null, 2)
    const blob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'home-content-config.json'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const addFeatureItem = () => {
    const newItem: FeatureItem = {
      id: Date.now().toString(),
      icon: '✨',
      title: '',
      description: '',
    }
    setContent({
      ...content,
      features: {
        ...content.features,
        items: [...(content.features?.items || []), newItem],
      } as FeaturesSection,
    })
  }

  const removeFeatureItem = (id: string) => {
    setContent({
      ...content,
      features: {
        ...content.features,
        items: content.features?.items.filter(item => item.id !== id),
      } as FeaturesSection,
    })
  }

  const updateFeatureItem = (id: string, field: keyof FeatureItem, value: string) => {
    setContent({
      ...content,
      features: {
        ...content.features,
        items: content.features?.items.map(item =>
          item.id === id ? { ...item, [field]: value } : item
        ) || [],
      } as FeaturesSection,
    })
  }

  const addImpactStat = () => {
    const newStat: ImpactStat = {
      id: Date.now().toString(),
      value: '',
      label: '',
    }
    setContent({
      ...content,
      impact: {
        ...content.impact,
        stats: [...(content.impact?.stats || []), newStat],
      } as ImpactSection,
    })
  }

  const removeImpactStat = (id: string) => {
    setContent({
      ...content,
      impact: {
        ...content.impact,
        stats: content.impact?.stats.filter(stat => stat.id !== id),
      } as ImpactSection,
    })
  }

  const updateImpactStat = (id: string, field: keyof ImpactStat, value: string) => {
    setContent({
      ...content,
      impact: {
        ...content.impact,
        stats: content.impact?.stats.map(stat =>
          stat.id === id ? { ...stat, [field]: value } : stat
        ) || [],
      } as ImpactSection,
    })
  }

  const addTestimonial = () => {
    const newTestimonial: Testimonial = {
      id: Date.now().toString(),
      author: '',
      role: '',
      content: '',
      avatar: '',
      rating: 5,
    }
    setContent({
      ...content,
      testimonials: {
        ...content.testimonials,
        testimonials: [...(content.testimonials?.testimonials || []), newTestimonial],
      } as TestimonialsSection,
    })
  }

  const removeTestimonial = (id: string) => {
    setContent({
      ...content,
      testimonials: {
        ...content.testimonials,
        testimonials: content.testimonials?.testimonials.filter(t => t.id !== id),
      } as TestimonialsSection,
    })
  }

  const updateTestimonial = (id: string, field: keyof Testimonial, value: string | number) => {
    setContent({
      ...content,
      testimonials: {
        ...content.testimonials,
        testimonials: content.testimonials?.testimonials.map(t =>
          t.id === id ? { ...t, [field]: value } : t
        ) || [],
      } as TestimonialsSection,
    })
  }

  const handleTestimonialAvatarSelect = (e: React.ChangeEvent<HTMLInputElement>, testimonialId: string) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result as string
      setContent({
        ...content,
        testimonials: {
          ...content.testimonials,
          testimonials: content.testimonials?.testimonials.map(t =>
            t.id === testimonialId ? { ...t, avatar: result } : t
          ) || [],
        } as TestimonialsSection,
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    }
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  const removeTestimonialAvatar = (id: string) => {
    setContent({
      ...content,
      testimonials: {
        ...content.testimonials,
        testimonials: content.testimonials?.testimonials.map(t =>
          t.id === id ? { ...t, avatar: '' } : t
        ) || [],
      } as TestimonialsSection,
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
      <header className="bg-white shadow sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/dashboard')} className="text-gray-600 hover:text-gray-900">
              <ChevronLeft size={24} />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">主页内容管理</h1>
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
        {/* 板块选择器 - 左侧固定导航 */}
        <div className="flex gap-6 mb-8">
          <div className="w-56 flex-shrink-0">
            <nav className="space-y-1">
              {[
                { id: 'hero', label: '🎯 Hero Banner', icon: '🎯' },
                { id: 'features', label: '⭐ 核心特性', icon: '⭐' },
                { id: 'impact', label: '🌱 环保影响', icon: '🌱' },
                { id: 'testimonials', label: '💬 用户评价', icon: '💬' },
                { id: 'newsletter', label: '📧 订阅通讯', icon: '📧' },
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
                    onClick={() => {
                      setEditingImage('hero')
                      setCurrentImage(content.hero?.backgroundImage || '')
                      fileInputRef.current?.click()
                    }}
                    className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <ImageIcon size={18} />
                    <span>{content.hero?.backgroundImage ? '更换背景图' : '添加背景图'}</span>
                  </button>
                </div>

                {/* 图片预览区域 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">背景图预览</label>
                  {content.hero?.backgroundImage ? (
                    <div className="relative">
                      <img
                        src={content.hero.backgroundImage}
                        alt="Hero background preview"
                        className="w-full max-w-md h-48 object-cover rounded-lg shadow-sm border border-gray-200"
                      />
                      <button
                        onClick={() => {
                          setContent({
                            ...content,
                            hero: { ...content.hero, backgroundImage: '' } as HeroBanner,
                          })
                        }}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition-colors"
                        type="button"
                        title="删除图片"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <div className="w-full max-w-md h-48 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                      <div className="text-center text-gray-400">
                        <ImageIcon size={48} className="mx-auto mb-2 opacity-50" />
                        <p className="text-sm">暂无背景图，请点击上方按钮上传</p>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    主标题 <span className="text-gray-400">(必填)</span>
                  </label>
                  <input
                    type="text"
                    value={content.hero?.title || ''}
                    onChange={(e) => setContent({
                      ...content,
                      hero: { ...content.hero, title: e.target.value } as HeroBanner,
                    })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg font-serif"
                    placeholder="例如：Handcrafted with Love, Rooted in Samoan Culture"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    副标题 <span className="text-gray-400">(可选)</span>
                  </label>
                  <input
                    type="text"
                    value={content.hero?.subtitle || ''}
                    onChange={(e) => setContent({
                      ...content,
                      hero: { ...content.hero, subtitle: e.target.value } as HeroBanner,
                    })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="例如：Authentic Pacific Crafts"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    描述 <span className="text-gray-400">(可选)</span>
                  </label>
                  <textarea
                    value={content.hero?.description || ''}
                    onChange={(e) => setContent({
                      ...content,
                      hero: { ...content.hero, description: e.target.value } as HeroBanner,
                    })}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="简短描述..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      CTA 按钮文字 <span className="text-gray-400">(可选)</span>
                    </label>
                    <input
                      type="text"
                      value={content.hero?.ctaText || ''}
                      onChange={(e) => setContent({
                        ...content,
                        hero: { ...content.hero, ctaText: e.target.value } as HeroBanner,
                      })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="例如：Shop Now"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      CTA 链接 <span className="text-gray-400">(可选)</span>
                    </label>
                    <input
                      type="text"
                      value={content.hero?.ctaLink || ''}
                      onChange={(e) => setContent({
                        ...content,
                        hero: { ...content.hero, ctaLink: e.target.value } as HeroBanner,
                      })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="例如：/collections/all"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 核心特性编辑 */}
            {activeSection === 'features' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b">
                  <h2 className="text-xl font-bold text-gray-900">核心特性</h2>
                  <button
                    onClick={addFeatureItem}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus size={18} />
                    <span>添加特性</span>
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">板块标题</label>
                  <input
                    type="text"
                    value={content.features?.title || ''}
                    onChange={(e) => setContent({
                      ...content,
                      features: { ...content.features, title: e.target.value } as FeaturesSection,
                    })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                    placeholder="例如：Why Choose EcoMafola"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">板块副标题</label>
                  <input
                    type="text"
                    value={content.features?.subtitle || ''}
                    onChange={(e) => setContent({
                      ...content,
                      features: { ...content.features, subtitle: e.target.value } as FeaturesSection,
                    })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="例如：Crafted with purpose"
                  />
                </div>

                <div className="space-y-4">
                  <label className="block text-sm font-medium text-gray-700">特性列表</label>
                  {content.features?.items?.map((item, index) => (
                    <div key={item.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                      <div className="flex justify-between items-start mb-3">
                        <span className="text-sm font-medium text-gray-500">特性 {index + 1}</span>
                        <button
                          onClick={() => removeFeatureItem(item.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <div className="grid grid-cols-12 gap-3">
                        <div className="col-span-2">
                          <label className="block text-xs text-gray-500 mb-1">图标</label>
                          <input
                            type="text"
                            value={item.icon}
                            onChange={(e) => updateFeatureItem(item.id, 'icon', e.target.value)}
                            className="w-full px-2 py-2 border border-gray-300 rounded-lg text-center text-lg"
                            placeholder="✨"
                          />
                        </div>
                        <div className="col-span-10 space-y-3">
                          <input
                            type="text"
                            value={item.title}
                            onChange={(e) => updateFeatureItem(item.id, 'title', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder="特性标题..."
                          />
                          <textarea
                            value={item.description}
                            onChange={(e) => updateFeatureItem(item.id, 'description', e.target.value)}
                            rows={2}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder="特性描述..."
                          />
                        </div>
                      </div>
                    </div>
                  )) || (
                    <div className="text-center py-8 text-gray-500">暂无特性，点击上方按钮添加</div>
                  )}
                </div>
              </div>
            )}

            {/* 环保影响编辑 */}
            {activeSection === 'impact' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b">
                  <h2 className="text-xl font-bold text-gray-900">环保影响</h2>
                  <button
                    onClick={() => {
                      setEditingImage('impact')
                      setCurrentImage(content.impact?.image || '')
                      fileInputRef.current?.click()
                    }}
                    className="flex items-center gap-2 px-4 py-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                  >
                    <ImageIcon size={18} />
                    <span>{content.impact?.image ? '更换配图' : '添加配图'}</span>
                  </button>
                </div>

                {/* 图片预览区域 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">配图预览</label>
                  {content.impact?.image ? (
                    <div className="relative">
                      <img
                        src={content.impact.image}
                        alt="Impact preview"
                        className="w-full max-w-md h-48 object-cover rounded-lg shadow-sm border border-gray-200"
                      />
                      <button
                        onClick={() => {
                          setContent({
                            ...content,
                            impact: { ...content.impact, image: '' } as ImpactSection,
                          })
                        }}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition-colors"
                        type="button"
                        title="删除图片"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <div className="w-full max-w-md h-48 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                      <div className="text-center text-gray-400">
                        <ImageIcon size={48} className="mx-auto mb-2 opacity-50" />
                        <p className="text-sm">暂无配图，请点击上方按钮上传</p>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">板块标题</label>
                  <input
                    type="text"
                    value={content.impact?.title || ''}
                    onChange={(e) => setContent({
                      ...content,
                      impact: { ...content.impact, title: e.target.value } as ImpactSection,
                    })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg"
                    placeholder="例如：Our Environmental Impact"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">板块副标题</label>
                  <input
                    type="text"
                    value={content.impact?.subtitle || ''}
                    onChange={(e) => setContent({
                      ...content,
                      impact: { ...content.impact, subtitle: e.target.value } as ImpactSection,
                    })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="例如：Making a difference, one product at a time"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">描述</label>
                  <textarea
                    value={content.impact?.description || ''}
                    onChange={(e) => setContent({
                      ...content,
                      impact: { ...content.impact, description: e.target.value } as ImpactSection,
                    })}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="描述环保影响..."
                  />
                </div>

                {/* 数据统计 */}
                <div className="border-t pt-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-900">数据统计</h3>
                    <button
                      onClick={addImpactStat}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <Plus size={18} />
                      <span>添加数据</span>
                    </button>
                  </div>
                  <div className="space-y-3">
                    {content.impact?.stats?.map((stat, index) => (
                      <div key={stat.id} className="flex items-center gap-3 border border-gray-200 rounded-lg p-3 bg-gray-50">
                        <span className="text-sm text-gray-500 w-8">{index + 1}.</span>
                        <input
                          type="text"
                          value={stat.value}
                          onChange={(e) => updateImpactStat(stat.id, 'value', e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                          placeholder="数值，如：1000+"
                        />
                        <input
                          type="text"
                          value={stat.label}
                          onChange={(e) => updateImpactStat(stat.id, 'label', e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                          placeholder="标签，如：Trees Planted"
                        />
                        <button
                          onClick={() => removeImpactStat(stat.id)}
                          className="text-red-500 hover:text-red-700 p-2"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    )) || (
                      <div className="text-center py-4 text-gray-500">暂无数据，点击上方按钮添加</div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* 用户评价编辑 */}
            {activeSection === 'testimonials' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b">
                  <h2 className="text-xl font-bold text-gray-900">用户评价</h2>
                  <button
                    onClick={addTestimonial}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus size={18} />
                    <span>添加评价</span>
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">板块标题</label>
                  <input
                    type="text"
                    value={content.testimonials?.title || ''}
                    onChange={(e) => setContent({
                      ...content,
                      testimonials: { ...content.testimonials, title: e.target.value } as TestimonialsSection,
                    })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                    placeholder="例如：What Our Customers Say"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">板块副标题</label>
                  <input
                    type="text"
                    value={content.testimonials?.subtitle || ''}
                    onChange={(e) => setContent({
                      ...content,
                      testimonials: { ...content.testimonials, subtitle: e.target.value } as TestimonialsSection,
                    })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="例如：Real stories from real customers"
                  />
                </div>

                <div className="space-y-4">
                  <label className="block text-sm font-medium text-gray-700">评价列表</label>
                  {content.testimonials?.testimonials?.map((testimonial, index) => (
                    <div key={testimonial.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                      <div className="flex justify-between items-start mb-4">
                        <span className="text-sm font-medium text-gray-500">评价 {index + 1}</span>
                        <button
                          onClick={() => removeTestimonial(testimonial.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>

                      {/* 头像 */}
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">头像</label>
                        <div className="flex items-center gap-3">
                          {testimonial.avatar ? (
                            <div className="relative">
                              <img
                                src={testimonial.avatar}
                                alt="Avatar"
                                className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                              />
                              <button
                                onClick={() => removeTestimonialAvatar(testimonial.id)}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                type="button"
                              >
                                <X size={12} />
                              </button>
                            </div>
                          ) : (
                            <div className="w-16 h-16 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center">
                              <span className="text-2xl text-gray-400">👤</span>
                            </div>
                          )}
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleTestimonialAvatarSelect(e, testimonial.id)}
                            className="hidden"
                            id={`avatar-${testimonial.id}`}
                          />
                          <label
                            htmlFor={`avatar-${testimonial.id}`}
                            className="flex items-center gap-2 px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                          >
                            <Upload size={16} />
                            <span>{testimonial.avatar ? '更换' : '上传'}头像</span>
                          </label>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                          <input
                            type="text"
                            value={testimonial.author}
                            onChange={(e) => updateTestimonial(testimonial.id, 'author', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder="评价者姓名"
                          />
                          <input
                            type="text"
                            value={testimonial.role}
                            onChange={(e) => updateTestimonial(testimonial.id, 'role', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder="角色/身份"
                          />
                        </div>
                        <textarea
                          value={testimonial.content}
                          onChange={(e) => updateTestimonial(testimonial.id, 'content', e.target.value)}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          placeholder="评价内容..."
                        />
                        <div className="flex items-center gap-2">
                          <label className="text-sm text-gray-600">评分：</label>
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              onClick={() => updateTestimonial(testimonial.id, 'rating', star)}
                              className="focus:outline-none"
                            >
                              <span className={`text-xl ${star <= testimonial.rating ? 'text-yellow-400' : 'text-gray-300'}`}>
                                ★
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )) || (
                    <div className="text-center py-8 text-gray-500">暂无评价，点击上方按钮添加</div>
                  )}
                </div>
              </div>
            )}

            {/* 订阅通讯编辑 */}
            {activeSection === 'newsletter' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b">
                  <h2 className="text-xl font-bold text-gray-900">订阅通讯</h2>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">板块标题</label>
                  <input
                    type="text"
                    value={content.newsletter?.title || ''}
                    onChange={(e) => setContent({
                      ...content,
                      newsletter: { ...content.newsletter, title: e.target.value } as NewsletterSection,
                    })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                    placeholder="例如：Join Our Community"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">板块副标题</label>
                  <input
                    type="text"
                    value={content.newsletter?.subtitle || ''}
                    onChange={(e) => setContent({
                      ...content,
                      newsletter: { ...content.newsletter, subtitle: e.target.value } as NewsletterSection,
                    })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="例如：Get 10% off your first order + eco-friendly tips"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      输入框占位符 <span className="text-gray-400">(可选)</span>
                    </label>
                    <input
                      type="text"
                      value={content.newsletter?.placeholder || ''}
                      onChange={(e) => setContent({
                        ...content,
                        newsletter: { ...content.newsletter, placeholder: e.target.value } as NewsletterSection,
                      })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="例如：Enter your email"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      按钮文字 <span className="text-gray-400">(可选)</span>
                    </label>
                    <input
                      type="text"
                      value={content.newsletter?.buttonText || ''}
                      onChange={(e) => setContent({
                        ...content,
                        newsletter: { ...content.newsletter, buttonText: e.target.value } as NewsletterSection,
                      })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="例如：Subscribe"
                    />
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </main>

      {/* 保存提示 */}
      {saved && (
        <div className="fixed bottom-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-pulse">
          <Save size={20} />
          <span>已保存！</span>
        </div>
      )}

      {/* 隐藏的文件选择输入 */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileSelect}
      />
    </div>
  )
}
