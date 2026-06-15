"use client"

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { Icon } from '@iconify/react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, CheckCircle, Star, Send, MessageCircle, ChevronLeft, ChevronRight, Calculator, X, MapPin, Zap, Package, AlertTriangle, Lightbulb, TrendingUp } from 'lucide-react'
import * as LucideIcons from 'lucide-react'
import { companyInfo, products, benefits, testimonials } from '@/mock/data'

const categoryFilterMap: Record<string, string> = {
  'solar': 'Solar', 'inverter': 'Inverter', 'jumbo-ups': 'High Capacity UPS',
  'online-ups': 'ONLINE UPS', 'battery': 'Battery', 'lithium': 'New Lithium Battery', 'combos': 'Combo',
}

const SLIDES = [
  { id: 0, type: 'image' as const, src: '/images/hero/Product_range.png', alt: 'Microtek Product Range', fit: 'cover' },
  { id: 1, type: 'image' as const, src: '/images/hero/startup-india.png', alt: 'Startup India Certificate', fit: 'contain' },
  { id: 2, type: 'image' as const, src: '/images/hero/startup-telangana.png', alt: 'Startup Telangana Certificate', fit: 'contain' },
]

// ── Projects data ─────────────────────────────────────────────────────────────
interface Project {
  id:            string
  title:         string
  location:      string
  capacity:      string
  description:   string
  image:         string
  imageFallback: string
  imageAlt:      string
  imageFile:     string
  category:      string
  categoryColor: string
  components:    string[]
  overview:      string
  challenge:     string
  solution:      string
  result:        string
  keywords:      string[]
}

