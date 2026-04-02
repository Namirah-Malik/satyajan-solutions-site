'use client';

import { useRouter, useParams } from 'next/navigation';
import { Icon } from '@iconify/react';
import Image from 'next/image';

// ── Design system ────────────────────────────────────────────────────────────
const GlassCard = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-white/40 backdrop-blur-lg rounded-3xl shadow-xl border border-white/30 transition-all duration-300 hover:shadow-2xl ${className}`}>
    {children}
  </div>
);

const PlayfulIcon = ({ icon, ringColor, bgColor }: { icon: string; ringColor: string; bgColor: string }) => (
  <div className={`relative flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 ${bgColor} rounded-full shadow-lg mb-3 flex-shrink-0`}>
    <span className={`absolute inset-0 rounded-full animate-spin-slow border-4 ${ringColor} opacity-30`} />
    <Icon icon={icon} className="text-xl sm:text-3xl text-white z-10" />
  </div>
);

// ── Job data ─────────────────────────────────────────────────────────────────
const jobDetailsData = {
  'sales-executive': {
    id: 'sales-executive',
    type: 'Full-time',
    department: 'Sales',
    title: 'Sales Executive (Power Backup & Solar)',
    location: 'Hyderabad',
    experience: '0-3 years',
    postedDate: '2025-01-15',
    about: "Satyajan Energy Solutions is looking for energetic and passionate Sales Executives to join our growing team. This role offers excellent growth opportunities in the booming renewable energy sector. You'll be working with innovative products that help customers save money while contributing to a greener planet.",
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80&auto=format&fit=crop',
    responsibilities: [
      'Identify and develop new business opportunities in assigned territory',
      'Present and demonstrate solar panels, inverters, and battery systems',
      'Meet with homeowners, businesses, and dealers to understand their needs',
      'Achieve monthly and quarterly sales targets',
      'Maintain strong relationships with existing customers',
      'Provide accurate product information and technical specifications',
      'Coordinate with installation team for smooth project execution',
      'Collect market intelligence and competitor information',
      'Participate in exhibitions, trade shows, and promotional events',
      'Maintain daily sales reports and CRM updates',
    ],
    requirements: [
      'Graduate in any discipline (B.Com, BBA, Engineering preferred)',
      'Excellent communication skills in English, Hindi, and Telugu',
      'Willingness to travel within Hyderabad and nearby areas',
      'Two-wheeler with valid driving license',
      'Basic understanding of solar energy or willingness to learn',
      'Confident, self-motivated, and target-oriented personality',
      'Good negotiation and persuasion skills',
      'Proficiency in MS Office and smartphone applications',
      'Age: 21-32 years',
    ],
    skills: ['Communication', 'Field Sales', 'Product Knowledge', 'Customer Relations'],
    salary: { base: '₹15,000 - ₹20,000', incentives: '₹10,000 - ₹30,000', allowances: '₹3,000 (Travel)', total: '₹28,000 - ₹53,000 per month' },
    benefits: ['Attractive monthly incentives on achieving targets', 'Quarterly performance bonuses', 'Travel and fuel allowance', 'Comprehensive product training', 'Career growth to Team Leader → Sales Manager', 'Festival bonuses', 'Mobile reimbursement'],
  },
  'accounts-executive': {
    id: 'accounts-executive',
    type: 'Full-time',
    department: 'Accounts',
    title: 'Accounts Executive',
    location: 'Hyderabad',
    experience: '1-3 years',
    postedDate: '2025-01-12',
    about: 'Manage day-to-day accounting operations, billing, GST compliance, and financial reporting for our growing business. We are looking for detail-oriented accounting professionals to join our finance team.',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80&auto=format&fit=crop',
    responsibilities: [
      'Handle day-to-day accounting operations and transactions',
      'Manage billing and invoicing processes',
      'Ensure GST compliance and regulatory requirements',
      'Prepare and verify financial reports',
      'Reconcile accounts and maintain accuracy',
      'Process vendor invoices and payments',
      'Maintain accounting records and documentation',
      'Coordinate with auditors and external agencies',
      'Prepare monthly and quarterly financial statements',
      'Support tax planning and filing',
    ],
    requirements: [
      'B.Com or equivalent accounting qualification',
      '1-3 years of accounting experience',
      'Strong knowledge of GST and indirect taxes',
      'Proficiency in Tally and accounting software',
      'Good understanding of financial statements',
      'Excellent attention to detail',
      'Strong analytical and problem-solving skills',
      'Knowledge of Excel is essential',
    ],
    skills: ['Accounting', 'Tally', 'GST', 'Billing', 'Financial Reporting'],
    salary: { base: '₹18,000 - ₹24,000', incentives: '₹5,000 - ₹10,000', allowances: '₹2,000 (Conveyance)', total: '₹25,000 - ₹34,000 per month' },
    benefits: ['Competitive salary based on experience', 'Performance bonuses', 'Conveyance allowance', 'Professional training and development', 'Health insurance coverage', 'Festival bonuses', 'Paid leave policy'],
  },
};

const respIcons = ['ph:target-fill', 'ph:users-fill', 'ph:chart-line-up-fill', 'ph:handshake-fill', 'ph:star-fill', 'ph:lightning-fill', 'ph:gear-fill', 'ph:map-pin-fill', 'ph:megaphone-fill', 'ph:clipboard-fill'];
const reqIcons  = ['ph:graduation-cap-fill', 'ph:chat-circle-fill', 'ph:car-fill', 'ph:sun-fill', 'ph:person-fill', 'ph:handshake-fill', 'ph:device-mobile-fill', 'ph:calendar-fill', 'ph:check-circle-fill'];

export default function JobDetailPage() {
  const router = useRouter();
  const params = useParams();
  const jobId = params?.id as string;
  const job = jobDetailsData[jobId as keyof typeof jobDetailsData];

  if (!job) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <GlassCard className="p-12 text-center max-w-sm">
          <Icon icon="ph:warning-circle-fill" className="text-5xl text-amber-400 mx-auto mb-4" />
          <h2 className="text-2xl font-extrabold text-gray-900 mb-4">Job Not Found</h2>
          <button onClick={() => router.back()} className="bg-primary text-white px-6 py-2.5 rounded-full font-semibold hover:bg-dark transition-colors">
            Go Back
          </button>
        </GlassCard>
      </div>
    );
  }

  return (
    <main className="min-h-screen">

      {/* ── HERO ───────────────────────────────────────────────────── */}
      <section className="relative min-h-[55vh] flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <Image src={job.image} alt={job.title} fill className="object-cover" unoptimized />
          <div className="absolute inset-0 bg-gradient-to-br from-dark/90 via-primary/50 to-transparent" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 pt-32 pb-10 w-full">
          <button onClick={() => router.back()} className="flex items-center gap-2 text-white/70 hover:text-white mb-6 font-medium text-sm transition-colors">
            <Icon icon="ph:arrow-left-bold" width={16} />
            Back to All Jobs
          </button>
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="text-xs font-semibold text-white bg-primary/80 backdrop-blur-sm px-3 py-1 rounded-full">{job.type}</span>
            <span className="text-xs font-semibold text-primary border border-primary/60 bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full">{job.department}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight drop-shadow-lg tracking-tight mb-4 max-w-3xl">
            {job.title}
          </h1>
          <div className="flex flex-wrap gap-3 sm:gap-5 text-sm text-white/80">
            <span className="flex items-center gap-1.5"><Icon icon="ph:map-pin-fill" className="text-primary" width={16} />{job.location}</span>
            <span className="flex items-center gap-1.5"><Icon icon="ph:briefcase-fill" className="text-primary" width={16} />{job.experience}</span>
            <span className="flex items-center gap-1.5"><Icon icon="ph:calendar-fill" className="text-primary" width={16} />
              Posted {new Date(job.postedDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </span>
          </div>
        </div>
      </section>

      {/* ── CONTENT ──────────────────────────────────────────────────── */}
      <section className="py-12 sm:py-16 px-3 sm:px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-10">

            {/* Main */}
            <div className="lg:col-span-2 flex flex-col gap-6">

              {/* About */}
              <GlassCard className="p-5 sm:p-8">
                <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 mb-4 tracking-tight">About the Role</h2>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed font-medium">{job.about}</p>
              </GlassCard>

              {/* Responsibilities */}
              <GlassCard className="p-5 sm:p-8">
                <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 mb-5 tracking-tight">Key Responsibilities</h2>
                <ul className="space-y-3">
                  {job.responsibilities.map((resp, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-emerald-400 flex items-center justify-center flex-shrink-0 mt-0.5 shadow">
                        <Icon icon={respIcons[idx % respIcons.length]} className="text-white text-xs" />
                      </div>
                      <span className="text-xs sm:text-sm text-gray-700 font-medium leading-relaxed">{resp}</span>
                    </li>
                  ))}
                </ul>
              </GlassCard>

              {/* Requirements */}
              <GlassCard className="p-5 sm:p-8">
                <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 mb-5 tracking-tight">Requirements & Qualifications</h2>
                <ul className="space-y-3">
                  {job.requirements.map((req, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center flex-shrink-0 mt-0.5 shadow">
                        <Icon icon={reqIcons[idx % reqIcons.length]} className="text-white text-xs" />
                      </div>
                      <span className="text-xs sm:text-sm text-gray-700 font-medium leading-relaxed">{req}</span>
                    </li>
                  ))}
                </ul>
              </GlassCard>

              {/* Skills */}
              <GlassCard className="p-5 sm:p-8">
                <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 mb-4 tracking-tight">Required Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((skill, idx) => (
                    <span key={idx} className="text-xs sm:text-sm bg-primary/10 text-primary px-4 py-2 rounded-full font-semibold">
                      {skill}
                    </span>
                  ))}
                </div>
              </GlassCard>

              {/* Salary */}
              <GlassCard className="p-5 sm:p-8">
                <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 mb-5 tracking-tight">Salary & Compensation</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
                  {[
                    { label: 'Base Salary', value: job.salary.base, icon: 'ph:currency-inr-fill', bg: 'bg-gradient-to-br from-emerald-400 to-green-500', ring: 'border-emerald-400' },
                    { label: 'Monthly Incentives', value: job.salary.incentives, icon: 'ph:trend-up-fill', bg: 'bg-gradient-to-br from-yellow-400 to-orange-400', ring: 'border-yellow-400' },
                    { label: 'Allowances', value: job.salary.allowances, icon: 'ph:car-fill', bg: 'bg-gradient-to-br from-blue-400 to-indigo-500', ring: 'border-blue-400' },
                  ].map((s, i) => (
                    <div key={i} className="flex flex-col items-center text-center p-4 bg-white/50 rounded-2xl border border-white/40">
                      <PlayfulIcon icon={s.icon} ringColor={s.ring} bgColor={s.bg} />
                      <p className="text-xs text-gray-500 font-medium mb-1">{s.label}</p>
                      <p className="text-sm sm:text-base font-extrabold text-gray-900">{s.value}</p>
                    </div>
                  ))}
                </div>
                <div className="bg-gradient-to-r from-primary/10 to-emerald-400/10 border border-primary/20 rounded-2xl p-4 sm:p-5 text-center">
                  <p className="text-xs text-gray-500 font-medium mb-1">Total Earning Potential</p>
                  <p className="text-xl sm:text-2xl font-extrabold text-primary">{job.salary.total}</p>
                </div>
              </GlassCard>

              {/* Benefits */}
              <GlassCard className="p-5 sm:p-8">
                <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 mb-5 tracking-tight">Additional Benefits</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {job.benefits.map((benefit, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3 bg-white/50 rounded-2xl border border-white/40 hover:bg-primary/5 transition-colors">
                      <Icon icon="ph:check-circle-fill" className="text-primary flex-shrink-0 mt-0.5" width={18} />
                      <span className="text-xs sm:text-sm text-gray-700 font-medium leading-relaxed">{benefit}</span>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 flex flex-col gap-4">

                {/* Apply CTA */}
                <GlassCard className="p-5 sm:p-6 bg-white/60">
                  <h3 className="text-lg sm:text-xl font-extrabold text-gray-900 mb-2 tracking-tight">Ready to Apply?</h3>
                  <p className="text-xs sm:text-sm text-gray-600 font-medium mb-5 leading-relaxed">
                    Take the next step in your career. Submit your application and join our team.
                  </p>
                  <div className="flex flex-col gap-3">
                    <button
                      onClick={() => router.push(`/career/apply?job=${job.id}`)}
                      className="w-full bg-primary text-white px-4 py-3 rounded-full font-bold hover:bg-dark transition-colors shadow-md flex items-center justify-center gap-2 text-sm"
                    >
                      <Icon icon="ph:paper-plane-tilt-fill" width={18} />
                      Apply for this Job
                    </button>
                    <a
                      href={`https://wa.me/918019179159?text=Hi, I am interested in the ${job.title} position`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full border-2 border-gray-200 text-gray-800 px-4 py-3 rounded-full font-bold hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-2 text-sm"
                    >
                      <Icon icon="ph:whatsapp-logo-fill" className="text-green-500" width={18} />
                      WhatsApp HR
                    </a>
                  </div>
                </GlassCard>

                {/* Job Summary */}
                <GlassCard className="p-5 sm:p-6">
                  <h4 className="font-extrabold text-gray-900 mb-4 tracking-tight">Job Summary</h4>
                  <div className="space-y-3">
                    {[
                      { label: 'Location', value: job.location, icon: 'ph:map-pin-fill' },
                      { label: 'Job Type', value: job.type, icon: 'ph:briefcase-fill' },
                      { label: 'Experience', value: job.experience, icon: 'ph:clock-fill' },
                      { label: 'Department', value: job.department, icon: 'ph:buildings-fill' },
                    ].map((s, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 bg-white/50 rounded-2xl border border-white/40">
                        <Icon icon={s.icon} className="text-primary flex-shrink-0" width={18} />
                        <div>
                          <p className="text-xs text-gray-400 font-medium">{s.label}</p>
                          <p className="text-sm font-bold text-gray-900">{s.value}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </GlassCard>

              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────── */}
      <section className="py-12 sm:py-16 px-3 sm:px-4">
        <div className="max-w-4xl mx-auto">
          <GlassCard className="p-6 sm:p-10 bg-white/60 text-center">
            <h2 className="text-xl sm:text-3xl font-extrabold text-primary mb-3 drop-shadow-lg tracking-tight">
              Interested in this Role?
            </h2>
            <p className="text-sm sm:text-lg text-dark font-medium mb-6 sm:mb-8">
              Don't miss out — apply today or reach out to our HR team directly.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => router.push(`/career/apply?job=${job.id}`)}
                className="inline-flex items-center justify-center gap-2 bg-primary text-white px-6 sm:px-8 py-3 rounded-full font-bold hover:bg-dark transition-colors shadow-md text-sm sm:text-base"
              >
                <Icon icon="ph:paper-plane-tilt-fill" width={18} />
                Apply Now
              </button>
              <a
                href={`https://wa.me/918019179159?text=Hi, I am interested in the ${job.title} position`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 border-2 border-primary text-primary px-6 sm:px-8 py-3 rounded-full font-bold hover:bg-primary hover:text-white transition-colors text-sm sm:text-base"
              >
                <Icon icon="ph:whatsapp-logo-fill" width={18} />
                Talk to HR
              </a>
            </div>
          </GlassCard>
        </div>
      </section>

    </main>
  );
}