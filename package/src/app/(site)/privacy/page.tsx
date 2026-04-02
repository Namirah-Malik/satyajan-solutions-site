import { Icon } from '@iconify/react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | Satyajan Energy Solutions Pvt. Ltd.',
  description: 'Privacy Policy for Satyajan Energy Solutions Pvt. Ltd. - How we collect, use, and protect your personal information.',
};

export default function PrivacyPolicy() {
  return (
    <div className='container max-w-8xl mx-auto px-5 2xl:px-0 pt-32 md:pt-44 pb-14 md:pb-28'>
      {/* Header */}
      <div className='mb-16'>
        <div className='flex gap-2.5 items-center justify-center mb-3'>
          <span>
            <Icon
              icon={'ph:shield-check-fill'}
              width={20}
              height={20}
              className='text-primary'
            />
          </span>
          <p className='text-base font-semibold text-badge'>
            Legal Information
          </p>
        </div>
        <div className='text-center'>
          <h1 className='text-4xl sm:text-52 font-medium tracking-tighter text-black mb-3 leading-10 sm:leading-14'>
            PRIVACY POLICY
          </h1>
          <p className='text-xm font-normal tracking-tight text-black/50 leading-6'>
            How Satyajan Energy Solutions Pvt. Ltd. collects, uses, and protects your personal information.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className='bg-white rounded-2xl border border-black/10 shadow-xl p-6 md:p-10 lg:p-14'>
        <div className='prose max-w-none'>
          <div className='mb-10'>
            <p className='text-xm text-dark/80 mb-4 leading-relaxed'>
              At Satyajan Energy Solutions Pvt. Ltd. , we value your trust. This Privacy Policy explains how we collect, use, store, and protect your personal information when you visit our website or make a purchase.
            </p>

            <div className='space-y-4'>
              {/* Information We Collect */}
              <div>
                <h2 className='text-2xl font-bold text-dark mb-4 pb-3 border-b-2 border-primary'>1. Information We Collect</h2>
                
                <h3 className='text-xl font-semibold text-dark mb-3 mt-4'>Personal Information</h3>
                <p className='text-xm text-dark/80 mb-3 leading-relaxed'>
                  Collected when you create an account, place an order, or contact us:
                </p>
                <ul className='list-none space-y-2 ml-4'>
                  <li className='text-xm text-dark/80 leading-relaxed flex items-start gap-2'>
                    <span className='text-primary mt-1.5'>•</span>
                    <span>Name</span>
                  </li>
                  <li className='text-xm text-dark/80 leading-relaxed flex items-start gap-2'>
                    <span className='text-primary mt-1.5'>•</span>
                    <span>Email address</span>
                  </li>
                  <li className='text-xm text-dark/80 leading-relaxed flex items-start gap-2'>
                    <span className='text-primary mt-1.5'>•</span>
                    <span>Phone number</span>
                  </li>
                  <li className='text-xm text-dark/80 leading-relaxed flex items-start gap-2'>
                    <span className='text-primary mt-1.5'>•</span>
                    <span>Billing & shipping address</span>
                  </li>
                </ul>

                <h3 className='text-xl font-semibold text-dark mb-3 mt-4'>Payment Information</h3>
                <ul className='list-none space-y-2 ml-4'>
                  <li className='text-xm text-dark/80 leading-relaxed flex items-start gap-2'>
                    <span className='text-primary mt-1.5'>•</span>
                    <span>We do NOT store any card or bank details.</span>
                  </li>
                  <li className='text-xm text-dark/80 leading-relaxed flex items-start gap-2'>
                    <span className='text-primary mt-1.5'>•</span>
                    <span>Payments are processed securely through third-party payment gateways.</span>
                  </li>
                </ul>

                <h3 className='text-xl font-semibold text-dark mb-3 mt-4'>Website Usage Data</h3>
                <p className='text-xm text-dark/80 mb-3 leading-relaxed'>We collect:</p>
                <ul className='list-none space-y-2 ml-4'>
                  <li className='text-xm text-dark/80 leading-relaxed flex items-start gap-2'>
                    <span className='text-primary mt-1.5'>•</span>
                    <span>IP Address</span>
                  </li>
                  <li className='text-xm text-dark/80 leading-relaxed flex items-start gap-2'>
                    <span className='text-primary mt-1.5'>•</span>
                    <span>Browser type</span>
                  </li>
                  <li className='text-xm text-dark/80 leading-relaxed flex items-start gap-2'>
                    <span className='text-primary mt-1.5'>•</span>
                    <span>Device information</span>
                  </li>
                  <li className='text-xm text-dark/80 leading-relaxed flex items-start gap-2'>
                    <span className='text-primary mt-1.5'>•</span>
                    <span>Pages visited</span>
                  </li>
                  <li className='text-xm text-dark/80 leading-relaxed flex items-start gap-2'>
                    <span className='text-primary mt-1.5'>•</span>
                    <span>Cookie and analytics data</span>
                  </li>
                </ul>
                <p className='text-xm text-dark/80 mt-3 leading-relaxed'>
                  This helps us improve website performance and user experience.
                </p>
              </div>

              {/* How We Use Your Information */}
              <div>
                <h2 className='text-2xl font-bold text-dark mb-4 pb-3 border-b-2 border-primary'>2. How We Use Your Information</h2>
                <p className='text-xm text-dark/80 mb-3 leading-relaxed'>Your information is used for:</p>
                <ul className='list-none space-y-2 ml-4'>
                  <li className='text-xm text-dark/80 leading-relaxed flex items-start gap-2'>
                    <span className='text-primary mt-1.5'>•</span>
                    <span>Processing and delivering your order</span>
                  </li>
                  <li className='text-xm text-dark/80 leading-relaxed flex items-start gap-2'>
                    <span className='text-primary mt-1.5'>•</span>
                    <span>Providing customer support and warranty assistance</span>
                  </li>
                  <li className='text-xm text-dark/80 leading-relaxed flex items-start gap-2'>
                    <span className='text-primary mt-1.5'>•</span>
                    <span>Sending order updates, offers, and important notifications</span>
                  </li>
                  <li className='text-xm text-dark/80 leading-relaxed flex items-start gap-2'>
                    <span className='text-primary mt-1.5'>•</span>
                    <span>Enhancing website performance and security</span>
                  </li>
                  <li className='text-xm text-dark/80 leading-relaxed flex items-start gap-2'>
                    <span className='text-primary mt-1.5'>•</span>
                    <span>Preventing fraud and unauthorized activities</span>
                  </li>
                </ul>
                <p className='text-xm text-dark/80 mt-3 leading-relaxed'>
                  We do not sell or rent your personal information to any external party.
                </p>
              </div>

              {/* Sharing of Information */}
              <div>
                <h2 className='text-2xl font-bold text-dark mb-4 pb-3 border-b-2 border-primary'>3. Sharing of Information</h2>
                <p className='text-xm text-dark/80 mb-3 leading-relaxed'>Your information may be shared only with:</p>
                <ul className='list-none space-y-2 ml-4'>
                  <li className='text-xm text-dark/80 leading-relaxed flex items-start gap-2'>
                    <span className='text-primary mt-1.5'>•</span>
                    <span>Courier partners (for delivery)</span>
                  </li>
                  <li className='text-xm text-dark/80 leading-relaxed flex items-start gap-2'>
                    <span className='text-primary mt-1.5'>•</span>
                    <span>Manufacturers or service centers (for warranty claims)</span>
                  </li>
                  <li className='text-xm text-dark/80 leading-relaxed flex items-start gap-2'>
                    <span className='text-primary mt-1.5'>•</span>
                    <span>Payment gateway providers (for secure transactions)</span>
                  </li>
                  <li className='text-xm text-dark/80 leading-relaxed flex items-start gap-2'>
                    <span className='text-primary mt-1.5'>•</span>
                    <span>Legal authorities if required by law</span>
                  </li>
                </ul>
                <p className='text-xm text-dark/80 mt-3 leading-relaxed'>
                  All partners are required to follow strict confidentiality protocols.
                </p>
              </div>

              {/* Data Storage & Protection */}
              <div>
                <h2 className='text-2xl font-bold text-dark mb-4 pb-3 border-b-2 border-primary'>4. Data Storage & Protection</h2>
                <p className='text-xm text-dark/80 mb-3 leading-relaxed'>
                  We use secure servers, encrypted connections, and industry-standard security practices to safeguard your data against unauthorized access, loss, or misuse.
                </p>
                <p className='text-xm text-dark/80 leading-relaxed'>
                  Only authorized staff members have access to customer information.
                </p>
              </div>

              {/* Cookies & Tracking */}
              <div>
                <h2 className='text-2xl font-bold text-dark mb-4 pb-3 border-b-2 border-primary'>5. Cookies & Tracking</h2>
                <p className='text-xm text-dark/80 mb-3 leading-relaxed'>We use cookies to:</p>
                <ul className='list-none space-y-2 ml-4'>
                  <li className='text-xm text-dark/80 leading-relaxed flex items-start gap-2'>
                    <span className='text-primary mt-1.5'>•</span>
                    <span>Improve loading speed</span>
                  </li>
                  <li className='text-xm text-dark/80 leading-relaxed flex items-start gap-2'>
                    <span className='text-primary mt-1.5'>•</span>
                    <span>Remember your preferences</span>
                  </li>
                  <li className='text-xm text-dark/80 leading-relaxed flex items-start gap-2'>
                    <span className='text-primary mt-1.5'>•</span>
                    <span>Analyze website performance</span>
                  </li>
                </ul>
                <p className='text-xm text-dark/80 mt-3 leading-relaxed'>
                  You can disable cookies, but some features may not function properly.
                </p>
              </div>

              {/* Changes to This Policy */}
              <div>
                <h2 className='text-2xl font-bold text-dark mb-4 pb-3 border-b-2 border-primary'>6. Changes to This Policy</h2>
                <p className='text-xm text-dark/80 leading-relaxed'>
                  This Privacy Policy may be updated from time to time. All updates will be posted on this page.
                </p>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className='bg-primary/10 p-6 rounded-xl border border-primary/20'>
            <h3 className='text-2xl font-semibold text-dark mb-4'>Contact Us</h3>
            <p className='text-xm text-dark/80 mb-4 leading-relaxed'>
              If you have any questions about our privacy practices, please feel free to contact us:
            </p>
            <div className='space-y-2'>
              <p className='text-xm text-dark/80 leading-relaxed'>
                <strong>Phone:</strong> <a href="tel:+918019179159" className='text-primary hover:underline'>+91 8019179159</a>
              </p>
              <p className='text-xm text-dark/80 leading-relaxed'>
                <strong>Email:</strong> <a href="mailto:info@satyajan.com" className='text-primary hover:underline'>info@satyajan.com</a>
              </p>
              <p className='text-xm text-dark/80 leading-relaxed'>
                <strong>Location:</strong> Hyderabad, India
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
