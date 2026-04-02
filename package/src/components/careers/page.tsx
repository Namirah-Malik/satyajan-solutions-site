'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Icon } from '@iconify/react';
import Image from 'next/image';

// ── Design system ────────────────────────────────────────────────────────────
const GlassCard = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-white/40 backdrop-blur-lg rounded-3xl shadow-xl border border-white/30 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl ${className}`}>
    {children}
  </div>
);

const PlayfulIcon = ({ icon, ringColor, bgColor }: { icon: string; ringColor: string; bgColor: string }) => (
  <div className={`relative flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 ${bgColor} rounded-full shadow-lg mb-4 flex-shrink-0`}>
    <span className={`absolute inset-0 rounded-full animate-spin-slow border-4 ${ringColor} opacity-30`} />
    <Icon icon={icon} className="text-2xl sm:text-3xl text-white z-10" />
  </div>
);

// ── Data ─────────────────────────────────────────────────────────────────────
const whyWorkWithUs = [
  { icon: 'ph:trend-up-fill', ring: 'border-primary', bg: 'bg-primary', title: 'Growth-Driven Environment', description: "Be part of India's fastest-growing renewable energy sector with unlimited career advancement." },
  { icon: 'ph:heart-fill', ring: 'border-pink-400', bg: 'bg-gradient-to-br from-pink-400 to-rose-400', title: 'Respect & Transparency', description: 'We value every team member and maintain open, honest communication at all levels.' },
  { icon: 'ph:currency-inr-fill', ring: 'border-emerald-400', bg: 'bg-gradient-to-br from-emerald-400 to-green-500', title: 'Performance Incentives', description: 'Your hard work is rewarded with attractive incentives, bonuses, and recognition.' },
  { icon: 'ph:book-open-fill', ring: 'border-blue-400', bg: 'bg-gradient-to-br from-blue-400 to-indigo-500', title: 'Learn New Skills', description: 'Comprehensive training in sales, marketing, technical skills, and the latest solar technology.' },
  { icon: 'ph:sun-fill', ring: 'border-yellow-400', bg: 'bg-gradient-to-br from-yellow-400 to-orange-400', title: 'High-Growth Industry', description: 'Work in the booming solar and power backup industry with strong future prospects.' },
  { icon: 'ph:shield-check-fill', ring: 'border-teal-400', bg: 'bg-gradient-to-br from-teal-400 to-cyan-500', title: 'Career Stability', description: 'Join a stable, growing company offering long-term career security and advancement.' },
];

const perks = [
  { icon: 'ph:currency-inr-fill', bg: 'bg-gradient-to-br from-emerald-400 to-green-500', ring: 'border-emerald-400', title: 'Competitive Salary', desc: 'Market-leading packages with monthly incentives' },
  { icon: 'ph:trophy-fill', bg: 'bg-gradient-to-br from-yellow-400 to-orange-400', ring: 'border-yellow-400', title: 'Performance Bonuses', desc: 'Quarterly and annual bonuses based on achievements' },
  { icon: 'ph:car-fill', bg: 'bg-gradient-to-br from-blue-400 to-indigo-500', ring: 'border-blue-400', title: 'Travel Allowance', desc: 'Fuel reimbursement and travel allowances for field staff' },
  { icon: 'ph:graduation-cap-fill', bg: 'bg-gradient-to-br from-purple-400 to-violet-500', ring: 'border-purple-400', title: 'Training Programs', desc: 'Regular product and skill development with certifications' },
  { icon: 'ph:lightning-fill', bg: 'bg-primary', ring: 'border-primary', title: 'Fast Promotions', desc: 'Quick career progression based on performance and merit' },
  { icon: 'ph:sparkle-fill', bg: 'bg-gradient-to-br from-pink-400 to-rose-400', ring: 'border-pink-400', title: 'Positive Culture', desc: 'Healthy, supportive and collaborative work environment' },
  { icon: 'ph:gift-fill', bg: 'bg-gradient-to-br from-amber-400 to-yellow-500', ring: 'border-amber-400', title: 'Festival Bonuses', desc: 'Special rewards and bonuses during festivals' },
  { icon: 'ph:medal-fill', bg: 'bg-gradient-to-br from-teal-400 to-cyan-500', ring: 'border-teal-400', title: 'Employee Recognition', desc: 'Monthly awards for top performers' },
];

const values = [
  { icon: 'ph:shield-check-fill', bg: 'bg-primary', ring: 'border-primary', title: 'Integrity', desc: 'Highest ethical standards in all business dealings.' },
  { icon: 'ph:users-three-fill', bg: 'bg-gradient-to-br from-blue-400 to-indigo-500', ring: 'border-blue-400', title: 'Customer-First', desc: "Our customers' success is our success." },
  { icon: 'ph:lightbulb-fill', bg: 'bg-gradient-to-br from-yellow-400 to-orange-400', ring: 'border-yellow-400', title: 'Innovation', desc: 'Continuously seeking better ways to serve.' },
  { icon: 'ph:lightning-fill', bg: 'bg-gradient-to-br from-emerald-400 to-green-500', ring: 'border-emerald-400', title: 'Speed', desc: 'Move fast, deliver results without compromising quality.' },
  { icon: 'ph:handshake-fill', bg: 'bg-gradient-to-br from-purple-400 to-violet-500', ring: 'border-purple-400', title: 'Teamwork', desc: 'Collaboration and support to achieve common goals.' },
  { icon: 'ph:target-fill', bg: 'bg-gradient-to-br from-pink-400 to-rose-400', ring: 'border-pink-400', title: 'Accountability', desc: 'We own our work and deliver on our commitments.' },
];

const jobOpenings = [
  {
    id: 'sales-executive',
    type: 'Full-time',
    department: 'Sales',
    title: 'Sales Executive (Power Backup & Solar)',
    shortDescription: 'Join our dynamic sales team to promote cutting-edge solar and power backup solutions across Hyderabad.',
    location: 'Hyderabad',
    experience: '0-3 years',
    postedDate: '2025-01-15',
    skills: ['Communication', 'Field Sales', 'Product Knowledge', 'Customer Relations'],
    icon: 'ph:solar-panel-fill',
    bg: 'bg-gradient-to-br from-yellow-400 to-orange-400',
    ring: 'border-yellow-400',
  },
  {
    id: 'accounts-executive',
    type: 'Full-time',
    department: 'Accounts',
    title: 'Accounts Executive',
    shortDescription: 'Manage accounting operations, billing, GST compliance, and financial reporting for our growing business.',
    location: 'Hyderabad',
    experience: '1-3 years',
    postedDate: '2025-01-12',
    skills: ['Accounting', 'Tally', 'GST', 'Billing'],
    icon: 'ph:calculator-fill',
    bg: 'bg-gradient-to-br from-blue-400 to-indigo-500',
    ring: 'border-blue-400',
  },
];

const lifePhotos = [
  '/images/team/team3.jpeg',
  '/images/team/team2.jpeg',
  '/images/team/team.jpeg',
];

export default function CareersPage() {
  const router = useRouter();

  const scrollToJobs = () => {
    document.getElementById('open-positions')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <main className="min-h-screen">

      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section className="relative min-h-[70vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1542336391-ae2936d8efe4?q=80&w=1600&auto=format&fit=crop"
            alt="careers hero"
            fill
            className="object-cover"
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-br from-dark/90 via-primary/60 to-emerald-900/80" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 pt-32 pb-20 w-full">
          <span className="inline-block text-xs font-semibold text-white/70 uppercase tracking-widest px-3 py-1 bg-white/10 rounded-full mb-4 backdrop-blur-sm">
            We're Hiring
          </span>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-4 leading-tight drop-shadow-lg tracking-tight max-w-3xl">
            Build Your Career with Satyajan Energy Solutions
          </h1>
          <p className="text-base sm:text-xl text-white/80 max-w-2xl mb-8 font-medium leading-relaxed">
            Join one of the fastest-growing companies in Power Backup & Solar Energy. Be part of India's renewable energy revolution.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={scrollToJobs}
              className="inline-flex items-center justify-center gap-2 bg-white text-primary px-6 sm:px-8 py-3 rounded-full font-bold hover:bg-primary hover:text-white transition-colors shadow-xl text-sm sm:text-base"
            >
              <Icon icon="ph:briefcase-fill" width={18} />
              View Open Positions
            </button>
            <a
              href="https://wa.me/918019179159?text=Hi, I want to know about career opportunities"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 border-2 border-white text-white px-6 sm:px-8 py-3 rounded-full font-bold hover:bg-white hover:text-dark transition-colors text-sm sm:text-base"
            >
              <Icon icon="ph:whatsapp-logo-fill" width={18} />
              WhatsApp HR
            </a>
          </div>
        </div>
      </section>

      {/* ── WHY WORK WITH US ─────────────────────────────────────────── */}
      <section className="py-14 sm:py-20 px-3 sm:px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10 sm:mb-14">
            <span className="inline-block text-xs font-semibold text-primary uppercase tracking-widest px-3 py-1 bg-primary/10 rounded-full mb-4">
              Why Join Us
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-gray-900 drop-shadow-lg tracking-tight mb-3">
              Why Work With Us?
            </h2>
            <p className="text-sm sm:text-lg text-gray-600 font-medium max-w-2xl mx-auto">
              Join a team that values growth, innovation, and your success
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {whyWorkWithUs.map((w, i) => (
              <GlassCard key={i} className="p-5 sm:p-7 flex flex-col items-center text-center">
                <PlayfulIcon icon={w.icon} ringColor={w.ring} bgColor={w.bg} />
                <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">{w.title}</h3>
                <p className="text-xs sm:text-sm text-gray-600 font-medium leading-relaxed">{w.description}</p>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* ── PERKS & BENEFITS ─────────────────────────────────────────── */}
      <section className="py-14 sm:py-20 px-3 sm:px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10 sm:mb-14">
            <span className="inline-block text-xs font-semibold text-primary uppercase tracking-widest px-3 py-1 bg-primary/10 rounded-full mb-4">
              Benefits
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-gray-900 drop-shadow-lg tracking-tight mb-3">
              Perks & Benefits
            </h2>
            <p className="text-sm sm:text-lg text-gray-600 font-medium max-w-2xl mx-auto">
              We take care of our team with competitive compensation and excellent benefits
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {perks.map((p, i) => (
              <GlassCard key={i} className="p-4 sm:p-6 flex items-start gap-4">
                <PlayfulIcon icon={p.icon} ringColor={p.ring} bgColor={p.bg} />
                <div className="pt-1">
                  <h4 className="text-sm sm:text-base font-bold text-gray-900 mb-1">{p.title}</h4>
                  <p className="text-xs text-gray-500 font-medium leading-relaxed">{p.desc}</p>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* ── OPEN POSITIONS ───────────────────────────────────────────── */}
      <section id="open-positions" className="py-14 sm:py-20 px-3 sm:px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10 sm:mb-14">
            <span className="inline-block text-xs font-semibold text-primary uppercase tracking-widest px-3 py-1 bg-primary/10 rounded-full mb-4">
              Now Hiring
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-gray-900 drop-shadow-lg tracking-tight mb-3">
              Open Positions
            </h2>
            <p className="text-sm sm:text-lg text-gray-600 font-medium max-w-2xl mx-auto">
              Find your perfect role and start your journey with us
            </p>
          </div>

          <div className="flex flex-col gap-5 max-w-4xl mx-auto">
            {jobOpenings.map((job) => (
              <GlassCard key={job.id} className="p-5 sm:p-8">
                <div className="flex flex-col lg:flex-row lg:items-center gap-5 lg:gap-8">
                  {/* Icon */}
                  <div className="hidden sm:flex flex-shrink-0">
                    <PlayfulIcon icon={job.icon} ringColor={job.ring} bgColor={job.bg} />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className="text-xs font-semibold text-white bg-primary px-3 py-1 rounded-full">{job.type}</span>
                      <span className="text-xs font-semibold text-primary border border-primary px-3 py-1 rounded-full">{job.department}</span>
                    </div>
                    <h3 className="text-lg sm:text-2xl font-extrabold text-gray-900 tracking-tight mb-2">{job.title}</h3>
                    <p className="text-xs sm:text-sm text-gray-600 font-medium mb-3 leading-relaxed">{job.shortDescription}</p>

                    <div className="flex flex-wrap gap-3 text-xs text-gray-500 mb-3">
                      <span className="flex items-center gap-1"><Icon icon="ph:map-pin-fill" className="text-primary" width={14} />{job.location}</span>
                      <span className="flex items-center gap-1"><Icon icon="ph:briefcase-fill" className="text-primary" width={14} />{job.experience}</span>
                      <span className="flex items-center gap-1"><Icon icon="ph:calendar-fill" className="text-primary" width={14} />
                        Posted {new Date(job.postedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {job.skills.map((s, idx) => (
                        <span key={idx} className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full font-semibold">{s}</span>
                      ))}
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="flex-shrink-0 flex flex-col gap-2">
                    <button
                      onClick={() => router.push(`/career/${job.id}`)}
                      className="inline-flex items-center justify-center gap-2 bg-primary text-white px-5 py-3 rounded-full font-bold hover:bg-dark transition-colors shadow-md text-sm whitespace-nowrap"
                    >
                      View Details
                      <Icon icon="ph:arrow-right-bold" width={16} />
                    </button>
                    <button
                      onClick={() => router.push(`/career/apply?job=${job.id}`)}
                      className="inline-flex items-center justify-center gap-2 border-2 border-primary text-primary px-5 py-2.5 rounded-full font-bold hover:bg-primary hover:text-white transition-colors text-sm whitespace-nowrap"
                    >
                      Apply Now
                    </button>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* ── LIFE AT SATYAJAN ─────────────────────────────────────────── */}
      <section className="py-14 sm:py-20 px-3 sm:px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10 sm:mb-14">
            <span className="inline-block text-xs font-semibold text-primary uppercase tracking-widest px-3 py-1 bg-primary/10 rounded-full mb-4">
              Our Culture
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-gray-900 drop-shadow-lg tracking-tight mb-3">
              Life at Satyajan Energy Solutions
            </h2>
            <p className="text-sm sm:text-lg text-gray-600 font-medium max-w-2xl mx-auto">
              A glimpse into our vibrant work culture and team spirit
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            {lifePhotos.map((url, i) => (
              <GlassCard key={i} className="overflow-hidden p-0 rounded-3xl">
                <div className="relative w-full aspect-[4/3] overflow-hidden rounded-3xl">
                  <img src={url} alt={`life-${i}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* ── VALUES ───────────────────────────────────────────────────── */}
      <section className="py-14 sm:py-20 px-3 sm:px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10 sm:mb-14">
            <span className="inline-block text-xs font-semibold text-primary uppercase tracking-widest px-3 py-1 bg-primary/10 rounded-full mb-4">
              What We Stand For
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-gray-900 drop-shadow-lg tracking-tight mb-3">
              Our Work Culture & Values
            </h2>
            <p className="text-sm sm:text-lg text-gray-600 font-medium max-w-2xl mx-auto">
              The principles that guide us every day
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {values.map((v, i) => (
              <GlassCard key={i} className="p-5 sm:p-7 flex flex-col items-center text-center">
                <PlayfulIcon icon={v.icon} ringColor={v.ring} bgColor={v.bg} />
                <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">{v.title}</h3>
                <p className="text-xs sm:text-sm text-gray-600 font-medium leading-relaxed">{v.desc}</p>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────── */}
      <section className="py-14 sm:py-20 px-3 sm:px-4">
        <div className="max-w-4xl mx-auto">
          <GlassCard className="p-6 sm:p-12 bg-white/60 text-center">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-primary mb-3 sm:mb-4 drop-shadow-lg tracking-tight">
              Ready to Join Our Team?
            </h2>
            <p className="text-sm sm:text-lg text-dark font-medium mb-6 sm:mb-8 max-w-xl mx-auto">
              Explore our open positions or send us your resume for future opportunities.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={scrollToJobs}
                className="inline-flex items-center justify-center gap-2 bg-primary text-white px-6 sm:px-8 py-3 rounded-full font-bold hover:bg-dark transition-colors shadow-md text-sm sm:text-base"
              >
                <Icon icon="ph:briefcase-fill" width={18} />
                Browse Open Roles
              </button>
              <button
                onClick={() => router.push('/career/apply')}
                className="inline-flex items-center justify-center gap-2 border-2 border-primary text-primary px-6 sm:px-8 py-3 rounded-full font-bold hover:bg-primary hover:text-white transition-colors text-sm sm:text-base"
              >
                <Icon icon="ph:paper-plane-tilt-fill" width={18} />
                Apply Now
              </button>
            </div>
          </GlassCard>
        </div>
      </section>

    </main>
  );
}