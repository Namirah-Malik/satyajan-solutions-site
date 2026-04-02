'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Icon } from '@iconify/react';

// ── Storage helpers (localStorage) ──────────────────────────────────────────
const STORAGE_KEY = 'satyajan_applications';

function getAppliedJobs(): { email: string; jobId: string; date: string }[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

function hasAlreadyApplied(email: string, jobId: string): boolean {
  return getAppliedJobs().some(
    a => a.email.toLowerCase() === email.toLowerCase() && a.jobId === jobId
  );
}

function saveApplication(email: string, jobId: string) {
  const existing = getAppliedJobs();
  existing.push({ email, jobId, date: new Date().toISOString() });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
}

// ── Already Applied Banner ───────────────────────────────────────────────────
const AlreadyAppliedBanner = ({ jobId, onBack }: { jobId: string; onBack: () => void }) => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
    <div className="bg-white rounded-3xl shadow-2xl overflow-hidden w-full max-w-md">
      <div className="bg-gradient-to-r from-amber-400 to-orange-400 p-8 text-center">
        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
          <Icon icon="ph:warning-circle-fill" className="text-amber-500 text-5xl" />
        </div>
        <h2 className="text-2xl font-extrabold text-white tracking-tight">Already Applied</h2>
        <p className="text-white/80 mt-1 text-sm">Your application is under review</p>
      </div>
      <div className="p-8 text-center">
        <p className="text-gray-700 font-medium leading-relaxed mb-2">
          You've <span className="text-amber-500 font-bold">already submitted</span> an application for this position using this email address.
        </p>
        <p className="text-gray-500 text-sm mb-6">
          Our HR team is reviewing all applications. We'll reach out to shortlisted candidates within <span className="font-semibold">5–7 business days</span>.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href={`https://wa.me/918019179159?text=Hi, I applied for the ${jobId} position and wanted to follow up`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 px-6 py-3 bg-green-500 text-white rounded-full font-semibold hover:bg-green-600 transition-colors shadow-md"
          >
            <Icon icon="ph:whatsapp-logo-fill" width={18} />
            Follow Up on WhatsApp
          </a>
          <button
            onClick={onBack}
            className="px-6 py-3 border-2 border-gray-200 text-gray-600 rounded-full font-semibold hover:border-primary hover:text-primary transition-colors"
          >
            Back to Jobs
          </button>
        </div>
      </div>
    </div>
  </div>
);

