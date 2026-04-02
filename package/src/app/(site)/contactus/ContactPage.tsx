'use client';

import { Icon } from '@iconify/react'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

// ── Success Popup ─────────────────────────────────────────────────────────────
const SuccessPopup = ({ onClose }: { onClose: () => void }) => (
  <>
    <div className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm" onClick={onClose} />
    <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md px-4">
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-emerald-500 to-green-400 p-8 text-center">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Icon icon="ph:check-circle-fill" className="text-emerald-500 text-5xl" />
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">Query Submitted!</h2>
          <p className="text-white/80 mt-1 text-sm">We've received your message</p>
        </div>
        <div className="p-8 text-center">
          <p className="text-gray-700 text-base font-medium leading-relaxed mb-6">
            Thank you! Your query has been successfully submitted.<br />
            Our team will get back to you within{' '}
            <span className="text-primary font-bold">24 hours</span>.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="tel:+918019179159"
              className="flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-full font-semibold hover:bg-dark transition-colors shadow-md"
            >
              <Icon icon="ph:phone-fill" width={18} />
              Call Us Now
            </a>
            <button
              onClick={onClose}
              className="px-6 py-3 border-2 border-gray-200 text-gray-600 rounded-full font-semibold hover:border-primary hover:text-primary transition-colors"
            >
              Close
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-4">Mon–Sat, 9 AM – 7 PM · +91 8019179159</p>
        </div>
      </div>
    </div>
  </>
)

// ── Validation helpers ────────────────────────────────────────────────────────
function validatePhone(phone: string) {
  const digits = phone.replace(/\D/g, '')
  if (!digits) return 'Phone number is required'
  if (digits.length !== 10) return 'Enter a valid 10-digit mobile number'
  if (!/^[6-9]/.test(digits)) return 'Enter a valid Indian mobile number'
  return ''
}

function validateEmail(email: string) {
  if (!email) return 'Email address is required'
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
  if (!emailRegex.test(email)) return 'Enter a valid email address (e.g. name@example.com)'
  return ''
}

function validateName(name: string) {
  if (!name.trim()) return 'Name is required'
  if (name.trim().length < 2) return 'Name must be at least 2 characters'
  return ''
}

