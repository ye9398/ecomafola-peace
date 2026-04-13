import { useNavigate } from 'react-router-dom'
import { Package, FileText, Home, LogOut } from 'lucide-react'
import { Helmet } from 'react-helmet-async'

export default function AdminPage() {
  const navigate = useNavigate()

  // 认证检查
  const authenticated = typeof window !== 'undefined' ? localStorage.getItem('admin_authenticated') : false
  if (!authenticated) {
    navigate('/dashboard/login')
    return null
  }

  const handleLogout = () => {
    localStorage.removeItem('admin_authenticated')
    navigate('/')
  }

  const modules = [
    {
      icon: <Package size={32} />,
      title: 'Product Content',
      desc: 'Edit product stories, specs, gallery images for all 17 products',
      route: '/dashboard/products',
      color: 'bg-ocean-blue/10 text-ocean-blue',
    },
    {
      icon: <FileText size={32} />,
      title: 'Blog Posts',
      desc: 'Create and manage blog articles with cover image upload',
      route: '/dashboard/blog',
      color: 'bg-tropical-green/10 text-tropical-green',
    },
    {
      icon: <Home size={32} />,
      title: 'Homepage Editor',
      desc: 'Edit hero banner, section headings, and homepage content',
      route: '/dashboard/home',
      color: 'bg-amber-500/10 text-amber-600',
    },
  ]

  return (
    <>
      <Helmet>
        <title>Dashboard | EcoMafola Peace</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <div className="min-h-screen bg-gray-50 font-sans">
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-xs text-gray-400">Manage your store content</p>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-red-600 transition-colors text-sm">
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {modules.map(mod => (
            <div
              key={mod.route}
              onClick={() => navigate(mod.route)}
              className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:border-ocean-blue/20 transition-all cursor-pointer group"
            >
              <div className={`w-14 h-14 ${mod.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                {mod.icon}
              </div>
              <h2 className="text-lg font-bold text-gray-900 mb-2">{mod.title}</h2>
              <p className="text-sm text-gray-500 leading-relaxed">{mod.desc}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
    </>
  )
}
