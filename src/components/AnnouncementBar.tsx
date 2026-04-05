import { useState } from 'react'
import { X } from 'lucide-react'

export default function AnnouncementBar() {
  const [visible, setVisible] = useState(true)
  if (!visible) return null

  return (
    <div className="bg-tropical-green text-white text-center py-2 px-4 relative z-[60]">
      <p className="font-sans text-sm font-medium tracking-wide">
        🌊 Grand Opening Sale — Free Shipping on Orders Over $45! Use Code: <span className="font-bold underline">ALOHA15</span> for 15% Off
      </p>
      <button
        onClick={() => setVisible(false)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/80 hover:text-white"
        aria-label="Close announcement"
      >
        <X size={16} />
      </button>
    </div>
  )
}
