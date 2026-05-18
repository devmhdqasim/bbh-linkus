import React from 'react'
import { PhoneIncoming, PhoneOff, User } from 'lucide-react'
import { useLinkus } from '../hooks/useLinkus'

export function IncomingCallModal() {
  const { incomingSession, remoteParty, answer, decline } = useLinkus()

  if (!incomingSession) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xl flex items-center justify-center animate-fade-in">
      <div className="relative rounded-3xl p-8 md:p-10 shadow-2xl shadow-black/50 bg-brand-dark-card border border-white/[0.06] overflow-hidden max-w-xs w-full mx-4">
        {/* Ambient glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full bg-brand-gold/8 blur-3xl" />

        <div className="relative z-10 flex flex-col items-center text-center">
          {/* Avatar with pulse */}
          <div className="relative mb-6">
            <div className="absolute inset-[-10px] rounded-full border-2 border-brand-gold/20 animate-pulse-ring" />
            <div className="absolute inset-[-20px] rounded-full border border-brand-gold/10 animate-pulse-ring-slow" />
            <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-brand-dark-surface to-brand-dark-deep border border-white/[0.1] flex items-center justify-center">
              <User size={26} className="text-brand-gold/60" />
            </div>
          </div>

          <p className="text-brand-gold text-[11px] uppercase tracking-[0.15em] font-semibold mb-2">
            Incoming Call
          </p>

          <h2 className="text-xl font-semibold text-white mb-0.5 tracking-tight">
            {remoteParty.name || 'Unknown Caller'}
          </h2>
          <p className="text-gray-500 text-sm font-mono mb-8">
            {remoteParty.number || '—'}
          </p>

          {/* Actions */}
          <div className="flex items-center gap-10">
            <div className="flex flex-col items-center gap-1.5">
              <button
                onClick={answer}
                className="bg-emerald-500 hover:bg-emerald-400 w-14 h-14 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-500/30 transition-all duration-200 active:scale-[0.9] hover:scale-105"
              >
                <PhoneIncoming size={22} className="text-white" />
              </button>
              <span className="text-[11px] text-gray-500">Accept</span>
            </div>

            <div className="flex flex-col items-center gap-1.5">
              <button
                onClick={decline}
                className="bg-red-500 hover:bg-red-400 w-14 h-14 rounded-lg flex items-center justify-center shadow-lg shadow-red-500/30 transition-all duration-200 active:scale-[0.9] hover:scale-105"
              >
                <PhoneOff size={22} className="text-white" />
              </button>
              <span className="text-[11px] text-gray-500">Decline</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
