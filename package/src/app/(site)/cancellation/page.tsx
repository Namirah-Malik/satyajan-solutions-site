import { Icon } from '@iconify/react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cancellation & Refund Policy | Satyajan Energy Solutions Pvt. Ltd.',
  description: 'Cancellation & Refund Policy for Satyajan Energy Solutions Pvt. Ltd. - Return eligibility, refund process, and warranty information.',
};

export default function CancellationRefundPolicy() {
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
            CANCELLATION & REFUND POLICY
          </h1>
          <p className='text-xm font-normal tracking-tight text-black/50 leading-6'>
            Fair and transparent policies for returns, refunds, replacements, and cancellations.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className='bg-white rounded-2xl border border-black/10 shadow-xl p-6 md:p-10 lg:p-14'>
        <div className='prose max-w-none'>
          <div className='mb-10'>
            <p className='text-xm text-dark/80 mb-4 leading-relaxed'>
              We want every customer to be fully satisfied with their purchase. Our Cancellation & Refund Policy is designed to be fair, transparent, and aligned with the nature of power-backup products.
            </p>

            <div className='space-y-4'>
              {/* Return Eligibility */}
              <div>
                <h2 className='text-2xl font-bold text-dark mb-4 pb-3 border-b-2 border-primary'>1. Return Eligibility</h2>
                <p className='text-xm text-dark/80 mb-3 leading-relaxed'>A product is eligible for return if:</p>
                <ul className='list-none space-y-2 ml-4'>
                  <li className='text-xm text-dark/80 leading-relaxed flex items-start gap-2'>
                    <span className='text-primary mt-1.5'>•</span>
                    <span>The return request is raised within 7 days of delivery</span>
                  </li>
                  <li className='text-xm text-dark/80 leading-relaxed flex items-start gap-2'>
                    <span className='text-primary mt-1.5'>•</span>
                    <span>The product is unused, uninstalled, and in its original packaging</span>
                  </li>
                  <li className='text-xm text-dark/80 leading-relaxed flex items-start gap-2'>
                    <span className='text-primary mt-1.5'>•</span>
                    <span>All accessories, serial numbers, and documents are intact</span>
                  </li>
                </ul>
              </div>

              {/* Items Not Eligible for Return */}
              <div>
                <h2 className='text-2xl font-bold text-dark mb-4 pb-3 border-b-2 border-primary'>2. Items Not Eligible for Return</h2>
                <p className='text-xm text-dark/80 mb-3 leading-relaxed'>The following products cannot be returned:</p>
                <ul className='list-none space-y-2 ml-4'>
                  <li className='text-xm text-dark/80 leading-relaxed flex items-start gap-2'>
                    <span className='text-primary mt-1.5'>•</span>
                    <span>Batteries once the seal is broken or electrolyte is filled</span>
                  </li>
                  <li className='text-xm text-dark/80 leading-relaxed flex items-start gap-2'>
                    <span className='text-primary mt-1.5'>•</span>
                    <span>Products that have been opened, installed, or used</span>
                  </li>
                  <li className='text-xm text-dark/80 leading-relaxed flex items-start gap-2'>
                    <span className='text-primary mt-1.5'>•</span>
                    <span>Items damaged after delivery due to customer handling</span>
                  </li>
                  <li className='text-xm text-dark/80 leading-relaxed flex items-start gap-2'>
                    <span className='text-primary mt-1.5'>•</span>
                    <span>Products missing their original box, accessories, or invoice</span>
                  </li>
                  <li className='text-xm text-dark/80 leading-relaxed flex items-start gap-2'>
                    <span className='text-primary mt-1.5'>•</span>
                    <span>Items purchased during clearance sales or special price deals</span>
                  </li>
                  <li className='text-xm text-dark/80 leading-relaxed flex items-start gap-2'>
                    <span className='text-primary mt-1.5'>•</span>
                    <span>Physical damage or electrical burn due to installation mistakes</span>
                  </li>
                </ul>
              </div>

              {/* Return Procedure */}
              <div>
                <h2 className='text-2xl font-bold text-dark mb-4 pb-3 border-b-2 border-primary'>3. Return Procedure</h2>
                <ol className='list-decimal list-inside space-y-2 ml-4'>
                  <li className='text-xm text-dark/80 leading-relaxed'>Contact us at <strong>8019179159</strong> with your order number.</li>
                  <li className='text-xm text-dark/80 leading-relaxed'>Provide photos/videos of the product and packaging.</li>
                  <li className='text-xm text-dark/80 leading-relaxed'>After verification, we will approve or reject the request.</li>
                  <li className='text-xm text-dark/80 leading-relaxed'>A reverse pickup will be arranged (where serviceable), or the customer may need to ship the item back.</li>
                  <li className='text-xm text-dark/80 leading-relaxed'>Once we receive the item, it undergoes quality inspection.</li>
                  <li className='text-xm text-dark/80 leading-relaxed'>Refund or replacement is processed based on inspection results.</li>
                </ol>
              </div>

              {/* Refunds */}
              <div>
                <h2 className='text-2xl font-bold text-dark mb-4 pb-3 border-b-2 border-primary'>4. Refunds</h2>
                <p className='text-xm text-dark/80 mb-3 leading-relaxed'>
                  Refunds will be issued after the returned product passes all quality checks.
                </p>
                <p className='text-xm text-dark/80 mb-3 leading-relaxed'>Refunds may be processed to:</p>
                <ul className='list-none space-y-2 ml-4'>
                  <li className='text-xm text-dark/80 leading-relaxed flex items-start gap-2'>
                    <span className='text-primary mt-1.5'>•</span>
                    <span>The original payment method</span>
                  </li>
                  <li className='text-xm text-dark/80 leading-relaxed flex items-start gap-2'>
                    <span className='text-primary mt-1.5'>•</span>
                    <span>The original bank account or UPI ID</span>
                  </li>
                </ul>
                <p className='text-xm text-dark/80 mt-3 leading-relaxed'>
                  <strong>Processing time:</strong> 5–7 working days.
                </p>

                <h3 className='text-xl font-semibold text-dark mb-3 mt-4'>Refund May Include Deductions</h3>
                <p className='text-xm text-dark/80 mb-3 leading-relaxed'>Deductions may apply if:</p>
                <ul className='list-none space-y-2 ml-4'>
                  <li className='text-xm text-dark/80 leading-relaxed flex items-start gap-2'>
                    <span className='text-primary mt-1.5'>•</span>
                    <span>Packaging is damaged</span>
                  </li>
                  <li className='text-xm text-dark/80 leading-relaxed flex items-start gap-2'>
                    <span className='text-primary mt-1.5'>•</span>
                    <span>Accessories are missing</span>
                  </li>
                  <li className='text-xm text-dark/80 leading-relaxed flex items-start gap-2'>
                    <span className='text-primary mt-1.5'>•</span>
                    <span>Product shows signs of use</span>
                  </li>
                </ul>
              </div>

              {/* Replacement Policy */}
              <div>
                <h2 className='text-2xl font-bold text-dark mb-4 pb-3 border-b-2 border-primary'>5. Replacement Policy</h2>
                <p className='text-xm text-dark/80 mb-3 leading-relaxed'>A replacement will be provided if:</p>
                <ul className='list-none space-y-2 ml-4'>
                  <li className='text-xm text-dark/80 leading-relaxed flex items-start gap-2'>
                    <span className='text-primary mt-1.5'>•</span>
                    <span>You received an incorrect product</span>
                  </li>
                  <li className='text-xm text-dark/80 leading-relaxed flex items-start gap-2'>
                    <span className='text-primary mt-1.5'>•</span>
                    <span>The product is defective on arrival</span>
                  </li>
                  <li className='text-xm text-dark/80 leading-relaxed flex items-start gap-2'>
                    <span className='text-primary mt-1.5'>•</span>
                    <span>The damage is reported immediately upon delivery</span>
                  </li>
                  <li className='text-xm text-dark/80 leading-relaxed flex items-start gap-2'>
                    <span className='text-primary mt-1.5'>•</span>
                    <span>Customers must raise a replacement request within 7 days from the date of delivery</span>
                  </li>
                  <li className='text-xm text-dark/80 leading-relaxed flex items-start gap-2'>
                    <span className='text-primary mt-1.5'>•</span>
                    <span>Replacement will be delivered within 5 to 7 business days after request is raised</span>
                  </li>
                </ul>
              </div>

              {/* Warranty Support */}
              <div>
                <h2 className='text-2xl font-bold text-dark mb-4 pb-3 border-b-2 border-primary'>6. Warranty Support</h2>
                <p className='text-xm text-dark/80 mb-3 leading-relaxed'>
                  All batteries, UPS systems, inverters, and solar products are covered under brand warranty.
                </p>
                <p className='text-xm text-dark/80 mb-3 leading-relaxed'>Important notes:</p>
                <ul className='list-none space-y-2 ml-4'>
                  <li className='text-xm text-dark/80 leading-relaxed flex items-start gap-2'>
                    <span className='text-primary mt-1.5'>•</span>
                    <span>Warranty is offered directly by the manufacturer, not Satyajan Energy Solutions Pvt. Ltd. .</span>
                  </li>
                  <li className='text-xm text-dark/80 leading-relaxed flex items-start gap-2'>
                    <span className='text-primary mt-1.5'>•</span>
                    <span>The manufacturer's decision regarding repair or replacement is final.</span>
                  </li>
                  <li className='text-xm text-dark/80 leading-relaxed flex items-start gap-2'>
                    <span className='text-primary mt-1.5'>•</span>
                    <span>Warranty does not cover:</span>
                  </li>
                </ul>
                <ul className='list-none space-y-2 ml-12 mt-2'>
                  <li className='text-xm text-dark/80 leading-relaxed flex items-start gap-2'>
                    <span className='text-primary/60 mt-1.5'>○</span>
                    <span>Damage due to improper installation</span>
                  </li>
                  <li className='text-xm text-dark/80 leading-relaxed flex items-start gap-2'>
                    <span className='text-primary/60 mt-1.5'>○</span>
                    <span>Short circuits, reverse polarity, or voltage fluctuations</span>
                  </li>
                  <li className='text-xm text-dark/80 leading-relaxed flex items-start gap-2'>
                    <span className='text-primary/60 mt-1.5'>○</span>
                    <span>Physical/water damage</span>
                  </li>
                </ul>
                <p className='text-xm text-dark/80 mt-3 leading-relaxed'>
                  We will assist by guiding customers to the nearest authorized service center.
                </p>
              </div>

              {/* Cancellation Policy */}
              <div>
                <h2 className='text-2xl font-bold text-dark mb-4 pb-3 border-b-2 border-primary'>7. Order Cancellation Policy</h2>
                <ul className='list-none space-y-2 ml-4'>
                  <li className='text-xm text-dark/80 leading-relaxed flex items-start gap-2'>
                    <span className='text-primary mt-1.5'>•</span>
                    <span>Orders can be cancelled before dispatch.</span>
                  </li>
                  <li className='text-xm text-dark/80 leading-relaxed flex items-start gap-2'>
                    <span className='text-primary mt-1.5'>•</span>
                    <span>Once shipped, the order cannot be cancelled and will follow the return procedure.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className='bg-primary/10 p-6 rounded-xl border border-primary/20'>
            <h3 className='text-2xl font-semibold text-dark mb-4'>Contact Us</h3>
            <p className='text-xm text-dark/80 mb-4 leading-relaxed'>
              If you have any questions about our cancellation and refund policies, please feel free to contact us:
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
