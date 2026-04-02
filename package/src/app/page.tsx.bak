"use client"

import React, { useState, useEffect } from 'react'
import { ArrowRight, CheckCircle, Star, Phone, Mail, MapPin, Send, Download, MessageCircle, X, Calculator } from 'lucide-react'
import * as LucideIcons from 'lucide-react'
import { companyInfo, products, benefits, testimonials, faqs, dealerBenefits } from '@/mock/data'
import CallMeBackModal from '@/components/CallMeBackModal'
import { useScrollTimer } from '@/hooks/useScrollTimer'

export default function HomePageClient() {
  const [showWelcomePopup, setShowWelcomePopup] = useState(false)
  const [contactForm, setContactForm] = useState({ name: '', email: '', phone: '', message: '' })
  const [dealerForm, setDealerForm] = useState({ name: '', email: '', phone: '', businessName: '', location: '', experience: '' })
  const { showModal, closeModal } = useScrollTimer(60000) // 60 seconds

  useEffect(() => {
    const t = setTimeout(() => setShowWelcomePopup(true), 800)
    return () => clearTimeout(t)
  }, [])
