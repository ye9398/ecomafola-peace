import { useState, useRef, useEffect, useCallback } from 'react'
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
  brandStory?: {
    title: string
    description: string
    image?: string
    buttonText: string
    buttonLink: string
  }
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
    brandStory: {
      title: '',
      description: '',
      buttonText: '',
      buttonLink: '',
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
  const [activeSection, setActiveSection] = useState<'hero' | 'features' | 'brandStory' | 'impact' | 'testimonials' | 'newsletter'>('hero')

  // 图片编辑状态
  const [currentImage, setCurrentImage] = useState<string>('')
  const [editingImage, setEditingImage] = useState<'hero' | 'impact' | 'brandStory' | null>(null)

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

  const saveContent = async () => {
    try {
      // 在实际应用中，这里应该发送到 API
      // 这里我们模拟保存到 localStorage 并导出
      localStorage.setItem('home_content_draft', JSON.stringify(content))
      
      const blob = new Blob([JSON.stringify(content, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'home-content.json'
      a.click()
      
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (error) {
      console.error('Error saving home content:', error)
      alert('保存失败，请重试')
    }
  }

  const handleImageUpload = (section: 'hero' | 'impact' | 'brandStory') => {
    setEditingImage(section)
    fileInputRef.current?.click()
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && editingImage) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const url = event.target?.result as string
        if (editingImage === 'hero') {
          setContent({ ...content, hero: { ...content.hero, backgroundImage: url } as HeroBanner })
        } else if (editingImage === 'impact') {
          setContent({ ...content, impact: { ...content.impact, image: url } as ImpactSection })
        } else if (editingImage === 'brandStory') {
          setContent({ ...content, brandStory: { ...content.brandStory, image: url } as any })
        }
      }
      reader.readAsDataURL(file)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* 顶部导航 */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/dashboard')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500"
            >
              <ChevronLeft size={20} />
            </button>
            <h1 className="text-xl font-bold text-gray-900">主页内容管理</h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={saveContent}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-medium flex items-center gap-2 shadow-sm transition-all active:scale-95"
            >
              <Download size={18} />
              导出并部署 (JSON)
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8 flex gap-8">
        {/* 左侧侧边栏 - 板块选择 */}
        <div className="w-64 shrink-0 space-y-2">
          {[
            { id: 'hero', label: 'Hero Banner', icon: <ImageIcon size={18} /> },
            { id: 'features', label: 'Features (Journey)', icon: <ImageIcon size={18} /> },
            { id: 'brandStory', label: 'Brand Story', icon: <ImageIcon size={18} /> },
            { id: 'impact', label: 'Impact Section', icon: <ImageIcon size={18} /> },
            { id: 'testimonials', label: 'Testimonials', icon: <ImageIcon size={18} /> },
            { id: 'newsletter', label: 'Newsletter', icon: <ImageIcon size={18} /> },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id as any)}
              className={`w-full text-left px-4 py-3 rounded-xl font-medium flex items-center gap-3 transition-all ${
                activeSection === item.id 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>

        {/* 右侧编辑区 */}
        <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-8">
            {/* Hero Section */}
            {activeSection === 'hero' && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Hero Banner 板块</h2>
                  <p className="text-gray-500 text-sm mb-6">设置网站首屏的主标题、描述及背景图。</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">主标题</label>
                      <input
                        type="text"
                        value={content.hero?.title || ''}
                        onChange={(e) => setContent({
                          ...content,
                          hero: { ...content.hero, title: e.target.value } as HeroBanner,
                        })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg font-bold"
                        placeholder="例如：Ocean Wisdom, Handcrafted Heart"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">副标题</label>
                      <input
                        type="text"
                        value={content.hero?.subtitle || ''}
                        onChange={(e) => setContent({
                          ...content,
                          hero: { ...content.hero, subtitle: e.target.value } as HeroBanner,
                        })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="例如：Authentic Samoan Treasures"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">描述内容</label>
                      <textarea
                        rows={4}
                        value={content.hero?.description || ''}
                        onChange={(e) => setContent({
                          ...content,
                          hero: { ...content.hero, description: e.target.value } as HeroBanner,
                        })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        placeholder="介绍品牌的核心价值..."
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">按钮文字</label>
                        <input
                          type="text"
                          value={content.hero?.ctaText || ''}
                          onChange={(e) => setContent({
                            ...content,
                            hero: { ...content.hero, ctaText: e.target.value } as HeroBanner,
                          })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="例如：Shop Collection"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">按钮链接</label>
                        <input
                          type="text"
                          value={content.hero?.ctaLink || ''}
                          onChange={(e) => setContent({
                            ...content,
                            hero: { ...content.hero, ctaLink: e.target.value } as HeroBanner,
                          })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="/products"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">背景图</label>
                    <div className="aspect-video bg-gray-100 rounded-xl overflow-hidden border-2 border-dashed border-gray-300 relative group">
                      {content.hero?.backgroundImage ? (
                        <>
                          <img 
                            src={content.hero.backgroundImage} 
                            alt="Preview" 
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                            <button 
                              onClick={() => handleImageUpload('hero')}
                              className="bg-white text-gray-900 p-2 rounded-full hover:bg-gray-100"
                            >
                              <Upload size={18} />
                            </button>
                            <button 
                              onClick={() => setContent({ ...content, hero: { ...content.hero, backgroundImage: '' } as HeroBanner })}
                              className="bg-red-600 text-white p-2 rounded-full hover:bg-red-700"
                            >
                              <X size={18} />
                            </button>
                          </div>
                        </>
                      ) : (
                        <button 
                          onClick={() => handleImageUpload('hero')}
                          className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 hover:text-blue-600 transition-colors"
                        >
                          <Plus size={32} className="mb-2" />
                          <span className="text-sm">上传背景图</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Features Section */}
            {activeSection === 'features' && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Features (Journey) 板块</h2>
                  <p className="text-gray-500 text-sm mb-6">管理首页的“工艺旅程”展示项。</p>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">板块主标题</label>
                      <input
                        type="text"
                        value={content.features?.title || ''}
                        onChange={(e) => setContent({
                          ...content,
                          features: { ...content.features, title: e.target.value } as FeaturesSection,
                        })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
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
                      />
                    </div>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bold text-gray-800">特性列表</h3>
                      <button 
                        onClick={() => {
                          const items = content.features?.items || []
                          setContent({
                            ...content,
                            features: { 
                              ...content.features, 
                              items: [...items, { id: Date.now().toString(), title: '新特性', description: '', icon: 'Waves' }] 
                            } as FeaturesSection
                          })
                        }}
                        className="text-blue-600 hover:text-blue-700 text-sm font-bold flex items-center gap-1"
                      >
                        <Plus size={16} /> 添加项
                      </button>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                      {(content.features?.items || []).map((item, idx) => (
                        <div key={item.id} className="p-6 bg-gray-50 rounded-xl border border-gray-200 relative group">
                          <button 
                            onClick={() => {
                              const items = [...(content.features?.items || [])]
                              items.splice(idx, 1)
                              setContent({ ...content, features: { ...content.features, items } as FeaturesSection })
                            }}
                            className="absolute top-4 right-4 text-gray-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 size={18} />
                          </button>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">特性标题</label>
                              <input
                                type="text"
                                value={item.title}
                                onChange={(e) => {
                                  const items = [...(content.features?.items || [])]
                                  items[idx] = { ...item, title: e.target.value }
                                  setContent({ ...content, features: { ...content.features, items } as FeaturesSection })
                                }}
                                className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm"
                              />
                            </div>
                            <div className="md:col-span-2">
                              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">描述内容</label>
                              <input
                                type="text"
                                value={item.description}
                                onChange={(e) => {
                                  const items = [...(content.features?.items || [])]
                                  items[idx] = { ...item, description: e.target.value }
                                  setContent({ ...content, features: { ...content.features, items } as FeaturesSection })
                                }}
                                className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Brand Story Section */}
            {activeSection === 'brandStory' && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Brand Story 板块</h2>
                  <p className="text-gray-500 text-sm mb-6">管理首页的品牌故事文字、图片和按钮。</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">板块主标题</label>
                      <input
                        type="text"
                        value={content.brandStory?.title || ''}
                        onChange={(e) => setContent({
                          ...content,
                          brandStory: { ...content.brandStory, title: e.target.value } as any,
                        })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg font-bold"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">故事描述 (支持 HTML)</label>
                      <textarea
                        rows={10}
                        value={content.brandStory?.description || ''}
                        onChange={(e) => setContent({
                          ...content,
                          brandStory: { ...content.brandStory, description: e.target.value } as any,
                        })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none font-mono text-sm"
                        placeholder="使用 <p>, <strong> 等标签完善故事..."
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">按钮文字</label>
                        <input
                          type="text"
                          value={content.brandStory?.buttonText || ''}
                          onChange={(e) => setContent({
                            ...content,
                            brandStory: { ...content.brandStory, buttonText: e.target.value } as any,
                          })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">按钮链接</label>
                        <input
                          type="text"
                          value={content.brandStory?.buttonLink || ''}
                          onChange={(e) => setContent({
                            ...content,
                            brandStory: { ...content.brandStory, buttonLink: e.target.value } as any,
                          })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">故事图片</label>
                    <div className="aspect-[4/5] bg-gray-100 rounded-3xl overflow-hidden border-2 border-dashed border-gray-300 relative group max-w-sm mx-auto">
                      {content.brandStory?.image ? (
                        <>
                          <img 
                            src={content.brandStory.image} 
                            alt="Preview" 
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                            <button 
                              onClick={() => handleImageUpload('brandStory')}
                              className="bg-white text-gray-900 p-2 rounded-full hover:bg-gray-100"
                            >
                              <Upload size={18} />
                            </button>
                          </div>
                        </>
                      ) : (
                        <button 
                          onClick={() => handleImageUpload('brandStory')}
                          className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 hover:text-blue-600 transition-colors"
                        >
                          <Plus size={32} className="mb-2" />
                          <span className="text-sm">上传图片</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Impact Section */}
            {activeSection === 'impact' && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Impact Section 板块</h2>
                  <p className="text-gray-500 text-sm mb-6">管理首页的影响力统计数据和品牌使命。</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">板块主标题</label>
                      <input
                        type="text"
                        value={content.impact?.title || ''}
                        onChange={(e) => setContent({
                          ...content,
                          impact: { ...content.impact, title: e.target.value } as ImpactSection,
                        })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg font-bold"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">使命描述</label>
                      <textarea
                        rows={4}
                        value={content.impact?.description || ''}
                        onChange={(e) => setContent({
                          ...content,
                          impact: { ...content.impact, description: e.target.value } as ImpactSection,
                        })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      />
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <label className="block text-sm font-medium text-gray-700">影响力数据项</label>
                        <button 
                          onClick={() => {
                            const stats = content.impact?.stats || []
                            setContent({
                              ...content,
                              impact: { 
                                ...content.impact, 
                                stats: [...stats, { id: Date.now().toString(), value: '0', label: 'New Metric' }] 
                              } as ImpactSection
                            })
                          }}
                          className="text-blue-600 hover:text-blue-700 text-xs font-bold"
                        >
                          + 添加数据
                        </button>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {(content.impact?.stats || []).map((stat, idx) => (
                          <div key={stat.id} className="p-4 bg-gray-50 border border-gray-200 rounded-xl relative group">
                            <button 
                              onClick={() => {
                                const stats = [...(content.impact?.stats || [])]
                                stats.splice(idx, 1)
                                setContent({ ...content, impact: { ...content.impact, stats } as ImpactSection })
                              }}
                              className="absolute top-2 right-2 text-gray-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X size={14} />
                            </button>
                            <input
                              type="text"
                              value={stat.value}
                              onChange={(e) => {
                                const stats = [...(content.impact?.stats || [])]
                                stats[idx] = { ...stat, value: e.target.value }
                                setContent({ ...content, impact: { ...content.impact, stats } as ImpactSection })
                              }}
                              className="w-full bg-transparent border-0 text-xl font-bold text-blue-600 p-0 focus:ring-0"
                              placeholder="240+"
                            />
                            <input
                              type="text"
                              value={stat.label}
                              onChange={(e) => {
                                const stats = [...(content.impact?.stats || [])]
                                stats[idx] = { ...stat, label: e.target.value }
                                setContent({ ...content, impact: { ...content.impact, stats } as ImpactSection })
                              }}
                              className="w-full bg-transparent border-0 text-xs text-gray-500 p-0 focus:ring-0"
                              placeholder="Artisans"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">背景图/形象图</label>
                    <div className="aspect-video bg-gray-100 rounded-xl overflow-hidden border-2 border-dashed border-gray-300 relative group">
                      {content.impact?.image ? (
                        <>
                          <img 
                            src={content.impact.image} 
                            alt="Preview" 
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                            <button 
                              onClick={() => handleImageUpload('impact')}
                              className="bg-white text-gray-900 p-2 rounded-full hover:bg-gray-100"
                            >
                              <Upload size={18} />
                            </button>
                          </div>
                        </>
                      ) : (
                        <button 
                          onClick={() => handleImageUpload('impact')}
                          className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 hover:text-blue-600 transition-colors"
                        >
                          <Plus size={32} className="mb-2" />
                          <span className="text-sm">上传图片</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Testimonials Section */}
            {activeSection === 'testimonials' && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Testimonials 板块</h2>
                  <p className="text-gray-500 text-sm mb-6">管理客户评价及反馈展示。</p>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">板块主标题</label>
                      <input
                        type="text"
                        value={content.testimonials?.title || ''}
                        onChange={(e) => setContent({
                          ...content,
                          testimonials: { ...content.testimonials, title: e.target.value } as TestimonialsSection,
                        })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                      />
                    </div>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bold text-gray-800">评价列表</h3>
                      <button 
                        onClick={() => {
                          const items = content.testimonials?.testimonials || []
                          setContent({
                            ...content,
                            testimonials: { 
                              ...content.testimonials, 
                              testimonials: [...items, { id: Date.now().toString(), author: 'New Customer', role: 'Verified Buyer', content: '', rating: 5 }] 
                            } as TestimonialsSection
                          })
                        }}
                        className="text-blue-600 hover:text-blue-700 text-sm font-bold flex items-center gap-1"
                      >
                        <Plus size={16} /> 添加评价
                      </button>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                      {(content.testimonials?.testimonials || []).map((t, idx) => (
                        <div key={t.id} className="p-6 bg-gray-50 rounded-xl border border-gray-200 relative group">
                          <button 
                            onClick={() => {
                              const items = [...(content.testimonials?.testimonials || [])]
                              items.splice(idx, 1)
                              setContent({ ...content, testimonials: { ...content.testimonials, testimonials: items } as TestimonialsSection })
                            }}
                            className="absolute top-4 right-4 text-gray-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 size={18} />
                          </button>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                              <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">姓名</label>
                                <input
                                  type="text"
                                  value={t.author}
                                  onChange={(e) => {
                                    const items = [...(content.testimonials?.testimonials || [])]
                                    items[idx] = { ...t, author: e.target.value }
                                    setContent({ ...content, testimonials: { ...content.testimonials, testimonials: items } as TestimonialsSection })
                                  }}
                                  className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">评价内容</label>
                                <textarea
                                  rows={3}
                                  value={t.content}
                                  onChange={(e) => {
                                    const items = [...(content.testimonials?.testimonials || [])]
                                    items[idx] = { ...t, content: e.target.value }
                                    setContent({ ...content, testimonials: { ...content.testimonials, testimonials: items } as TestimonialsSection })
                                  }}
                                  className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm resize-none"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Newsletter Section */}
            {activeSection === 'newsletter' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Newsletter 板块</h2>
                  <p className="text-gray-500 text-sm mb-6">管理首页的订阅邮件区域。</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">板块主标题</label>
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
