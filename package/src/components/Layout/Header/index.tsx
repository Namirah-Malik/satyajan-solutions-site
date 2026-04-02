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

// ── Mobile bottom nav items ───────────────────────────────────────────────────
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

  return (
    <>
      {/* ── DESKTOP / TABLET HEADER ─────────────────────────────────────── */}
      <header className={`fixed z-50 w-full transition-all duration-300 lg:px-0 px-4 ${scrolled ? 'top-3 py-0' : 'top-0 py-4'}`}>
        <nav className={`container mx-auto max-w-8xl flex items-center justify-between px-4 transition-all duration-300 ${scrolled ? 'bg-white rounded-full py-3 shadow-xl' : 'bg-transparent rounded-none py-3'}`}>
          <div className='flex justify-between items-center gap-2 w-full'>

            <div>
              <Logo />
            </div>

            <div className='flex items-center gap-2 sm:gap-6'>

              {/* Search */}
              <div>
                <Search sticky={scrolled} isHomepage={!scrolled} />
              </div>

              {/* Cart */}
              <Link
                href='/cart'
                className='relative flex items-center justify-center p-2 rounded-full transition-colors text-dark hover:text-primary'
              >
                <Icon icon={'solar:cart-large-4-bold'} width={24} height={24} />
                {mounted && cartItemCount > 0 && (
                  <span className='absolute -top-1 -right-1 bg-primary text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center'>
                    {cartItemCount > 9 ? '9+' : cartItemCount}
                  </span>
                )}
              </Link>

              {/* Phone — desktop only */}
              <div className='hidden md:block'>
                <Link
                  href='https://wa.me/918019179159'
                  className='text-base flex items-center gap-2 border-r pr-6 transition-colors text-dark hover:text-primary border-dark/20'
                >
                  <Icon icon={'ph:phone-bold'} width={24} height={24} />
                  +91 8019179159
                </Link>
              </div>

              {/* Catalogue — desktop only */}
              <div className='hidden md:block'>
                <a
                  href='/images/hero/Satyajan-Product-Catalogue-2025.pdf'
                  download='Satyajan-Product-Catalogue-2025.pdf'
                  className='flex items-center gap-2 bg-primary hover:bg-dark text-white px-5 py-3 rounded-full font-semibold transition-colors text-sm whitespace-nowrap'
                >
                  <Icon icon='ph:download-simple-bold' width={18} />
                  Catalogue
                </a>
              </div>

              {/* Menu button */}
              <div>
                <button
                  onClick={() => setNavbarOpen(!navbarOpen)}
                  className='flex items-center gap-3 p-2 sm:px-5 sm:py-3 rounded-full font-semibold hover:cursor-pointer border transition-colors bg-dark text-white hover:bg-dark/80 border-dark'
                  aria-label='Toggle mobile menu'
                >
                  <Icon icon={'ph:list'} width={24} height={24} />
                  <span className='hidden sm:block'>Menu</span>
                </button>
              </div>

            </div>
          </div>
        </nav>

        {/* Overlay */}
        {navbarOpen && (
          <div className='fixed top-0 left-0 w-full h-full bg-black/50 z-40' />
        )}

        {/* Side drawer */}
        <div
          ref={sideMenuRef}
          className={`fixed top-0 right-0 h-full w-full bg-dark shadow-lg transition-transform duration-300 max-w-2xl ${navbarOpen ? 'translate-x-0' : 'translate-x-full'} z-50 px-20 overflow-auto no-scrollbar`}
        >
          <div className='flex flex-col h-full justify-between'>
            <div>
              <div className='flex items-center justify-start py-10'>
                <button
                  onClick={() => setNavbarOpen(false)}
                  aria-label='Close mobile menu'
                  className='bg-white p-3 rounded-full hover:cursor-pointer'
                >
                  <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'>
                    <path fill='none' stroke='black' strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M6 18L18 6M6 6l12 12' />
                  </svg>
                </button>
              </div>
              <nav className='flex flex-col items-start gap-4'>
                <ul className='w-full'>
                  {navLinks.map((item, index) => (
                    <NavLink key={index} item={item} onClick={() => setNavbarOpen(false)} />
                  ))}
                </ul>
              </nav>
            </div>

            <div className='flex flex-col gap-1 my-16 text-white'>
              <a
                href='/images/hero/Satyajan-Product-Catalogue-2025.pdf'
                download='Satyajan-Product-Catalogue-2025.pdf'
                className='flex items-center gap-2 bg-primary hover:bg-dark text-white px-6 py-3 rounded-full font-semibold transition-colors text-sm w-fit mb-6'
              >
                <Icon icon='ph:download-simple-bold' width={18} />
                Download Catalogue
              </a>

              <p className='text-base font-normal text-white/40'>Contact</p>
              <Link href='mailto:info@satyajan.com' className='text-base font-medium text-inherit hover:text-primary'>
                info@satyajan.com
              </Link>
              <Link href='mailto:service@satyajan.com' className='text-base font-medium text-inherit hover:text-primary'>
                service@satyajan.com
              </Link>
              <Link href='https://wa.me/918019179159' className='text-base font-medium text-inherit hover:text-primary'>
                +91 8019179159
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* ── MOBILE BOTTOM NAV BAR ───────────────────────────────────────── */}
      {/* Only visible on mobile (md:hidden) */}
      {/* pb-safe handles iPhone notch / home indicator */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
        {/* Frosted glass bar */}
        <div className="bg-white/90 backdrop-blur-xl border-t border-gray-200/60 shadow-2xl">
          <div className="flex items-end justify-around px-2 pt-2 pb-[env(safe-area-inset-bottom,8px)]">
            {BOTTOM_NAV.map((item) => {
              const isActive = pathname === item.href ||
                (item.href !== '/' && pathname.startsWith(item.href.replace('/book', '')))

              // Centre "Book Service" button — raised pill
              if (item.center) {
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex flex-col items-center -mt-5 mb-1"
                  >
                    <span className="w-14 h-14 rounded-full bg-primary shadow-lg shadow-primary/40 flex items-center justify-center mb-1 border-4 border-white">
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
                  {/* Active indicator dot */}
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

      {/* ── BOTTOM NAV SPACER ───────────────────────────────────────────── */}
      {/* Pushes page content up so it's not hidden behind the bottom nav on mobile */}
      <div className="h-16 md:hidden" aria-hidden="true" />
    </>
  )
}

export default Header