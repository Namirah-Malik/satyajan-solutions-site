"use client"

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { Icon } from '@iconify/react'
import { ArrowRight, CheckCircle, Star, Send, MessageCircle, Calculator } from 'lucide-react'
import * as LucideIcons from 'lucide-react'
import { companyInfo, products, benefits, testimonials, faqs } from '@/mock/data'
import SolarSavingsCalculator from '@/components/SolarSavingsCalculator'

// ── Category map: mock/data category → products page filter value ─────────────
const categoryFilterMap: Record<string, string> = {
  'solar':      'Solar',
  'inverter':   'Inverter',
  'jumbo-ups':  'High Capacity UPS',
  'online-ups': 'ONLINE UPS',
  'battery':    'Battery',
  'lithium':    'New Lithium Battery',
  'combos':     'Combo',
}

// ── Scroll Reveal Hook ────────────────────────────────────────────────────────
function useScrollReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('sr-visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    )
    const els = document.querySelectorAll('.sr')
    els.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])
}

// ── Counter Hook ──────────────────────────────────────────────────────────────
function useCounter(target: number, suffix: string, duration = 1600) {
  const [count, setCount] = useState('0')
  const ref = useRef<HTMLSpanElement>(null)
  const started = useRef(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true
          const steps = 60
          const stepTime = duration / steps
          let current = 0
          const increment = target / steps
          const timer = setInterval(() => {
            current = Math.min(current + increment, target)
            setCount(Math.floor(current).toLocaleString('en-IN') + suffix)
            if (current >= target) clearInterval(timer)
          }, stepTime)
        }
      },
      { threshold: 0.5 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [target, suffix, duration])

  return { ref, count }
}

const WavyDivider = ({ flip = false }: { flip?: boolean }) => (
  <svg className={`w-full h-6 sm:h-8 md:h-12 ${flip ? 'rotate-180' : ''}`} viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
    <path d="M0,0 C480,100 960,0 1440,100 L1440,100 L0,100 Z" fill="url(#wavyGrad)" opacity="0.12" />
    <defs>
      <linearGradient id="wavyGrad" x1="0" y1="0" x2="1440" y2="100" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FFD600" /><stop offset="1" stopColor="#34D399" />
      </linearGradient>
    </defs>
  </svg>
)

const GlassCard = ({
  children,
  className = '',
  style
}: {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
}) => (
  <div
    className={`bg-white/40 backdrop-blur-lg rounded-2xl md:rounded-3xl shadow-xl border border-white/30 transition-all duration-300 hover:shadow-2xl ${className}`}
    style={style}
  >
    {children}
  </div>
)

const PlayfulIcon = ({ icon, ringColor, bgColor }: { icon: string; ringColor: string; bgColor: string }) => (
  <div className={`relative flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 ${bgColor} rounded-full shadow-lg mb-3 flex-shrink-0`}>
    <span className={`absolute inset-0 rounded-full animate-spin-slow border-4 ${ringColor} opacity-30`} />
    <Icon icon={icon} className="text-xl sm:text-2xl md:text-3xl text-white z-10" />
  </div>
)

function StatCard({ value, label }: { value: string; label: string }) {
  const num = parseInt(value.replace(/\D/g, ''))
  const suffix = value.replace(/[0-9,]/g, '')
  const { ref, count } = useCounter(num, suffix)
  return (
    <GlassCard className="p-2 sm:p-3 md:p-4 text-center">
      <span ref={ref} className="block text-base sm:text-xl md:text-2xl lg:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-400">
        {count || '0'}
      </span>
      <div className="text-[9px] sm:text-xs text-gray-600 mt-0.5 font-medium">{label}</div>
    </GlassCard>
  )
}

const MARQUEE_ITEMS = [
  'Solar Panel Installation', 'Battery Replacement', 'Inverter Setup & Repair',
  'Free Consultation', '24/7 Support', 'Easy EMI Options',
  'Pan-India Delivery', 'Free Installation', 'Microtek Authorized Partner',
]