const PROJECTS: Project[] = [
  {
    id: 'imaxx-online-ups-office',
    title: '30kva max+ Online ups  lab purpose for school',
    location: 'Hyderabad, Telangana',
    capacity: '100 kVA Online UPS',
    description: 'Installed a Microtek iMAXX 100kVA online UPS with a 32-battery Exide Powersafe SMF bank for a commercial office requiring zero-downtime power for servers and workstations.',
    image: '/images/projects/microtek-imaxx-online-ups-battery-bank-hyderabad.jpg',
    imageFallback: 'ph:lightning-fill',
    imageAlt: 'Microtek iMAXX 100kVA online UPS with Exide Powersafe SMF battery bank installed by Satyajan Energy Solutions in Hyderabad.',
    imageFile: 'microtek-imaxx-online-ups-battery-bank-hyderabad.jpg',
    category: 'Online UPS',
    categoryColor: 'bg-blue-600',
    components: [
      'Microtek iMAXX 100kVA Online UPS',
      '12 × Exide Powersafe SMF Batteries',
      'MS Battery Rack (2-Tier)',
      'Distribution Board & Bypass Switch',
      'Copper Interconnects & Lugs',
    ],
    overview: 'A commercial office in Hyderabad required uninterrupted power for their server room and 20+ workstations. Frequent grid outages were causing data loss and productivity disruption.',
    challenge: 'The client had no existing UPS — only a basic offline inverter. Server room equipment required true online double-conversion protection with zero transfer time. Limited floor space required a compact, high-density battery layout.',
    solution: 'Satyajan Energy Solutions installed a Microtek iMAXX 6kVA true online UPS paired with 12 Exide Powersafe SMF batteries on a custom 2-tier MS rack. The online UPS provides zero transfer time, constant voltage/frequency regulation, and complete isolation from grid disturbances — essential for server protection.',
    result: 'The server room now operates with complete power protection. Zero data loss incidents since installation. The 12-battery bank provides 3–4 hours of backup at 50% load. Client upgraded from reactive emergency fixes to proactive power management.',
    keywords: ['online UPS installation Hyderabad', 'Microtek iMAXX UPS Hyderabad', 'server room power backup', 'commercial UPS installation'],
  },
  {
    id: 'home-inverter-tubular-battery',
    title: 'Super power Inverter installation in ZPHS School in saroornagar',
    location: 'Hyderabad, Telangana',
    capacity: '1250VA / 150Ah',
    description: 'Installed a Microtek Heavy Duty inverter with a tall tubular battery in a compact home setup — providing 6+ hours of backup for fans, lights, TV and essential appliances.',
    image: '/images/projects/microtek-heavy-duty-inverter-home-installation.jpg',
    imageFallback: 'ph:house-fill',
    imageAlt: 'Microtek Heavy Duty inverter with tall tubular battery installation in a Hyderabad home by Satyajan Energy Solutions.',
    imageFile: 'microtek-heavy-duty-inverter-home-installation.jpg',
    category: 'Home Inverter',
    categoryColor: 'bg-emerald-600',
    components: [
      'Microtek Heavy Duty 1250VA Inverter',
      '150Ah Tall Tubular Battery',
      'Battery Trolley with Wheels',
      'Wiring & MCB Protection',
      'Paperless Warranty Registration',
    ],
    overview: 'A family in Hyderabad was experiencing 6–8 hour daily power cuts during summer. They needed reliable backup for 3 ceiling fans, 8 LED lights, and a 40" LED TV.',
    challenge: 'Existing basic inverter was undersized and the old flat plate battery was only lasting 2 hours. Client wanted a neat, space-saving installation that could be moved easily — hence the battery trolley requirement.',
    solution: 'A Microtek Heavy Duty 1250VA pure sine wave inverter was paired with a 150Ah tall tubular battery mounted on a wheeled trolley for easy mobility. The installation was done with concealed wiring and an MCB for overload protection. Digital warranty registration was completed on the same day.',
    result: 'The family now gets 6+ hours of backup — enough to cover full-day power cuts. The tall tubular battery requires minimal water top-ups (quarterly) and the mobile trolley allows easy repositioning. 100% satisfaction with the neat, professional installation.',
    keywords: ['home inverter installation Hyderabad', 'Microtek Heavy Duty inverter', '150Ah tubular battery installation', 'home UPS backup Hyderabad'],
  },
  {
    id: 'Luxe inverter with lithium battery combo installation in home',
    title: 'School Classroom Power Backup',
    location: 'Hyderabad, Telangana',
    capacity: '900VA / 150Ah',
    description: 'Deployed a Microtek inverter + tall tubular battery for a school classroom, ensuring uninterrupted power for fans, lights and smart board during frequent afternoon outages.',
    image: '/images/projects/microtek-inverter-school-classroom-hyderabad.jpg',
    imageFallback: 'ph:buildings-fill',
    imageAlt: 'Microtek inverter and tall tubular battery backup system installed in a school classroom in Hyderabad by Satyajan Energy Solutions.',
    imageFile: 'microtek-inverter-school-classroom-hyderabad.jpg',
    category: 'Educational',
    categoryColor: 'bg-purple-600',
    components: [
      'Microtek 900VA Pure Sine Wave Inverter',
      '150Ah Tall Tubular Battery',
      'Battery Trolley Cabinet',
      'MCB Panel & Earthing',
      'Warranty & AMC Registration',
    ],
    overview: 'A school in Hyderabad was facing disruptions to afternoon classes due to daily power cuts. Teaching with a smart board and running ceiling fans for student comfort was becoming impossible during hot months.',
    challenge: 'The school needed a reliable, safe, and maintenance-easy solution that non-technical school staff could monitor. Budget was a consideration — a cost-effective solution was required without compromising quality.',
    solution: 'A Microtek 900VA pure sine wave inverter was installed with a 150Ah tall tubular battery in a neat cabinet trolley. The inverter\'s pure sine wave output is safe for the school\'s smart board and other electronics. The installation was designed to be simple for staff to monitor — a single LED indicator shows battery health.',
    result: 'Zero class disruptions since installation. The system supports 2 ceiling fans, 6 LED lights, and the smart board for 4+ hours of backup. School management expressed satisfaction with both the product quality and the professional, mess-free installation by Satyajan\'s team.',
    keywords: ['school power backup Hyderabad', 'inverter for classroom', 'educational institution UPS Hyderabad', 'Microtek inverter school installation'],
  },
  {
    id: 'solar-pcu-home-installation',
    title: 'Solar PCU + Tall Tubular Battery System',
    location: 'Hyderabad, Telangana',
    capacity: '1kW Solar + 200Ah Storage',
    description: 'Installed a Microtek Solar PCU with 2 × tall tubular batteries, enabling a home to run on solar power during the day and stored energy at night — drastically cutting electricity bills.',
    image: '/images/projects/microtek-solar-pcu-tubular-battery-installation.jpg',
    imageFallback: 'ph:sun-fill',
    imageAlt: 'Microtek Solar PCU with 2 tall tubular batteries installed for a home solar power system in Hyderabad by Satyajan Energy Solutions.',
    imageFile: 'microtek-solar-pcu-tubular-battery-installation.jpg',
    category: 'Solar + Battery',
    categoryColor: 'bg-amber-500',
    components: [
      'Microtek Solar PCU 1kW/24V',
      '2 × Microtek 100Ah Tall Tubular Batteries',
      'Solar Panel Array (1kW)',
      'Charge Controller (Inbuilt)',
      'MC4 Connectors & DC Cabling',
    ],
    overview: 'A residential property in Hyderabad wanted to reduce their electricity bill and have power independence during grid outages. The terrace had space for a small 1kW solar array.',
    challenge: 'The client wanted solar power that could also provide backup during outages — a standard grid-tie system would shut down during power cuts. A hybrid Solar PCU solution was needed that could simultaneously charge batteries from solar and power loads.',
    solution: 'Satyajan installed a Microtek Solar PCU (Power Conditioning Unit) — a hybrid inverter that manages solar charging, battery charging from grid, and load supply simultaneously. Two 100Ah tall tubular batteries provide 24V storage. During the day, solar powers the loads directly; excess charges batteries; grid supplements when solar is insufficient.',
    result: 'Monthly electricity bill reduced by 60–70%. The family gets 8+ hours of backup with batteries charged by solar. During good sun days, the system operates fully off-grid from 9 AM to 6 PM. Payback estimated at 3.5 years with ₹2,000+ monthly savings.',
    keywords: ['solar PCU installation Hyderabad', 'hybrid solar inverter home', 'solar + battery backup system', 'Microtek Solar PCU Hyderabad'],
  },
  {
    id: 'home-inverter-bigpowerr',
    title: '10kva online ups for OASK Publishers',
    location: 'Hyderabad, Telangana',
    capacity: '1250VA / 180Ah',
    description: 'Complete home power backup solution with Microtek Heavy Duty inverter and a BIG POWERR 180Ah tubular battery — delivering 8+ hours of backup for a 3 BHK apartment.',
    image: '/images/projects/microtek-inverter-bigpowerr-battery-home.jpg',
    imageFallback: 'ph:battery-charging-fill',
    imageAlt: 'Microtek Heavy Duty inverter with BIG POWERR 180Ah tubular battery installed in a Hyderabad apartment by Satyajan Energy Solutions.',
    imageFile: 'microtek-inverter-bigpowerr-battery-home.jpg',
    category: 'Home Inverter',
    categoryColor: 'bg-emerald-600',
    components: [
      'Microtek Heavy Duty 1250VA Inverter',
      'BIG POWERR 180Ah Tubular Battery',
      'Battery Cabinet with Wheels',
      'MCB + Fuse Protection',
      'Same-Day Installation & Warranty',
    ],
    overview: 'A family in a 3 BHK apartment in Hyderabad was suffering through 8-hour daily power cuts in summer with an ageing inverter that could barely last 2 hours. They needed a significant upgrade.',
    challenge: 'Old flat plate battery had reduced to 20% capacity. The apartment had a specific corner installation requirement with no wall space for a fixed rack. Client wanted a solution that could be relocated easily if they moved apartments.',
    solution: 'A Microtek Heavy Duty 1250VA pure sine wave inverter was paired with a BIG POWERR 180Ah tall tubular battery in a sleek wheeled cabinet. The mobile cabinet design allows easy relocation and keeps the installation neat and compact in the apartment corner. Wiring was neatly channeled with a dedicated MCB for safety.',
    result: 'The family now gets 8–10 hours of backup — sufficient even for the longest power cuts. The 180Ah battery is significantly larger than their old setup, providing noticeably better performance. Client also saved on installation by reusing the existing wiring from their old system.',
    keywords: ['home inverter upgrade Hyderabad', 'Microtek Heavy Duty 1250VA', 'BIG POWERR battery installation', '180Ah tubular battery Hyderabad'],
  },
  {
    id: 'lithium-battery-luxe-combo',
    title: 'lithium 1500 SW Inverter For home',
    location: 'Hyderabad, Telangana',
    capacity: '1100VA / 100Ah LFP',
    description: 'Upgraded a home from a conventional tubular battery to a Microtek LFP Lithium-Ion battery with LUXE inverter — 3500+ cycles, maintenance-free, and 5× faster charging.',
    image: '/images/projects/microtek-luxe-lithium-battery-combo.jpg',
    imageFallback: 'ph:atom-fill',
    imageAlt: 'Microtek LUXE inverter with Microtek Lithium-Ion LFP battery (MLB1280060) installed in a Hyderabad home by Satyajan Energy Solutions.',
    imageFile: 'microtek-luxe-lithium-battery-combo.jpg',
    category: 'Lithium Battery',
    categoryColor: 'bg-violet-600',
    components: [
      'Microtek LUXE NEW 1400 Inverter (1100VA)',
      'Microtek Lithium-Ion Battery MLB1280060 (100Ah/12.8V)',
      'Built-in BMS Protection',
      '5-Year Lithium Warranty',
      'Zero-Maintenance Setup',
    ],
    overview: 'A customer in Hyderabad wanted to upgrade from a conventional tubular battery that required water top-ups every month and was deteriorating rapidly. They wanted a modern, maintenance-free solution.',
    challenge: 'Conventional tubular batteries require regular water maintenance, produce hydrogen gas (ventilation needed), and deteriorate over 4–5 years. The customer lived in an apartment with no space for battery ventilation and wanted a safe, compact, zero-maintenance solution.',
    solution: 'Satyajan recommended the Microtek LUXE NEW 1400 inverter paired with the Microtek MLB1280060 100Ah LFP Lithium-Ion battery — a sealed, maintenance-free system with built-in BMS. The LFP chemistry is thermally stable (no ventilation needed), charges 5× faster than tubular batteries, and delivers 3500+ cycles vs 500 for lead-acid.',
    result: 'The customer is delighted — no more monthly water top-ups, no acid smell, faster charging, and a 5-year warranty. The compact lithium battery fits neatly on the shelf. At 10kg, it weighs a fraction of a 180Ah tubular battery (50kg). Estimated 10+ years of service life with the LFP chemistry.',
    keywords: ['lithium battery inverter Hyderabad', 'Microtek LFP lithium battery', 'maintenance-free inverter battery', 'Microtek LUXE lithium combo Hyderabad'],
  },
]

