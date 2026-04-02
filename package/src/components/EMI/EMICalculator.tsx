'use client'
import { useState } from 'react'
import { Icon } from '@iconify/react'

const TENURES = [
  { months: 3,  rate: 0,  badge: 'No Cost' },
  { months: 6,  rate: 0,  badge: 'No Cost' },
  { months: 12, rate: 12 },
  { months: 18, rate: 14 },
  { months: 24, rate: 15 },
]

const BANKS = ['HDFC Bank', 'ICICI Bank', 'SBI Card', 'Axis Bank', 'Kotak Bank', 'Yes Bank']

function calcEMI(principal: number, annualRate: number, months: number) {
  if (annualRate === 0) return { emi: principal / months, total: principal, interest: 0 }
  const r = annualRate / 12 / 100
  const emi = (principal * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1)
  return { emi, total: emi * months, interest: emi * months - principal }
}

function inr(n: number) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n)
}

export default function EMICalculator({ price }: { price: number }) {
  const [open, setOpen]       = useState(false)
  const [tenure, setTenure]   = useState(1)
  const [downPct, setDownPct] = useState(0)

  const down    = Math.round((price * downPct) / 100)
  const loan    = price - down
  const opt     = TENURES[tenure]
  const { emi, total, interest } = calcEMI(loan, opt.rate, opt.months)
  const teaser  = calcEMI(price, 0, 6).emi

  return (
    <div className='w-full rounded-2xl border border-gray-200 overflow-hidden bg-white shadow-sm'>

      {/* Header — always visible */}
      <button
        onClick={() => setOpen(o => !o)}
        className='w-full flex items-center justify-between px-5 py-4 bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 transition-colors'
      >
        <div className='flex items-center gap-3'>
          <div className='bg-primary/10 p-2 rounded-xl'>
            <Icon icon='mdi:calculator-variant' width={22} className='text-primary' />
          </div>
          <div className='text-left'>
            <p className='font-semibold text-dark text-sm'>Easy EMI Available</p>
            <p className='text-xs text-gray-500'>
              Starting <span className='font-bold text-primary'>{inr(teaser)}/mo</span>
              {' '}· No-cost on 3 &amp; 6 months
            </p>
          </div>
        </div>
        <Icon
          icon='mdi:chevron-down' width={20}
          className={`text-gray-400 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Body */}
      <div className={`transition-all duration-300 overflow-hidden ${open ? 'max-h-[900px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className='px-5 py-5 space-y-5'>

          {/* Tenure selector */}
          <div>
            <p className='text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3'>Select Tenure</p>
            <div className='grid grid-cols-5 gap-2'>
              {TENURES.map((t, i) => (
                <button
                  key={i} onClick={() => setTenure(i)}
                  className={`relative flex flex-col items-center py-3 rounded-xl border-2 transition-all ${
                    tenure === i ? 'border-primary bg-primary/5 shadow-sm' : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  {t.badge && (
                    <span className='absolute -top-2.5 left-1/2 -translate-x-1/2 bg-green-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full whitespace-nowrap'>
                      {t.badge}
                    </span>
                  )}
                  <span className={`text-sm font-bold ${tenure === i ? 'text-primary' : 'text-dark'}`}>{t.months}</span>
                  <span className='text-[10px] text-gray-500 mt-0.5'>months</span>
                  <span className={`text-[10px] font-medium mt-1 ${t.rate === 0 ? 'text-green-600' : 'text-gray-400'}`}>
                    {t.rate === 0 ? '0%' : `${t.rate}%`}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Down payment */}
          <div>
            <div className='flex justify-between mb-2'>
              <p className='text-xs font-semibold text-gray-500 uppercase tracking-wider'>Down Payment</p>
              <span className='text-sm font-bold text-dark'>{downPct}% — {inr(down)}</span>
            </div>
            <input
              type='range' min={0} max={50} step={5} value={downPct}
              onChange={e => setDownPct(Number(e.target.value))}
              className='w-full h-2 rounded-full bg-gray-200 accent-primary cursor-pointer appearance-none'
            />
            <div className='flex justify-between text-[10px] text-gray-400 mt-1'>
              <span>₹0</span><span>25%</span><span>50%</span>
            </div>
          </div>

          {/* Result card */}
          <div className='bg-gradient-to-br from-dark to-gray-800 rounded-2xl p-5 text-white'>
            <div className='flex items-end justify-between mb-4'>
              <div>
                <p className='text-xs text-white/50 mb-1'>Monthly EMI</p>
                <p className='text-3xl font-bold tracking-tight'>
                  {inr(emi)}<span className='text-sm font-normal text-white/60 ml-1'>/month</span>
                </p>
              </div>
              <div className='text-right'>
                <p className='text-xs text-white/50 mb-1'>for {opt.months} months</p>
                {opt.rate === 0
                  ? <span className='bg-green-500 text-white text-xs font-bold px-2.5 py-1 rounded-full'>✓ No Cost EMI</span>
                  : <span className='bg-white/10 text-white/70 text-xs px-2.5 py-1 rounded-full'>{opt.rate}% p.a.</span>
                }
              </div>
            </div>
            <div className='grid grid-cols-3 gap-3 border-t border-white/10 pt-4'>
              <div>
                <p className='text-[10px] text-white/40 mb-1'>Loan Amount</p>
                <p className='text-sm font-semibold'>{inr(loan)}</p>
              </div>
              <div>
                <p className='text-[10px] text-white/40 mb-1'>Total Interest</p>
                <p className={`text-sm font-semibold ${interest === 0 ? 'text-green-400' : 'text-orange-300'}`}>
                  {interest === 0 ? '₹0 (Free!)' : inr(interest)}
                </p>
              </div>
              <div>
                <p className='text-[10px] text-white/40 mb-1'>Total Payable</p>
                <p className='text-sm font-semibold'>{inr(total)}</p>
              </div>
            </div>
            {interest > 0 && (
              <div className='mt-4'>
                <div className='flex justify-between text-[10px] text-white/40 mb-1'>
                  <span>Principal {Math.round((loan / total) * 100)}%</span>
                  <span>Interest {Math.round((interest / total) * 100)}%</span>
                </div>
                <div className='h-1.5 rounded-full bg-white/10 overflow-hidden flex'>
                  <div className='h-full bg-primary transition-all duration-500' style={{ width: `${(loan / total) * 100}%` }} />
                  <div className='h-full bg-orange-400 flex-1' />
                </div>
              </div>
            )}
          </div>

          {/* Banks */}
          <div>
            <p className='text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3'>Available on</p>
            <div className='flex flex-wrap gap-2'>
              {BANKS.map(b => (
                <span key={b} className='text-xs bg-gray-100 text-gray-600 px-3 py-1.5 rounded-full font-medium'>{b}</span>
              ))}
            </div>
          </div>

          {/* Info */}
          <div className='flex gap-3 bg-blue-50 border border-blue-100 rounded-xl p-4'>
            <Icon icon='mdi:information-outline' width={18} className='text-blue-500 shrink-0 mt-0.5' />
            <p className='text-xs text-blue-700 leading-relaxed'>
              EMI is processed at checkout via your bank/card. No-cost EMI means 0% interest — the discount is pre-adjusted in the price. Final EMI is subject to bank approval.
            </p>
          </div>

        </div>
      </div>
    </div>
  )
}