import { Mail, MapPin, Clock, Send } from 'lucide-react'

export default function Contact() {
  return (
    <section className="py-24 bg-white relative overflow-hidden" id="contact">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: Info */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-tropical-green/10 border border-tropical-green/20 mb-6">
              <span className="w-1.5 h-1.5 bg-tropical-green rounded-full" />
              <p className="font-sans text-[10px] font-black text-tropical-green uppercase tracking-[0.2em]">
                Get in Touch
              </p>
            </div>
            <h2 className="font-serif text-4xl md:text-6xl font-bold text-ocean-blue mb-8">
              Let's Connect with the <span className="italic text-tropical-green font-normal">Pacific</span>
            </h2>
            <p className="font-sans text-ocean-blue/60 text-sm md:text-base leading-relaxed mb-12 max-w-lg">
              Have questions about our artisans, wholesale opportunities, or your order? 
              Our team is here to share the spirit of Samoa with you.
            </p>

            <div className="space-y-8">
              {[
                { icon: <Mail className="text-tropical-green" />, label: 'Email Us', value: 'hello@ecomafola.com' },
                { icon: <MapPin className="text-tropical-green" />, label: 'Our Base', value: 'Apia, Samoa & Sydney, AU' },
                { icon: <Clock className="text-tropical-green" />, label: 'Response Time', value: 'Within 24 Hours' }
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-ocean-blue/5 flex items-center justify-center shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <p className="font-sans text-xs font-black uppercase tracking-widest text-ocean-blue/40 mb-1">{item.label}</p>
                    <p className="font-serif text-lg font-bold text-ocean-blue">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Form */}
          <div className="bg-[#F0E8DC] p-8 md:p-12 rounded-[2.5rem] shadow-xl">
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="font-sans text-xs font-black uppercase tracking-widest text-ocean-blue/40 ml-1">Your Name</label>
                  <input 
                    type="text" 
                    placeholder="John Doe"
                    className="w-full bg-white border-0 rounded-2xl px-6 py-4 text-sm font-sans focus:ring-2 focus:ring-tropical-green transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="font-sans text-xs font-black uppercase tracking-widest text-ocean-blue/40 ml-1">Email Address</label>
                  <input 
                    type="email" 
                    placeholder="john@example.com"
                    className="w-full bg-white border-0 rounded-2xl px-6 py-4 text-sm font-sans focus:ring-2 focus:ring-tropical-green transition-all"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="font-sans text-xs font-black uppercase tracking-widest text-ocean-blue/40 ml-1">Message</label>
                <textarea 
                  rows={4} 
                  placeholder="Tell us your story..."
                  className="w-full bg-white border-0 rounded-2xl px-6 py-4 text-sm font-sans focus:ring-2 focus:ring-tropical-green transition-all resize-none"
                />
              </div>
              <button className="w-full bg-ocean-blue text-white py-5 rounded-2xl font-sans font-black uppercase tracking-[0.2em] text-xs hover:bg-tropical-green transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-3 group">
                Send Message
                <Send size={16} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Background Decorative Text */}
      <div className="absolute -top-12 -right-12 font-serif text-[15vw] font-black text-ocean-blue/5 pointer-events-none select-none italic leading-none whitespace-nowrap">
        Contact Us
      </div>
    </section>
  )
}
