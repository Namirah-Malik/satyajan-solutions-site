import Link from "next/link";
import Image from "next/image";
import { Icon } from "@iconify/react";

const FooterLinks = [
  { label: 'Home',               href: '/' },
  { label: 'Products',           href: '/products' },
  { label: 'Services',           href: '/services' },
  { label: 'Technology',         href: '/technology' },
  { label: 'Blogs',              href: '/blogs' },
  { label: 'Careers',            href: '/careers' },
  { label: 'Contact Us',         href: '/contactus' },
  { label: 'Terms & Conditions', href: '/terms' },
];

const ProductLinks = [
  { label: 'Solar Solutions',     href: '/products?category=Solar' },
  { label: 'Inverter / Home UPS', href: '/products?category=Inverter' },
  { label: 'Jumbo UPS',           href: '/products?category=High+Capacity+UPS' },
  { label: 'Online UPS',          href: '/products?category=ONLINE+UPS' },
  { label: 'Tubular Battery',     href: '/products?category=Battery' },
  { label: 'Lithium Batteries',   href: '/products?category=New+Lithium+Battery' },
  { label: 'Combos',              href: '/products?category=Combos' },
];

const ServiceLinks = [
  { label: 'Solar Energy',                    href: '/services#solar-energy' },
  { label: 'Power Backup & UPS',              href: '/services#power-backup-ups' },
  { label: 'Battery Services',                href: '/services#battery-services' },
  { label: 'Technical Support & After-Sales', href: '/services#technical-support' },
];

const Footer = () => {
  return (
    <footer
      id="site-footer"
      className="relative z-0 bg-dark text-white"
    >
      {/* subtle top accent line */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

      <div className="site-container py-16 md:py-20">

        {/* Top — Brand + Links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 md:gap-12">

          {/* Brand block */}
          <div className="lg:col-span-4">
            <Link href="/" className="inline-flex items-center gap-3 group">
              <Image
                src="/images/header/satyajan-logo.png"
                alt="Satyajan Energy Solutions Logo"
                width={48}
                height={48}
                unoptimized
                className="rounded-md"
              />
              <span className="leading-tight">
                <span className="block text-white text-lg font-bold tracking-tight">Satyajan</span>
                <span className="block text-primary text-xs font-medium tracking-wide">Energy Solutions</span>
              </span>
            </Link>

            <p className="mt-5 text-white/65 text-sm leading-relaxed max-w-sm">
              Your trusted partner for solar solutions, power backup systems, and battery management across India.
            </p>

            <div className="mt-5 inline-flex items-center gap-2 text-xs text-white/55">
              <Icon icon="ph:certificate-fill" className="text-primary shrink-0" width={14} />
              <span>
                GST: <span className="text-white/80 font-medium tracking-wide">36ABGCS0416A1ZX</span>
              </span>
            </div>

            {/* Social */}
            <div className="mt-7 flex items-center gap-2.5 flex-wrap">
              {[
                { href: "https://www.amazon.in/l/27943762031?me=A3VPQJV1FYL5BP&ref_=ssf_share", icon: "fa7-brands:amazon", title: "Amazon" },
                { href: "https://www.instagram.com/satyajan.solutions/", icon: "fa7-brands:instagram", title: "Instagram" },
                { href: "https://www.linkedin.com/company/satyajan-energy-solutions-pvt-ltd/", icon: "fa7-brands:linkedin", title: "LinkedIn" },
                { href: "https://www.facebook.com/profile.php?id=61577768371371&sk=followers", icon: "fa7-brands:square-facebook", title: "Facebook" },
                { href: "https://share.google/UqkYvc7zrN2PjQBi8", icon: "fa7-brands:google", title: "Google" },
              ].map((s) => (
                <Link
                  key={s.title}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={s.title}
                  className="w-9 h-9 inline-flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-white/70 hover:bg-primary hover:border-primary hover:text-white transition-all"
                >
                  <Icon icon={s.icon} width={16} />
                </Link>
              ))}

              <Link
                href="https://www.indiamart.com/satyajanenergysolutions/profile.html"
                target="_blank"
                rel="noopener noreferrer"
                title="IndiaMART"
                className="w-9 h-9 inline-flex items-center justify-center rounded-full bg-white/5 border border-white/10 hover:border-orange-300 transition-all overflow-hidden"
              >
                <Image
                  src="/images/social/indiamart.png"
                  alt="IndiaMART"
                  width={20}
                  height={20}
                  unoptimized
                  className="object-contain"
                />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2">
            <h4 className="text-white text-sm font-semibold tracking-wide uppercase mb-5">Explore</h4>
            <ul className="space-y-2.5">
              {FooterLinks.map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="text-white/60 hover:text-primary text-sm transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Products */}
          <div className="lg:col-span-3">
            <h4 className="text-white text-sm font-semibold tracking-wide uppercase mb-5">Our Products</h4>
            <ul className="space-y-2.5">
              {ProductLinks.map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="text-white/60 hover:text-primary text-sm transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services + Contact */}
          <div className="lg:col-span-3">
            <h4 className="text-white text-sm font-semibold tracking-wide uppercase mb-5">Services</h4>
            <ul className="space-y-2.5 mb-8">
              {ServiceLinks.map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="text-white/60 hover:text-primary text-sm transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>

            <h4 className="text-white text-sm font-semibold tracking-wide uppercase mb-4">Get in touch</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2.5">
                <Icon icon="ph:phone-fill" className="text-primary mt-0.5 shrink-0" width={16} />
                <Link href="tel:+918019179159" className="text-white/70 hover:text-white transition-colors">
                  +91 8019179159
                </Link>
              </li>
              <li className="flex items-start gap-2.5">
                <Icon icon="ph:envelope-fill" className="text-primary mt-0.5 shrink-0" width={16} />
                <Link href="mailto:info@satyajan.com" className="text-white/70 hover:text-white transition-colors break-all">
                  info@satyajan.com
                </Link>
              </li>
              <li className="flex items-start gap-2.5">
                <Icon icon="ph:map-pin-fill" className="text-primary mt-0.5 shrink-0" width={16} />
                <span className="text-white/70">
                  Hyderabad, Telangana, India
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 mt-14 pt-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <p className="text-white/45 text-xs md:text-sm text-center md:text-left">
              © {new Date().getFullYear()} Satyajan Energy Solutions Pvt Ltd. All rights reserved.
            </p>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 justify-center">
              <Link href="/terms"        className="text-white/55 hover:text-white text-xs md:text-sm transition-colors">Terms of Service</Link>
              <Link href="/privacy"      className="text-white/55 hover:text-white text-xs md:text-sm transition-colors">Privacy Policy</Link>
              <Link href="/cancellation" className="text-white/55 hover:text-white text-xs md:text-sm transition-colors">Cancellation & Refund</Link>
              <Link href="/contactus"    className="text-white/55 hover:text-white text-xs md:text-sm transition-colors">Contact</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