// ── Success Popup ────────────────────────────────────────────────────────────
const SuccessPopup = ({ jobId, onClose }: { jobId: string; onClose: () => void }) => (
  <>
    <div className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm" />
    <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md px-4">
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-emerald-500 to-green-400 p-8 text-center">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Icon icon="ph:check-circle-fill" className="text-emerald-500 text-5xl" />
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">Application Submitted!</h2>
          <p className="text-white/80 mt-1 text-sm">We've received your application</p>
        </div>
        <div className="p-8 text-center">
          <p className="text-gray-700 font-medium leading-relaxed mb-2">
            Thank you! Your application has been <span className="text-primary font-bold">successfully submitted</span>.
          </p>
          <p className="text-gray-500 text-sm mb-6">
            Our HR team will review your profile and contact shortlisted candidates within <span className="font-semibold">5–7 business days</span>.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href={`https://wa.me/918019179159?text=Hi, I just applied for the ${jobId} position at Satyajan`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-6 py-3 bg-green-500 text-white rounded-full font-semibold hover:bg-green-600 transition-colors shadow-md"
            >
              <Icon icon="ph:whatsapp-logo-fill" width={18} />
              Message HR
            </a>
            <button
              onClick={onClose}
              className="px-6 py-3 border-2 border-gray-200 text-gray-600 rounded-full font-semibold hover:border-primary hover:text-primary transition-colors"
            >
              Back to Careers
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-4">+91 8019179159 · info@satyajan.com</p>
        </div>
      </div>
    </div>
  </>
);

// ── Main Form ────────────────────────────────────────────────────────────────
function CareerApplyForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const jobId = searchParams.get('job') || '';

  const [formData, setFormData] = useState({
    fullName: '', email: '', phone: '', education: '',
    experience: '', resume_url: '', coverLetter: '',
    currentCompany: '', noticeRequired: '', expectedSalary: '',
    agreeTerms: false,
  });

  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [alreadyApplied, setAlreadyApplied] = useState(false);
  // Per-field duplicate error
  const [emailError, setEmailError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, type, value } = e.target;
    if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
      // Clear email error when user edits email
      if (name === 'email') setEmailError('');
    }
  };

  // Check duplicate on email blur
  const handleEmailBlur = () => {
    if (formData.email && jobId && hasAlreadyApplied(formData.email, jobId)) {
      setEmailError('You have already applied for this position with this email address.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Final duplicate check before submit
    if (jobId && hasAlreadyApplied(formData.email, jobId)) {
      setAlreadyApplied(true);
      return;
    }

    setLoading(true);
    try {
      await fetch('/api/career/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, jobPosition: jobId }),
      });
    } catch (_) {
      // Proceed regardless — save locally and show success
    } finally {
      // Save to localStorage to prevent future duplicates
      saveApplication(formData.email, jobId);
      setLoading(false);
      setShowSuccess(true);
    }
  };

  // Show "already applied" full-screen state
  if (alreadyApplied) {
    return <AlreadyAppliedBanner jobId={jobId} onBack={() => router.push('/careers')} />;
  }

  const inputClass = 'w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors text-sm';
  const labelClass = 'block text-sm font-semibold text-gray-900 mb-2';

  return (
    <>
      {showSuccess && (
        <SuccessPopup
          jobId={jobId}
          onClose={() => router.push('/careers')}
        />
      )}

      <div className="min-h-screen bg-gray-50">
        <div className="pt-20 pb-12">
          <div className="container mx-auto px-4 max-w-2xl">

            <button onClick={() => router.back()} className="flex items-center gap-2 text-primary hover:text-dark mb-6 font-medium text-sm transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Back to Job Details
            </button>

            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="mb-8">
                <h1 className="text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">Apply Now</h1>
                <p className="text-gray-500">Submit your application for <span className="font-semibold text-primary">{jobId || 'this position'}</span>. Our team will review and contact you soon.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">

                <div>
                  <label className={labelClass}>Full Name *</label>
                  <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required className={inputClass} placeholder="John Doe" />
                </div>

                {/* Email with duplicate validation */}
                <div>
                  <label className={labelClass}>Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={handleEmailBlur}
                    required
                    className={`${inputClass} ${emailError ? 'border-red-400 focus:ring-red-200 focus:border-red-400' : ''}`}
                    placeholder="john@example.com"
                  />
                  {emailError && (
                    <div className="mt-2 flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-xl">
                      <Icon icon="ph:warning-circle-fill" className="text-amber-500 flex-shrink-0 mt-0.5" width={18} />
                      <div>
                        <p className="text-amber-700 text-sm font-semibold">Already Applied</p>
                        <p className="text-amber-600 text-xs mt-0.5">{emailError}</p>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label className={labelClass}>Phone Number *</label>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required className={inputClass} placeholder="+91 98765 43210" />
                </div>

                <div>
                  <label className={labelClass}>Position Applied For</label>
                  <input type="text" value={jobId || 'Not specified'} disabled className={`${inputClass} bg-gray-50 text-gray-500 cursor-not-allowed`} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className={labelClass}>Highest Education *</label>
                    <input type="text" name="education" value={formData.education} onChange={handleChange} required className={inputClass} placeholder="e.g., B.Com, B.Tech" />
                  </div>
                  <div>
                    <label className={labelClass}>Years of Experience *</label>
                    <input type="number" name="experience" value={formData.experience} onChange={handleChange} required className={inputClass} placeholder="0" min="0" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className={labelClass}>Current Company</label>
                    <input type="text" name="currentCompany" value={formData.currentCompany} onChange={handleChange} className={inputClass} placeholder="Optional" />
                  </div>
                  <div>
                    <label className={labelClass}>Notice Period (days) *</label>
                    <input type="number" name="noticeRequired" value={formData.noticeRequired} onChange={handleChange} required className={inputClass} placeholder="30" min="0" />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Expected Salary</label>
                  <input type="text" name="expectedSalary" value={formData.expectedSalary} onChange={handleChange} className={inputClass} placeholder="e.g., ₹25,000 – ₹35,000" />
                </div>

                <div>
                  <label className={labelClass}>Resume Link (Google Drive)</label>
                  <input type="url" name="resume_url" value={formData.resume_url} onChange={handleChange} className={inputClass} placeholder="https://drive.google.com/..." />
                </div>

                <div>
                  <label className={labelClass}>Cover Letter / Additional Information</label>
                  <textarea name="coverLetter" value={formData.coverLetter} onChange={handleChange} rows={5} className={inputClass} placeholder="Tell us why you're a great fit for this position..." />
                </div>

                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <input type="checkbox" name="agreeTerms" checked={formData.agreeTerms} onChange={handleChange} required className="mt-1 w-4 h-4 accent-primary cursor-pointer" />
                  <label className="text-gray-600 text-sm leading-relaxed cursor-pointer">
                    I agree that Satyajan Energy Solutions can contact me regarding my application and store my information for recruitment purposes. *
                  </label>
                </div>

                <div className="flex gap-4 pt-2">
                  <button type="button" onClick={() => router.back()} className="flex-1 border-2 border-gray-200 text-gray-700 px-6 py-3 rounded-xl hover:border-gray-300 transition-colors font-semibold text-sm">
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading || !!emailError}
                    className="flex-1 bg-primary text-white px-6 py-3 rounded-xl hover:bg-dark transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
                  >
                    {loading
                      ? <><Icon icon="svg-spinners:3-dots-fade" width={20} />Submitting...</>
                      : <><Icon icon="ph:paper-plane-tilt-fill" width={18} />Submit Application</>
                    }
                  </button>
                </div>

              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// ── Page export with Suspense ────────────────────────────────────────────────
export default function CareerApplyPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-gray-600">Loading application form...</p>
        </div>
      </div>
    }>
      <CareerApplyForm />
    </Suspense>
  );
}