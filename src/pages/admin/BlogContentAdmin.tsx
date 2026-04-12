import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import Cropper from 'react-easy-crop'
import { Save, Plus, Trash2, Image as ImageIcon, X, FileText, ChevronLeft, LogOut } from 'lucide-react'
import type { Area } from 'react-easy-crop'
import { getAllBlogPosts, saveBlogPost, deleteBlogPost, uploadBlogImage, BlogPost } from '../../lib/contentService'
import { isSupabaseConfigured } from '../../lib/supabase'

export default function BlogContentAdmin() {
  const navigate = useNavigate()
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  // Cropper states
  const [image, setImage] = useState<string | null>(null)
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)
  const [showCropper, setShowCropper] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)

  // 认证检查（照抄产品模块）
  useEffect(() => {
    const authenticated = localStorage.getItem('admin_authenticated')
    if (!authenticated) {
      navigate('/dashboard/login')
      return
    }
    loadPosts()
  }, [navigate])

  const loadPosts = async () => {
    if (!isSupabaseConfigured()) {
      setLoading(false)
      return
    }
    setLoading(true)
    const data = await getAllBlogPosts()
    setPosts(data)
    setLoading(false)
  }

  const handleLogout = () => {
    localStorage.removeItem('admin_authenticated')
    navigate('/')
  }

  const handleCreateNew = () => {
    const handle = `post-${Date.now()}`
    const newPost: BlogPost = {
      id: handle,
      title: 'New Blog Post',
      excerpt: 'A short summary of your post...',
      date: new Date().toISOString().split('T')[0],
      author: 'EcoMafola Peace',
      image: '',
      content: 'Start writing your story here...',
      handle,
    }
    setSelectedPost(newPost)
  }

  const handleSave = async () => {
    if (!selectedPost) return
    if (!selectedPost.title.trim()) {
      alert('Title is required')
      return
    }
    if (selectedPost.title.length > 200) {
      alert('Title must be under 200 characters')
      return
    }
    setSaving(true)
    // 去掉 cache-busting 后缀，保持数据库 URL 干净
    const savePayload = { ...selectedPost, image: selectedPost.image || '' }
    const success = await saveBlogPost(savePayload)
    if (success) {
      setSaved(true)
      await loadPosts()
    } else {
      alert('Save failed. Please check Supabase connection.')
    }
    setSaving(false)
  }

  // 自动清除 saved 状态
  useEffect(() => {
    if (saved) {
      const timer = setTimeout(() => setSaved(false), 3000)
      return () => clearTimeout(timer)
    }
  }, [saved])

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return
    const success = await deleteBlogPost(id)
    if (success) {
      if (selectedPost?.id === id) setSelectedPost(null)
      await loadPosts()
    }
  }

  // Image Upload & Crop
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      const reader = new FileReader()
      reader.addEventListener('load', () => {
        setImage(reader.result as string)
        setShowCropper(true)
      })
      reader.readAsDataURL(file)
      e.target.value = ''
    }
  }

  const onCropComplete = useCallback((_croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }, [])

  const handleCropConfirm = async () => {
    if (!croppedAreaPixels || !image || !selectedPost) return
    setUploadingImage(true)
    setShowCropper(false)

    try {
      // Step 1: 把 base64/blob URL 转成 Blob 再用 createImageBitmap，避免 new Image() 在 Vite 里的加载竞态
      const res = await fetch(image)
      const srcBlob = await res.blob()
      const bitmap = await createImageBitmap(srcBlob)

      // Step 2: 裁剪到 800×600 canvas
      const { width, height, x, y } = croppedAreaPixels
      const canvas = document.createElement('canvas')
      canvas.width = 800
      canvas.height = 600
      const ctx = canvas.getContext('2d')
      if (!ctx) throw new Error('Canvas 2D context not available')
      ctx.drawImage(bitmap, x, y, width, height, 0, 0, 800, 600)
      bitmap.close()

      // Step 3: canvas → Blob → File
      const croppedBlob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(b => b ? resolve(b) : reject(new Error('canvas.toBlob returned null')), 'image/jpeg', 0.9)
      })
      const file = new File([croppedBlob], 'cover.jpeg', { type: 'image/jpeg' })

      // Step 4: 上传到 Supabase Storage
      const handle = selectedPost.handle || selectedPost.id
      const { publicUrl } = await uploadBlogImage(handle, file)

      // Step 5: 清理 URL，更新本地 state（加 cache-buster 让预览立即刷新）
      const cleanUrl = publicUrl.split('?')[0]
      const updatedPost = { ...selectedPost, image: cleanUrl, handle }
      setSelectedPost({ ...updatedPost, image: `${cleanUrl}?t=${Date.now()}` })

      // Step 6: 立即写入数据库
      const ok = await saveBlogPost(updatedPost)

      if (!ok) {
        alert('⚠️ Image uploaded to storage but failed to save URL to database.\nPlease click "Save & Publish" manually.')
      } else {
        await loadPosts()
        setSaved(true)
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err)
      alert('Upload failed: ' + message)
    } finally {
      setUploadingImage(false)
    }
  }

  if (!isSupabaseConfigured()) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="p-8 text-center bg-red-50 text-red-600 rounded-xl border border-red-100 font-sans">
          Supabase is not configured. Please check your environment variables.
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* 顶部导航（照抄产品模块） */}
      <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/dashboard')} className="text-gray-400 hover:text-gray-900 transition-colors">
              <ChevronLeft size={24} />
            </button>
            <div>
              <h1 className="text-lg font-bold text-gray-900">Blog Management</h1>
              <p className="text-xs text-gray-400">Changes sync to the live site immediately after saving</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleCreateNew}
              className="flex items-center gap-2 px-4 py-2 bg-tropical-green text-white rounded-xl hover:bg-green-700 transition-colors font-bold text-sm"
            >
              <Plus size={16} /> New Post
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-red-600 transition-colors text-sm"
            >
              <LogOut size={16} /> Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* 左侧：文章列表 */}
          <div className="w-full lg:w-72 shrink-0">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-ocean-blue/5 sticky top-24">
              <h2 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-4">All Posts ({posts.length})</h2>
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="w-6 h-6 border-2 border-ocean-blue border-t-transparent rounded-full animate-spin" />
                </div>
              ) : (
                <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-1">
                  {posts.map(post => (
                    <div
                      key={post.id}
                      onClick={() => setSelectedPost(post)}
                      className={`p-4 rounded-2xl cursor-pointer transition-all border ${
                        selectedPost?.id === post.id
                          ? 'bg-ocean-blue/5 border-ocean-blue'
                          : 'bg-gray-50 border-transparent hover:border-gray-200'
                      }`}
                    >
                      <h3 className="text-sm font-bold text-ocean-blue line-clamp-2 leading-snug">{post.title}</h3>
                      <p className="text-xs text-gray-400 mt-1">{post.date}</p>
                    </div>
                  ))}
                  {posts.length === 0 && (
                    <p className="text-sm text-gray-400 text-center py-8">No posts yet.<br />Click "New Post" to start.</p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* 右侧：编辑区 */}
          <div className="flex-1 bg-white rounded-3xl p-8 shadow-sm border border-ocean-blue/5 min-h-[600px]">
            {selectedPost ? (
              <div className="space-y-6">
                {/* 操作栏 */}
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900">
                    {posts.find(p => p.id === selectedPost.id) ? 'Edit Post' : 'New Post'}
                  </h2>
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleDelete(selectedPost.id)}
                      className="px-4 py-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors flex items-center gap-2 text-sm font-bold"
                    >
                      <Trash2 size={16} /> Delete
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className={`px-6 py-2 rounded-xl transition-all flex items-center gap-2 font-bold text-sm text-white ${
                        saved ? 'bg-green-600' : 'bg-ocean-blue hover:bg-blue-800'
                      } disabled:opacity-60`}
                    >
                      <Save size={16} />
                      {saving ? 'Saving...' : saved ? 'Saved!' : 'Save & Publish'}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Title</label>
                      <input
                        type="text"
                        value={selectedPost.title}
                        onChange={e => setSelectedPost({ ...selectedPost, title: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-ocean-blue text-ocean-blue font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Excerpt</label>
                      <textarea
                        rows={3}
                        value={selectedPost.excerpt}
                        onChange={e => setSelectedPost({ ...selectedPost, excerpt: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-ocean-blue text-gray-700 text-sm resize-none"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Date</label>
                        <input
                          type="date"
                          value={selectedPost.date}
                          onChange={e => setSelectedPost({ ...selectedPost, date: e.target.value })}
                          className="w-full px-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-ocean-blue text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Author</label>
                        <input
                          type="text"
                          value={selectedPost.author}
                          onChange={e => setSelectedPost({ ...selectedPost, author: e.target.value })}
                          className="w-full px-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-ocean-blue text-sm"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 封面图上传 */}
                  <div>
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Cover Image (4:3)</label>
                    <div className="relative aspect-[4/3] bg-gray-50 rounded-3xl overflow-hidden border-2 border-dashed border-gray-200 group hover:border-ocean-blue transition-colors">
                      {selectedPost.image ? (
                        <img src={selectedPost.image} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-300">
                          <ImageIcon size={40} className="mb-2" />
                          <p className="text-xs">Click to upload</p>
                        </div>
                      )}
                      <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer text-white text-sm font-bold rounded-3xl">
                        <input type="file" accept="image/*" onChange={onFileChange} className="hidden" />
                        Change Image
                      </label>
                      {uploadingImage && (
                        <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                          <div className="w-8 h-8 border-4 border-ocean-blue border-t-transparent rounded-full animate-spin" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* 正文内容 */}
                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Content (HTML supported)</label>
                  <textarea
                    rows={18}
                    value={selectedPost.content}
                    onChange={e => setSelectedPost({ ...selectedPost, content: e.target.value })}
                    className="w-full px-6 py-4 bg-gray-50 border-none rounded-3xl focus:ring-2 focus:ring-ocean-blue text-gray-800 leading-relaxed text-sm font-mono resize-y"
                    placeholder="Write your blog post here... (HTML tags are supported)"
                  />
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-gray-200 select-none">
                <FileText size={72} className="mb-4" />
                <p className="text-gray-400 font-sans">Select a post or create a new one</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Cropper Modal */}
      {showCropper && image && (
        <div className="fixed inset-0 z-[60] bg-black/90 flex flex-col items-center justify-center p-4">
          <p className="text-white font-bold mb-4 text-sm uppercase tracking-widest">Crop Cover Image (4:3)</p>
          <div className="relative w-full max-w-2xl aspect-[4/3] bg-gray-900 rounded-3xl overflow-hidden mb-6">
            <Cropper
              image={image}
              crop={crop}
              zoom={zoom}
              aspect={4 / 3}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          </div>
          <input
            type="range"
            min={1}
            max={3}
            step={0.05}
            value={zoom}
            onChange={e => setZoom(Number(e.target.value))}
            className="w-48 mb-6 accent-tropical-green"
          />
          <div className="flex gap-4">
            <button
              onClick={() => setShowCropper(false)}
              className="px-8 py-3 bg-white/10 text-white rounded-2xl hover:bg-white/20 transition-all font-bold flex items-center gap-2"
            >
              <X size={18} /> Cancel
            </button>
            <button
              onClick={handleCropConfirm}
              className="px-12 py-3 bg-tropical-green text-white rounded-2xl hover:bg-green-700 transition-all font-bold flex items-center gap-2 shadow-lg shadow-green-900/20"
            >
              Confirm & Upload
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
