import React from 'react'
import { Wifi, WifiOff, RefreshCw } from 'lucide-react'
import { useLinkus } from '../hooks/useLinkus'

export function RegistrationStatus() {
  const { registerState } = useLinkus()

  const isRegistered = registerState === 'registered'

  if (isRegistered) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-50" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
        </span>
        Connected
      </div>
    )
  }

  return null
}

export function DisconnectedBanner() {
  const { registerState } = useLinkus()

  if (registerState === 'registered') return null

  const isFailed = registerState === 'failed'

  return (
    <div
      className="flex items-center gap-3 px-4 py-2.5 bg-amber-500/10 border border-amber-500/15 rounded-2xl mb-5"
      style={{ animation: 'slideInUp 0.3s ease-out' }}
    >
      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-amber-500/15 flex-shrink-0">
        {isFailed ? (
          <WifiOff size={14} className="text-amber-400" />
        ) : (
          <RefreshCw size={14} className="text-amber-400 animate-spin" style={{ animationDuration: '2s' }} />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-amber-300 text-sm font-medium leading-tight">
          {isFailed ? 'Connection failed' : 'Connecting...'}
        </p>
        <p className="text-amber-400/50 text-xs mt-0.5">
          {isFailed
            ? 'Unable to reach the server. Check your network and reload.'
            : 'Trying to establish a connection to the server.'}
        </p>
      </div>
      {isFailed && (
        <button
          onClick={() => window.location.reload()}
          className="px-3 py-1.5 rounded-full text-xs font-medium bg-amber-500/15 text-amber-300 hover:bg-amber-500/25 transition-colors flex-shrink-0"
        >
          Retry
        </button>
      )}
    </div>
  )
}
