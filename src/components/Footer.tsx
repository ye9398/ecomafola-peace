import { Link } from 'react-router-dom'
import { Instagram, Facebook, Twitter, Youtube } from 'lucide-react'

interface NavLinkItem {
  label: string
  href: string
}

const navLinks: Record<string, NavLinkItem[]> = {
  Shop: [
    { label: 'Coconut Bowls', href: '/products/coconut-bowls' },
    { label: 'Woven Baskets', href: '/products/woven-baskets' },
    { label: 'Natural Soaps', href: '/products/natural-soaps' },
    { label: 'Wood Carvings', href: '/products/wood-carvings' },
    { label: 'Shell Jewelry', href: '/products/shell-jewelry' },
  ],
  Company: [
    { label: 'Our Story', href: '/our-story' },
    { label: 'Impact', href: '/impact' },
    { label: 'Artisan Partners', href: '/partners' },
    { label: 'Blog', href: '/blog' },
  ],
  Support: [
    { label: 'Contact Us', href: '/contact' },
    { label: 'Shipping & Returns', href: '/shipping' },
    { label: 'FAQ', href: '/faq' },
    { label: 'Track Order', href: '/track' },
  ],
}

export default function Footer() {
  return (
    <footer className="bg-ocean-blue-dark text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-5">
              <img src="/logo.png" alt="EcoMafola Peace" className="w-40 h-40 object-contain" />
              <span className="font-serif font-semibold text-lg text-white">EcoMafola Peace</span>
            </div>
            <p className="font-sans text-sm text-white/60 leading-relaxed mb-6 max-w-xs">
              Handcrafted treasures from the South Pacific, made in partnership with Samoan artisan cooperatives. Sustainable, authentic, and made with love.
            </p>

            {/* Social */}
            <div className="flex gap-3">
              {[
                { icon: Instagram, href: '#', name: 'Instagram' },
                { icon: Facebook, href: '#', name: 'Facebook' },
                { icon: Twitter, href: '#', name: 'Twitter' },
                { icon: Youtube, href: '#', name: 'YouTube' },
              ].map(({ icon: Icon, href, name }) => (
                <a 
                  key={name} 
                  href={href} 
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-tropical-green flex items-center justify-center transition-colors duration-200"
                  aria-label={`Follow us on ${name}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Nav Columns */}
          {Object.entries(navLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-sans text-sm font-semibold text-white mb-4 tracking-wide">{category}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link to={link.href} className="font-sans text-sm text-white/55 hover:text-white transition-colors duration-200">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-sans text-xs text-white/40">
            © 2024 EcoMafola Peace. All rights reserved. Made for the Pacific.
          </p>

          {/* Payment Icons */}
          <div className="flex items-center gap-3">
            <span className="font-sans text-xs text-white/40 mr-1">Secure payments:</span>
            {['VISA', 'MC', 'PayPal', 'Apple Pay', 'Google Pay'].map((pm) => (
              <span key={pm} className="bg-white/10 text-white/60 text-xs font-sans px-2.5 py-1 rounded-md font-medium">
                {pm}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}