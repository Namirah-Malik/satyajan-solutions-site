'use client'
import { Icon } from '@iconify/react'

export const TENURES = [
  { months: 3,  rate: 0,  label: '3 mo' },
  { months: 6,  rate: 0,  label: '6 mo' },
  { months: 12, rate: 12, label: '12 mo' },
  { months: 18, rate: 14, label: '18 mo' },
  { months: 24, rate: 15, label: '24 mo' },
]

export function calcEMI(principal: number, annualRate: number, months: number) {
  if (annualRate === 0) return { emi: principal / months, interest: 0, total: principal }
  const r = annualRate / 12 / 100
  const emi = (principal * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1)
  return { emi, interest: emi * months - principal, total: emi * months }
}

function inr(n: number) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n)
}

interface Props {
  cartTotal: number
  selected: number
  onSelect: (i: number) => void
}

export default function CartEMISummary({ cartTotal, selected, onSelect }: Props) {
  const t = TENURES[selected]
  const { emi, interest, total } = calcEMI(cartTotal, t.rate, t.months)

  return (
    <div className='rounded-2xl border border-gray-200 bg-white overflow-hidden'>

      {/* Header */}
      <div className='px-5 py-4 bg-gradient-to-r from-green-50 to-emerald-50 border-b border-gray-100 flex items-center gap-3'>
        <div className='bg-primary/10 p-2 rounded-xl'>
          <Icon icon='mdi:credit-card-outline' width={20} className='text-primary' />
        </div>
        <div>
          <p className='font-semibold text-dark text-sm'>Pay in Easy EMIs</p>
          <p className='text-xs text-gray-500'>No-cost EMI available · Choose your tenure</p>
        </div>
      </div>

      <div className='p-5 space-y-4'>

        {/* Tenure tabs */}
        <div className='grid grid-cols-5 gap-1 bg-gray-100 p-1 rounded-xl'>
          {TENURES.map((tenure, i) => (
            <button
              key={i} onClick={() => onSelect(i)}
              className={`relative py-2 rounded-lg text-xs font-semibold transition-all ${
                selected === i ? 'bg-white text-dark shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tenure.label}
              {tenure.rate === 0 && (
                <span className='absolute -top-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-green-500 rounded-full' />
              )}
            </button>
          ))}
        </div>

        {/* Breakdown table */}
        <div className='rounded-xl overflow-hidden border border-gray-100'>
          <table className='w-full text-sm'>
            <tbody>
              {[
                { label: 'Cart Total',    value: inr(cartTotal) },
                { label: 'Tenure',        value: `${t.months} months` },
                {
                  label: 'Interest Rate',
                  value: t.rate === 0
                    ? <span className='text-green-600 font-semibold'>0% (No Cost EMI)</span>
                    : <span className='text-dark font-semibold'>{t.rate}% p.a.</span>
                },
                {
                  label: 'Total Interest',
                  value: interest === 0
                    ? <span className='text-green-600 font-semibold'>₹0</span>
                    : <span className='text-orange-500 font-semibold'>{inr(interest)}</span>
                },
                { label: 'Total Payable', value: inr(total) },
              ].map((row, i) => (
                <tr key={i} className='border-b border-gray-100'>
                  <td className='px-4 py-3 text-gray-500'>{row.label}</td>
                  <td className='px-4 py-3 text-right font-semibold text-dark'>{row.value}</td>
                </tr>
              ))}
              <tr className='bg-dark'>
                <td className='px-4 py-4 text-white font-semibold'>Monthly EMI</td>
                <td className='px-4 py-4 text-right'>
                  <span className='text-2xl font-bold text-primary'>{inr(emi)}</span>
                  <span className='text-white/60 text-xs ml-1'>/month</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className='flex items-center gap-2 text-xs text-gray-500'>
          <span className='w-2 h-2 bg-green-500 rounded-full' />
          No-cost EMI on 3 &amp; 6 month plans (0% interest)
        </div>
        <p className='text-[11px] text-gray-400 leading-relaxed'>
          * EMI is subject to bank approval. Actual EMI may vary slightly. No-cost EMI discount is pre-adjusted in the product price.
        </p>
      </div>
    </div>
  )
}