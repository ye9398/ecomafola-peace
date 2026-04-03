import { useState, useCallback, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import Cropper from 'react-easy-crop'
import { Save, Download, LogOut, ChevronLeft, Package, Image as ImageIcon, MessageSquare, Star, Upload, X, Plus, Trash2 } from 'lucide-react'

/**
 * 产品完整内容管理页面 v2
 * 编辑所有非 Shopify 内容：
 * - 每个板块都有：主标题、副标题、内容（多段落）、配图
 * - 评价卡片内容（独立配置）
 * - 规格、保证、FAQs 等
 */

const PRODUCTS = [
  { handle: 'samoan-handcrafted-coconut-bowl', name: 'Coconut Bowl' },
  { handle: 'samoan-woven-basket', name: 'Woven Basket' },
  { handle: 'samoan-handwoven-grass-tote-bag', name: 'Woven Tote Bag' },
  { handle: 'samoan-handcrafted-shell-necklace', name: 'Shell Necklace' },
  { handle: 'handwoven-papua-new-guinea-beach-bag', name: 'Beach Bag' },
  { handle: 'natural-coir-handwoven-coconut-palm-doormat', name: 'Doormat' },
]

interface Review {
  id: string
  author: string
  rating: number
  content: string
  date: string
  image?: string
  avatar?: string
}

interface SectionBlock {
  title: string
  subtitle: string
  content: string  // 支持多段落，用 \n\n 分隔
  image?: string
}

interface Specifications {
  size: string
  weight: string
  material: string
  origin: string
  care: string
}

interface FAQ {
  question: string
  answer: string
}

interface ProductContent {
  story?: SectionBlock
  environmental?: SectionBlock
  partnership?: SectionBlock
  specifications?: Specifications
  guarantee?: SectionBlock
  faqs?: FAQ[]
  reviews?: Review[]
  gallery?: string[]
}

export default function ProductContentAdmin() {
  const navigate = useNavigate()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const avatarInputRef = useRef<HTMLInputElement>(null)
  const [selectedProduct, setSelectedProduct] = useState('')
  const [content, setContent] = useState<Record<string, ProductContent>>({})
  const [loading, setLoading] = useState(true)
  const [saved, setSaved] = useState(false)
  const [activeSection, setActiveSection] = useState<'story' | 'environmental' | 'partnership' | 'specifications' | 'guarantee' | 'faqs' | 'reviews' | 'gallery'>('story')
  
  // 图片编辑状态
  // 模板标准尺寸 (宽x高)
  const TEMPLATE_SIZE = { width: 800, height: 400, aspect: 2 }

  const [currentImage, setCurrentImage] = useState<string>('')
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null)
  const [showCropModal, setShowCropModal] = useState(false)
  const [editingGalleryIndex, setEditingGalleryIndex] = useState<number | null>(null)
  const [editingSectionImage, setEditingSectionImage] = useState<'story' | 'environmental' | 'partnership' | 'guarantee' | null>(null)
  // 内嵌裁剪：在哪个板块显示裁剪工具
  const [inlineCropSection, setInlineCropSection] = useState<'story' | 'environmental' | 'partnership' | 'guarantee' | 'gallery' | null>(null)
  // 图片缩放：让原图自动填充模板
  const [autoZoom, setAutoZoom] = useState(1)

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

  const handleTextChange = (field: keyof ProductContent, value: string) => {
    if (!selectedProduct) return
    setContent({
      ...content,
      [selectedProduct]: {
        ...content[selectedProduct],
        [field]: value,
      },
    })
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !selectedProduct) return

    const reader = new FileReader()
    reader.onload = async (e) => {
      const result = e.target?.result as string
      setCurrentImage(result)
      
      // 自动计算缩放比例
      const zoom = await calculateAutoZoom(result)
      setAutoZoom(zoom)

      // 进入内嵌裁剪模式（所有上传图片都经过裁剪）
      if (editingSectionImage) {
        setInlineCropSection(editingSectionImage)
      } else {
        // gallery mode
        setShowCropModal(true)
      }
    }
    reader.readAsDataURL(file)
  }

  // 自动计算缩放比例，让图片刚好覆盖目标尺寸
  const calculateAutoZoom = useCallback((imageSrc: string): Promise<number> => {
    return new Promise((resolve) => {
      const img = new Image()
      img.onload = () => {
        const targetAspect = TEMPLATE_SIZE.height > 0 ? TEMPLATE_SIZE.width / TEMPLATE_SIZE.height : 2
        const imageAspect = img.width / img.height
        const zoom = Math.max(
          targetAspect > imageAspect ? targetAspect / imageAspect : imageAspect / targetAspect,
          1
        )
        resolve(zoom)
      }
      img.src = imageSrc
    })
  }, [])

  const onCropComplete = useCallback((croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }, [])

  /** 将裁剪后的图片保存到数据中 */
  const saveCroppedImage = useCallback(async (imageSrc: string, pixels: any, size: { width: number, height: number }): Promise<string> => {
    const image = new Image()
    image.src = imageSrc
    await new Promise((resolve) => { image.onload = resolve })

    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('No 2d context')

    const { width, height, x, y } = pixels
    canvas.width = size.width
    canvas.height = size.height
    ctx.drawImage(image, x, y, width, height, 0, 0, size.width, size.height)
    return canvas.toDataURL('image/jpeg', 0.9)
  }, [])

  /** 确认裁剪并保存 */
  const handleCropConfirm = async () => {
    if (!croppedAreaPixels || !currentImage) return
    try {
      // 板块模板图：固定尺寸
      const isSection = inlineCropSection && inlineCropSection !== 'gallery'
      const targetSize = isSection ? TEMPLATE_SIZE : { width: 800, height: 600 }

      const croppedImage = await saveCroppedImage(currentImage, croppedAreaPixels, targetSize)

      if (isSection) {
        // 保存到板块配图
        setContent({
          ...content,
          [selectedProduct]: {
            ...content[selectedProduct],
            [inlineCropSection as Exclude<typeof inlineCropSection, 'gallery'>]: {
              ...content[selectedProduct]?.[inlineCropSection as Exclude<typeof inlineCropSection, 'gallery'>],
              image: croppedImage,
            } as SectionBlock,
          },
        })
      } else if (editingGalleryIndex !== null) {
        // 替换图片库图片
        const updatedGallery = [...(content[selectedProduct]?.gallery || [])]
        updatedGallery[editingGalleryIndex] = croppedImage
        setContent({
          ...content,
          [selectedProduct]: { ...content[selectedProduct], gallery: updatedGallery },
        })
      } else {
        // 添加到图片库
        setContent({
          ...content,
          [selectedProduct]: {
            ...content[selectedProduct],
            gallery: [...(content[selectedProduct]?.gallery || []), croppedImage],
          },
        })
      }

      // 重置状态
      setCurrentImage('')
      setInlineCropSection(null)
      setShowCropModal(false)
      setEditingGalleryIndex(null)
      setEditingSectionImage(null)
      setAutoZoom(1)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (error) {
      console.error('Error cropping image:', error)
    }
  }

  /** 取消裁剪 */
  const handleCropCancel = () => {
    setCurrentImage('')
    setInlineCropSection(null)
    setShowCropModal(false)
    setEditingGalleryIndex(null)
    setEditingSectionImage(null)
    setAutoZoom(1)
  }

  const handleRemoveImage = (index: number) => {
    if (!selectedProduct) return
    const updatedGallery = content[selectedProduct]?.gallery?.filter((_, i) => i !== index) || []
    setContent({
      ...content,
      [selectedProduct]: {
        ...content[selectedProduct],
        gallery: updatedGallery,
      },
    })
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const handleAvatarSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>, reviewId: string) => {
    const file = e.target.files?.[0]
    if (!file || !selectedProduct) return

    // 验证文件大小
    const MAX_SIZE = 2 * 1024 * 1024 // 2MB
    if (file.size > MAX_SIZE) {
      alert('图片大小不能超过 2MB')
      e.target.value = ''
      return
    }

    // 验证文件类型
    if (!file.type.startsWith('image/')) {
      alert('只能上传图片文件')
      e.target.value = ''
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result as string
      const updated = (content[selectedProduct]?.reviews || []).map((review) =>
        review.id === reviewId ? { ...review, avatar: result } : review
      )
      setContent({ ...content, [selectedProduct]: { ...content[selectedProduct], reviews: updated } })
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    }
    reader.readAsDataURL(file)

    // Reset input so same file can be selected again
    e.target.value = ''
  }, [content, selectedProduct])

  const handleRemoveAvatar = useCallback((reviewId: string) => {
    if (!selectedProduct) return
    const updated = (content[selectedProduct]?.reviews || []).map((review) =>
      review.id === reviewId ? { ...review, avatar: undefined } : review
    )
    setContent({ ...content, [selectedProduct]: { ...content[selectedProduct], reviews: updated } })
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }, [content, selectedProduct])

  const handleDownload = () => {
    const dataStr = JSON.stringify({ products: content }, null, 2)
    const blob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'product-content-config.json'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
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
            <h1 className="text-2xl font-bold text-gray-900">产品完整内容管理</h1>
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
        {/* 产品选择 */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-2">选择产品</label>
          <select
            value={selectedProduct}
            onChange={(e) => setSelectedProduct(e.target.value)}
            className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">请选择产品...</option>
            {PRODUCTS.map((product) => (
              <option key={product.handle} value={product.handle}>
                {product.name}
              </option>
            ))}
          </select>
        </div>

        {selectedProduct && (
          <>
            {/* 板块选择器 - 左侧固定导航 */}
            <div className="flex gap-6 mb-8">
              <div className="w-56 flex-shrink-0">
                <nav className="space-y-1">
                  {[
                    { id: 'story', label: '📖 品牌故事', icon: '📖' },
                    { id: 'environmental', label: '🌱 环保影响', icon: '🌱' },
                    { id: 'partnership', label: '🤝 合作模式', icon: '🤝' },
                    { id: 'specifications', label: '📏 产品规格', icon: '📏' },
                    { id: 'guarantee', label: '✅ 质量保证', icon: '✅' },
                    { id: 'faqs', label: '❓ 常见问题', icon: '❓' },
                    { id: 'reviews', label: '⭐ 用户评价', icon: '⭐' },
                    { id: 'gallery', label: '🖼️ 补充图片', icon: '🖼️' },
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
                
                {/* 品牌故事编辑 */}
                {activeSection === 'story' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between pb-4 border-b">
                      <h2 className="text-xl font-bold text-gray-900">品牌故事</h2>
                      <button
                        onClick={() => {
                          setEditingSectionImage('story')
                          fileInputRef.current?.click()
                        }}
                        className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <ImageIcon size={18} />
                        <span>{content[selectedProduct]?.story?.image ? '更换配图' : '添加配图'}</span>
                      </button>
                    </div>

                    {/* 图片预览区域 */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">配图预览</label>
                      {content[selectedProduct]?.story?.image ? (
                        <div className="relative">
                          <img
                            src={content[selectedProduct].story.image}
                            alt="Story preview"
                            className="w-full max-w-md h-48 object-cover rounded-lg shadow-sm border border-gray-200"
                          />
                          <button
                            onClick={() => {
                              setContent({
                                ...content,
                                [selectedProduct]: {
                                  ...content[selectedProduct],
                                  story: { ...content[selectedProduct]?.story, image: undefined } as SectionBlock,
                                },
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
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        主标题 <span className="text-gray-400">(必填)</span>
                      </label>
                      <input
                        type="text"
                        value={content[selectedProduct]?.story?.title || ''}
                        onChange={(e) => setContent({
                          ...content,
                          [selectedProduct]: {
                            ...content[selectedProduct],
                            story: { ...content[selectedProduct]?.story, title: e.target.value } as SectionBlock,
                          },
                        })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg font-serif"
                        placeholder="例如：Handcrafted Coconut Bowl"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        副标题 <span className="text-gray-400">(可选)</span>
                      </label>
                      <input
                        type="text"
                        value={content[selectedProduct]?.story?.subtitle || ''}
                        onChange={(e) => setContent({
                          ...content,
                          [selectedProduct]: {
                            ...content[selectedProduct],
                            story: { ...content[selectedProduct]?.story, subtitle: e.target.value } as SectionBlock,
                          },
                        })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="例如：Nature's Perfect Vessel, Crafted by Samoan Artisans"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        内容 <span className="text-gray-400">(支持多段落，用空行分隔)</span>
                      </label>
                      <textarea
                        value={content[selectedProduct]?.story?.content || ''}
                        onChange={(e) => setContent({
                          ...content,
                          [selectedProduct]: {
                            ...content[selectedProduct],
                            story: { ...content[selectedProduct]?.story, content: e.target.value } as SectionBlock,
                          },
                        })}
                        rows={10}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-serif leading-relaxed"
                        placeholder="输入品牌故事内容...&#10;&#10;用空行分隔不同段落"
                      />
                    </div>
                  </div>
                )}

                {/* 环保影响编辑 */}
                {activeSection === 'environmental' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between pb-4 border-b">
                      <h2 className="text-xl font-bold text-gray-900">环保影响</h2>
                      <button
                        onClick={() => {
                          setEditingSectionImage('environmental')
                          fileInputRef.current?.click()
                        }}
                        className="flex items-center gap-2 px-4 py-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      >
                        <ImageIcon size={18} />
                        <span>{content[selectedProduct]?.environmental?.image ? '更换配图' : '添加配图'}</span>
                      </button>
                    </div>

                    {/* 图片预览区域 */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">配图预览</label>
                      {content[selectedProduct]?.environmental?.image ? (
                        <div className="relative">
                          <img
                            src={content[selectedProduct].environmental.image}
                            alt="Environmental preview"
                            className="w-full max-w-md h-48 object-cover rounded-lg shadow-sm border border-gray-200"
                          />
                          <button
                            onClick={() => {
                              setContent({
                                ...content,
                                [selectedProduct]: {
                                  ...content[selectedProduct],
                                  environmental: { ...content[selectedProduct]?.environmental, image: undefined } as SectionBlock,
                                },
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
                      <label className="block text-sm font-medium text-gray-700 mb-2">主标题</label>
                      <input
                        type="text"
                        value={content[selectedProduct]?.environmental?.title || ''}
                        onChange={(e) => setContent({
                          ...content,
                          [selectedProduct]: {
                            ...content[selectedProduct],
                            environmental: { ...content[selectedProduct]?.environmental, title: e.target.value } as SectionBlock,
                          },
                        })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg"
                        placeholder="例如：Environmental Impact"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">副标题</label>
                      <input
                        type="text"
                        value={content[selectedProduct]?.environmental?.subtitle || ''}
                        onChange={(e) => setContent({
                          ...content,
                          [selectedProduct]: {
                            ...content[selectedProduct],
                            environmental: { ...content[selectedProduct]?.environmental, subtitle: e.target.value } as SectionBlock,
                          },
                        })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="例如：How our products benefit the planet"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">内容</label>
                      <textarea
                        value={content[selectedProduct]?.environmental?.content || ''}
                        onChange={(e) => setContent({
                          ...content,
                          [selectedProduct]: {
                            ...content[selectedProduct],
                            environmental: { ...content[selectedProduct]?.environmental, content: e.target.value } as SectionBlock,
                          },
                        })}
                        rows={10}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="描述环保影响..."
                      />
                    </div>
                  </div>
                )}

                {/* 合作模式编辑 */}
                {activeSection === 'partnership' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between pb-4 border-b">
                      <h2 className="text-xl font-bold text-gray-900">合作模式</h2>
                      <button
                        onClick={() => {
                          setEditingSectionImage('partnership')
                          fileInputRef.current?.click()
                        }}
                        className="flex items-center gap-2 px-4 py-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                      >
                        <ImageIcon size={18} />
                        <span>{content[selectedProduct]?.partnership?.image ? '更换配图' : '添加配图'}</span>
                      </button>
                    </div>

                    {/* 图片预览区域 */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">配图预览</label>
                      {content[selectedProduct]?.partnership?.image ? (
                        <div className="relative">
                          <img
                            src={content[selectedProduct].partnership.image}
                            alt="Partnership preview"
                            className="w-full max-w-md h-48 object-cover rounded-lg shadow-sm border border-gray-200"
                          />
                          <button
                            onClick={() => {
                              setContent({
                                ...content,
                                [selectedProduct]: {
                                  ...content[selectedProduct],
                                  partnership: { ...content[selectedProduct]?.partnership, image: undefined } as SectionBlock,
                                },
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
                      <label className="block text-sm font-medium text-gray-700 mb-2">主标题</label>
                      <input
                        type="text"
                        value={content[selectedProduct]?.partnership?.title || ''}
                        onChange={(e) => setContent({
                          ...content,
                          [selectedProduct]: {
                            ...content[selectedProduct],
                            partnership: { ...content[selectedProduct]?.partnership, title: e.target.value } as SectionBlock,
                          },
                        })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg"
                        placeholder="例如：Our Partnership Model"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">副标题</label>
                      <input
                        type="text"
                        value={content[selectedProduct]?.partnership?.subtitle || ''}
                        onChange={(e) => setContent({
                          ...content,
                          [selectedProduct]: {
                            ...content[selectedProduct],
                            partnership: { ...content[selectedProduct]?.partnership, subtitle: e.target.value } as SectionBlock,
                          },
                        })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="例如：Fair trade that empowers communities"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">内容</label>
                      <textarea
                        value={content[selectedProduct]?.partnership?.content || ''}
                        onChange={(e) => setContent({
                          ...content,
                          [selectedProduct]: {
                            ...content[selectedProduct],
                            partnership: { ...content[selectedProduct]?.partnership, content: e.target.value } as SectionBlock,
                          },
                        })}
                        rows={10}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="描述合作模式..."
                      />
                    </div>
                  </div>
                )}

                {/* 产品规格编辑 */}
                {activeSection === 'specifications' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between pb-4 border-b">
                      <h2 className="text-xl font-bold text-gray-900">产品规格</h2>
                      <button
                        onClick={() => {
                          setEditingSectionImage('story')
                          setCurrentImage(content[selectedProduct]?.specifications?.image || '')
                          fileInputRef.current?.click()
                        }}
                        className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <ImageIcon size={18} />
                        <span>添加配图</span>
                      </button>
                    </div>
                    
                    {[
                      { key: 'size', label: '尺寸', placeholder: '例如：Approximately 5 inches (13cm) diameter' },
                      { key: 'weight', label: '重量', placeholder: '例如：Approximately 0.3 lbs (140g)' },
                      { key: 'material', label: '材质', placeholder: '例如：100% natural coconut shell' },
                      { key: 'origin', label: '产地', placeholder: '例如：Handcrafted in Apia, Samoa' },
                      { key: 'care', label: '保养说明', placeholder: '例如：Hand wash only with mild soap' },
                    ].map((field) => (
                      <div key={field.key}>
                        <label className="block text-sm font-medium text-gray-700 mb-2">{field.label}</label>
                        <input
                          type="text"
                          value={(content[selectedProduct]?.specifications as any)?.[field.key] || ''}
                          onChange={(e) => setContent({
                            ...content,
                            [selectedProduct]: {
                              ...content[selectedProduct],
                              specifications: { 
                                ...(content[selectedProduct]?.specifications || {}),
                                [field.key]: e.target.value 
                              } as Specifications,
                            },
                          })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder={field.placeholder}
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* 质量保证编辑 */}
                {activeSection === 'guarantee' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between pb-4 border-b">
                      <h2 className="text-xl font-bold text-gray-900">质量保证</h2>
                      <button
                        onClick={() => {
                          setEditingSectionImage('guarantee')
                          fileInputRef.current?.click()
                        }}
                        className="flex items-center gap-2 px-4 py-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                      >
                        <ImageIcon size={18} />
                        <span>{content[selectedProduct]?.guarantee?.image ? '更换配图' : '添加配图'}</span>
                      </button>
                    </div>

                    {/* 图片预览区域 */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">配图预览</label>
                      {content[selectedProduct]?.guarantee?.image ? (
                        <div className="relative">
                          <img
                            src={content[selectedProduct].guarantee.image}
                            alt="Guarantee preview"
                            className="w-full max-w-md h-48 object-cover rounded-lg shadow-sm border border-gray-200"
                          />
                          <button
                            onClick={() => {
                              setContent({
                                ...content,
                                [selectedProduct]: {
                                  ...content[selectedProduct],
                                  guarantee: { ...content[selectedProduct]?.guarantee, image: undefined } as SectionBlock,
                                },
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
                      <label className="block text-sm font-medium text-gray-700 mb-2">主标题</label>
                      <input
                        type="text"
                        value={content[selectedProduct]?.guarantee?.title || ''}
                        onChange={(e) => setContent({
                          ...content,
                          [selectedProduct]: {
                            ...content[selectedProduct],
                            guarantee: { ...content[selectedProduct]?.guarantee, title: e.target.value } as SectionBlock,
                          },
                        })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-lg"
                        placeholder="例如：Quality Guarantee"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">内容</label>
                      <textarea
                        value={content[selectedProduct]?.guarantee?.content || ''}
                        onChange={(e) => setContent({
                          ...content,
                          [selectedProduct]: {
                            ...content[selectedProduct],
                            guarantee: { ...content[selectedProduct]?.guarantee, content: e.target.value } as SectionBlock,
                          },
                        })}
                        rows={10}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        placeholder="描述质量保证政策..."
                      />
                    </div>
                  </div>
                )}

                {/* 常见问题编辑 */}
                {activeSection === 'faqs' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between pb-4 border-b">
                      <h2 className="text-xl font-bold text-gray-900">常见问题</h2>
                      <button
                        onClick={() => {
                          const newFaq: FAQ = { question: '', answer: '' }
                          setContent({
                            ...content,
                            [selectedProduct]: {
                              ...content[selectedProduct],
                              faqs: [...(content[selectedProduct]?.faqs || []), newFaq],
                            },
                          })
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <Plus size={18} />
                        <span>添加问题</span>
                      </button>
                    </div>
                    
                    <div className="space-y-4">
                      {content[selectedProduct]?.faqs?.map((faq, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                          <div className="flex justify-between items-start mb-3">
                            <span className="text-sm font-medium text-gray-500">问题 {index + 1}</span>
                            <button
                              onClick={() => {
                                const updated = content[selectedProduct]?.faqs?.filter((_, i) => i !== index) || []
                                setContent({
                                  ...content,
                                  [selectedProduct]: { ...content[selectedProduct], faqs: updated },
                                })
                              }}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                          <div className="space-y-3">
                            <input
                              type="text"
                              value={faq.question}
                              onChange={(e) => {
                                const updated = [...(content[selectedProduct]?.faqs || [])]
                                updated[index].question = e.target.value
                                setContent({ ...content, [selectedProduct]: { ...content[selectedProduct], faqs: updated } })
                              }}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                              placeholder="问题内容..."
                            />
                            <textarea
                              value={faq.answer}
                              onChange={(e) => {
                                const updated = [...(content[selectedProduct]?.faqs || [])]
                                updated[index].answer = e.target.value
                                setContent({ ...content, [selectedProduct]: { ...content[selectedProduct], faqs: updated } })
                              }}
                              rows={3}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                              placeholder="回答内容..."
                            />
                          </div>
                        </div>
                      )) || (
                        <div className="text-center py-8 text-gray-500">暂无问题，点击上方按钮添加</div>
                      )}
                    </div>
                  </div>
                )}

                {/* 用户评价编辑 */}
                {activeSection === 'reviews' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between pb-4 border-b">
                      <h2 className="text-xl font-bold text-gray-900">用户评价</h2>
                      <button
                        onClick={() => {
                          const newReview: Review = {
                            id: Date.now().toString(),
                            author: '',
                            rating: 5,
                            content: '',
                            date: new Date().toISOString().split('T')[0],
                          }
                          setContent({
                            ...content,
                            [selectedProduct]: {
                              ...content[selectedProduct],
                              reviews: [...(content[selectedProduct]?.reviews || []), newReview],
                            },
                          })
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <Plus size={18} />
                        <span>添加评价</span>
                      </button>
                    </div>
                    
                    <div className="space-y-4">
                      {content[selectedProduct]?.reviews?.map((review, index) => (
                        <div key={review.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-4 flex-1">
                              {/* 头像上传 */}
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">头像</label>
                                <div className="flex items-center gap-3">
                                  {review.avatar ? (
                                    <div className="relative">
                                      <img
                                        src={review.avatar}
                                        alt="Avatar"
                                        className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                                      />
                                      <button
                                        onClick={() => handleRemoveAvatar(review.id)}
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
                                  <button
                                    onClick={() => avatarInputRef.current?.click()}
                                    className="flex items-center gap-2 px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                    type="button"
                                  >
                                    <Upload size={16} />
                                    <span>{review.avatar ? '更换' : '上传'}头像</span>
                                  </button>
                                </div>
                                <input
                                  ref={avatarInputRef}
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) => handleAvatarSelect(e, review.id)}
                                />
                              </div>

                              <input
                                type="text"
                                value={review.author}
                                onChange={(e) => {
                                  const updated = [...(content[selectedProduct]?.reviews || [])]
                                  updated[index].author = e.target.value
                                  setContent({ ...content, [selectedProduct]: { ...content[selectedProduct], reviews: updated } })
                                }}
                                placeholder="评价者姓名"
                                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                              />
                              <div className="flex items-center gap-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <button
                                    key={star}
                                    onClick={() => {
                                      const updated = [...(content[selectedProduct]?.reviews || [])]
                                      updated[index].rating = star
                                      setContent({ ...content, [selectedProduct]: { ...content[selectedProduct], reviews: updated } })
                                    }}
                                    className="focus:outline-none"
                                  >
                                    <Star
                                      size={20}
                                      className={star <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                                    />
                                  </button>
                                ))}
                              </div>
                            </div>
                            <button
                              onClick={() => {
                                const updated = content[selectedProduct]?.reviews?.filter((_, i) => i !== index) || []
                                setContent({ ...content, [selectedProduct]: { ...content[selectedProduct], reviews: updated } })
                              }}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                          <textarea
                            value={review.content}
                            onChange={(e) => {
                              const updated = [...(content[selectedProduct]?.reviews || [])]
                              updated[index].content = e.target.value
                              setContent({ ...content, [selectedProduct]: { ...content[selectedProduct], reviews: updated } })
                            }}
                            placeholder="评价内容..."
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 mb-3"
                          />
                          <div className="flex items-center gap-4">
                            <div>
                              <label className="text-sm text-gray-600">日期：</label>
                              <input
                                type="date"
                                value={review.date}
                                onChange={(e) => {
                                  const updated = [...(content[selectedProduct]?.reviews || [])]
                                  updated[index].date = e.target.value
                                  setContent({ ...content, [selectedProduct]: { ...content[selectedProduct], reviews: updated } })
                                }}
                                className="ml-2 px-3 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                              />
                            </div>
                          </div>
                        </div>
                      )) || (
                        <div className="text-center py-8 text-gray-500">暂无评价，点击上方按钮添加</div>
                      )}
                    </div>
                  </div>
                )}

                {/* 补充图片库 */}
                {activeSection === 'gallery' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between pb-4 border-b">
                      <h2 className="text-xl font-bold text-gray-900">补充图片库</h2>
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <Upload size={18} />
                        <span>上传图片</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {content[selectedProduct]?.gallery?.map((img, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={img}
                            alt={`Gallery ${index}`}
                            className="w-full h-48 object-cover rounded-lg"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity rounded-lg flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                            <button
                              onClick={() => handleRemoveImage(index)}
                              className="p-2 bg-red-500 rounded-full hover:bg-red-600"
                            >
                              <X size={16} className="text-white" />
                            </button>
                          </div>
                        </div>
                      )) || (
                        <div className="col-span-full bg-gray-100 rounded-lg h-48 flex items-center justify-center">
                          <p className="text-gray-500">暂无图片，点击上方按钮上传</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

              </div>
            </div>
          </>
        )}

        {/* 使用说明 */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-bold text-blue-900 mb-2">📋 使用说明</h3>
          <ul className="space-y-2 text-blue-800">
            <li>✅ <strong>板块化编辑：</strong>每个板块（品牌故事、环保影响等）都有独立的主标题、副标题、内容、配图</li>
            <li>✅ <strong>用户评价：</strong>管理详情页顶部展示的用户评价卡片（姓名、评分、内容、日期）</li>
            <li>✅ <strong>产品规格：</strong>编辑尺寸、重量、材质、产地、保养说明</li>
            <li>✅ <strong>常见问题：</strong>添加/编辑 FAQs 问答对</li>
            <li>✅ <strong>补充图片：</strong>上传额外的产品场景图、细节图到图片库</li>
            <li>✅ <strong>下载配置：</strong>完成后下载 JSON 文件，用于更新网站内容</li>
            <li>⚠️ <strong>数据隔离：</strong>所有内容存储在独立 JSON 文件，不影响 Shopify 核心数据</li>
          </ul>
        </div>
      </main>

      {/* 隐藏的文件选择输入 */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileSelect}
      />

      {/* 内嵌裁剪工具 — 板块配图 & 图片库 */}
      {currentImage && (inlineCropSection || showCropModal) && (
        <div className="mt-6 bg-white rounded-xl shadow-sm border-2 border-blue-200 p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-gray-900">
              ✂️ 裁剪图片
            </h3>
            <button onClick={handleCropCancel} className="text-gray-400 hover:text-gray-600 text-2xl">✕</button>
          </div>
          
          {/* 提示 */}
          <div className="mb-3 px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-700">
            {inlineCropSection && inlineCropSection !== 'gallery' 
              ? `📐 模板尺寸：${TEMPLATE_SIZE.width}×${TEMPLATE_SIZE.height} — 拖动调整位置，滚轮缩放` 
              : '📐 图片库尺寸：800×600 — 拖动调整位置，滚轮缩放'}
          </div>

          {/* 图片比例显示 */}
          <p className="text-xs text-gray-400 mb-2">蓝色框内为最终显示区域</p>

          {/* 裁剪区域 */}
          <div className="relative rounded-lg overflow-hidden bg-gray-900" style={{ width: '100%', maxWidth: 800, maxHeight: 400, aspectRatio: `${TEMPLATE_SIZE.aspect}/1`, margin: '0 auto' }}>
            <Cropper
              image={currentImage}
              crop={crop}
              zoom={autoZoom}
              aspect={TEMPLATE_SIZE.aspect}
              onCropChange={setCrop}
              onZoomChange={(z) => setAutoZoom(z)}
              onCropComplete={onCropComplete}
            />
          </div>

          {/* 控制栏 */}
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600">🔍 缩放：</span>
              <input
                type="range"
                min="1"
                max={Math.ceil(autoZoom * 3 * 10) / 10}
                step="0.1"
                defaultValue={autoZoom}
                onChange={(e) => setAutoZoom(Number(e.target.value))}
                className="w-48 accent-blue-600"
              />
              <span className="text-sm text-gray-500">{autoZoom.toFixed(1)}x</span>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleCropCancel}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-600"
              >
                取消
              </button>
              <button
                onClick={handleCropConfirm}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Save size={18} />
                保存裁剪
              </button>
            </div>
          </div>
        </div>
      )}

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