// ── Project Modal ─────────────────────────────────────────────────────────────
function ProjectModal({ project, onClose }: { project: Project; onClose: () => void }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', handler) }
  }, [onClose])

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.97 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="relative bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="relative bg-gray-900 rounded-t-3xl p-6 sm:p-8">
            <button onClick={onClose}
              className="absolute top-4 right-4 w-9 h-9 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors">
              <X className="w-4 h-4" />
            </button>
            <span className={`inline-block text-[10px] font-black text-white uppercase tracking-widest px-3 py-1 rounded-full mb-3 ${project.categoryColor}`}>
              {project.category}
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white mb-4 leading-tight pr-10">{project.title}</h2>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 text-white/70 text-sm">
                <MapPin className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>{project.location}</span>
              </div>
              <div className="flex items-center gap-2 text-white/70 text-sm">
                <Zap className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span>{project.capacity}</span>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="p-6 sm:p-8 space-y-6">

            {/* Components */}
            <div>
              <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2 mb-3">
                <Package className="w-4 h-4 text-emerald-600" /> Components Used
              </h3>
              <div className="flex flex-wrap gap-2">
                {project.components.map((c, i) => (
                  <span key={i} className="inline-flex items-center gap-1 bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-semibold px-3 py-1.5 rounded-full">
                    <CheckCircle className="w-3 h-3 flex-shrink-0" /> {c}
                  </span>
                ))}
              </div>
            </div>

            {/* Project Overview */}
            <div className="bg-gray-50 rounded-2xl p-4 sm:p-5">
              <h3 className="text-sm font-bold text-gray-900 mb-2">📋 Project Overview</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{project.overview}</p>
            </div>

            {/* Challenge */}
            <div className="bg-red-50 border border-red-100 rounded-2xl p-4 sm:p-5">
              <h3 className="text-sm font-bold text-red-800 mb-2 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-red-500" /> The Challenge
              </h3>
              <p className="text-sm text-red-700 leading-relaxed">{project.challenge}</p>
            </div>

            {/* Solution */}
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 sm:p-5">
              <h3 className="text-sm font-bold text-blue-800 mb-2 flex items-center gap-1.5">
                <Lightbulb className="w-4 h-4 text-blue-500" /> Our Solution
              </h3>
              <p className="text-sm text-blue-700 leading-relaxed">{project.solution}</p>
            </div>

            {/* Result */}
            <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 sm:p-5">
              <h3 className="text-sm font-bold text-emerald-800 mb-2 flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-emerald-600" /> Result & Impact
              </h3>
              <p className="text-sm text-emerald-700 leading-relaxed">{project.result}</p>
            </div>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <a
                href={`https://wa.me/918019179159?text=${encodeURIComponent(`Hi! I saw your ${project.title} project on your website and I'm interested in a similar solution. Please share more details.`)}`}
                target="_blank" rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1fba58] text-white font-bold py-3 rounded-xl text-sm transition-colors shadow-md"
              >
                <Icon icon="mdi:whatsapp" width={18} /> Discuss Similar Project
              </a>
              <button onClick={onClose}
                className="flex-1 flex items-center justify-center gap-2 border-2 border-gray-200 text-gray-600 hover:border-gray-300 font-semibold py-3 rounded-xl text-sm transition-colors">
                Close
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

