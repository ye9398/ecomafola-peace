import { useState, useCallback, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import Cropper from 'react-easy-crop'
import type { Area } from 'react-easy-crop'
import { Save, Download, LogOut, ChevronLeft, Package, Image as ImageIcon, MessageSquare, Star, Upload, X, Plus, Trash2 } from 'lucide-react'
import { getAllProducts } from '../../lib/shopify'
import { getProductContent, saveProductContent, uploadSectionImage, uploadGalleryImage, type ProductContent } from '../../lib/contentService'
import { isSupabaseConfigured } from '../../lib/supabase'

/**
 * 产品完整内容管理页面 v2
 * 编辑所有非 Shopify 内容
 * - 每个板块都有：主标题、副标题、内容（多段落）、配图
 * - 评价卡片内容（独立配置）
 * - 规格、保证、FAQs 等
 */

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
  image?: string
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
  const [shopifyProducts, setShopifyProducts] = useState<{ handle: string; name: string }[]>([])
  const [selectedProduct, setSelectedProduct] = useState('')
  const [content, setContent] = useState<Record<string, ProductContent>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [activeSection, setActiveSection] = useState<'story' | 'environmental' | 'partnership' | 'specifications' | 'guarantee' | 'faqs' | 'reviews' | 'gallery'>('story')
  
  // 模板标准尺寸 (宽x高)
  const TEMPLATE_SIZE = { width: 1200, height: 900, aspect: 4 / 3 }

  const [currentImage, setCurrentImage] = useState<string>('')
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null)
  const [showCropModal, setShowCropModal] = useState(false)
  const [editingGalleryIndex, setEditingGalleryIndex] = useState<number | null>(null)
  const [editingSectionImage, setEditingSectionImage] = useState<'story' | 'environmental' | 'partnership' | 'specifications' | 'guarantee' | null>(null)
  // 内嵌裁剪：在哪个板块显示裁剪工具
  const [inlineCropSection, setInlineCropSection] = useState<'story' | 'environmental' | 'partnership' | 'specifications' | 'guarantee' | 'gallery' | null>(null)
  // 图片缩放：让原图自动填充模板
  const [autoZoom, setAutoZoom] = useState(1)

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
      // Step 1: Fetch products from Shopify
      const products = await getAllProducts()
      if (!products.length) {
        throw new Error('Shopify returned empty product list')
      }
      const productList = products.map((p: any) => ({ handle: p.handle, name: p.title }))
      setShopifyProducts(productList)

      // Step 2: Fetch all content from Supabase
      if (isSupabaseConfigured()) {
        const supaContent: Record<string, ProductContent> = {}
        for (const p of productList) {
          const c = await getProductContent(p.handle)
          if (c) supaContent[p.handle] = c
        }
        setContent(supaContent)
      }
    } catch (error) {
      console.error('Shopify API failed, falling back to JSON:', error)
      // Fallback: load from static JSON
      try {
        const response = await fetch('/admin-content/ecomafola-content.json')
        if (response.ok) {
          const data = await response.json()
          setContent(data.products || {})
        }
      } catch {
        // Use empty
      }
      // Ensure shopifyProducts is set even on API failure
      if (shopifyProducts.length === 0) {
        const fallbackProducts = [
          { handle: 'samoan-handcrafted-coconut-bowl', name: 'Coconut Bowl' },
          { handle: 'samoan-woven-basket', name: 'Woven Basket' },
          { handle: 'samoan-handwoven-grass-tote-bag', name: 'Woven Tote Bag' },
          { handle: 'samoan-handcrafted-shell-necklace', name: 'Shell Necklace' },
          { handle: 'handwoven-papua-new-guinea-beach-bag', name: 'Beach Bag' },
          { handle: 'natural-coir-handwoven-coconut-palm-doormat', name: 'Doormat' },
          { handle: 'samoan-handcrafted-natural-shell-coasters', name: 'Shell Coasters' },
        ]
        setShopifyProducts(fallbackProducts)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('admin_authenticated')
    navigate('/')
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

      // 进入内嵌裁剪模式
      if (editingSectionImage) {
        setInlineCropSection(editingSectionImage)
      } else {
        // gallery mode
        setShowCropModal(true)
      }
    }
    reader.readAsDataURL(file)
    // 重置 input 以便同一个文件可以再次选择
    e.target.value = ''
  }

  // 自动计算缩放比例，让图片刚好覆盖目标尺寸
  const calculateAutoZoom = useCallback((imageSrc: string): Promise<number> => {
    return new Promise((resolve) => {
      const img = new Image()
      img.onload = () => {
        const targetAspect = TEMPLATE_SIZE.aspect
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

  const onCropComplete = useCallback((_croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }, [])

  /** 将裁剪后的图片保存到数据 */
  const saveCroppedImage = useCallback(async (imageSrc: string, pixels: any, size: { width: number, height: number }, targetSizeKB = 150): Promise<{ dataUrl: string, compressedSizeKB: number }> => {
    const image = new Image()
    image.src = imageSrc
    await new Promise((resolve) => { image.onload = resolve })

    let quality = 0.9
    let dataUrl: string
    
    do {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      if (!ctx) throw new Error('No 2d context')

      const { width, height, x, y } = pixels
      canvas.width = size.width
      canvas.height = size.height
      ctx.drawImage(image, x, y, width, height, 0, 0, size.width, size.height)
      dataUrl = canvas.toDataURL('image/jpeg', quality)
      
      const base64Length = dataUrl.length - dataUrl.indexOf(',') - 1
      const sizeKB = Math.round((base64Length * 0.75) / 1024)
      
      if (sizeKB <= targetSizeKB) {
        return { dataUrl, compressedSizeKB: sizeKB }
      }
      
      quality -= 0.1
    } while (quality >= 0.3)

    const base64Length = dataUrl.length - dataUrl.indexOf(',') - 1
    const sizeKB = Math.round((base64Length * 0.75) / 1024)
    return { dataUrl, compressedSizeKB: sizeKB }
  }, [])

  /** 确认裁剪并保存 */
  const handleCropConfirm = async () => {
    if (!croppedAreaPixels || !currentImage || !selectedProduct) return
    try {
      const isSection = inlineCropSection && inlineCropSection !== 'gallery'
      const targetSize = isSection ? { width: TEMPLATE_SIZE.width, height: TEMPLATE_SIZE.height } : { width: 1200, height: 900 }

      const { dataUrl: croppedImage, compressedSizeKB: sizeKB } = await saveCroppedImage(currentImage, croppedAreaPixels, targetSize)

      // Upload to Supabase Storage
      let imageUrl = croppedImage
      if (isSupabaseConfigured()) {
        try {
          const blob = await fetch(croppedImage).then(r => r.blob())
          const file = new File([blob], 'image.jpeg', { type: 'image/jpeg' })
          const sectionKey = inlineCropSection || 'gallery'
          let publicUrl: string
          if (sectionKey === 'gallery' && editingGalleryIndex !== null) {
            publicUrl = (await uploadGalleryImage(selectedProduct, editingGalleryIndex, file)).publicUrl
          } else {
            const typedSection = sectionKey as 'story' | 'environmental' | 'partnership' | 'specifications' | 'guarantee'
            publicUrl = (await uploadSectionImage(selectedProduct, typedSection, file)).publicUrl
          }
          imageUrl = publicUrl
        } catch (uploadErr: unknown) {
          const msg = uploadErr instanceof Error ? uploadErr.message : String(uploadErr)
          console.warn('Supabase upload failed, using local dataURL:', msg)
          // Continue with base64 as fallback
        }
      }

      if (isSection) {
        const section = inlineCropSection as Exclude<typeof inlineCropSection, 'gallery'>
        const productContent = content[selectedProduct] || {}
        const updatedProductContent = { ...productContent }

        if (section === 'specifications') {
          updatedProductContent.specifications = {
            ...(productContent.specifications || { size: '', weight: '', material: '', origin: '', care: '' }),
            image: imageUrl
          }
        } else {
          updatedProductContent[section] = {
            ...(productContent[section] || { title: '', subtitle: '', content: '' }),
            image: imageUrl
          }
        }

        setContent({
          ...content,
          [selectedProduct]: updatedProductContent
        })
      } else if (editingGalleryIndex !== null) {
        const updatedGallery = [...(content[selectedProduct]?.gallery || [])]
        updatedGallery[editingGalleryIndex] = imageUrl
        setContent({
          ...content,
          [selectedProduct]: { ...content[selectedProduct], gallery: updatedGallery },
        })
      } else {
        setContent({
          ...content,
          [selectedProduct]: {
            ...content[selectedProduct],
            gallery: [...(content[selectedProduct]?.gallery || []), imageUrl],
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

      alert(`图片已保存！\n裁剪尺寸：${targetSize.width}×${targetSize.height}\n压缩后大小：${sizeKB}KB`)
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : String(error)
      console.error('Error cropping image:', msg)
    }
  }

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
  }

  const handleAvatarSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>, reviewId: string) => {
    const file = e.target.files?.[0]
    if (!file || !selectedProduct) return

    const MAX_SIZE = 2 * 1024 * 1024
    if (file.size > MAX_SIZE) {
      alert('图片大小不能超过 2MB')
      e.target.value = ''
      return
    }

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
    }
    reader.readAsDataURL(file)
    e.target.value = ''
  }, [content, selectedProduct])

  const handleRemoveAvatar = useCallback((reviewId: string) => {
    if (!selectedProduct) return
    const updated = (content[selectedProduct]?.reviews || []).map((review) =>
      review.id === reviewId ? { ...review, avatar: undefined } : review
    )
    setContent({ ...content, [selectedProduct]: { ...content[selectedProduct], reviews: updated } })
    setSaved(true)
  }, [content, selectedProduct])

  const handleSavePublish = async () => {
    if (!selectedProduct) return
    setSaving(true)
    try {
      await saveProductContent(selectedProduct, content[selectedProduct])
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">加载中...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
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
              onClick={handleSavePublish}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              <Download size={20} />
              <span>{saving ? '保存中...' : '保存并发布'}</span>
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
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-2">选择产品</label>
          <select
            value={selectedProduct}
            onChange={(e) => setSelectedProduct(e.target.value)}
            className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">请选择产品...</option>
            {shopifyProducts.map((product) => (
              <option key={product.handle} value={product.handle}>
                {product.name}
              </option>
            ))}
          </select>
        </div>

        {selectedProduct && (
          <div className="flex gap-6 mb-8">
            <div className="w-56 flex-shrink-0">
              <nav className="space-y-1">
                {[
                  { id: 'story', label: '📖 品牌故事' },
                  { id: 'environmental', label: '🌱 环保影响' },
                  { id: 'partnership', label: '🤝 合作模式' },
                  { id: 'specifications', label: '📏 产品规格' },
                  { id: 'guarantee', label: '🛡️ 质量保证' },
                  { id: 'faqs', label: '❓ 常见问题' },
                  { id: 'reviews', label: '⭐ 用户评价' },
                  { id: 'gallery', label: '🖼️ 补充图片' },
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

            <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              
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
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">配图预览</label>
                    {content[selectedProduct]?.story?.image ? (
                      <div className="relative">
                        <img
                          src={content[selectedProduct].story.image}
                          alt="Story preview"
                          className="w-full max-w-md h-64 object-cover rounded-lg shadow-sm border border-gray-200"
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
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ) : (
                      <div className="w-full max-w-md h-48 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400">
                        <ImageIcon size={48} className="mb-2 opacity-50" />
                        <p className="text-sm">暂无配图</p>
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">主标题</label>
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">内容</label>
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              )}

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
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">配图预览</label>
                    {content[selectedProduct]?.environmental?.image ? (
                      <div className="relative">
                        <img
                          src={content[selectedProduct].environmental.image}
                          alt="Environmental preview"
                          className="w-full max-w-md h-64 object-cover rounded-lg shadow-sm border border-gray-200"
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
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ) : (
                      <div className="w-full max-w-md h-48 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400">
                        <ImageIcon size={48} className="mb-2 opacity-50" />
                        <p className="text-sm">暂无配图</p>
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </div>
              )}

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
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">配图预览</label>
                    {content[selectedProduct]?.partnership?.image ? (
                      <div className="relative">
                        <img
                          src={content[selectedProduct].partnership.image}
                          alt="Partnership preview"
                          className="w-full max-w-md h-64 object-cover rounded-lg shadow-sm border border-gray-200"
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
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ) : (
                      <div className="w-full max-w-md h-48 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400">
                        <ImageIcon size={48} className="mb-2 opacity-50" />
                        <p className="text-sm">暂无配图</p>
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>
              )}

              {activeSection === 'specifications' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between pb-4 border-b">
                    <h2 className="text-xl font-bold text-gray-900">产品规格</h2>
                    <button
                      onClick={() => {
                        setEditingSectionImage('specifications')
                        fileInputRef.current?.click()
                      }}
                      className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <ImageIcon size={18} />
                      <span>{content[selectedProduct]?.specifications?.image ? '更换配图' : '添加配图'}</span>
                    </button>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">规格图预览 (4:3)</label>
                    {content[selectedProduct]?.specifications?.image ? (
                      <div className="relative">
                        <img
                          src={content[selectedProduct].specifications.image}
                          alt="Specifications preview"
                          className="w-full max-w-md h-64 object-cover rounded-lg shadow-sm border border-gray-200"
                        />
                        <button
                          onClick={() => {
                            const updated = { ...content }
                            if (updated[selectedProduct].specifications) {
                              updated[selectedProduct].specifications.image = undefined
                              setContent(updated)
                            }
                          }}
                          className="absolute -top-2 -left-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ) : (
                      <div className="w-full max-w-md h-48 bg-gray-50 border-2 border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center text-gray-400">
                        <ImageIcon size={48} className="mb-2" />
                        <p className="text-sm">暂无配图</p>
                      </div>
                    )}
                  </div>
                  
                  {[
                    { key: 'size', label: '尺寸' },
                    { key: 'weight', label: '重量' },
                    { key: 'material', label: '材质' },
                    { key: 'origin', label: '产地' },
                    { key: 'care', label: '保养说明' },
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
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  ))}
                </div>
              )}

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
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">配图预览</label>
                    {content[selectedProduct]?.guarantee?.image ? (
                      <div className="relative">
                        <img
                          src={content[selectedProduct].guarantee.image}
                          alt="Guarantee preview"
                          className="w-full max-w-md h-64 object-cover rounded-lg shadow-sm border border-gray-200"
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
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ) : (
                      <div className="w-full max-w-md h-48 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400">
                        <ImageIcon size={48} className="mb-2 opacity-50" />
                        <p className="text-sm">暂无配图</p>
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>
              )}

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
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
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
                              setContent({ ...content, [selectedProduct]: { ...content[selectedProduct], faqs: updated } })
                            }}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                        <input
                          type="text"
                          value={faq.question}
                          onChange={(e) => {
                            const updated = [...(content[selectedProduct]?.faqs || [])]
                            updated[index].question = e.target.value
                            setContent({ ...content, [selectedProduct]: { ...content[selectedProduct], faqs: updated } })
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-2"
                        />
                        <textarea
                          value={faq.answer}
                          onChange={(e) => {
                            const updated = [...(content[selectedProduct]?.faqs || [])]
                            updated[index].answer = e.target.value
                            setContent({ ...content, [selectedProduct]: { ...content[selectedProduct], faqs: updated } })
                          }}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

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
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      <Plus size={18} />
                      <span>添加评价</span>
                    </button>
                  </div>
                  <div className="space-y-4">
                    {content[selectedProduct]?.reviews?.map((review, index) => (
                      <div key={review.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center gap-4">
                            {review.avatar ? (
                              <div className="relative">
                                <img src={review.avatar} alt="Avatar" className="w-16 h-16 rounded-full object-cover" />
                                <button onClick={() => handleRemoveAvatar(review.id)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"><X size={12} /></button>
                              </div>
                            ) : (
                              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-2xl text-gray-400">👤</div>
                            )}
                            <button onClick={() => avatarInputRef.current?.click()} className="text-sm text-blue-600 hover:underline">上传头像</button>
                            <input ref={avatarInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleAvatarSelect(e, review.id)} />
                            <input
                              type="text"
                              value={review.author}
                              onChange={(e) => {
                                const updated = [...(content[selectedProduct]?.reviews || [])]
                                updated[index].author = e.target.value
                                setContent({ ...content, [selectedProduct]: { ...content[selectedProduct], reviews: updated } })
                              }}
                              className="px-3 py-2 border border-gray-300 rounded-lg"
                              placeholder="评价者姓名"
                            />
                            <div className="flex gap-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star key={star} size={20} className={star <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'} onClick={() => {
                                  const updated = [...(content[selectedProduct]?.reviews || [])]
                                  updated[index].rating = star
                                  setContent({ ...content, [selectedProduct]: { ...content[selectedProduct], reviews: updated } })
                                }} />
                              ))}
                            </div>
                          </div>
                          <button onClick={() => {
                            const updated = content[selectedProduct]?.reviews?.filter((_, i) => i !== index) || []
                            setContent({ ...content, [selectedProduct]: { ...content[selectedProduct], reviews: updated } })
                          }} className="text-red-500"><Trash2 size={18} /></button>
                        </div>
                        <textarea
                          value={review.content}
                          onChange={(e) => {
                            const updated = [...(content[selectedProduct]?.reviews || [])]
                            updated[index].content = e.target.value
                            setContent({ ...content, [selectedProduct]: { ...content[selectedProduct], reviews: updated } })
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                          rows={3}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeSection === 'gallery' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between pb-4 border-b">
                    <h2 className="text-xl font-bold text-gray-900">补充图片库</h2>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      <Upload size={18} />
                      <span>上传图片</span>
                    </button>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {content[selectedProduct]?.gallery?.map((img, index) => (
                      <div key={index} className="relative group">
                        <img src={img} alt={`Gallery ${index}`} className="w-full h-48 object-cover rounded-lg" />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
                          <button onClick={() => handleRemoveImage(index)} className="p-2 bg-red-500 rounded-full"><X size={16} className="text-white" /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>
        )}

        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-bold text-blue-900 mb-2">📋 使用说明</h3>
          <ul className="space-y-2 text-blue-800 text-sm">
            <li>✅ <strong>板块化编辑</strong>：品牌故事、环保影响等均支持独立配图。</li>
            <li>✅ <strong>图片标准</strong>：建议使用 4:3 比例的图片以获得最佳显示效果。</li>
            <li>✅ <strong>数据同步</strong>：编辑完成后请务必点击顶部“下载 JSON”保存配置。</li>
          </ul>
        </div>
      </main>

      <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileSelect} />

      {currentImage && (inlineCropSection || showCropModal) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4">
          <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="text-lg font-bold">✂️ 裁剪图片</h3>
              <button onClick={handleCropCancel} className="text-gray-400 hover:text-gray-600 text-2xl">×</button>
            </div>
            <div className="flex-1 relative bg-gray-900 min-h-[400px]">
              <Cropper
                image={currentImage}
                crop={crop}
                zoom={autoZoom}
                aspect={TEMPLATE_SIZE.aspect}
                onCropChange={setCrop}
                onZoomChange={setAutoZoom}
                onCropComplete={onCropComplete}
              />
            </div>
            <div className="p-6 border-t bg-gray-50 flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium">🔍 缩放</span>
                <input
                  type="range"
                  min="1"
                  max="3"
                  step="0.1"
                  value={autoZoom}
                  onChange={(e) => setAutoZoom(Number(e.target.value))}
                  className="flex-1"
                />
              </div>
              <div className="flex justify-end gap-3">
                <button onClick={handleCropCancel} className="px-6 py-2 border rounded-lg">取消</button>
                <button onClick={handleCropConfirm} className="px-6 py-2 bg-blue-600 text-white rounded-lg font-bold">确认裁剪并保存</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {saved && (
        <div className="fixed bottom-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg animate-bounce">
          已更新配置！
        </div>
      )}
    </div>
  )
}