function MarqueeTicker() {
  const items = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS]
  return (
    <div className="overflow-hidden bg-emerald-600 py-3">
      <div className="flex animate-marquee gap-0 w-max">
        {items.map((item, i) => (
          <span key={i} className="flex items-center gap-2 px-6 text-white text-xs sm:text-sm font-semibold whitespace-nowrap">
            <span className="w-1.5 h-1.5 rounded-full bg-white/60 inline-block" />
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}

export default function HomePageClient() {
  const [contactForm, setContactForm] = useState({ name: '', email: '', phone: '', message: '' })
  const [showSavingsCalculator, setShowSavingsCalculator] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(0)
  const [contactErrors, setContactErrors] = useState({ name: '', email: '', phone: '', message: '' })
  const [contactTouched, setContactTouched] = useState({ name: false, email: false, phone: false, message: false })
  const [contactSuccess, setContactSuccess] = useState(false)

  useScrollReveal()

  const validateContactField = (field: string, value: string) => {
    if (field === 'name') {
      if (!value.trim()) return 'Name is required'
      if (value.trim().length < 2) return 'Name must be at least 2 characters'
    }
    if (field === 'email') {
      if (!value) return 'Email is required'
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) return 'Enter a valid email (e.g. name@example.com)'
    }
    if (field === 'phone') {
      const digits = value.replace(/\D/g, '')
      if (!digits) return 'Phone number is required'
      if (digits.length !== 10) return 'Enter a valid 10-digit mobile number'
      if (!/^[6-9]/.test(digits)) return 'Enter a valid Indian mobile number'
    }
    if (field === 'message') {
      if (!value.trim()) return 'Message is required'
      if (value.trim().length < 10) return 'Message must be at least 10 characters'
    }
    return ''
  }

  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    let newValue = value
    if (name === 'phone') newValue = value.replace(/\D/g, '').slice(0, 10)
    setContactForm({ ...contactForm, [name]: newValue })
    if (contactTouched[name as keyof typeof contactTouched]) {
      setContactErrors({ ...contactErrors, [name]: validateContactField(name, newValue) })
    }
  }

  const handleContactBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setContactTouched({ ...contactTouched, [name]: true })
    setContactErrors({ ...contactErrors, [name]: validateContactField(name, value) })
  }

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors = {
      name: validateContactField('name', contactForm.name),
      email: validateContactField('email', contactForm.email),
      phone: validateContactField('phone', contactForm.phone),
      message: validateContactField('message', contactForm.message),
    }
    setContactErrors(newErrors)
    setContactTouched({ name: true, email: true, phone: true, message: true })
    if (Object.values(newErrors).some(Boolean)) return
    setContactSuccess(true)
    setContactForm({ name: '', email: '', phone: '', message: '' })
    setContactErrors({ name: '', email: '', phone: '', message: '' })
    setContactTouched({ name: false, email: false, phone: false, message: false })
  }

  const removedFaqs: string[] = [
    'How long do solar panels last?',
    'Do you provide installation services?',
    'What are the benefits of joining as a dealer?',
    'Are the products covered under warranty?',
  ]
  const visibleFaqs = faqs.filter((f: any) => !removedFaqs.includes(f.question))
  const allProducts = products.filter((p: any) => p.name !== 'Combos')

  const renderProductCard = (product: any) => (
    <div key={product.id} className="sr group rounded-2xl bg-white shadow-md border border-gray-100 overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-xl h-full">
      <div className="relative w-full bg-white flex-shrink-0" style={{ aspectRatio: '16/9' }}>
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
        />
        <span className="absolute top-2 left-2 bg-emerald-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full shadow">
          {product.category || 'Solar'}
        </span>
      </div>
      <div className="flex flex-col flex-1 border-t border-gray-100 p-3 sm:p-4 md:p-5">
        <h3 className="font-bold text-gray-900 mb-1 leading-snug text-sm sm:text-base md:text-lg">{product.name}</h3>
        <p className="text-gray-500 text-xs mb-2 leading-relaxed line-clamp-2">{product.description}</p>
        <ul className="mb-3 flex-1 space-y-1">
          {product.features.slice(0, 3).map((f: string, i: number) => (
            <li key={i} className="flex items-start gap-1.5 text-xs text-gray-700">
              <CheckCircle className="w-3 h-3 text-emerald-500 mt-0.5 flex-shrink-0" />
              <span className="line-clamp-1">{f}</span>
            </li>
          ))}
        </ul>
        {/* ✅ Fixed: each button now links to its specific category */}
        <Link
          href={`/products?category=${encodeURIComponent(categoryFilterMap[product.category] || product.category)}`}
          className="w-full bg-gradient-to-r from-emerald-500 to-teal-400 text-white py-2 rounded-xl flex items-center justify-center gap-1.5 font-semibold hover:shadow-lg transition-all text-xs sm:text-sm mt-auto"
        >
          View Products <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
    </div>
  )

  return (
    <main className="min-h-screen overflow-x-hidden">

      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section id="hero" className="relative pt-16 sm:pt-20 md:pt-24 pb-0 overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-yellow-50">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute w-72 h-72 bg-emerald-400/10 rounded-full -top-20 -right-20 animate-float-slow" />
          <div className="absolute w-48 h-48 bg-teal-400/10 rounded-full bottom-10 -left-16 animate-float-medium" />
          <div className="absolute w-32 h-32 bg-yellow-400/10 rounded-full top-1/2 left-1/3 animate-float-fast" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-10 md:py-16 relative z-10">
          <div className="grid lg:grid-cols-2 gap-6 lg:gap-12 lg:items-end">
            <div className="flex flex-col space-y-4 md:space-y-6">
              <div className="sr inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 text-xs font-semibold px-3 py-1.5 rounded-full w-fit">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Authorized Microtek Partner
              </div>
              <h1 className="sr text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold text-gray-900 leading-tight">
                Power Your Future with{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-400 animate-gradient-x">
                  Clean Solar Energy
                </span>
              </h1>
              <p className="sr text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed font-medium">
                Save up to 80% on electricity bills. 25-year warranty. Easy EMI options.
                Join 1000+ satisfied customers across India.
              </p>
              <div className="sr flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                  className="w-full sm:w-auto bg-gradient-to-r from-emerald-500 to-teal-400 text-white text-sm md:text-base px-5 md:px-8 py-3 rounded-2xl flex items-center justify-center gap-2 shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all font-semibold"
                >
                  Book Free Consultation <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setShowSavingsCalculator(true)}
                  className="w-full sm:w-auto bg-white/60 backdrop-blur border border-gray-200 text-gray-700 hover:bg-white text-sm md:text-base px-5 md:px-8 py-3 rounded-2xl flex items-center justify-center gap-2 shadow-md hover:shadow-xl active:scale-95 transition-all font-semibold"
                >
                  <Calculator className="w-4 h-4" /> Calculate Savings
                </button>
              </div>
              <div className="sr grid grid-cols-3 gap-2 sm:gap-3 md:gap-4 pt-2">
                <StatCard value="1000+" label="Happy Customers" />
                <StatCard value="25 Yrs" label="Warranty" />
                <StatCard value="80%" label="Bill Savings" />
              </div>
            </div>
            <div className="mt-2 lg:mt-0 sr">
              <GlassCard className="overflow-hidden p-0 hover:scale-[1.02] transition-transform duration-500">
                <img
                  src="/images/hero/Product_range.png"
                  alt="Microtek Product Range"
                  className="w-full h-52 sm:h-64 md:h-80 lg:h-[460px] object-cover object-center rounded-2xl md:rounded-3xl"
                />
              </GlassCard>
            </div>
          </div>
        </div>
        <div className="relative z-10">
          <MarqueeTicker />
        </div>
        <WavyDivider />
      </section>

      {/* ── ABOUT ────────────────────────────────────────────────────── */}
      <section id="about" className="py-10 sm:py-14 md:py-20 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="sr text-center mb-6 sm:mb-10 md:mb-12">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-gray-900 mb-3 tracking-tight">
            About Satyajan Energy Solutions
          </h2>
          <p className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-600 max-w-3xl mx-auto font-medium">{companyInfo.description}</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 md:gap-8">
          {[
            { icon: 'ph:target-fill', bg: 'bg-gradient-to-br from-blue-400 to-indigo-400', ring: 'border-blue-400', title: 'Our Mission', text: 'To provide reliable, sustainable energy solutions that empower homes and businesses across India.' },
            { icon: 'ph:eye-fill', bg: 'bg-gradient-to-br from-emerald-400 to-teal-400', ring: 'border-emerald-400', title: 'Our Vision', text: "To be India's most trusted partner for clean energy and power backup solutions." },
            { icon: 'ph:heart-fill', bg: 'bg-gradient-to-br from-orange-400 to-yellow-400', ring: 'border-orange-400', title: 'Our Values', text: 'Quality, reliability, customer satisfaction, and commitment to a sustainable future.' },
          ].map((card, i) => (
            <GlassCard key={card.title} className="sr flex flex-col items-center text-center p-4 sm:p-5 md:p-8 hover:scale-[1.03] transition-transform duration-300" style={{ transitionDelay: `${i * 100}ms` }}>
              <PlayfulIcon icon={card.icon} bgColor={card.bg} ringColor={card.ring} />
              <h3 className="text-sm sm:text-base md:text-xl font-bold text-gray-900 mb-1 sm:mb-2">{card.title}</h3>
              <p className="text-xs sm:text-sm md:text-base text-gray-600 font-medium">{card.text}</p>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* ── PRODUCTS ─────────────────────────────────────────────────── */}
      <section id="products" className="py-10 sm:py-14 md:py-20 px-4 sm:px-6 bg-gradient-to-b from-emerald-50/60 to-white">
        <WavyDivider flip />
        <div className="max-w-7xl mx-auto">
          <div className="sr mb-6 sm:mb-10 md:mb-12">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-gray-900 mb-2 sm:mb-3 tracking-tight">
              Our Products &amp; Services
            </h2>
            <p className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-600 max-w-3xl font-medium">
              Comprehensive range of power solutions backed by Microtek's quality and our expert local support.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
            {allProducts.map((p: any) => renderProductCard(p))}
          </div>
        </div>
        <WavyDivider />
      </section>

      {/* ── BENEFITS ─────────────────────────────────────────────────── */}
      <section id="benefits" className="py-10 sm:py-14 md:py-20 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="sr text-center mb-6 sm:mb-10 md:mb-12">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-gray-900 mb-2 sm:mb-3 tracking-tight">
            Why Choose Satyajan Energy?
          </h2>
          <p className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-600 max-w-2xl mx-auto font-medium">
            Your trusted partner for reliable power solutions with unmatched service quality.
          </p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-8">
          {benefits.map((b: any, i: number) => {
            const LIcon = (LucideIcons as any)[b.icon]
            const gradients = ['bg-gradient-to-br from-emerald-400 to-teal-400','bg-gradient-to-br from-blue-400 to-indigo-400','bg-gradient-to-br from-orange-400 to-yellow-400','bg-gradient-to-br from-purple-400 to-blue-400','bg-gradient-to-br from-rose-400 to-orange-400','bg-gradient-to-br from-teal-400 to-emerald-400']
            const rings = ['border-emerald-400','border-blue-400','border-orange-400','border-purple-400','border-rose-400','border-teal-400']
            return (
              <GlassCard key={i} className="sr p-3 sm:p-4 md:p-6 flex flex-col items-center text-center hover:scale-[1.04] transition-transform duration-300">
                <div className={`relative flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 ${gradients[i % gradients.length]} rounded-full shadow-lg mb-2 sm:mb-3 flex-shrink-0`}>
                  <span className={`absolute inset-0 rounded-full animate-spin-slow border-4 ${rings[i % rings.length]} opacity-30`} />
                  {LIcon && <LIcon className="w-4 h-4 sm:w-5 sm:h-5 md:w-7 md:h-7 text-white z-10 relative" />}
                </div>
                <h4 className="text-xs sm:text-sm md:text-lg font-bold text-gray-900 mb-1">{b.title}</h4>
                <p className="text-gray-600 font-medium text-[10px] sm:text-xs md:text-sm">{b.description}</p>
              </GlassCard>
            )
          })}
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────────────────── */}
      <section id="testimonials" className="py-10 sm:py-14 md:py-20 px-4 sm:px-6 bg-gradient-to-b from-yellow-50/60 to-white">
        <WavyDivider flip />
        <div className="max-w-7xl mx-auto">
          <div className="sr text-center mb-6 sm:mb-10 md:mb-12">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-gray-900 mb-2 tracking-tight">What Our Clients Say</h2>
            <p className="text-xs sm:text-sm md:text-base text-gray-600 font-medium">Real experiences from satisfied customers across India.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 md:gap-8">
            {testimonials.map((t: any) => (
              <GlassCard key={t.id} className="sr p-3 sm:p-4 md:p-6 hover:scale-[1.02] transition-transform duration-300">
                <div className="flex gap-1 mb-2 sm:mb-3">
                  {[...Array(t.rating)].map((_: any, i: number) => (
                    <Star key={i} className="w-3 h-3 sm:w-4 sm:h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-gray-700 mb-3 sm:mb-4 italic font-medium">&quot;{t.text}&quot;</p>
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 bg-gradient-to-br from-emerald-400 to-teal-400 rounded-full flex items-center justify-center text-white font-bold text-xs sm:text-sm">{t.name[0]}</div>
                  <div className="font-semibold text-gray-900 text-xs sm:text-sm md:text-base">{t.name}</div>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────── */}
      <section id="faq" className="py-10 sm:py-14 md:py-20 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="sr mb-6 sm:mb-8 md:mb-10">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-gray-900 mb-1 sm:mb-2 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm md:text-base text-gray-600 max-w-3xl font-medium">
            Everything you need to know about our products and services.
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8 items-start">
          <div className="space-y-2 sm:space-y-3">
            {visibleFaqs.map((f: any, i: number) => (
              <div key={i} className="sr bg-white/60 backdrop-blur-lg rounded-xl sm:rounded-2xl border border-white/40 shadow-md overflow-hidden hover:border-emerald-200 transition-colors duration-300">
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between gap-3 px-4 sm:px-5 py-3 sm:py-4 text-left"
                >
                  <span className="font-semibold text-gray-900 text-xs sm:text-sm md:text-base leading-snug">
                    {f.question}
                  </span>
                  <span className={`flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center transition-colors duration-200 ${
                    openFaq === i ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-gray-500'
                  }`}>
                    <Icon icon={openFaq === i ? 'ph:minus-bold' : 'ph:plus-bold'} width={12} />
                  </span>
                </button>
                <div className={`transition-all duration-300 ease-in-out overflow-hidden ${
                  openFaq === i ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}>
                  <p className="px-4 sm:px-5 pb-3 sm:pb-4 text-gray-600 text-xs sm:text-sm leading-relaxed font-medium border-t border-gray-100 pt-2">
                    {f.answer}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="hidden lg:block sticky top-24 sr">
            <div className="rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl border border-white/30 hover:scale-[1.02] transition-transform duration-500">
              <img
                src="/images/faqs/homeimagefaq.jpeg"
                alt="FAQ illustration"
                className="w-full h-full object-cover"
                style={{ maxHeight: `${visibleFaqs.length * 68}px`, minHeight: '320px' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── CONTACT ──────────────────────────────────────────────────── */}
      <section id="contact" className="py-10 sm:py-14 md:py-20 px-4 sm:px-6 bg-gradient-to-b from-emerald-50/60 to-white">
        <WavyDivider flip />
        <div className="max-w-5xl mx-auto">
          <div className="sr text-center mb-6 sm:mb-10 md:mb-12">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-gray-900 mb-2 tracking-tight">Get In Touch</h2>
            <p className="text-xs sm:text-sm md:text-base text-gray-600 font-medium">Have questions? We&apos;re here to help. Contact us for a free consultation.</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-12">
            <div className="space-y-3 sm:space-y-4 md:space-y-6">
              {[
                { icon: 'ph:phone-fill', bg: 'bg-gradient-to-br from-blue-400 to-indigo-400', ring: 'border-blue-400', label: 'Phone', value: companyInfo.contact.phone, href: `tel:${companyInfo.contact.phone}` },
                { icon: 'ph:envelope-fill', bg: 'bg-gradient-to-br from-emerald-400 to-teal-400', ring: 'border-emerald-400', label: 'Email', value: companyInfo.contact.email, href: `mailto:${companyInfo.contact.email}` },
                { icon: 'ph:map-pin-fill', bg: 'bg-gradient-to-br from-orange-400 to-yellow-400', ring: 'border-orange-400', label: 'Address', value: companyInfo.contact.address, href: undefined },
              ].map((c) => (
                <GlassCard key={c.label} className="sr flex items-start gap-3 p-3 sm:p-4 md:p-5 hover:scale-[1.02] transition-transform duration-300">
                  <PlayfulIcon icon={c.icon} bgColor={c.bg} ringColor={c.ring} />
                  <div className="min-w-0">
                    <div className="font-bold text-gray-900 mb-0.5 text-xs sm:text-sm md:text-base">{c.label}</div>
                    {c.href ? (
                      <a href={c.href} className="text-gray-600 hover:text-emerald-600 font-medium transition-colors text-xs break-all">{c.value}</a>
                    ) : (
                      <p className="text-gray-600 font-medium text-xs">{c.value}</p>
                    )}
                  </div>
                </GlassCard>
              ))}
              <button
                onClick={() => window.open('https://wa.me/918019179159', '_blank')}
                className="sr w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white text-sm md:text-base px-4 py-3 rounded-2xl flex items-center justify-center gap-2 font-semibold shadow-xl hover:shadow-2xl hover:scale-[1.02] active:scale-95 transition-all"
              >
                <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" /> WhatsApp Now
              </button>
              <div className="sr h-36 sm:h-44 md:h-56 rounded-2xl md:rounded-3xl overflow-hidden shadow-xl relative group border border-white/30">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3806.5!2d78.5387496!3d17.3342621!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb99c0c3e1ffe7:0xa6b7d4b850493ba0!2sSatyajan%20Energy%20Solutions%20Pvt.Ltd.!5e0!3m2!1sen!2sin!4v1234567890123"
                  width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade" title="Satyajan Location"
                  className="pointer-events-none"
                />
                <a href="https://maps.app.goo.gl/vtyTimUrenngkoHn9" target="_blank" rel="noopener noreferrer"
                  className="absolute inset-0 z-10 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/50 transition-opacity duration-300 rounded-2xl md:rounded-3xl">
                  <span className="text-white font-semibold text-xs sm:text-sm">Open in Google Maps</span>
                </a>
              </div>
            </div>
            <GlassCard className="sr p-4 sm:p-5 md:p-8">
              <h4 className="text-base sm:text-lg md:text-2xl font-bold text-emerald-800 mb-1 tracking-tight">Send Us a Message</h4>
              <p className="text-xs md:text-sm text-gray-600 mb-3 sm:mb-4 md:mb-6 font-medium">We&apos;ll get back to you within 24 hours.</p>
              {contactSuccess && (
                <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-emerald-700 text-xs sm:text-sm font-medium animate-fade-in">
                  <CheckCircle className="w-4 h-4 flex-shrink-0" /> Message sent! We&apos;ll get back to you soon.
                </div>
              )}
              <form onSubmit={handleContactSubmit} noValidate className="space-y-3 md:space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Name *</label>
                  <input type="text" name="name" value={contactForm.name}
                    onChange={handleContactChange} onBlur={handleContactBlur}
                    placeholder="Your full name"
                    className={`w-full rounded-xl p-2.5 md:p-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 transition text-xs sm:text-sm border ${
                      contactErrors.name && contactTouched.name ? 'border-red-400 bg-red-50 focus:ring-red-200' : 'border-white/40 bg-white/60 focus:ring-emerald-400'
                    }`} />
                  {contactErrors.name && contactTouched.name && <p className="text-red-500 text-xs mt-1 ml-1">⚠ {contactErrors.name}</p>}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Email *</label>
                  <input type="email" name="email" value={contactForm.email}
                    onChange={handleContactChange} onBlur={handleContactBlur}
                    placeholder="your.email@example.com"
                    className={`w-full rounded-xl p-2.5 md:p-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 transition text-xs sm:text-sm border ${
                      contactErrors.email && contactTouched.email ? 'border-red-400 bg-red-50 focus:ring-red-200' : 'border-white/40 bg-white/60 focus:ring-emerald-400'
                    }`} />
                  {contactErrors.email && contactTouched.email && <p className="text-red-500 text-xs mt-1 ml-1">⚠ {contactErrors.email}</p>}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Phone *</label>
                  <div className={`flex items-center rounded-xl border overflow-hidden transition ${
                    contactErrors.phone && contactTouched.phone ? 'border-red-400 bg-red-50' : 'border-white/40 bg-white/60'
                  }`}>
                    <span className="pl-3 pr-2 text-gray-500 text-xs font-medium whitespace-nowrap">+91</span>
                    <div className="w-px h-4 bg-gray-300" />
                    <input type="tel" name="phone" value={contactForm.phone}
                      onChange={handleContactChange} onBlur={handleContactBlur}
                      placeholder="10-digit mobile number" maxLength={10} inputMode="numeric"
                      className="flex-1 px-3 py-2.5 bg-transparent focus:outline-none text-gray-800 placeholder-gray-400 text-xs sm:text-sm" />
                  </div>
                  {contactErrors.phone && contactTouched.phone && <p className="text-red-500 text-xs mt-1 ml-1">⚠ {contactErrors.phone}</p>}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Message *</label>
                  <textarea name="message" value={contactForm.message}
                    onChange={handleContactChange} onBlur={handleContactBlur}
                    placeholder="Tell us about your requirements (min 10 characters)" rows={3}
                    className={`w-full rounded-xl p-2.5 md:p-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 transition text-xs sm:text-sm border ${
                      contactErrors.message && contactTouched.message ? 'border-red-400 bg-red-50 focus:ring-red-200' : 'border-white/40 bg-white/60 focus:ring-emerald-400'
                    }`} />
                  {contactErrors.message && contactTouched.message && <p className="text-red-500 text-xs mt-1 ml-1">⚠ {contactErrors.message}</p>}
                </div>
                <button type="submit" className="w-full bg-gradient-to-r from-emerald-500 to-teal-400 text-white py-2.5 md:py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:shadow-lg hover:scale-[1.02] active:scale-95 transition-all text-xs sm:text-sm md:text-base">
                  Send Message <Send className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>
              </form>
            </GlassCard>
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────── */}
      <section className="py-8 sm:py-10 md:py-16 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <GlassCard className="sr p-5 sm:p-6 md:p-10 bg-white/60">
            <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-emerald-700 mb-2 sm:mb-3 tracking-tight">Ready to Switch to Clean Energy?</h2>
            <p className="text-gray-700 mb-4 sm:mb-5 md:mb-8 text-xs sm:text-sm md:text-base lg:text-lg font-medium">Join over 1000+ happy customers who have already made the switch with Satyajan Energy Solutions.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/products" className="w-full sm:w-auto bg-gradient-to-r from-emerald-500 to-teal-400 text-white px-5 md:px-8 py-2.5 sm:py-3 rounded-xl font-semibold hover:shadow-xl hover:scale-105 active:scale-95 transition-all text-xs sm:text-sm md:text-base text-center">
                Explore Products
              </Link>
              <Link href="/contactus" className="w-full sm:w-auto border-2 border-emerald-500 text-emerald-600 px-5 md:px-8 py-2.5 sm:py-3 rounded-xl font-semibold hover:bg-emerald-500 hover:text-white hover:scale-105 active:scale-95 transition-all text-xs sm:text-sm md:text-base text-center">
                Contact Us Today
              </Link>
            </div>
          </GlassCard>
        </div>
      </section>

      <SolarSavingsCalculator isOpen={showSavingsCalculator} onClose={() => setShowSavingsCalculator(false)} />
    </main>
  )
}