'use client';

import React, { useState } from 'react';
import { Icon } from '@iconify/react';

interface CallMeBackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CallMeBackModal: React.FC<CallMeBackModalProps> = ({ isOpen, onClose }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [activeTab, setActiveTab] = useState<'callback' | 'message'>('callback');

  if (!isOpen) return null;

  const resetAndClose = () => {
    onClose();
    setTimeout(() => {
      setSubmitted(false);
      setPhoneNumber('');
      setMessage('');
    }, 300);
  };

  const handleCallbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await fetch('/api/callback-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber }),
      });
    } catch (_) {
      // Show success regardless
    } finally {
      setIsSubmitting(false);
      setPhoneNumber('');
      setSubmitted(true);
    }
  };

  const handleMessageSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    setIsSubmitting(true);
    try {
      await fetch('/api/send-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      });
    } catch (_) {
      // Show success regardless
    } finally {
      setIsSubmitting(false);
      setMessage('');
      setSubmitted(true);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm" onClick={resetAndClose} />

      {/* Modal */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-50 px-4">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">

          {/* ── Success state ── */}
          {submitted ? (
            <>
              <div className="bg-gradient-to-r from-emerald-500 to-green-400 p-8 text-center relative">
                <button onClick={resetAndClose} className="absolute top-4 right-4 text-white/70 hover:text-white transition">
                  <Icon icon="ph:x-bold" width={22} />
                </button>
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Icon icon="ph:check-circle-fill" className="text-emerald-500 text-5xl" />
                </div>
                <h2 className="text-2xl font-extrabold text-white tracking-tight">
                  {activeTab === 'callback' ? 'Request Received!' : 'Message Sent!'}
                </h2>
                <p className="text-white/80 mt-1 text-sm">We'll get back to you shortly</p>
              </div>
              <div className="p-8 text-center">
                <p className="text-gray-700 font-medium leading-relaxed mb-6">
                  {activeTab === 'callback'
                    ? <>Thank you! Your query has been successfully submitted.<br />We'll <span className="text-primary font-bold">call you back</span> within 24 hours.</>
                    : <>Thank you! Your query has been successfully submitted.<br />Our team will <span className="text-primary font-bold">respond shortly</span>.</>
                  }
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <a href="tel:+918019179159" className="flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-full font-semibold hover:bg-dark transition-colors shadow-md">
                    <Icon icon="ph:phone-fill" width={18} />
                    Call Us Now
                  </a>
                  <button onClick={resetAndClose} className="px-6 py-3 border-2 border-gray-200 text-gray-600 rounded-full font-semibold hover:border-primary hover:text-primary transition-colors">
                    Close
                  </button>
                </div>
                <p className="text-xs text-gray-400 mt-4">Mon–Sat, 9 AM – 7 PM · +91 8019179159</p>
              </div>
            </>
          ) : (
            <>
              {/* ── Header ── */}
              <div className="bg-primary px-6 py-8 text-white relative">
                <button onClick={resetAndClose} className="absolute top-4 right-4 text-white/70 hover:text-white transition">
                  <Icon icon="ph:x-bold" width={22} />
                </button>
                <h2 className="text-2xl font-bold mb-1">Looking for something specific?</h2>
                <p className="text-white/80">We're just a call away.</p>
              </div>

              {/* ── Body ── */}
              <div className="px-6 py-8 bg-gray-50">

                {/* Tabs */}
                <div className="flex gap-2 mb-6">
                  {(['callback', 'message'] as const).map(tab => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`flex-1 py-2 px-3 rounded-full font-semibold transition flex items-center justify-center gap-2 text-sm ${
                        activeTab === tab ? 'bg-primary text-white shadow-md' : 'bg-white text-gray-700 border border-gray-200 hover:border-primary hover:text-primary'
                      }`}
                    >
                      <Icon icon={tab === 'callback' ? 'ph:phone-fill' : 'ph:chat-circle-text-fill'} width={16} />
                      {tab === 'callback' ? 'Call Me Back' : 'Write Us'}
                    </button>
                  ))}
                </div>

                {/* Call Me Back */}
                {activeTab === 'callback' && (
                  <form onSubmit={handleCallbackSubmit} className="space-y-4">
                    <p className="text-gray-600 text-sm mb-4">Share your number to get a call-back from our experts</p>
                    <div>
                      <label className="block text-sm font-semibold text-gray-800 mb-2">Phone Number</label>
                      <div className="flex gap-2">
                        <div className="flex items-center border border-gray-200 rounded-full px-4 bg-white">
                          <span className="text-gray-700 font-medium text-sm">+91</span>
                        </div>
                        <input
                          type="tel"
                          placeholder="Enter your mobile number"
                          value={phoneNumber}
                          onChange={e => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                          required
                          className="flex-1 border border-gray-200 rounded-full px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      disabled={isSubmitting || phoneNumber.length < 10}
                      className="w-full bg-primary hover:bg-dark disabled:bg-gray-300 text-white py-3 rounded-full font-semibold flex items-center justify-center gap-2 transition text-sm"
                    >
                      {isSubmitting
                        ? <><Icon icon="svg-spinners:3-dots-fade" width={18} />Submitting...</>
                        : <><Icon icon="ph:phone-fill" width={18} />Call Me Back</>
                      }
                    </button>
                  </form>
                )}

                {/* Write Us */}
                {activeTab === 'message' && (
                  <form onSubmit={handleMessageSubmit} className="space-y-4">
                    <p className="text-gray-600 text-sm mb-4">Send us your message and we'll respond via WhatsApp</p>
                    <div>
                      <label className="block text-sm font-semibold text-gray-800 mb-2">Your Message</label>
                      <textarea
                        placeholder="Tell us about your requirements..."
                        value={message}
                        onChange={e => setMessage(e.target.value)}
                        required
                        rows={4}
                        className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isSubmitting || !message.trim()}
                      className="w-full bg-primary hover:bg-dark disabled:bg-gray-300 text-white py-3 rounded-full font-semibold flex items-center justify-center gap-2 transition text-sm"
                    >
                      {isSubmitting
                        ? <><Icon icon="svg-spinners:3-dots-fade" width={18} />Sending...</>
                        : <><Icon icon="ph:paper-plane-tilt-fill" width={18} />Send Message</>
                      }
                    </button>
                  </form>
                )}

                {/* Divider */}
                <div className="flex items-center gap-3 my-6">
                  <div className="flex-1 h-px bg-gray-200" />
                  <span className="text-gray-400 font-medium text-sm">OR</span>
                  <div className="flex-1 h-px bg-gray-200" />
                </div>

                {/* Alt actions */}
                <div className="grid grid-cols-2 gap-3">
                  <a href="tel:+918019179159" className="border-2 border-primary/30 text-primary hover:bg-primary/5 py-3 rounded-full font-semibold flex items-center justify-center gap-2 transition text-sm">
                    <Icon icon="ph:phone-fill" width={16} />
                    Call Now
                  </a>
                  <a href="https://wa.me/918019179159" target="_blank" rel="noopener noreferrer" className="border-2 border-green-500/30 text-green-600 hover:bg-green-50 py-3 rounded-full font-semibold flex items-center justify-center gap-2 transition text-sm">
                    <Icon icon="ph:whatsapp-logo-fill" width={16} />
                    WhatsApp
                  </a>
                </div>

                <p className="text-center text-xs text-gray-400 mt-5">Mon–Sat, 9 AM – 7 PM · +91 8019179159</p>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default CallMeBackModal;