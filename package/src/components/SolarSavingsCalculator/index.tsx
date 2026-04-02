'use client'

import React, { useState } from 'react';
import { X, Zap, Leaf, DollarSign, Clock } from 'lucide-react';

interface SolarSavingsCalculatorProps {
  isOpen: boolean;
  onClose: () => void;
}

const SolarSavingsCalculator: React.FC<SolarSavingsCalculatorProps> = ({ isOpen, onClose }) => {
  const [monthlyBill, setMonthlyBill] = useState('5000');
  const [systemSize, setSystemSize] = useState('5');
  const [showResults, setShowResults] = useState(false);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [bookingForm, setBookingForm] = useState({
    name: '',
    email: '',
    phone: '',
    service: 'Solar Solutions',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const bill = parseFloat(monthlyBill) || 0;
  const size = parseFloat(systemSize) || 0;

  // Calculation logic
  const annualBill = bill * 12;
  const systemCost = size * 120000; // ₹1,20,000 per kW
  const governmentSubsidy = systemCost * 0.40; // 40% subsidy
  const actualCost = systemCost - governmentSubsidy;
  const annualSavings = annualBill * 0.80; // 80% savings
  const paybackPeriod = actualCost / annualSavings;
  const twentyYearSavings = annualSavings * 20;
  const co2Reduction = size * 5000; // kg per year
  const treesEquivalent = Math.round(size * 50);

  const handleBookNow = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!bookingForm.name || !bookingForm.phone) {
      alert('Please fill name and phone number');
      return;
    }

    // Create WhatsApp message
    const message = `Hi! I want to book a free consultation for ${bookingForm.service}.

Name: ${bookingForm.name}
Email: ${bookingForm.email}
Phone: ${bookingForm.phone}
Service: ${bookingForm.service}
Message: ${bookingForm.message || 'No additional message'}

System Size: ${systemSize}kW
Monthly Bill: ₹${monthlyBill}`;

    // Open WhatsApp with the message
    const whatsappUrl = `https://wa.me/918019179159?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');

    setSubmitted(true);
    setTimeout(() => {
      onClose();
      setSubmitted(false);
      setBookingForm({ name: '', email: '', phone: '', service: 'Solar Solutions', message: '' });
      setShowResults(false);
      setShowBookingForm(false);
      setMonthlyBill('5000');
      setSystemSize('5');
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-teal-600 text-white p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold">Solar Savings Calculator</h2>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white transition"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {submitted ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Message Sent Successfully!</h3>
              <p className="text-gray-600">We've received your inquiry and will contact you shortly via WhatsApp with a customized solar solution.</p>
            </div>
          ) : showBookingForm ? (
            // Booking Form - Exactly as per your requirement
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Book Free Consultation</h2>
              <form onSubmit={handleBookNow} className="space-y-4">
                <div>
                  <input
                    type="text"
                    value={bookingForm.name}
                    onChange={(e) => setBookingForm({ ...bookingForm, name: e.target.value })}
                    placeholder="Your Name"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>

                <div>
                  <input
                    type="email"
                    value={bookingForm.email}
                    onChange={(e) => setBookingForm({ ...bookingForm, email: e.target.value })}
                    placeholder="Your Email"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>

                <div>
                  <input
                    type="tel"
                    value={bookingForm.phone}
                    onChange={(e) => setBookingForm({ ...bookingForm, phone: e.target.value })}
                    placeholder="Your Phone"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>

                <div>
                  <select
                    value={bookingForm.service}
                    onChange={(e) => setBookingForm({ ...bookingForm, service: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
                  >
                    <option>Solar Solutions</option>
                    <option>UPS Systems</option>
                    <option>Batteries</option>
                    <option>Maintenance</option>
                  </select>
                </div>

                <div>
                  <textarea
                    value={bookingForm.message}
                    onChange={(e) => setBookingForm({ ...bookingForm, message: e.target.value })}
                    placeholder="Your Message (Optional)"
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition text-base"
                >
                  Book Consultation
                </button>
              </form>
            </div>
          ) : !showResults ? (
            // Input Form
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Monthly Electricity Bill (₹) *</label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-gray-600 font-semibold">₹</span>
                  <input
                    type="number"
                    value={monthlyBill}
                    onChange={(e) => setMonthlyBill(e.target.value)}
                    placeholder="5000"
                    min="0"
                    className="w-full pl-8 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 text-lg"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Enter your current monthly electricity bill</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Solar System Size (kW) *</label>
                <div className="grid grid-cols-3 gap-3">
                  {[3, 5, 7, 10, 15, 20].map((kw) => (
                    <button
                      key={kw}
                      onClick={() => setSystemSize(kw.toString())}
                      className={`py-2 px-3 rounded-lg font-semibold transition ${
                        systemSize === kw.toString()
                          ? 'bg-blue-600 text-white border-2 border-blue-600'
                          : 'bg-gray-100 text-gray-900 border-2 border-gray-300 hover:border-blue-400'
                      }`}
                    >
                      {kw}kW
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  value={systemSize}
                  onChange={(e) => setSystemSize(e.target.value)}
                  placeholder="Enter custom size"
                  min="0"
                  step="0.5"
                  className="w-full mt-3 px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 text-sm"
                />
              </div>

              <button
                onClick={() => setShowResults(true)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition text-lg"
              >
                Calculate My Savings
              </button>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-900">
                  <strong>💡 Tip:</strong> The calculations are based on average solar efficiency and government subsidies applicable in most Indian states. Actual savings may vary based on your location, roof condition, and power consumption patterns.
                </p>
              </div>
            </div>
          ) : (
            // Results Section
            <div className="space-y-6">
              {/* Financial Savings */}
              <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-xl p-6 border border-green-200">
                <div className="flex items-start gap-3 mb-4">
                  <DollarSign className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">Financial Savings</h3>
                    <p className="text-sm text-gray-600">Based on 80% electricity bill reduction</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Annual Savings</p>
                    <p className="text-2xl font-bold text-green-600">₹{Math.round(annualSavings).toLocaleString('en-IN')}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">System Cost (After 40% Subsidy)</p>
                    <p className="text-2xl font-bold text-blue-600">₹{Math.round(actualCost).toLocaleString('en-IN')}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Payback Period</p>
                    <p className="text-2xl font-bold text-orange-600">{paybackPeriod.toFixed(1)} Years</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">20-Year Savings</p>
                    <p className="text-2xl font-bold text-emerald-600">₹{Math.round(twentyYearSavings).toLocaleString('en-IN')}</p>
                  </div>
                </div>
              </div>

              {/* Environmental Impact */}
              <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl p-6 border border-emerald-200">
                <div className="flex items-start gap-3 mb-4">
                  <Leaf className="w-6 h-6 text-emerald-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">Environmental Impact</h3>
                    <p className="text-sm text-gray-600">Annual reduction in carbon footprint</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">CO₂ Reduction/Year</p>
                    <p className="text-2xl font-bold text-emerald-600">{Math.round(co2Reduction).toLocaleString('en-IN')} kg</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Trees Equivalent</p>
                    <p className="text-2xl font-bold text-green-600">{treesEquivalent} Trees</p>
                  </div>
                </div>
              </div>

              {/* Payback Summary */}
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-amber-900 mb-1">Your Solar System Will Pay for Itself in {paybackPeriod.toFixed(1)} Years</p>
                    <p className="text-sm text-amber-800">After this period, you'll enjoy 25+ years of nearly free electricity!</p>
                  </div>
                </div>
              </div>

              {/* Book Button */}
              <button
                onClick={() => setShowBookingForm(true)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition text-lg"
              >
                Book Consultation to Get Started
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SolarSavingsCalculator;
