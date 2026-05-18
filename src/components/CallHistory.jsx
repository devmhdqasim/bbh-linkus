import React, { useState, useEffect } from 'react'
import { PhoneIncoming, PhoneOutgoing, PhoneMissed, Clock } from 'lucide-react'
import { useLinkus } from '../hooks/useLinkus'

function formatRelativeTime(timestamp) {
  const diff = Math.floor((Date.now() - timestamp) / 1000)
  if (diff < 60) return 'Just now'
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return new Date(timestamp).toLocaleDateString()
}

function formatDuration(seconds) {
  if (!seconds || seconds === 0) return '—'
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return m > 0 ? `${m}m ${s}s` : `${s}s`
}

export function CallHistory() {
  const { callStatus, callDirection, remoteParty, callStartTime } = useLinkus()
  const [history, setHistory] = useState([])
  const [prevStatus, setPrevStatus] = useState('idle')

  // Track call end to log history
  useEffect(() => {
    if (prevStatus !== 'idle' && callStatus === 'ended') {
      const duration = callStartTime ? Math.floor((Date.now() - callStartTime) / 1000) : 0
      const missed = prevStatus === 'ringing' && callDirection === 'inbound'

      setHistory((prev) => [
        {
          id: Date.now(),
          number: remoteParty.number || 'Unknown',
          name: remoteParty.name || '',
          direction: callDirection,
          duration,
          timestamp: Date.now(),
          status: missed ? 'missed' : 'completed',
        },
        ...prev.slice(0, 19), // keep 20 max
      ])
    }
    setPrevStatus(callStatus)
  }, [callStatus])

  function getIcon(entry) {
    if (entry.status === 'missed') {
      return <PhoneMissed size={14} className="text-red-400" />
    }
    if (entry.direction === 'inbound') {
      return <PhoneIncoming size={14} className="text-emerald-400" />
    }
    return <PhoneOutgoing size={14} className="text-brand-gold" />
  }

  return (
    <div style={{ animation: 'slideInUp 0.4s ease-out 0.1s both' }}>
      <h2 className="text-[13px] font-semibold text-gray-400 uppercase tracking-wider mb-4">
        Recent Calls
      </h2>

      <div className="rounded-3xl bg-brand-dark-card/80 border border-white/[0.04] overflow-hidden backdrop-blur-sm card-interactive border-alive">
        {history.length === 0 ? (
          <div className="px-5 py-12 text-center flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-white/[0.03] flex items-center justify-center mb-3 animate-float">
              <Clock size={22} className="text-gray-600 animate-breathe" />
            </div>
            <p className="text-gray-600 text-sm">No call history yet</p>
            <p className="text-gray-700 text-xs mt-1">Your recent calls will appear here</p>
          </div>
        ) : (
          <div className="max-h-72 overflow-y-auto">
            {history.map((entry, index) => (
              <div
                key={entry.id}
                className={`group flex items-center gap-4 px-5 py-3.5 transition-all duration-300 hover:bg-brand-dark-hover hover:pl-6 ${
                  index !== history.length - 1 ? 'border-b border-white/[0.04]' : ''
                }`}
                style={{ animation: `slideInUp 0.3s ease-out ${index * 0.04}s both` }}
              >
                <div className="w-8 h-8 rounded-full bg-white/[0.04] flex items-center justify-center flex-shrink-0">
                  {getIcon(entry)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] text-white font-medium truncate">
                    {entry.name || entry.number}
                  </p>
                  {entry.name && (
                    <p className="text-[12px] text-gray-600 font-mono">{entry.number}</p>
                  )}
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-[12px] text-gray-500">{formatRelativeTime(entry.timestamp)}</p>
                  <p className="text-[11px] text-gray-600">{formatDuration(entry.duration)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