// ── Project Card ──────────────────────────────────────────────────────────────
function ProjectCard({ project, onOpen }: { project: Project; onOpen: () => void }) {
  const [imgError, setImgError] = useState(false)

  return (
    <article
      className="group relative bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm
                 hover:shadow-[0_12px_40px_rgba(0,0,0,0.12)] hover:-translate-y-1.5
                 transition-all duration-300 flex flex-col h-full"
    >
      {/* Image — fixed aspect ratio, never grows */}
      <div className="relative overflow-hidden bg-gray-900 flex-shrink-0" style={{ aspectRatio: '16/10' }}>
        {!imgError ? (
          <img
            src={project.image}
            alt={project.imageAlt}
            loading="lazy"
            onError={() => setImgError(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900 p-6">
            <Icon icon={project.imageFallback} className="text-emerald-400 mb-3" width={48} />
            <p className="text-white/60 text-xs text-center font-medium leading-snug">{project.imageAlt}</p>
          </div>
        )}
        {/* Category badge */}
        <div className="absolute top-3 left-3">
          <span className={`inline-block text-[10px] font-black text-white uppercase tracking-widest px-3 py-1 rounded-full shadow-md ${project.categoryColor}`}>
            {project.category}
          </span>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Content — flex-col + flex-1 so this block fills remaining card height */}
      <div className="flex flex-col flex-1 p-4 sm:p-5">
        <h3 className="text-sm sm:text-base font-bold text-gray-900 mb-2 leading-snug group-hover:text-primary transition-colors line-clamp-2">
          {project.title}
        </h3>

        <div className="flex flex-wrap gap-x-3 gap-y-1 mb-3">
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <MapPin className="w-3 h-3 text-primary flex-shrink-0" />
            <span>{project.location}</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Zap className="w-3 h-3 text-amber-500 flex-shrink-0" />
            <span className="font-semibold text-gray-700">{project.capacity}</span>
          </div>
        </div>

        {/* flex-1 pushes the button to the bottom regardless of text length */}
        <p className="text-xs text-gray-500 leading-relaxed flex-1 mb-4 line-clamp-3">
          {project.description}
        </p>

        {/* mt-auto as belt-and-suspenders to always pin button at bottom */}
        <button
          onClick={onOpen}
          aria-label={`View details of ${project.title}`}
          className="mt-auto w-full flex items-center justify-center gap-2
                     bg-gray-900 hover:bg-primary text-white
                     py-2.5 rounded-xl text-xs font-bold
                     transition-all duration-200 active:scale-95"
        >
          View Details <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </article>
  )
}

// ── Projects Section ──────────────────────────────────────────────────────────
function ProjectsSection() {
  const [activeProject, setActiveProject] = useState<Project | null>(null)

  return (
    <section
      id="projects"
      aria-labelledby="projects-heading"
      className="py-10 sm:py-14 md:py-20 px-4 sm:px-6 bg-gradient-to-b from-gray-50/80 to-white"
    >
      <WavyDivider flip />
      <div className="max-w-7xl mx-auto">

        {/* Heading */}
        <div className="sr text-center mb-8 sm:mb-12">
          <span className="inline-block text-xs font-semibold text-primary uppercase tracking-widest px-3 py-1 bg-primary/10 rounded-full mb-4">
            Our Work
          </span>
          <h2 id="projects-heading" className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-gray-900 mb-3 tracking-tight">
            Our Projects
          </h2>
          <p className="text-xs sm:text-sm md:text-base text-gray-500 max-w-2xl mx-auto font-medium">
            Delivering Reliable Power Backup &amp; Energy Solutions Across India
          </p>
        </div>

        {/* Grid — items-stretch ensures every cell in a row is the same height */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6 items-stretch">
          {PROJECTS.map((project) => (
            <div key={project.id} className="sr h-full">
              <ProjectCard project={project} onOpen={() => setActiveProject(project)} />
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="sr mt-10 text-center">
          <p className="text-sm text-gray-500 mb-4 font-medium">
            Have a similar project in mind? Let&apos;s discuss your requirements.
          </p>
          <a
            href="https://wa.me/918019179159?text=Hi! I'd like to discuss a power backup project for my business."
            target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#1fba58] text-white px-6 py-3 rounded-full font-bold text-sm shadow-lg transition-all hover:scale-[1.03]"
          >
            <Icon icon="mdi:whatsapp" width={18} /> Discuss Your Project — Free Consultation
          </a>
        </div>
      </div>

      {/* Modal */}
      {activeProject && (
        <ProjectModal project={activeProject} onClose={() => setActiveProject(null)} />
      )}
    </section>
  )
}

// ── Shared helpers ────────────────────────────────────────────────────────────
function useScrollReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => { entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('sr-visible'); observer.unobserve(e.target) } }) },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    )
    document.querySelectorAll('.sr').forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])
}

function useCounter(target: number, suffix: string, duration = 1600) {
  const [count, setCount] = useState('0')
  const ref = useRef<HTMLSpanElement>(null)
  const started = useRef(false)
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true
        const steps = 60; const stepTime = duration / steps; let current = 0; const increment = target / steps
        const timer = setInterval(() => {
          current = Math.min(current + increment, target)
          setCount(Math.floor(current).toLocaleString('en-IN') + suffix)
          if (current >= target) clearInterval(timer)
        }, stepTime)
      }
    }, { threshold: 0.5 })
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [target, suffix, duration])
  return { ref, count }
}

const GoogleIcon = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
)

const IndiaMART_Icon = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <rect width="32" height="32" rx="6" fill="#F97316"/>
    <text x="50%" y="52%" dominantBaseline="middle" textAnchor="middle" fill="white" fontSize="13" fontWeight="900" fontFamily="Arial, sans-serif" letterSpacing="-0.5">IM</text>
  </svg>
)

const WavyDivider = ({ flip = false }: { flip?: boolean }) => (
  <svg className={`w-full h-6 sm:h-8 md:h-12 ${flip ? 'rotate-180' : ''}`} viewBox="0 0 1440 100" fill="none" preserveAspectRatio="none">
    <path d="M0,0 C480,100 960,0 1440,100 L1440,100 L0,100 Z" fill="url(#wavyGrad)" opacity="0.12" />
    <defs><linearGradient id="wavyGrad" x1="0" y1="0" x2="1440" y2="100" gradientUnits="userSpaceOnUse"><stop stopColor="#FFD600"/><stop offset="1" stopColor="#34D399"/></linearGradient></defs>
  </svg>
)

const GlassCard = ({ children, className = '', style }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) => (
  <div className={`bg-white/40 backdrop-blur-lg rounded-2xl md:rounded-3xl shadow-xl border border-white/30 transition-all duration-300 hover:shadow-2xl ${className}`} style={style}>{children}</div>
)

const PlayfulIcon = ({ icon, ringColor, bgColor }: { icon: string; ringColor: string; bgColor: string }) => (
  <div className={`relative flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 ${bgColor} rounded-full shadow-lg mb-3 flex-shrink-0`}>
    <span className={`absolute inset-0 rounded-full animate-spin-slow border-4 ${ringColor} opacity-30`} />
    <Icon icon={icon} className="text-xl sm:text-2xl md:text-3xl text-white z-10" />
  </div>
)

function StatCard({ value, label }: { value: string; label: string }) {
  const num = parseInt(value.replace(/\D/g, '')); const suffix = value.replace(/[0-9,]/g, '')
  const { ref, count } = useCounter(num, suffix)
  return (
    <div className="text-center">
      <span ref={ref} className="block text-2xl sm:text-3xl font-extrabold text-primary">{count || '0'}</span>
      <div className="text-[11px] sm:text-xs text-gray-500 mt-0.5 font-medium">{label}</div>
    </div>
  )
}

function GoogleRatingBadge() {
  return (
    <a href="https://share.google/xEUrHKGcodkwsSfRF" target="_blank" rel="noopener noreferrer"
      className="inline-flex items-center gap-2.5 bg-white border border-gray-200 rounded-full px-4 py-2 shadow-md hover:shadow-lg hover:border-gray-300 transition-all duration-200 group w-fit">
      <GoogleIcon size={16} />
      <div className="flex items-center gap-0.5">
        {[1,2,3,4,5].map((i) => (
          <svg key={i} width="13" height="13" viewBox="0 0 24 24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
              fill={i === 5 ? 'url(#halfStar)' : i <= 4 ? '#FBBF24' : '#E5E7EB'} />
            {i === 5 && (<defs><linearGradient id="halfStar" x1="0" x2="1" y1="0" y2="0"><stop offset="80%" stopColor="#FBBF24" /><stop offset="80%" stopColor="#E5E7EB" /></linearGradient></defs>)}
          </svg>
        ))}
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-sm font-extrabold text-gray-900">4.9</span>
        <span className="text-xs text-gray-500 font-medium">· 200+ Reviews</span>
      </div>
      <ArrowRight className="w-3 h-3 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-0.5 transition-all" />
    </a>
  )
}

