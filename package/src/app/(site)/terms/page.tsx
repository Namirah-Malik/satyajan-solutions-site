import { Icon } from '@iconify/react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms & Conditions | Satyajan Energy Solutions Pvt. Ltd.',
  description: 'Terms & Conditions for Satyajan Energy Solutions Pvt. Ltd. - Rules and guidelines for using our website and services.',
};

export default function TermsAndConditions() {
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
            TERMS & CONDITIONS
          </h1>
          <p className='text-xm font-normal tracking-tight text-black/50 leading-6'>
            Please read these terms and conditions carefully before using our website and services.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className='bg-white rounded-2xl border border-black/10 shadow-xl p-6 md:p-10 lg:p-14'>
        <div className='prose max-w-none'>
          <div className='mb-10'>
            <p className='text-xm text-dark/80 mb-4 leading-relaxed'>
              Welcome to Satyajan Energy Solutions Pvt. Ltd. These Terms & Conditions govern your use of our website and services. By accessing and using our website, you agree to be bound by these terms. If you do not agree with any part of these terms, please do not use our website.
            </p>

            <div className='space-y-4'>
              {/* User Responsibilities */}
              <div>
                <h2 className='text-2xl font-bold text-dark mb-4 pb-3 border-b-2 border-primary'>1. User Responsibilities</h2>
                <p className='text-xm text-dark/80 mb-3 leading-relaxed'>As a user of our website, you agree to:</p>
                <ul className='list-none space-y-2 ml-4'>
                  <li className='text-xm text-dark/80 leading-relaxed flex items-start gap-2'>
                    <span className='text-primary mt-1.5'>•</span>
                    <span>Provide accurate, complete, and current information when making a purchase</span>
                  </li>
                  <li className='text-xm text-dark/80 leading-relaxed flex items-start gap-2'>
                    <span className='text-primary mt-1.5'>•</span>
                    <span>Maintain the confidentiality of your account information and password</span>
                  </li>
                  <li className='text-xm text-dark/80 leading-relaxed flex items-start gap-2'>
                    <span className='text-primary mt-1.5'>•</span>
                    <span>Accept full responsibility for all activities under your account</span>
                  </li>
                  <li className='text-xm text-dark/80 leading-relaxed flex items-start gap-2'>
                    <span className='text-primary mt-1.5'>•</span>
                    <span>Not use the website for illegal, fraudulent, or harmful purposes</span>
                  </li>
                </ul>
              </div>

              {/* Product Information & Availability */}
              <div>
                <h2 className='text-2xl font-bold text-dark mb-4 pb-3 border-b-2 border-primary'>2. Product Information & Availability</h2>
                <p className='text-xm text-dark/80 mb-3 leading-relaxed'>Please note:</p>
                <ul className='list-none space-y-2 ml-4'>
                  <li className='text-xm text-dark/80 leading-relaxed flex items-start gap-2'>
                    <span className='text-primary mt-1.5'>•</span>
                    <span>All product descriptions, images, and specifications are provided for informational purposes</span>
                  </li>
                  <li className='text-xm text-dark/80 leading-relaxed flex items-start gap-2'>
                    <span className='text-primary mt-1.5'>•</span>
                    <span>We endeavor to provide accurate information but do not warrant complete accuracy</span>
                  </li>
                  <li className='text-xm text-dark/80 leading-relaxed flex items-start gap-2'>
                    <span className='text-primary mt-1.5'>•</span>
                    <span>Product availability is subject to stock and may change without notice</span>
                  </li>
                  <li className='text-xm text-dark/80 leading-relaxed flex items-start gap-2'>
                    <span className='text-primary mt-1.5'>•</span>
                    <span>We reserve the right to discontinue products or modify specifications at any time</span>
                  </li>
                </ul>
              </div>

              {/* Pricing & Payment */}
              <div>
                <h2 className='text-2xl font-bold text-dark mb-4 pb-3 border-b-2 border-primary'>3. Pricing & Payment</h2>
                <ul className='list-none space-y-2 ml-4'>
                  <li className='text-xm text-dark/80 leading-relaxed flex items-start gap-2'>
                    <span className='text-primary mt-1.5'>•</span>
                    <span>All prices are in Indian Rupees (INR) and include applicable taxes unless stated otherwise</span>
                  </li>
                  <li className='text-xm text-dark/80 leading-relaxed flex items-start gap-2'>
                    <span className='text-primary mt-1.5'>•</span>
                    <span>Prices may change without notice, but changes will not affect orders already placed</span>
                  </li>
                  <li className='text-xm text-dark/80 leading-relaxed flex items-start gap-2'>
                    <span className='text-primary mt-1.5'>•</span>
                    <span>Payment must be received before order processing</span>
                  </li>
                  <li className='text-xm text-dark/80 leading-relaxed flex items-start gap-2'>
                    <span className='text-primary mt-1.5'>•</span>
                    <span>We accept various payment methods as listed on our website</span>
                  </li>
                  <li className='text-xm text-dark/80 leading-relaxed flex items-start gap-2'>
                    <span className='text-primary mt-1.5'>•</span>
                    <span>All payment transactions are encrypted and secure</span>
                  </li>
                </ul>
              </div>

              {/* Order Acceptance & Confirmation */}
              <div>
                <h2 className='text-2xl font-bold text-dark mb-4 pb-3 border-b-2 border-primary'>4. Order Acceptance & Confirmation</h2>
                <p className='text-xm text-dark/80 mb-3 leading-relaxed'>
                  Your order is confirmed only after we send an order confirmation email to your registered email address.
                </p>
                <p className='text-xm text-dark/80 mb-3 leading-relaxed'>We reserve the right to:</p>
                <ul className='list-none space-y-2 ml-4'>
                  <li className='text-xm text-dark/80 leading-relaxed flex items-start gap-2'>
                    <span className='text-primary mt-1.5'>•</span>
                    <span>Refuse or cancel any order if payment fails or we suspect fraudulent activity</span>
                  </li>
                  <li className='text-xm text-dark/80 leading-relaxed flex items-start gap-2'>
                    <span className='text-primary mt-1.5'>•</span>
                    <span>Limit order quantities per customer to prevent hoarding</span>
                  </li>
                  <li className='text-xm text-dark/80 leading-relaxed flex items-start gap-2'>
                    <span className='text-primary mt-1.5'>•</span>
                    <span>Cancel orders if the product becomes unavailable</span>
                  </li>
                </ul>
              </div>

              {/* Shipping & Delivery */}
              <div>
                <h2 className='text-2xl font-bold text-dark mb-4 pb-3 border-b-2 border-primary'>5. Shipping & Delivery</h2>
                <p className='text-xm text-dark/80 mb-3 leading-relaxed'>Shipping details:</p>
                <ul className='list-none space-y-2 ml-4'>
                  <li className='text-xm text-dark/80 leading-relaxed flex items-start gap-2'>
                    <span className='text-primary mt-1.5'>•</span>
                    <span>We ship products within 3–5 business days of order confirmation</span>
                  </li>
                  <li className='text-xm text-dark/80 leading-relaxed flex items-start gap-2'>
                    <span className='text-primary mt-1.5'>•</span>
                    <span>Delivery timelines depend on your location and courier partner</span>
                  </li>
                  <li className='text-xm text-dark/80 leading-relaxed flex items-start gap-2'>
                    <span className='text-primary mt-1.5'>•</span>
                    <span>We are not responsible for delays caused by courier partners or unforeseen circumstances</span>
                  </li>
                  <li className='text-xm text-dark/80 leading-relaxed flex items-start gap-2'>
                    <span className='text-primary mt-1.5'>•</span>
                    <span>Shipping costs are calculated at checkout and are non-refundable</span>
                  </li>
                </ul>
              </div>

              {/* Intellectual Property Rights */}
              <div>
                <h2 className='text-2xl font-bold text-dark mb-4 pb-3 border-b-2 border-primary'>6. Intellectual Property Rights</h2>
                <p className='text-xm text-dark/80 mb-3 leading-relaxed'>
                  All content on our website (images, text, logos, graphics, designs, etc.) is the exclusive property of Satyajan Energy Solutions Pvt. Ltd. and protected by copyright laws.
                </p>
                <p className='text-xm text-dark/80 mb-3 leading-relaxed'>You agree not to:</p>
                <ul className='list-none space-y-2 ml-4'>
                  <li className='text-xm text-dark/80 leading-relaxed flex items-start gap-2'>
                    <span className='text-primary mt-1.5'>•</span>
                    <span>Reproduce, distribute, or transmit any content without written permission</span>
                  </li>
                  <li className='text-xm text-dark/80 leading-relaxed flex items-start gap-2'>
                    <span className='text-primary mt-1.5'>•</span>
                    <span>Remove or alter any copyright, trademark, or proprietary notices</span>
                  </li>
                  <li className='text-xm text-dark/80 leading-relaxed flex items-start gap-2'>
                    <span className='text-primary mt-1.5'>•</span>
                    <span>Use our content for commercial purposes without consent</span>
                  </li>
                </ul>
              </div>

              {/* Limitation of Liability */}
              <div>
                <h2 className='text-2xl font-bold text-dark mb-4 pb-3 border-b-2 border-primary'>7. Limitation of Liability</h2>
                <p className='text-xm text-dark/80 mb-3 leading-relaxed'>
                  To the fullest extent permitted by law, Satyajan Energy Solutions Pvt. Ltd. shall not be liable for:
                </p>
                <ul className='list-none space-y-2 ml-4'>
                  <li className='text-xm text-dark/80 leading-relaxed flex items-start gap-2'>
                    <span className='text-primary mt-1.5'>•</span>
                    <span>Any indirect, incidental, or consequential damages</span>
                  </li>
                  <li className='text-xm text-dark/80 leading-relaxed flex items-start gap-2'>
                    <span className='text-primary mt-1.5'>•</span>
                    <span>Loss of profits or business interruption</span>
                  </li>
                  <li className='text-xm text-dark/80 leading-relaxed flex items-start gap-2'>
                    <span className='text-primary mt-1.5'>•</span>
                    <span>Errors, omissions, or inaccuracies in product information</span>
                  </li>
                  <li className='text-xm text-dark/80 leading-relaxed flex items-start gap-2'>
                    <span className='text-primary mt-1.5'>•</span>
                    <span>Website downtime or technical issues beyond our reasonable control</span>
                  </li>
                </ul>
              </div>

              {/* Dispute Resolution */}
              <div>
                <h2 className='text-2xl font-bold text-dark mb-4 pb-3 border-b-2 border-primary'>8. Dispute Resolution</h2>
                <p className='text-xm text-dark/80 mb-3 leading-relaxed'>
                  Any disputes arising from these terms or your use of our website shall be governed by the laws of India. Both parties agree to attempt to resolve disputes amicably before pursuing legal action.
                </p>
              </div>

              {/* Changes to Terms */}
              <div>
                <h2 className='text-2xl font-bold text-dark mb-4 pb-3 border-b-2 border-primary'>9. Changes to Terms</h2>
                <p className='text-xm text-dark/80 mb-3 leading-relaxed'>
                  We reserve the right to update or modify these Terms & Conditions at any time without prior notice. Your continued use of the website after changes constitutes your acceptance of the new terms.
                </p>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className='bg-primary/10 p-6 rounded-xl border border-primary/20'>
            <h3 className='text-2xl font-semibold text-dark mb-4'>Contact Us</h3>
            <p className='text-xm text-dark/80 mb-4 leading-relaxed'>
              If you have any questions about our Terms & Conditions, please feel free to contact us:
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
