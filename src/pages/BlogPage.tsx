import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { Clock, User, ArrowLeft, Share2, Facebook, Twitter, MessageCircle } from 'lucide-react'
import { OptimizedImage } from '../components/OptimizedImage'
import { getAllBlogPosts, BlogPost } from '../lib/contentService'
import DOMPurify from 'dompurify'

type Post = BlogPost

export function BlogListPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadPosts() {
      try {
        const data = await getAllBlogPosts()
        setPosts(data)
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err)
        setError(message)
      } finally {
        setLoading(false)
      }
    }
    loadPosts()
  }, [])

  return (
    <div className="min-h-screen bg-coral-white pt-24 pb-20">
      <Helmet>
        <link rel="canonical" href="https://ecomafola.com/blog" />
        <title>The Pacific Soul | EcoMafola Peace Blog</title>
        <meta name="description" content="Discover the stories behind South Pacific craftsmanship, sustainable living tips, and island heritage." />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "The Pacific Soul",
            "url": "https://ecomafola.com/blog",
            "breadcrumb": {
              "@type": "BreadcrumbList",
              "itemListElement": [
                { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://ecomafola.com" },
                { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://ecomafola.com/blog" }
              ]
            }
          })}
        </script>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Blog",
            "name": "The Pacific Soul",
            "description": "Discover the stories behind South Pacific craftsmanship, sustainable living tips, and island heritage.",
            "url": "https://ecomafola.com/blog",
            "publisher": { "@type": "Organization", "name": "EcoMafola Peace", "logo": "https://ecomafola.com/logo.png" }
          })}
        </script>
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-xs font-sans font-black text-tropical-green tracking-[0.3em] uppercase mb-4">Journal</p>
          <h1 className="font-serif text-4xl md:text-6xl font-bold text-ocean-blue">The Pacific Soul</h1>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 border-2 border-ocean-blue border-t-transparent rounded-full animate-spin" />
          </div>
        ) : error ? (
          <div className="text-center py-12 text-red-500">
            <p>Failed to load blog posts: {error}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map(post => (
              <Link
                key={post.handle || post.id}
                to={`/blog/${post.handle || post.id}`}
                className="group bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl transition-all border border-ocean-blue/5"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <OptimizedImage src={post.image} alt={post.title} preset="card" loading="lazy" className="w-full h-full group-hover:scale-110 transition-transform duration-700" />
                </div>
                <div className="p-8">
                  <div className="flex items-center gap-3 text-xs font-sans text-gray-400 mb-4">
                    <span className="flex items-center gap-1"><Clock size={12} /> {post.date}</span>
                    <span className="w-1 h-1 bg-gray-300 rounded-full" />
                    <span>{post.author}</span>
                  </div>
                  <h2 className="font-serif text-2xl font-bold text-ocean-blue mb-4 line-clamp-2 group-hover:text-tropical-green transition-colors">
                    {post.title}
                  </h2>
                  <p className="font-sans text-gray-600 text-sm leading-relaxed line-clamp-3 mb-6">
                    {post.excerpt}
                  </p>
                  <span className="text-xs font-sans font-black text-tropical-green tracking-widest uppercase flex items-center gap-2">
                    Read More <ArrowLeft size={14} className="rotate-180" />
                  </span>
                </div>
              </Link>
            ))}
            {posts.length === 0 && (
              <div className="col-span-full text-center py-16 text-gray-400">
                <p className="text-lg">No blog posts yet.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export function BlogPostPage() {
  const { id } = useParams()
  const [post, setPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadPost() {
      try {
        const data = await getAllBlogPosts()
        const found = data.find(p => (p.handle || p.id) === id)
        setPost(found || null)
      } catch (err: unknown) {
        console.error('[BlogPostPage] Failed to load post:', err)
      } finally {
        setLoading(false)
      }
    }
    loadPost()
  }, [id])

  if (loading) {
    return <div className="pt-40 text-center font-sans text-gray-400">Loading...</div>
  }
  if (!post) return <div className="pt-40 text-center font-sans">Post not found</div>

  const canonicalUrl = `https://ecomafola.com/blog/${post.handle || post.id}`

  return (
    <div className="min-h-screen bg-coral-white pt-24 pb-20">
      <Helmet>
        <link rel="canonical" href={canonicalUrl} />
        <title>{post.title} | EcoMafola Peace</title>
        <meta name="description" content={post.excerpt} />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": post.title,
            "description": post.excerpt,
            "image": {
              "@type": "ImageObject",
              "url": post.image,
              "width": "1200",
              "height": "675",
              "caption": post.title
            },
            "datePublished": post.date,
            "dateModified": post.date,
            "author": { "@type": "Person", "name": post.author },
            "publisher": { "@type": "Organization", "name": "EcoMafola Peace", "logo": "https://ecomafola.com/logo.png" },
            "mainEntityOfPage": { "@type": "WebPage", "@id": canonicalUrl }
          })}
        </script>
      </Helmet>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/blog" className="inline-flex items-center gap-2 text-xs font-sans font-black text-tropical-green tracking-widest uppercase mb-10 hover:-translate-x-2 transition-transform">
          <ArrowLeft size={14} /> Back to Journal
        </Link>

        <header className="mb-12">
          <div className="flex items-center gap-4 text-xs font-sans text-gray-400 mb-6">
            <span className="flex items-center gap-2"><Clock size={14} /> {post.date}</span>
            <span className="w-1.5 h-1.5 bg-tropical-green/20 rounded-full" />
            <span className="flex items-center gap-2"><User size={14} /> {post.author}</span>
          </div>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-ocean-blue leading-tight mb-8">
            {post.title}
          </h1>
          <div className="aspect-[16/9] rounded-[2.5rem] overflow-hidden shadow-2xl">
            <OptimizedImage src={post.image} alt={post.title} preset="hero" loading="lazy" className="w-full h-full" />
          </div>
        </header>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Share */}
          <div className="lg:w-20 lg:sticky lg:top-32 h-fit flex lg:flex-col gap-4">
            {[
              { icon: <Facebook size={18} />, label: 'Facebook', handler: () => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(canonicalUrl)}`, '_blank') },
              { icon: <Twitter size={18} />, label: 'Twitter', handler: () => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(canonicalUrl)}&text=${encodeURIComponent(post.title)}`, '_blank') },
              { icon: <MessageCircle size={18} />, label: 'WhatsApp', handler: () => window.open(`https://wa.me/?text=${encodeURIComponent(post.title + ' ' + canonicalUrl)}`, '_blank') },
              { icon: <Share2 size={18} />, label: 'Copy Link', handler: () => navigator.clipboard.writeText(canonicalUrl) }
            ].map(s => (
              <button
                key={s.label}
                title={s.label}
                onClick={s.handler}
                className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-ocean-blue/5 flex items-center justify-center text-ocean-blue hover:bg-ocean-blue hover:text-white transition-all"
              >
                {s.icon}
              </button>
            ))}
          </div>

          <article
            className="flex-1 prose prose-lg prose-ocean max-w-none font-sans text-gray-700 leading-relaxed
              prose-headings:font-serif prose-headings:text-ocean-blue prose-h2:text-3xl prose-h3:text-2xl
              prose-p:mb-6 prose-strong:text-ocean-blue prose-img:rounded-3xl prose-hr:border-ocean-blue/5"
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.content) }}
          />
        </div>
      </div>
    </div>
  )
}
