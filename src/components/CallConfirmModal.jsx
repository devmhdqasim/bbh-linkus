import React from 'react'
import { Phone, X, WifiOff, PhoneOff } from 'lucide-react'

function getInitials(name) {
  if (!name) return null
  const parts = name.trim().split(/\s+/)
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  return parts[0][0].toUpperCase()
}

export function CallConfirmModal({ name, number, onConfirm, onClose }) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center animate-fade-in">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div
        className="relative w-full max-w-sm mx-4 rounded-2xl bg-brand-dark-card border border-white/[0.10] shadow-2xl shadow-black/60 overflow-hidden"
        style={{ animation: 'slideInUp 0.25s ease-out' }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-7 h-7 rounded-lg bg-white/[0.06] flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/[0.10] transition-all duration-200 z-10"
        >
          <X size={14} />
        </button>

        {/* Content */}
        <div className="px-6 pt-8 pb-6 flex flex-col items-center text-center">
          {/* Avatar */}
          <div className="relative mb-5">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 border-2 border-emerald-500/20 flex items-center justify-center">
              {getInitials(name) ? (
                <span className="text-xl font-bold text-emerald-400">{getInitials(name)}</span>
              ) : (
                <Phone size={24} className="text-emerald-400" />
              )}
            </div>
            <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-emerald-500/20 border-2 border-brand-dark-card flex items-center justify-center">
              <Phone size={12} className="text-emerald-400" />
            </div>
          </div>

          {/* Info */}
          <p className="text-[11px] text-gray-500 uppercase tracking-wider font-semibold mb-2">
            Outgoing Call
          </p>
          <h3 className="text-lg font-semibold text-white mb-1">
            {name || number}
          </h3>
          {name && (
            <p className="text-sm text-gray-400 font-mono">{number}</p>
          )}
          <p className="text-[12px] text-gray-600 mt-3">
            Are you sure you want to call this number?
          </p>
        </div>

        {/* Actions */}
        <div className="px-6 pb-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 rounded-xl bg-white/[0.05] text-gray-300 text-sm font-medium hover:bg-white/[0.08] transition-all duration-200 active:scale-[0.97]"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-3 rounded-xl bg-emerald-500 text-white text-sm font-semibold hover:bg-emerald-400 transition-all duration-200 active:scale-[0.97] shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2"
          >
            <Phone size={14} />
            Call Now
          </button>
        </div>
      </div>
    </div>
  )
}

export function CallErrorModal({ onClose, errorType }) {
  const isNotRegistered = errorType === 'not-registered'

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center animate-fade-in">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div
        className="relative w-full max-w-sm mx-4 rounded-2xl bg-brand-dark-card border border-white/[0.10] shadow-2xl shadow-black/60 overflow-hidden"
        style={{ animation: 'slideInUp 0.25s ease-out' }}
      >
        {/* Content */}
        <div className="px-6 pt-8 pb-6 flex flex-col items-center text-center">
          {/* Error icon */}
          <div className="relative mb-5">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-red-500/20 to-red-500/5 border-2 border-red-500/20 flex items-center justify-center">
              {isNotRegistered ? (
                <WifiOff size={24} className="text-red-400" />
              ) : (
                <PhoneOff size={24} className="text-red-400" />
              )}
            </div>
            <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-red-500/20 border-2 border-brand-dark-card flex items-center justify-center">
              <X size={12} className="text-red-400" />
            </div>
          </div>

          {/* Info */}
          <p className="text-[11px] text-red-400/80 uppercase tracking-wider font-semibold mb-2">
            {isNotRegistered ? 'Not Connected' : 'Call Failed'}
          </p>
          <h3 className="text-lg font-semibold text-white mb-2">
            {isNotRegistered ? 'Unable to Place Call' : 'Connection Error'}
          </h3>
          <p className="text-[13px] text-gray-400 leading-relaxed max-w-[280px]">
            {isNotRegistered
              ? 'Your phone is not registered to the server. Please check your connection and try again.'
              : 'The call could not be connected. The number may be unreachable or the server is unavailable.'}
          </p>
        </div>

        {/* Actions */}
        <div className="px-6 pb-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 rounded-xl bg-white/[0.06] text-gray-300 text-sm font-medium hover:bg-white/[0.10] transition-all duration-200 active:scale-[0.97]"
          >
            Close
          </button>
          {isNotRegistered && (
            <button
              onClick={() => window.location.reload()}
              className="flex-1 px-4 py-3 rounded-xl bg-red-500/15 text-red-300 text-sm font-semibold hover:bg-red-500/25 transition-all duration-200 active:scale-[0.97] border border-red-500/20"
            >
              Retry Connection
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
