/**
 * Content Service — Supabase 数据层 CRUD
 *
 * 表: products_content
 *   handle TEXT PRIMARY KEY,
 *   content_json JSONB,
 *   updated_at TIMESTAMPTZ
 *
 * Storage bucket: product-images (public)
 */
import { supabase } from './supabase'
import type { ProductContent, ImageUploadResult, SectionImageKey } from '../types/content'

const TABLE = 'products_content'
const BUCKET = 'product-images'

// ============================================================
// Read
// ============================================================

/**
 * 获取单个产品的内容
 * @returns ProductContent 或 null (不存在时)
 * @throws Error (数据库连接等意外错误)
 */
export async function getProductContent(handle: string): Promise<ProductContent | null> {
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq('handle', handle)
    .single()

  if (error) {
    // PGRST116 = "no rows found" — 正常情况
    if (error.code === 'PGRST116') return null
    throw new Error(error.message)
  }

  return data?.content_json ?? null
}

/**
 * 获取所有产品内容, 返回 { [handle]: ProductContent }
 * 出错时返回空对象, 不抛异常 (适合前台 fallback)
 */
export async function getAllProductContent(): Promise<Record<string, ProductContent>> {
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')

  if (error || !data) return {}

  const result: Record<string, ProductContent> = {}
  for (const row of data) {
    result[row.handle] = row.content_json
  }
  return result
}

// ============================================================
// Blog Posts
// ============================================================

// BlogPost 接口字段与 Supabase blog_posts 表完全对齐
// 表结构: id(uuid auto), title, excerpt, content, author, date, category, image_url, handle, created_at
export interface BlogPost {
  id: string       // 前端用 handle 作为唯一标识，数据库 id 为 UUID 自动生成
  title: string
  excerpt: string
  date: string
  author: string
  image: string    // 前端统一用 image，读写时映射到数据库的 image_url
  content: string
  handle?: string
}

// 数据库行格式（内部使用）
interface BlogPostRow {
  id: string
  title: string
  excerpt: string
  content: string
  author: string
  date: string
  category: string
  image_url: string
  handle: string
  created_at: string
}

/** 将数据库行转换为前端 BlogPost */
function rowToPost(row: BlogPostRow): BlogPost {
  return {
    id: row.handle,           // 前端用 handle 做路由/唯一 key
    title: row.title,
    excerpt: row.excerpt || '',
    date: row.date,
    author: row.author || 'EcoMafola Peace',
    image: row.image_url || '',
    content: row.content,
    handle: row.handle,
  }
}

/**
 * 获取所有博客文章（按日期倒序）
 */
export async function getAllBlogPosts(): Promise<BlogPost[]> {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .order('date', { ascending: false })

  if (error) {
    console.error('[Supabase] Failed to fetch blog posts:', error)
    return []
  }

  return (data as BlogPostRow[] || []).map(rowToPost)
}

/**
 * 保存/更新博客文章（以 handle 为唯一键 upsert）
 */
export async function saveBlogPost(post: BlogPost): Promise<boolean> {
  const handle = post.handle || post.id
  const row = {
    title: post.title,
    excerpt: post.excerpt,
    content: post.content,
    author: post.author,
    date: post.date,
    image_url: post.image,   // 前端 image → 数据库 image_url
    handle: handle,
    category: 'Island Heritage',
  }

  console.log('[saveBlogPost] handle:', handle, 'image_url:', row.image_url)

  // 按 handle 查是否已存在
  const { data: existing, error: findErr } = await supabase
    .from('blog_posts')
    .select('id')
    .eq('handle', handle)
    .maybeSingle()

  if (findErr) {
    console.error('[saveBlogPost] find error:', findErr)
    return false
  }

  console.log('[saveBlogPost] existing row:', existing)

  let error
  if (existing?.id) {
    console.log('[saveBlogPost] → UPDATE existing row, id:', existing.id)
    ;({ error } = await supabase
      .from('blog_posts')
      .update(row)
      .eq('handle', handle))
  } else {
    console.log('[saveBlogPost] → INSERT new row')
    ;({ error } = await supabase
      .from('blog_posts')
      .insert(row))
  }

  if (error) {
    console.error('[saveBlogPost] write error:', error)
    return false
  }
  console.log('[saveBlogPost] ✅ success')
  return true
}

/**
 * 删除博客文章（by handle）
 */
export async function deleteBlogPost(handle: string): Promise<boolean> {
  const { error } = await supabase
    .from('blog_posts')
    .delete()
    .eq('handle', handle)

  if (error) {
    console.error('[Supabase] Failed to delete blog post:', error)
    return false
  }
  return true
}

/**
 * 上传博客封面图到 blog-images bucket
 */
export async function uploadBlogImage(handle: string, file: File): Promise<{ publicUrl: string }> {
  const filePath = `covers/${handle}-${Date.now()}.jpeg`

  const { error } = await supabase.storage
    .from('blog-images')
    .upload(filePath, file, {
      upsert: true,
      contentType: 'image/jpeg'
    })

  if (error) throw error

  const { data } = supabase.storage
    .from('blog-images')
    .getPublicUrl(filePath)

  return { publicUrl: data.publicUrl }
}

/**
 * 保存产品内容 (upsert by handle)
 * @throws Error on database failure
 */
export async function saveProductContent(handle: string, content: ProductContent): Promise<void> {
  const { error } = await supabase
    .from(TABLE)
    .upsert(
      {
        handle,
        content_json: content,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'handle' }
    )

  if (error) throw new Error(error.message)
}

// ============================================================
// Storage (Images)
// ============================================================

/**
 * 上传 section 图片到 Supabase Storage
 * 路径: {handle}/{section}.jpeg
 * @returns { publicUrl, path }
 */
export async function uploadSectionImage(
  handle: string,
  section: SectionImageKey,
  file: File
): Promise<ImageUploadResult> {
  const storagePath = `${handle}/${section}.jpeg`

  const { data, error } = await supabase.storage
    .from(BUCKET)
    .upload(storagePath, file, {
      upsert: true,
      contentType: file.type || 'image/jpeg',
    })

  if (error) throw new Error(error.message)

  const { data: urlData } = supabase.storage
    .from(BUCKET)
    .getPublicUrl(storagePath)

  return {
    publicUrl: urlData.publicUrl,
    path: data.path,
  }
}

/**
 * 上传 gallery 图片到 Supabase Storage
 * 路径: {handle}/gallery/{index}.jpeg
 */
export async function uploadGalleryImage(
  handle: string,
  index: number,
  file: File
): Promise<ImageUploadResult> {
  const storagePath = `${handle}/gallery/${index}.jpeg`

  const { data, error } = await supabase.storage
    .from(BUCKET)
    .upload(storagePath, file, {
      upsert: true,
      contentType: file.type || 'image/jpeg',
    })

  if (error) throw new Error(error.message)

  const { data: urlData } = supabase.storage
    .from(BUCKET)
    .getPublicUrl(storagePath)

  return {
    publicUrl: urlData.publicUrl,
    path: data.path,
  }
}

/**
 * 获取图片的公开 URL
 */
export function getImagePublicUrl(path: string): string {
  const { data } = supabase.storage
    .from(BUCKET)
    .getPublicUrl(path)

  return data.publicUrl
}
