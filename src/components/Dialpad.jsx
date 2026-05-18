import React, { useState } from 'react'
import { Phone, Delete } from 'lucide-react'
import { useLinkus } from '../hooks/useLinkus'

const KEYS = [
  { digit: '1', letters: '' },
  { digit: '2', letters: 'ABC' },
  { digit: '3', letters: 'DEF' },
  { digit: '4', letters: 'GHI' },
  { digit: '5', letters: 'JKL' },
  { digit: '6', letters: 'MNO' },
  { digit: '7', letters: 'PQRS' },
  { digit: '8', letters: 'TUV' },
  { digit: '9', letters: 'WXYZ' },
  { digit: '*', letters: '' },
  { digit: '0', letters: '+' },
  { digit: '#', letters: '' },
]

export function Dialpad() {
  const [number, setNumber] = useState('')
  const { makeCall, sendDTMF, callStatus, registerState } = useLinkus()

  const isInCall = callStatus === 'talking'
  const isDisabled = registerState !== 'registered' && !isInCall

  function handleKeyPress(key) {
    if (isInCall) {
      sendDTMF(key)
    }
    setNumber((prev) => prev + key)
  }

  function handleBackspace() {
    setNumber((prev) => prev.slice(0, -1))
  }

  function handleCall() {
    if (!number.trim()) return
    makeCall(number.trim())
    setNumber('')
  }

  return (
    <div
      className="glass-card p-5 card-interactive"
      style={{ animation: 'slideInUp 0.5s ease-out' }}
    >
      <div className="relative z-10">
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Dialpad</h3>

        {/* Number display */}
        <div className="relative mb-5">
          <input
            type="text"
            value={number}
            onChange={(e) => setNumber(e.target.value.replace(/[^0-9*#+ ]/g, ''))}
            placeholder="Enter number"
            className="w-full bg-brand-dark-deep/80 border border-brand-gold/20 rounded-lg text-white text-2xl tracking-wider text-center py-3.5 pr-10 placeholder:text-gray-700 focus:border-brand-gold/60 focus:ring-2 focus:ring-brand-gold/10 outline-none transition-all duration-300 font-light"
          />
          {number && (
            <button
              onClick={handleBackspace}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-brand-gold transition-colors duration-200 p-1"
            >
              <Delete size={18} />
            </button>
          )}
        </div>

        {/* Key grid */}
        <div className="grid grid-cols-3 gap-2.5 mb-5">
          {KEYS.map(({ digit, letters }) => (
            <button
              key={digit}
              onClick={() => handleKeyPress(digit)}
              disabled={isDisabled}
              className="relative bg-brand-dark-deep/40 border border-white/5 hover:border-brand-gold/30 hover:bg-brand-dark-deep/70 rounded-lg py-3.5 text-center transition-all duration-200 active:scale-[0.93] disabled:opacity-40 disabled:cursor-not-allowed group/key"
            >
              <span className="block text-white text-xl font-medium group-hover/key:text-brand-gold-light transition-colors duration-200">
                {digit}
              </span>
              {letters && (
                <span className="block text-[10px] text-gray-600 tracking-widest mt-0.5 font-medium">
                  {letters}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Call button */}
        <button
          onClick={handleCall}
          disabled={isDisabled || !number.trim()}
          className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white rounded-lg py-3.5 font-semibold flex items-center justify-center gap-2.5 shadow-lg shadow-emerald-500/20 transition-all duration-300 active:scale-[0.97] disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
        >
          <Phone size={18} />
          <span>Call</span>
        </button>
      </div>
    </div>
  )
}
