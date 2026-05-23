'use client'
import { navLinks } from '@/app/api/navlink'
import { Icon } from '@iconify/react'
import Link from 'next/link'
import { useEffect, useRef, useState, useCallback } from 'react'
import NavLink from './Navigation/NavLink'
import { usePathname } from 'next/navigation'
import Logo from './BrandLogo/Logo'
import Search from './Search'
import { useCart } from '@/context/CartContext'
import WishlistIcon from '@/components/WishlistIcon';

const BOTTOM_NAV = [
  { label: 'Home',     href: '/',          icon: 'ph:house-fill' },
  { label: 'Products', href: '/products',  icon: 'ph:package-fill' },
  { label: 'Services', href: '/services/book', icon: 'ph:calendar-check-fill', center: true },
  { label: 'Blog',     href: '/blogs',     icon: 'ph:newspaper-fill' },
  { label: 'Contact',  href: '/contactus', icon: 'ph:phone-fill' },
]

const Header: React.FC = () => {
  const [scrolled, setScrolled]     = useState(false)
  const [navbarOpen, setNavbarOpen] = useState(false)
  const [mounted, setMounted]       = useState(false)
  const pathname  = usePathname()
  const { getTotalItems } = useCart()
  const cartItemCount = getTotalItems()
  const sideMenuRef = useRef<HTMLDivElement>(null)

  const handleClickOutside = (event: MouseEvent) => {
    if (sideMenuRef.current && !sideMenuRef.current.contains(event.target as Node)) {
      setNavbarOpen(false)
    }
  }

  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY >= 60)
  }, [])

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      window.removeEventListener('scroll', handleScroll)
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [handleScroll])

  // Lock body scroll while drawer is open
  useEffect(() => {
    if (navbarOpen) {
      const original = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => { document.body.style.overflow = original }
    }
  }, [navbarOpen])

  return (
    <>
      {/* ── DESKTOP / TABLET HEADER ─────────────────────────────────────── */}
      <header
        className={`fixed z-50 w-full transition-all duration-300 lg:px-0 px-3 sm:px-4 ${
          scrolled ? 'top-3 py-0' : 'top-0 py-3 sm:py-4'
        }`}
      >
        <nav
          className={`site-container flex items-center justify-between transition-all duration-300 ${
            scrolled
              ? 'bg-white/95 backdrop-blur-md rounded-full py-2.5 px-4 sm:px-6 shadow-card border border-line/60'
              : 'bg-transparent rounded-none py-3 px-0'
          }`}
        >
          <div className="flex justify-between items-center gap-2 w-full">

            <Logo />

            <div className="flex items-center gap-1 sm:gap-3">

              <Search sticky={scrolled} isHomepage={!scrolled} />

              <WishlistIcon />

              <Link
                href="/cart"
                aria-label="Cart"
                className="relative inline-flex items-center justify-center p-2 rounded-full transition-colors text-dark hover:text-primary"
              >
                <Icon icon="solar:cart-large-4-bold" width={24} height={24} />
                {mounted && cartItemCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-primary text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] px-1 flex items-center justify-center">
                    {cartItemCount > 9 ? '9+' : cartItemCount}
                  </span>
                )}
              </Link>

              {/* Phone — desktop only */}
              <Link
                href="https://wa.me/918019179159"
                className="hidden md:inline-flex items-center gap-2 text-sm font-medium border-r pr-5 ml-1 transition-colors text-dark/85 hover:text-primary border-line"
              >
                <Icon icon="ph:phone-fill" width={18} height={18} className="text-primary" />
                +91 8019179159
              </Link>

              {/* Catalogue — desktop only */}
              <a
                href="/images/hero/Satyajan-Product-Catalogue-2026.pdf"
                download="Satyajan-Product-Catalogue-2026.pdf"
                className="hidden md:inline-flex btn btn-primary btn-sm"
              >
                <Icon icon="ph:download-simple-bold" width={16} />
                Catalogue
              </a>

              {/* Menu button */}
              <button
                onClick={() => setNavbarOpen(true)}
                aria-label="Open menu"
                className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-full font-semibold text-sm bg-dark text-white hover:bg-dark-soft border border-dark transition-colors"
              >
                <Icon icon="ph:list-bold" width={20} height={20} />
                <span className="hidden sm:inline">Menu</span>
              </button>
            </div>
          </div>
        </nav>

        {/* Overlay */}
        {navbarOpen && (
          <div
            className="fixed inset-0 bg-black/55 backdrop-blur-sm z-40 animate-fade-in"
            onClick={() => setNavbarOpen(false)}
          />
        )}

        {/* Side drawer */}
        <aside
          ref={sideMenuRef}
          className={`fixed top-0 right-0 h-full w-[88%] xs:w-[80%] sm:w-[420px] md:w-[480px] bg-dark text-white shadow-2xl transition-transform duration-300 ${
            navbarOpen ? 'translate-x-0' : 'translate-x-full'
          } z-50 overflow-auto no-scrollbar`}
        >
          <div className="flex flex-col h-full justify-between px-7 sm:px-10 md:px-12 py-8">
            <div>
              <div className="flex items-center justify-between mb-10">
                <span className="eyebrow text-primary">Menu</span>
                <button
                  onClick={() => setNavbarOpen(false)}
                  aria-label="Close menu"
                  className="w-10 h-10 inline-flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                >
                  <Icon icon="ph:x-bold" width={18} className="text-white" />
                </button>
              </div>

              <nav>
                <ul className="w-full space-y-1">
                  {navLinks.map((item, index) => (
                    <NavLink key={index} item={item} onClick={() => setNavbarOpen(false)} />
                  ))}
                </ul>
              </nav>
            </div>

            <div className="mt-12 pt-8 border-t border-white/10">
              <a
                href="/images/hero/Satyajan-Product-Catalogue-2026.pdf"
                download="Satyajan-Product-Catalogue-2026.pdf"
                className="btn btn-primary mb-6"
              >
                <Icon icon="ph:download-simple-bold" width={16} />
                Download Catalogue
              </a>

              <p className="text-xs uppercase tracking-widest text-white/40 mb-3">Contact</p>
              <div className="space-y-1.5 text-sm">
                <Link href="mailto:info@satyajan.com" className="block text-white/80 hover:text-primary transition-colors">
                  info@satyajan.com
                </Link>
                <Link href="mailto:service@satyajan.com" className="block text-white/80 hover:text-primary transition-colors">
                  service@satyajan.com
                </Link>
                <Link href="https://wa.me/918019179159" className="block text-white/80 hover:text-primary transition-colors">
                  +91 8019179159
                </Link>
              </div>
            </div>
          </div>
        </aside>
      </header>

      {/* ── MOBILE BOTTOM NAV BAR ───────────────────────────────────────── */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
        <div className="bg-white/95 backdrop-blur-xl border-t border-line/70 shadow-2xl">
          <div className="flex items-end justify-around px-2 pt-2 pb-[env(safe-area-inset-bottom,8px)]">
            {BOTTOM_NAV.map((item) => {
              const isActive = pathname === item.href ||
                (item.href !== '/' && pathname.startsWith(item.href.replace('/book', '')))

              if (item.center) {
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex flex-col items-center -mt-5 mb-1"
                  >
                    <span className="w-14 h-14 rounded-full bg-primary shadow-glow flex items-center justify-center mb-1 border-4 border-white">
                      <Icon icon={item.icon} width={24} className="text-white" />
                    </span>
                    <span className="text-[10px] font-bold text-primary leading-none">
                      {item.label}
                    </span>
                  </Link>
                )
              }

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-all duration-200 active:scale-95"
                >
                  <span className={`w-1 h-1 rounded-full mb-0.5 transition-all duration-200 ${isActive ? 'bg-primary scale-100' : 'scale-0'}`} />
                  <Icon
                    icon={item.icon}
                    width={22}
                    className={`transition-colors duration-200 ${isActive ? 'text-primary' : 'text-gray-400'}`}
                  />
                  <span className={`text-[10px] font-semibold leading-none transition-colors duration-200 ${isActive ? 'text-primary' : 'text-gray-400'}`}>
                    {item.label}
                  </span>
                </Link>
              )
            })}
          </div>
        </div>
      </nav>

      <div className="h-16 md:hidden" aria-hidden="true" />
    </>
  )
}

export default Header