const MARQUEE_ITEMS = ['Solar Panel Installation','Battery Replacement','Inverter Setup & Repair','Free Consultation','24/7 Support','Easy EMI Options','Pan-India Delivery','Free Installation','Microtek Authorized Partner']

function MarqueeTicker() {
  const items = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS]
  return (
    <div className="overflow-hidden bg-primary py-3">
      <div className="flex animate-marquee gap-0 w-max">
        {items.map((item, i) => (
          <span key={i} className="flex items-center gap-2 px-6 text-white text-xs sm:text-sm font-semibold whitespace-nowrap">
            <span className="w-1.5 h-1.5 rounded-full bg-white/60 inline-block" />{item}
          </span>
        ))}
      </div>
    </div>
  )
}

function HeroSlideshow() {
  const [current, setCurrent] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const next = () => setCurrent((c) => (c + 1) % SLIDES.length)
  const prev = () => setCurrent((c) => (c - 1 + SLIDES.length) % SLIDES.length)
  useEffect(() => {
    timerRef.current = setInterval(next, 5000)
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const slide = SLIDES[current]
  return (
    <div className="relative w-full h-full min-h-[480px] lg:min-h-0 overflow-hidden bg-gradient-to-br from-emerald-50/40 to-gray-50/30">
      <AnimatePresence mode="wait">
        <motion.div key={current}
          initial={{ opacity: 0, scale: 1.03 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          className="absolute inset-0 flex items-center justify-center p-3 sm:p-5">
          <div className="w-full h-full flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-2xl shadow-md border border-white/50 p-2 sm:p-3"
            style={{ maxWidth: '96%', maxHeight: '94%' }}>
            <img src={slide.src} alt={slide.alt} className="w-full h-full drop-shadow-md"
              style={{ minHeight: '400px', maxHeight: '600px', objectFit: slide.fit as 'cover' | 'contain', objectPosition: 'center' }} />
          </div>
        </motion.div>
      </AnimatePresence>
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2 bg-white/70 backdrop-blur-md rounded-full px-3 py-2 shadow border border-white/50">
        <button onClick={prev} className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"><ChevronLeft className="w-3.5 h-3.5 text-gray-600" /></button>
        <div className="flex items-center gap-1.5">
          {SLIDES.map((_, i) => (<button key={i} onClick={() => setCurrent(i)} className={`rounded-full transition-all duration-300 h-1.5 ${i === current ? 'w-5 bg-primary' : 'w-1.5 bg-gray-300 hover:bg-gray-400'}`} />))}
        </div>
        <button onClick={next} className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"><ChevronRight className="w-3.5 h-3.5 text-gray-600" /></button>
      </div>
    </div>
  )
}

function TestimonialCard({ t }: { t: any }) {
  return (
    <a href={t.sourceUrl} target="_blank" rel="noopener noreferrer"
      className="group flex-shrink-0 w-72 sm:w-80 bg-white rounded-2xl shadow-md border border-gray-100 p-4 sm:p-5 flex flex-col justify-between hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer">
      <div className="flex items-start justify-between mb-3">
        <div className="flex gap-0.5">{[...Array(t.rating)].map((_: any, i: number) => <Star key={i} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />)}</div>
        <span className={`flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${t.source === 'Google' ? 'bg-white border-gray-200 text-gray-600' : 'bg-orange-50 border-orange-200 text-orange-600'}`}>
          {t.source === 'Google' ? <GoogleIcon size={10} /> : <IndiaMART_Icon size={10} />}{t.source}
        </span>
      </div>
      <p className="text-xs sm:text-sm text-gray-700 mb-3 italic font-medium leading-relaxed flex-1 line-clamp-3">&quot;{t.text}&quot;</p>
      <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
        <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-teal-400 rounded-full flex items-center justify-center text-white font-bold text-xs flex-shrink-0">{t.name[0]}</div>
        <div className="min-w-0">
          <div className="font-semibold text-gray-900 text-xs sm:text-sm truncate">{t.name}</div>
          <div className="flex items-center gap-1 flex-wrap">
            {t.location && <span className="text-[10px] text-gray-400">{t.location}</span>}
            {t.date && <span className="text-[10px] text-gray-300">· {t.date}</span>}
          </div>
          {t.badge && <span className="text-[9px] text-emerald-600 font-medium">{t.badge}</span>}
        </div>
      </div>
    </a>
  )
}

function TestimonialRow({ items, direction = 'left', speed = 40 }: { items: any[]; direction?: 'left' | 'right'; speed?: number }) {
  const doubled = [...items, ...items, ...items]
  return (
    <div className="overflow-hidden relative w-full">
      <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-24 bg-gradient-to-r from-yellow-50/80 to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-24 bg-gradient-to-l from-yellow-50/80 to-transparent z-10 pointer-events-none" />
      <div className={`flex gap-4 w-max py-2 ${direction === 'left' ? 'animate-scroll-left' : 'animate-scroll-right'}`}
        style={{ '--scroll-speed': `${speed}s` } as React.CSSProperties}>
        {doubled.map((t: any, i: number) => <TestimonialCard key={`${t.id}-${i}`} t={t} />)}
      </div>
    </div>
  )
}

type CellValue = true | false | string
interface ComparisonRow { feature: string; us: CellValue; online: CellValue; local: CellValue }

const COMPARISON_ROWS: ComparisonRow[] = [
  { feature: 'Product Availability',                  us: true,               online: true,                    local: true },
  { feature: 'Expert Guidance',                       us: 'Experienced Team', online: 'Limited',               local: 'Depends on Seller' },
  { feature: 'Proper Product Recommendation',         us: true,               online: 'Limited',               local: 'Depends on Seller' },
  { feature: 'Installation Support',                  us: true,               online: 'Limited',               local: 'Depends on Seller' },
  { feature: 'Fast Delivery',                         us: 'Same / Next Day',  online: 'Depends on Location',   local: 'Limited' },
  { feature: 'Paperless Warranty Support',            us: true,               online: 'Limited',               local: 'Depends on Seller' },
  { feature: 'Warranty Claim Assistance',             us: true,               online: 'Limited',               local: 'Depends on Seller' },
  { feature: 'After-Sales Service',                   us: true,               online: 'Limited',               local: 'Limited' },
  { feature: 'Direct Expert Support (Call/WhatsApp)', us: true,               online: 'Usually Not Available', local: 'Limited' },
]

const Tick = () => (
  <span className="inline-flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 rounded bg-emerald-100">
    <svg width="13" height="13" viewBox="0 0 14 14" fill="none"><path d="M2 7l3.5 3.5L12 3" stroke="#10B981" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
  </span>
)
const Cross = () => (
  <span className="inline-flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 rounded bg-red-50">
    <svg width="11" height="11" viewBox="0 0 12 12" fill="none"><path d="M2 2l8 8M10 2l-8 8" stroke="#EF4444" strokeWidth="2" strokeLinecap="round"/></svg>
  </span>
)

function CellContent({ value }: { value: CellValue }) {
  if (value === true)  return <Tick />
  if (value === false) return <Cross />
  return <span className="text-[10px] sm:text-xs text-gray-500 font-medium leading-tight">{value}</span>
}

function UsCellContent({ value }: { value: CellValue }) {
  if (value === true) return <Tick />
  return (
    <span className="inline-flex flex-col items-center gap-0.5">
      <Tick />
      <span className="text-[9px] sm:text-[11px] text-primary font-semibold text-center leading-tight">({value})</span>
    </span>
  )
}

function WhyChooseUsSection() {
  return (
    <section id="why-choose-us" className="py-10 sm:py-14 md:py-20 px-3 sm:px-6">
      <div className="max-w-5xl mx-auto">
        <div className="sr text-center mb-8 sm:mb-12">
          <span className="inline-block text-xs font-semibold text-primary uppercase tracking-widest px-3 py-1 bg-primary/10 rounded-full mb-4">Why Choose Us?</span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 mb-3 tracking-tight">More Than Just a Product — We&apos;re Your Energy Partner</h2>
          <p className="text-sm sm:text-base text-gray-500 max-w-xl mx-auto font-medium">We go beyond selling. From the right recommendation to installation and warranty support — we&apos;re with you every step of the way.</p>
        </div>
        <div className="sr overflow-x-auto rounded-2xl shadow-xl border border-gray-100">
          <table className="w-full text-sm" style={{ minWidth: '480px' }}>
            <thead>
              <tr className="bg-gray-900 text-white">
                <th className="text-left px-3 sm:px-4 py-3 sm:py-4 font-semibold text-xs sm:text-sm rounded-tl-2xl w-[38%] sm:w-[36%]">Feature</th>
                <th className="text-center px-2 sm:px-4 py-3 sm:py-4 font-bold text-xs sm:text-sm bg-primary w-[22%] sm:w-[21%]">
                  <span className="flex flex-col items-center gap-0.5 sm:gap-1"><span className="text-white/80 text-[10px] sm:text-xs">⚡</span><span className="leading-tight">Satyajan<br className="sm:hidden" /><span className="hidden sm:inline"> </span>Energy</span></span>
                </th>
                <th className="text-center px-2 sm:px-4 py-3 sm:py-4 font-semibold text-xs sm:text-sm w-[21%]">
                  <span className="flex flex-col items-center gap-0.5 sm:gap-1"><span className="text-gray-400 text-[10px] sm:text-xs">🛒</span><span className="leading-tight">Online<br className="sm:hidden" /><span className="hidden sm:inline"> </span>Platforms</span></span>
                </th>
                <th className="text-center px-2 sm:px-4 py-3 sm:py-4 font-semibold text-xs sm:text-sm rounded-tr-2xl w-[19%]">
                  <span className="flex flex-col items-center gap-0.5 sm:gap-1"><span className="text-gray-400 text-[10px] sm:text-xs">🏪</span><span className="leading-tight">Local<br className="sm:hidden" /><span className="hidden sm:inline"> </span>Sellers</span></span>
                </th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON_ROWS.map((row, i) => (
                <tr key={i} className={`border-b border-gray-100 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/60'}`}>
                  <td className="px-3 sm:px-4 py-2.5 sm:py-3.5 font-medium text-gray-800 text-[11px] sm:text-sm leading-snug">{row.feature}</td>
                  <td className="px-2 sm:px-4 py-2.5 sm:py-3.5 text-center bg-primary/5"><div className="flex items-center justify-center"><UsCellContent value={row.us} /></div></td>
                  <td className="px-2 sm:px-4 py-2.5 sm:py-3.5 text-center"><div className="flex items-center justify-center"><CellContent value={row.online} /></div></td>
                  <td className="px-2 sm:px-4 py-2.5 sm:py-3.5 text-center"><div className="flex items-center justify-center"><CellContent value={row.local} /></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="sr mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a href="https://wa.me/918019179159?text=Hi, I want expert guidance before buying" target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#1fba58] text-white px-6 py-3 rounded-full font-bold text-sm shadow-lg transition-all hover:scale-[1.03]">
            <Icon icon="mdi:whatsapp" width={18} /> Get Expert Advice — Free
          </a>
          <Link href="/products" className="inline-flex items-center gap-2 border-2 border-primary text-primary px-6 py-3 rounded-full font-bold text-sm hover:bg-primary hover:text-white transition-all hover:scale-[1.03]">
            Browse Products <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}

// ── Main export ───────────────────────────────────────────────────────────────
export default function HomePageClient() {
  const [contactForm, setContactForm] = useState({ name: '', email: '', phone: '', message: '' })
  const [contactErrors, setContactErrors] = useState({ name: '', email: '', phone: '', message: '' })
  const [contactTouched, setContactTouched] = useState({ name: false, email: false, phone: false, message: false })
  const [contactSuccess, setContactSuccess] = useState(false)
  useScrollReveal()
  const row1 = testimonials.slice(0, 6)
  const row2 = testimonials.slice(6)

  const validateContactField = (field: string, value: string) => {
    if (field === 'name')    { if (!value.trim()) return 'Name is required'; if (value.trim().length < 2) return 'Name must be at least 2 characters' }
    if (field === 'email')   { if (!value) return 'Email is required'; if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) return 'Enter a valid email' }
    if (field === 'phone')   { const d = value.replace(/\D/g, ''); if (!d) return 'Phone required'; if (d.length !== 10) return 'Enter 10-digit mobile'; if (!/^[6-9]/.test(d)) return 'Enter valid Indian mobile' }
    if (field === 'message') { if (!value.trim()) return 'Message is required'; if (value.trim().length < 10) return 'Min 10 characters' }
    return ''
  }
  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    const newValue = name === 'phone' ? value.replace(/\D/g, '').slice(0, 10) : value
    setContactForm({ ...contactForm, [name]: newValue })
    if (contactTouched[name as keyof typeof contactTouched]) setContactErrors({ ...contactErrors, [name]: validateContactField(name, newValue) })
  }
  const handleContactBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setContactTouched({ ...contactTouched, [name]: true })
    setContactErrors({ ...contactErrors, [name]: validateContactField(name, value) })
  }
  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors = { name: validateContactField('name', contactForm.name), email: validateContactField('email', contactForm.email), phone: validateContactField('phone', contactForm.phone), message: validateContactField('message', contactForm.message) }
    setContactErrors(newErrors); setContactTouched({ name: true, email: true, phone: true, message: true })
    if (Object.values(newErrors).some(Boolean)) return
    setContactSuccess(true); setContactForm({ name: '', email: '', phone: '', message: '' })
    setContactErrors({ name: '', email: '', phone: '', message: '' }); setContactTouched({ name: false, email: false, phone: false, message: false })
  }

  const allProducts = products.filter((p: any) => p.name !== 'Combos')

  const renderProductCard = (product: any) => (
    <div key={product.id} className="sr group rounded-2xl bg-white shadow-md border border-gray-100 overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-xl h-full">
      <div className="relative w-full bg-white flex-shrink-0" style={{ aspectRatio: '16/9' }}>
        <img src={product.image} alt={product.name} className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500" />
        <span className="absolute top-2 left-2 bg-emerald-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full shadow">{product.category || 'Solar'}</span>
      </div>
      <div className="flex flex-col flex-1 border-t border-gray-100 p-3 sm:p-4 md:p-5">
        <h3 className="font-bold text-gray-900 mb-1 leading-snug text-sm sm:text-base md:text-lg">{product.name}</h3>
        <p className="text-gray-500 text-xs mb-2 leading-relaxed line-clamp-2">{product.description}</p>
        <ul className="mb-3 flex-1 space-y-1">
          {product.features.slice(0, 3).map((f: string, i: number) => (
            <li key={i} className="flex items-start gap-1.5 text-xs text-gray-700">
              <CheckCircle className="w-3 h-3 text-emerald-500 mt-0.5 flex-shrink-0" /><span className="line-clamp-1">{f}</span>
            </li>
          ))}
        </ul>
        <Link href={`/products?category=${encodeURIComponent(categoryFilterMap[product.category] || product.category)}`}
          className="w-full bg-gradient-to-r from-emerald-500 to-teal-400 text-white py-2 rounded-xl flex items-center justify-center gap-1.5 font-semibold hover:shadow-lg transition-all text-xs sm:text-sm mt-auto">
          View Products <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
    </div>
  )

  return (
    <main className="min-h-screen overflow-x-hidden">

      {/* ── HERO ── */}
      <section id="hero" className="relative overflow-hidden bg-gradient-to-br from-emerald-50/60 via-white to-gray-50">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute w-[500px] h-[500px] bg-primary/5 rounded-full -top-40 -left-40 blur-3xl" />
          <div className="absolute w-[400px] h-[400px] bg-teal-400/5 rounded-full -bottom-20 -right-20 blur-3xl" />
        </div>
        <div className="relative grid grid-cols-1 lg:grid-cols-2 min-h-[calc(100vh-140px)]">
          <div className="flex flex-col justify-center px-6 sm:px-10 lg:px-16 xl:px-20 py-6 lg:py-8 z-10">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-primary/5 border border-primary/30 text-primary text-xs font-semibold px-3 py-1.5 rounded-full w-fit mb-5">
              <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />Authorized Microtek Partner
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.35 }}
              className="text-3xl sm:text-4xl lg:text-[3.25rem] font-extrabold leading-[1.12] tracking-tight text-gray-900 mb-5">
              Power Your Future with{' '}<span className="text-primary">Clean Solar Energy</span>
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.5 }}
              className="max-w-md text-[15px] text-gray-500 leading-relaxed mb-7">
              Save up to 80% on electricity bills. 30-year warranty. Easy EMI options. Join 1000+ satisfied customers across India.
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.65 }}
              className="flex flex-col sm:flex-row gap-3 mb-4">
              <button onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                className="inline-flex items-center justify-center gap-2 bg-primary text-white font-semibold px-6 py-3 rounded-lg shadow-lg hover:bg-primary/90 hover:shadow-xl hover:scale-[1.02] active:scale-95 transition-all text-sm">
                Book Free Consultation <ArrowRight className="w-4 h-4" />
              </button>
              <Link href="/solar-calculator"
                className="inline-flex items-center justify-center gap-2 border border-gray-200 text-gray-700 font-semibold px-6 py-3 rounded-lg hover:bg-gray-50 hover:shadow-md active:scale-95 transition-all text-sm bg-white">
                <Calculator className="w-4 h-4 text-primary" /> Solar Calculator
              </Link>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.72 }} className="mb-6">
              <Link href="/inverter-calculator"
                className="inline-flex items-center gap-2 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 font-semibold px-5 py-2.5 rounded-lg transition-all text-sm group">
                <Icon icon="ph:calculator-fill" width={16} className="text-amber-600" />
                Not sure which inverter to buy?
                <span className="font-bold text-amber-700 group-hover:underline">Use Load Calculator →</span>
              </Link>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.75 }} className="mb-8">
              <GoogleRatingBadge />
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.85 }}
              className="flex items-center gap-5 sm:gap-8 pt-4 border-t border-gray-100">
              <StatCard value="1000+" label="Happy Customers" />
              <div className="w-px h-10 bg-gray-200" />
              <StatCard value="30 Yrs" label="Warranty" />
              <div className="w-px h-10 bg-gray-200" />
              <StatCard value="80%" label="Bill Savings" />
            </motion.div>
          </div>
          <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.3 }}
            className="relative bg-gradient-to-br from-gray-50 to-emerald-50/30 lg:border-l border-gray-100 min-h-[500px] lg:min-h-0">
            <HeroSlideshow />
          </motion.div>
        </div>
        <MarqueeTicker />
        <WavyDivider />
      </section>

      {/* ── ABOUT ── */}
      <section id="about" className="py-10 sm:py-14 md:py-20 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="sr text-center mb-6 sm:mb-10 md:mb-12">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-gray-900 mb-3 tracking-tight">About Satyajan Energy Solutions</h2>
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

      {/* ── PRODUCTS ── */}
      <section id="products" className="py-10 sm:py-14 md:py-20 px-4 sm:px-6 bg-gradient-to-b from-emerald-50/60 to-white">
        <WavyDivider flip />
        <div className="max-w-7xl mx-auto">
          <div className="sr mb-6 sm:mb-10 md:mb-12">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-gray-900 mb-2 sm:mb-3 tracking-tight">Our Products &amp; Services</h2>
            <p className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-600 max-w-3xl font-medium">Comprehensive range of power solutions backed by Microtek&apos;s quality and our expert local support.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">{allProducts.map((p: any) => renderProductCard(p))}</div>
        </div>
        <WavyDivider />
      </section>

      {/* ── BENEFITS ── */}
      <section id="benefits" className="py-10 sm:py-14 md:py-20 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="sr text-center mb-6 sm:mb-10 md:mb-12">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-gray-900 mb-2 sm:mb-3 tracking-tight">Why Choose Satyajan Energy?</h2>
          <p className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-600 max-w-2xl mx-auto font-medium">Your trusted partner for reliable power solutions with unmatched service quality.</p>
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

      {/* ── WHY CHOOSE US ── */}
      <WhyChooseUsSection />

      {/* ── PROJECTS GALLERY ── */}
      <ProjectsSection />

      {/* ── TESTIMONIALS ── */}
      <section id="testimonials" className="py-10 sm:py-14 md:py-20 bg-gradient-to-b from-yellow-50/60 to-white overflow-hidden">
        <WavyDivider flip />
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="sr text-center mb-6 sm:mb-10 md:mb-12">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-gray-900 mb-2 tracking-tight">What Our Clients Say</h2>
            <p className="text-xs sm:text-sm md:text-base text-gray-600 font-medium">Real reviews from verified customers on Google &amp; IndiaMART.</p>
          </div>
        </div>
        <div className="mb-4"><TestimonialRow items={row1} direction="left" speed={35} /></div>
        <div className="mb-8"><TestimonialRow items={row2} direction="right" speed={30} /></div>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 px-4">
          <a href="https://share.google/xEUrHKGcodkwsSfRF" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 text-xs text-gray-500 hover:text-gray-800 transition-colors border border-gray-200 rounded-full px-4 py-2 bg-white shadow-sm hover:shadow-md">
            <GoogleIcon size={14} /> View all Google Reviews
          </a>
          <a href="https://www.indiamart.com/satyajanenergysolutions/" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 text-xs text-gray-500 hover:text-orange-600 transition-colors border border-gray-200 rounded-full px-4 py-2 bg-white shadow-sm hover:shadow-md">
            <IndiaMART_Icon size={14} /> View all IndiaMART Reviews
          </a>
        </div>
      </section>

      {/* ── CONTACT ── */}
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
                    {c.href ? <a href={c.href} className="text-gray-600 hover:text-emerald-600 font-medium transition-colors text-xs break-all">{c.value}</a> : <p className="text-gray-600 font-medium text-xs">{c.value}</p>}
                  </div>
                </GlassCard>
              ))}
              <button onClick={() => window.open('https://wa.me/918019179159', '_blank')}
                className="sr w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white text-sm md:text-base px-4 py-3 rounded-2xl flex items-center justify-center gap-2 font-semibold shadow-xl hover:shadow-2xl hover:scale-[1.02] active:scale-95 transition-all">
                <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" /> WhatsApp Now
              </button>
              <div className="sr h-36 sm:h-44 md:h-56 rounded-2xl md:rounded-3xl overflow-hidden shadow-xl relative group border border-white/30">
                <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3806.5!2d78.5387496!3d17.3342621!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb99c0c3e1ffe7:0xa6b7d4b850493ba0!2sSatyajan%20Energy%20Solutions%20Pvt.Ltd.!5e0!3m2!1sen!2sin!4v1234567890123"
                  width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Satyajan Energy Solutions location on Google Maps" className="pointer-events-none" />
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
                <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-emerald-700 text-xs sm:text-sm font-medium">
                  <CheckCircle className="w-4 h-4 flex-shrink-0" /> Message sent! We&apos;ll get back to you soon.
                </div>
              )}
              <form onSubmit={handleContactSubmit} noValidate className="space-y-3 md:space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Name *</label>
                  <input type="text" name="name" value={contactForm.name} onChange={handleContactChange} onBlur={handleContactBlur} placeholder="Your full name"
                    className={`w-full rounded-xl p-2.5 md:p-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 transition text-xs sm:text-sm border ${contactErrors.name && contactTouched.name ? 'border-red-400 bg-red-50 focus:ring-red-200' : 'border-white/40 bg-white/60 focus:ring-emerald-400'}`} />
                  {contactErrors.name && contactTouched.name && <p className="text-red-500 text-xs mt-1 ml-1">⚠ {contactErrors.name}</p>}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Email *</label>
                  <input type="email" name="email" value={contactForm.email} onChange={handleContactChange} onBlur={handleContactBlur} placeholder="your.email@example.com"
                    className={`w-full rounded-xl p-2.5 md:p-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 transition text-xs sm:text-sm border ${contactErrors.email && contactTouched.email ? 'border-red-400 bg-red-50 focus:ring-red-200' : 'border-white/40 bg-white/60 focus:ring-emerald-400'}`} />
                  {contactErrors.email && contactTouched.email && <p className="text-red-500 text-xs mt-1 ml-1">⚠ {contactErrors.email}</p>}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Phone *</label>
                  <div className={`flex items-center rounded-xl border overflow-hidden transition ${contactErrors.phone && contactTouched.phone ? 'border-red-400 bg-red-50' : 'border-white/40 bg-white/60'}`}>
                    <span className="pl-3 pr-2 text-gray-500 text-xs font-medium whitespace-nowrap">+91</span>
                    <div className="w-px h-4 bg-gray-300" />
                    <input type="tel" name="phone" value={contactForm.phone} onChange={handleContactChange} onBlur={handleContactBlur} placeholder="10-digit mobile number" maxLength={10} inputMode="numeric"
                      className="flex-1 px-3 py-2.5 bg-transparent focus:outline-none text-gray-800 placeholder-gray-400 text-xs sm:text-sm" />
                  </div>
                  {contactErrors.phone && contactTouched.phone && <p className="text-red-500 text-xs mt-1 ml-1">⚠ {contactErrors.phone}</p>}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Message *</label>
                  <textarea name="message" value={contactForm.message} onChange={handleContactChange} onBlur={handleContactBlur} placeholder="Tell us about your requirements (min 10 characters)" rows={3}
                    className={`w-full rounded-xl p-2.5 md:p-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 transition text-xs sm:text-sm border ${contactErrors.message && contactTouched.message ? 'border-red-400 bg-red-50 focus:ring-red-200' : 'border-white/40 bg-white/60 focus:ring-emerald-400'}`} />
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

      {/* ── CTA ── */}
      <section className="py-8 sm:py-10 md:py-16 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <GlassCard className="sr p-5 sm:p-6 md:p-10 bg-white/60">
            <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-emerald-700 mb-2 sm:mb-3 tracking-tight">Ready to Switch to Clean Energy?</h2>
            <p className="text-gray-700 mb-4 sm:mb-5 md:mb-8 text-xs sm:text-sm md:text-base lg:text-lg font-medium">Join over 1000+ happy customers who have already made the switch with Satyajan Energy Solutions.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/products" className="w-full sm:w-auto bg-gradient-to-r from-emerald-500 to-teal-400 text-white px-5 md:px-8 py-2.5 sm:py-3 rounded-xl font-semibold hover:shadow-xl hover:scale-105 active:scale-95 transition-all text-xs sm:text-sm md:text-base text-center">Explore Products</Link>
              <Link href="/contactus" className="w-full sm:w-auto border-2 border-emerald-500 text-emerald-600 px-5 md:px-8 py-2.5 sm:py-3 rounded-xl font-semibold hover:bg-emerald-500 hover:text-white hover:scale-105 active:scale-95 transition-all text-xs sm:text-sm md:text-base text-center">Contact Us Today</Link>
            </div>
          </GlassCard>
        </div>
      </section>

    </main>
  )
}