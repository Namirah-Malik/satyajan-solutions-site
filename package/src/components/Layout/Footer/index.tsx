import Link from "next/link";
import Image from "next/image";
import { Icon } from "@iconify/react"

const FooterLinks = [
  { label: 'Home',               href: '/' },
  { label: 'Products',           href: '/products' },
  { label: 'Services',           href: '/services' },
  { label: 'Technology',         href: '/technology' },
  { label: 'Blogs',              href: '/blogs' },
  { label: 'Careers',            href: '/careers' },
  { label: 'Contact Us',         href: '/contactus' },
  { label: 'Terms & Conditions', href: '/terms' },
]

const ProductLinks = [
  { label: 'Solar Solutions',     href: '/products?category=Solar' },
  { label: 'Inverter / Home UPS', href: '/products?category=Inverter' },
  { label: 'Jumbo UPS',           href: '/products?category=High+Capacity+UPS' },
  { label: 'Online UPS',          href: '/products?category=ONLINE+UPS' },
  { label: 'Tubular Battery',     href: '/products?category=Battery' },
  { label: 'Lithium Batteries',   href: '/products?category=New+Lithium+Battery' },
  { label: 'Combos',              href: '/products?category=Combos' },
]

const ServiceLinks = [
  { label: 'Solar Energy',                    href: '/services#solar-energy' },
  { label: 'Power Backup & UPS',              href: '/services#power-backup-ups' },
  { label: 'Battery Services',                href: '/services#battery-services' },
  { label: 'Technical Support & After-Sales', href: '/services#technical-support' },
]

const Footer = () => {
  return (
    <footer id="site-footer" className="relative z-0 bg-gradient-to-b from-slate-900 to-slate-800">
      <div className="container mx-auto max-w-8xl px-4 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 md:gap-8">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Image
                src="/images/header/satyajan-logo.png"
                alt="Satyajan Energy Solutions Logo"
                width={56}
                height={56}
                unoptimized={true}
              />
              <h3 className="text-white text-lg font-bold leading-tight">
                Satyajan<br />
                <span className="text-primary text-sm font-medium">Energy Solutions</span>
              </h3>
            </div>
            <p className="text-white/70 text-sm leading-relaxed">
              Your trusted partner for solar solutions, power backup systems, and battery management across India.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {FooterLinks.map((item, index) => (
                <li key={index}>
                  <Link href={item.href} className="text-white/60 hover:text-white text-sm transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Our Products */}
          <div>
            <h4 className="text-white text-lg font-semibold mb-4">Our Products</h4>
            <ul className="space-y-2">
              {ProductLinks.map((item, index) => (
                <li key={index}>
                  <Link href={item.href} className="text-white/60 hover:text-white text-sm transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Our Services */}
          <div>
            <h4 className="text-white text-lg font-semibold mb-4">Our Services</h4>
            <ul className="space-y-2">
              {ServiceLinks.map((item, index) => (
                <li key={index}>
                  <Link href={item.href} className="text-white/60 hover:text-white text-sm transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white text-lg font-semibold mb-4">Contact Us</h4>
            <div className="space-y-3">

              <div className="flex items-start gap-2">
                <Icon icon="fa-solid:phone" className="text-primary mt-0.5 shrink-0" width={14} />
                <Link href="tel:+918019179159" className="text-white/60 hover:text-white text-sm transition-colors">
                  +91 8019179159
                </Link>
              </div>

              <div className="flex items-start gap-2">
                <Icon icon="fa-solid:envelope" className="text-primary mt-0.5 shrink-0" width={14} />
                <Link href="mailto:info@satyajan.com" className="text-white/60 hover:text-white text-sm transition-colors">
                  info@satyajan.com
                </Link>
              </div>

              <div className="flex items-start gap-2">
                <Icon icon="fa-solid:map-marker-alt" className="text-primary mt-0.5 shrink-0" width={14} />
                <span className="text-white/60 text-sm">
                  Hyderabad, Telangana, India
                </span>
              </div>

              {/* Social icons */}
              <div className="flex items-center gap-3 pt-2 flex-wrap">

                {/* Amazon */}
                <Link
                  href="https://www.amazon.in/l/27943762031?me=A3VPQJV1FYL5BP&ref_=ssf_share"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Amazon Seller"
                >
                  <Icon icon="fa7-brands:amazon" width={22} height={22} className="text-white/60 hover:text-primary transition-colors" />
                </Link>

                {/* Instagram */}
                <Link href="https://www.instagram.com/satyajan.solutions/" target="_blank">
                  <Icon icon="fa7-brands:instagram" width={22} height={22} className="text-white/60 hover:text-primary transition-colors" />
                </Link>

                {/* LinkedIn */}
                <Link href="https://www.linkedin.com/company/satyajan-energy-solutions-pvt-ltd/" target="_blank">
                  <Icon icon="fa7-brands:linkedin" width={22} height={22} className="text-white/60 hover:text-primary transition-colors" />
                </Link>

                {/* Facebook */}
                <Link href="https://www.facebook.com/profile.php?id=61577768371371&sk=followers" target="_blank">
                  <Icon icon="fa7-brands:square-facebook" width={22} height={22} className="text-white/60 hover:text-primary transition-colors" />
                </Link>

                {/* IndiaMART */}
                <Link
                  href="https://www.indiamart.com/satyajanenergysolutions/profile.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="opacity-60 hover:opacity-100 transition-opacity flex items-center justify-center"
                >
                  <Image
                    src="/images/social/indiamart.png"
                    alt="IndiaMART"
                    width={22}
                    height={22}
                    unoptimized
                    className="rounded-sm object-contain"
                  />
                </Link>

                {/* Google */}
                <Link href="https://share.google/UqkYvc7zrN2PjQBi8" target="_blank" rel="noopener noreferrer">
                  <Icon icon="fa7-brands:google" width={22} height={22} className="text-white/60 hover:text-primary transition-colors" />
                </Link>

              </div>

            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 mt-10 pt-6">
          <div className="flex flex-col md:flex-row items-center md:justify-between gap-3 md:gap-4">
            <p className="text-white/40 text-xs md:text-sm text-center md:text-left">
              © 2025 Satyajan Energy Solutions Pvt Ltd. All rights reserved.
            </p>
            <div className="flex flex-wrap items-center gap-3 md:gap-6 justify-center">
              <Link href="/terms"        className="text-white/60 hover:text-white text-xs md:text-sm transition-colors">Terms of Service</Link>
              <Link href="/privacy"      className="text-white/60 hover:text-white text-xs md:text-sm transition-colors">Privacy Policy</Link>
              <Link href="/cancellation" className="text-white/60 hover:text-white text-xs md:text-sm transition-colors">Cancellation & Refund</Link>
              <Link href="/contactus"    className="text-white/60 hover:text-white text-xs md:text-sm transition-colors">Contact Us</Link>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;