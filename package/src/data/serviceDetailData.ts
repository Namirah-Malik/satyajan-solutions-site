// src/data/serviceDetailData.ts

export interface ServiceDetail {
  slug: string;
  bookingValue: string;
  title: string;
  tagline: string;
  heroImage: string;
  badge: string;
  description: string;
  highlights: { icon: string; label: string; value: string }[];
  features: { icon: string; title: string; desc: string }[];
  steps: { number: string; title: string; desc: string }[];
  faqs: { q: string; a: string }[];
}

export const serviceDetails: ServiceDetail[] = [
  {
    slug: 'inverter-installation',
    bookingValue: 'Inverter Installation',
    title: 'UPS / Inverter Installation',
    tagline: 'Professional inverter & UPS installation at your doorstep',
    heroImage: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=1200&q=80&auto=format&fit=crop',
    badge: 'Power Backup',
    description:
      'Never face a power outage again. Our certified technicians install inverters and UPS systems of all capacities — from home to commercial setups — with expert wiring, load calculation, and safety checks included.',
    highlights: [
      { icon: 'ph:clock-fill',        label: 'Avg. Install Time', value: '2–4 Hours' },
      { icon: 'ph:shield-check-fill', label: 'Warranty',          value: '1 Year' },
      { icon: 'ph:star-fill',         label: 'Rating',            value: '4.9 / 5' },
      { icon: 'ph:currency-inr-fill', label: 'Starting From',     value: '₹499' },
    ],
    features: [
      { icon: 'ph:wrench-fill',         title: 'Expert Installation',  desc: 'Certified technicians with years of experience in inverter and UPS setups.' },
      { icon: 'ph:lightning-fill',      title: 'Load Calculation',     desc: 'We assess your power needs and recommend the right capacity for your home or office.' },
      { icon: 'ph:shield-check-fill',   title: 'Safety First',         desc: 'Full electrical safety checks, earthing, and surge protection included.' },
      { icon: 'ph:check-circle-fill',   title: 'All Brands Supported', desc: 'Luminous, Microtek, Exide, Amaron, Su-Kam and more — we work with every brand.' },
      { icon: 'ph:calendar-check-fill', title: 'Same Day Service',     desc: 'Book before noon and get same-day installation in most areas.' },
      { icon: 'ph:headset-fill',        title: '24/7 Support',         desc: 'Round-the-clock support after installation for any issues or queries.' },
    ],
    steps: [
      { number: '01', title: 'Book Online',    desc: 'Fill the form below with your location and requirements.' },
      { number: '02', title: 'Site Visit',     desc: 'Our technician visits, checks wiring and load requirements.' },
      { number: '03', title: 'Installation',   desc: 'Clean, professional installation with all safety checks.' },
      { number: '04', title: 'Demo & Handover', desc: 'We walk you through usage and hand over warranty documents.' },
    ],
    faqs: [
      { q: 'How long does installation take?', a: 'Most installations take 2–4 hours depending on complexity.' },
      { q: 'Do you provide the inverter too?', a: 'Yes, we supply and install inverters from all leading brands.' },
      { q: 'What is covered under warranty?',  a: 'All installation work is covered for 1 year. Product warranty is as per brand.' },
    ],
  },
  {
    slug: 'battery-replacement',
    bookingValue: 'Battery Replacement',
    title: 'Battery Replacement',
    tagline: 'Fast, doorstep battery replacement for inverters & UPS',
    heroImage: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=1200&q=80&auto=format&fit=crop',
    badge: 'Battery',
    description:
      'Is your inverter backup time dropping? Your battery may need replacement. We offer doorstep battery replacement with genuine batteries from top brands, old battery pickup, and free disposal.',
    highlights: [
      { icon: 'ph:clock-fill',        label: 'Service Time',  value: '1–2 Hours' },
      { icon: 'ph:shield-check-fill', label: 'Warranty',      value: 'Up to 3 Years' },
      { icon: 'ph:star-fill',         label: 'Rating',        value: '4.8 / 5' },
      { icon: 'ph:currency-inr-fill', label: 'Starting From', value: '₹3,999' },
    ],
    features: [
      { icon: 'ph:battery-charging-fill', title: 'Genuine Batteries',  desc: 'We only use genuine batteries from Exide, Amaron, Luminous, and other top brands.' },
      { icon: 'ph:recycle-fill',          title: 'Old Battery Pickup', desc: 'We pick up and responsibly dispose of your old battery at no extra cost.' },
      { icon: 'ph:magnifying-glass-fill', title: 'Health Check',       desc: 'Free battery and inverter health check with every replacement.' },
      { icon: 'ph:trend-up-fill',         title: 'Longer Backup',      desc: 'New batteries restore your backup time to factory-specified levels.' },
      { icon: 'ph:map-pin-fill',          title: 'Doorstep Service',   desc: 'No need to carry heavy batteries — we come to you.' },
      { icon: 'ph:shield-check-fill',     title: 'Warranty Included',  desc: 'All replacement batteries come with manufacturer warranty up to 3 years.' },
    ],
    steps: [
      { number: '01', title: 'Book Service',      desc: 'Fill the form with your inverter brand and location.' },
      { number: '02', title: 'Battery Selection', desc: 'We recommend the right battery based on your inverter capacity.' },
      { number: '03', title: 'Doorstep Swap',     desc: 'Technician arrives, swaps old battery with new one on-site.' },
      { number: '04', title: 'Old Battery Pickup', desc: 'We carry the old battery away for safe, eco-friendly disposal.' },
    ],
    faqs: [
      { q: 'How do I know my battery needs replacement?',     a: 'Signs include reduced backup time, swollen battery, or inverter alarm beeping frequently.' },
      { q: 'Which battery brands do you offer?',              a: 'Exide, Amaron, Luminous, Su-Kam, Okaya, and more.' },
      { q: 'Do you offer exchange on old battery?',           a: 'Yes, we offer exchange value on old batteries to reduce your replacement cost.' },
    ],
  },
  {
    slug: 'solar-installation',
    bookingValue: 'Solar Installation',
    title: 'Solar Panel Installation',
    tagline: 'Go solar — cut electricity bills by up to 90%',
    heroImage: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=1200&q=80&auto=format&fit=crop',
    badge: 'Solar Energy',
    description:
      'Switch to clean, affordable solar energy. We handle everything from rooftop survey and system design to panel installation, grid connection, and subsidy paperwork — turning your roof into a power plant.',
    highlights: [
      { icon: 'ph:clock-fill',        label: 'Install Time',  value: '1–3 Days' },
      { icon: 'ph:shield-check-fill', label: 'Warranty',      value: '25 Years Panel' },
      { icon: 'ph:star-fill',         label: 'Rating',        value: '4.9 / 5' },
      { icon: 'ph:currency-inr-fill', label: 'Starting From', value: '₹45,000' },
    ],
    features: [
      { icon: 'ph:solar-panel-fill',  title: 'Rooftop Survey',         desc: 'Free site survey to assess roof strength, orientation, and shading.' },
      { icon: 'ph:compass-fill',      title: 'Custom System Design',   desc: 'System sized exactly for your consumption — no over or under sizing.' },
      { icon: 'ph:lightning-fill',    title: 'Grid Tie / Off-Grid',    desc: 'We install both grid-tied and off-grid systems based on your needs.' },
      { icon: 'ph:file-text-fill',    title: 'Subsidy Assistance',     desc: 'We help you apply for central and state government solar subsidies.' },
      { icon: 'ph:trend-up-fill',     title: '90% Bill Reduction',     desc: 'Most customers see electricity bills drop by 70–90% after installation.' },
      { icon: 'ph:shield-check-fill', title: '25-Year Panel Warranty', desc: 'Top-tier panels with 25-year performance warranty and 5-year installation warranty.' },
    ],
    steps: [
      { number: '01', title: 'Free Survey',       desc: 'Our solar expert visits your site for a detailed assessment.' },
      { number: '02', title: 'Proposal & Design', desc: 'Custom proposal with layout, savings estimate, and ROI.' },
      { number: '03', title: 'Installation',      desc: 'Professional installation in 1–3 days with minimal disruption.' },
      { number: '04', title: 'Commissioning',     desc: 'System testing, grid connection, and app setup for monitoring.' },
    ],
    faqs: [
      { q: 'Is my roof suitable for solar?',            a: 'Most roofs are suitable. We assess during the free site survey.' },
      { q: 'How much can I save on electricity bills?', a: 'Typically 70–90% reduction in bills, depending on usage and system size.' },
      { q: 'Is government subsidy available?',          a: 'Yes, under the PM Surya Ghar scheme, up to ₹78,000 subsidy is available.' },
    ],
  },
  {
    slug: 'inverter-maintenance',
    bookingValue: 'Inverter Maintenance',
    title: 'UPS / Inverter Service & Maintenance',
    tagline: 'Keep your power backup running at peak performance',
    heroImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=1200&q=80&auto=format&fit=crop',
    badge: 'Maintenance',
    description:
      'Regular maintenance extends the life of your inverter and battery by years. Our service includes cleaning, topping up distilled water, terminal checks, firmware updates, and a full health report.',
    highlights: [
      { icon: 'ph:clock-fill',        label: 'Service Time',  value: '1–2 Hours' },
      { icon: 'ph:shield-check-fill', label: 'Warranty',      value: '3 Months' },
      { icon: 'ph:star-fill',         label: 'Rating',        value: '4.8 / 5' },
      { icon: 'ph:currency-inr-fill', label: 'Starting From', value: '₹299' },
    ],
    features: [
      { icon: 'ph:magnifying-glass-fill', title: 'Full Health Diagnosis',  desc: 'Complete check of inverter, battery, and wiring for faults and wear.' },
      { icon: 'ph:drop-fill',             title: 'Distilled Water Top-Up', desc: 'Battery water level check and top-up for tubular batteries.' },
      { icon: 'ph:broom-fill',            title: 'Cleaning & Corrosion',   desc: 'Terminal cleaning, anti-corrosion treatment, and dust removal.' },
      { icon: 'ph:activity-fill',         title: 'Performance Testing',    desc: 'Load testing to verify backup time and identify weak cells.' },
      { icon: 'ph:file-text-fill',        title: 'Service Report',         desc: 'Detailed health report with recommendations delivered after every visit.' },
      { icon: 'ph:arrows-clockwise-fill', title: 'Annual AMC Plans',       desc: 'Annual Maintenance Contracts available for worry-free upkeep.' },
    ],
    steps: [
      { number: '01', title: 'Book Visit',      desc: 'Schedule a convenient time for our technician to visit.' },
      { number: '02', title: 'Diagnosis',       desc: 'Full inspection of inverter, battery, and wiring.' },
      { number: '03', title: 'Service',         desc: 'Cleaning, water top-up, terminal treatment, and any minor repairs.' },
      { number: '04', title: 'Report & Advice', desc: 'Receive a health report and recommendations for future care.' },
    ],
    faqs: [
      { q: 'How often should I service my inverter?', a: 'We recommend servicing every 6 months for optimal performance.' },
      { q: 'What is included in the AMC plan?',       a: 'AMC includes 2 scheduled visits per year + free emergency call-outs.' },
      { q: 'Can you service all inverter brands?',    a: 'Yes, we service all brands including Luminous, Microtek, Exide, Su-Kam, and more.' },
    ],
  },
];

export const getServiceBySlug = (slug: string): ServiceDetail | undefined =>
  serviceDetails.find(s => s.slug === slug);