function validateMessage(msg: string) {
  if (!msg.trim()) return 'Message is required'
  if (msg.trim().length < 10) return 'Message must be at least 10 characters'
  return ''
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function ContactUs() {
  const [form, setForm] = useState({ username: '', mobile: '', email: '', message: '' })
  const [errors, setErrors] = useState({ username: '', mobile: '', email: '', message: '' })
  const [touched, setTouched] = useState({ username: false, mobile: false, email: false, message: false })
  const [submitting, setSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target

    // For phone: only allow digits and limit to 10
    if (name === 'mobile') {
      const digitsOnly = value.replace(/\D/g, '').slice(0, 10)
      setForm({ ...form, mobile: digitsOnly })
      if (touched.mobile) setErrors({ ...errors, mobile: validatePhone(digitsOnly) })
      return
    }

    setForm({ ...form, [name]: value })

    // Live validation after first touch
    if (touched[name as keyof typeof touched]) {
      const fieldErrors = { ...errors }
      if (name === 'username') fieldErrors.username = validateName(value)
      if (name === 'email') fieldErrors.email = validateEmail(value)
      if (name === 'message') fieldErrors.message = validateMessage(value)
      setErrors(fieldErrors)
    }
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setTouched({ ...touched, [name]: true })
    const fieldErrors = { ...errors }
    if (name === 'username') fieldErrors.username = validateName(value)
    if (name === 'mobile') fieldErrors.mobile = validatePhone(value)
    if (name === 'email') fieldErrors.email = validateEmail(value)
    if (name === 'message') fieldErrors.message = validateMessage(value)
    setErrors(fieldErrors)
  }

  const validateAll = () => {
    const newErrors = {
      username: validateName(form.username),
      mobile: validatePhone(form.mobile),
      email: validateEmail(form.email),
      message: validateMessage(form.message),
    }
    setErrors(newErrors)
    setTouched({ username: true, mobile: true, email: true, message: true })
    return !Object.values(newErrors).some(Boolean)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateAll()) return // stop if any errors

    setSubmitting(true)
    try {
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
    } catch (_) {
      // Show success regardless — don't block UX if API is unavailable
    } finally {
      setSubmitting(false)
      setForm({ username: '', mobile: '', email: '', message: '' })
      setErrors({ username: '', mobile: '', email: '', message: '' })
      setTouched({ username: false, mobile: false, email: false, message: false })
      setShowSuccess(true)
    }
  }

  const inputClass = (field: keyof typeof errors) =>
    `px-6 py-3.5 border rounded-full outline-none focus:ring-2 w-full transition-all ${
      errors[field] && touched[field]
        ? 'border-red-400 focus:ring-red-200 bg-red-50'
        : 'border-black/10 focus:ring-primary/30 focus:border-primary'
    }`

  return (
    <>
      {showSuccess && <SuccessPopup onClose={() => setShowSuccess(false)} />}

      <div className='container max-w-8xl mx-auto px-5 2xl:px-0 pt-32 md:pt-44 pb-14 md:pb-28'>
        <div className='mb-16'>
          <div className='flex gap-2.5 items-center justify-center mb-3'>
            <Icon icon='ph:house-simple-fill' width={20} height={20} className='text-primary' />
            <p className='text-base font-semibold text-badge'>Contact us</p>
          </div>
          <div className='text-center'>
            <h3 className='text-4xl sm:text-52 font-medium tracking-tighter text-black mb-3 leading-10 sm:leading-14'>
              Have questions? ready to help!
            </h3>
            <p className='text-xm font-normal tracking-tight text-black/50 leading-6'>
              Have questions about solar? Our experts are here to help—reach out for advice and solutions.
            </p>
          </div>
        </div>

        <div className='border border-black/10 rounded-2xl p-4 shadow-xl'>
          <div className='flex flex-col lg:flex-row lg:items-center gap-12'>

            {/* Left image */}
            <div className='relative w-fit'>
              <Image src='/images/contactUs/contactUs.jpg' alt='contact' width={497} height={535} className='rounded-2xl brightness-50 h-full' unoptimized />
              <div className='absolute top-6 left-6 lg:top-12 lg:left-12 flex flex-col gap-2'>
                <h5 className='text-xl xs:text-2xl mobile:text-3xl font-medium tracking-tight text-white'>Contact information</h5>
                <p className='text-sm xs:text-base mobile:text-xm font-normal text-white/80'>Ready to find your dream home or sell your property? We're here to help!</p>
              </div>
              <div className='absolute bottom-6 left-6 lg:bottom-12 lg:left-12 flex flex-col gap-4 text-white'>
                <Link href='https://wa.me/918019179159' className='w-fit'>
                  <div className='flex items-center gap-4 group w-fit'>
                    <Icon icon='ph:phone' width={32} height={32} />
                    <p className='text-sm xs:text-base mobile:text-xm font-normal group-hover:text-primary'>+91 8019179159</p>
                  </div>
                </Link>
                <Link href='mailto:info@satyajan.com' className='w-fit'>
                  <div className='flex items-center gap-4 group w-fit'>
                    <Icon icon='ph:envelope-simple' width={32} height={32} />
                    <p className='text-sm xs:text-base mobile:text-xm font-normal group-hover:text-primary'>info@satyajan.com</p>
                  </div>
                </Link>
                <div className='flex items-center gap-4'>
                  <Icon icon='ph:map-pin' width={32} height={32} />
                  <p className='text-sm xs:text-base mobile:text-xm font-normal'>Hyderabad, India</p>
                </div>
              </div>
            </div>

            {/* Right: form */}
            <div className='flex-1'>
              <form onSubmit={handleSubmit} noValidate>
                <div className='flex flex-col gap-6'>

                  {/* Name + Phone row */}
                  <div className='flex flex-col lg:flex-row gap-6'>
                    <div className='w-full'>
                      <input
                        type='text' name='username' value={form.username}
                        onChange={handleChange} onBlur={handleBlur}
                        autoComplete='name' placeholder='Name*'
                        className={inputClass('username')}
                      />
                      {errors.username && touched.username && (
                        <p className='text-red-500 text-xs mt-1.5 ml-4 flex items-center gap-1'>
                          <Icon icon='ph:warning-circle-fill' width={13} /> {errors.username}
                        </p>
                      )}
                    </div>
                    <div className='w-full'>
                      <div className={`flex items-center border rounded-full overflow-hidden transition-all ${
                        errors.mobile && touched.mobile
                          ? 'border-red-400 bg-red-50 focus-within:ring-2 focus-within:ring-red-200'
                          : 'border-black/10 focus-within:ring-2 focus-within:ring-primary/30 focus-within:border-primary'
                      }`}>
                        <span className='pl-5 pr-2 text-gray-500 font-medium text-sm whitespace-nowrap'>+91</span>
                        <div className='w-px h-5 bg-gray-300' />
                        <input
                          type='tel' name='mobile' value={form.mobile}
                          onChange={handleChange} onBlur={handleBlur}
                          autoComplete='tel' placeholder='10-digit mobile number*'
                          maxLength={10} inputMode='numeric'
                          className='flex-1 px-4 py-3.5 outline-none bg-transparent text-sm'
                        />
                      </div>
                      {errors.mobile && touched.mobile && (
                        <p className='text-red-500 text-xs mt-1.5 ml-4 flex items-center gap-1'>
                          <Icon icon='ph:warning-circle-fill' width={13} /> {errors.mobile}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <input
                      type='email' name='email' value={form.email}
                      onChange={handleChange} onBlur={handleBlur}
                      autoComplete='email' placeholder='Email address*'
                      className={inputClass('email')}
                    />
                    {errors.email && touched.email && (
                      <p className='text-red-500 text-xs mt-1.5 ml-4 flex items-center gap-1'>
                        <Icon icon='ph:warning-circle-fill' width={13} /> {errors.email}
                      </p>
                    )}
                  </div>

                  {/* Message */}
                  <div>
                    <textarea
                      rows={8} name='message' value={form.message}
                      onChange={handleChange} onBlur={handleBlur}
                      placeholder='Write your message here*'
                      className={`px-6 py-3.5 border rounded-2xl outline-none focus:ring-2 w-full transition-all ${
                        errors.message && touched.message
                          ? 'border-red-400 focus:ring-red-200 bg-red-50'
                          : 'border-black/10 focus:ring-primary/30 focus:border-primary'
                      }`}
                    />
                    {errors.message && touched.message && (
                      <p className='text-red-500 text-xs mt-1.5 ml-4 flex items-center gap-1'>
                        <Icon icon='ph:warning-circle-fill' width={13} /> {errors.message}
                      </p>
                    )}
                  </div>

                  <button
                    type='submit'
                    disabled={submitting}
                    className='px-8 py-4 rounded-full bg-primary text-white text-base font-semibold w-full mobile:w-fit hover:bg-dark duration-300 disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2'
                  >
                    {submitting
                      ? <><Icon icon="svg-spinners:3-dots-fade" width={20} />Sending...</>
                      : <><Icon icon="ph:paper-plane-tilt-fill" width={20} />Send message</>
                    }
                  </button>
                </div>
              </form>
            </div>

          </div>
        </div>
      </div>
    </>
  )
}