import React, { useState, useEffect } from 'react'
import { PhoneOff, Mic, MicOff, Pause, Play, Grid3X3, User } from 'lucide-react'
import { useLinkus } from '../hooks/useLinkus'

const DTMF_KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#']

function formatTime(seconds) {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0')
  const s = (seconds % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}

export function ActiveCall() {
  const {
    callStatus,
    callDirection,
    remoteParty,
    isMuted,
    isHeld,
    callStartTime,
    hangup,
    mute,
    unmute,
    hold,
    unhold,
    sendDTMF,
  } = useLinkus()

  const [elapsed, setElapsed] = useState(0)
  const [showDTMF, setShowDTMF] = useState(false)

  useEffect(() => {
    if (callStatus !== 'talking' || !callStartTime) {
      setElapsed(0)
      return
    }

    const interval = setInterval(() => {
      setElapsed(Math.floor((Date.now() - callStartTime) / 1000))
    }, 1000)

    return () => clearInterval(interval)
  }, [callStatus, callStartTime])

  const statusLabel = {
    ringing: 'Ringing',
    calling: 'Calling',
    talking: 'Connected',
    ended: 'Call Ended',
  }[callStatus] || callStatus

  return (
    <div
      className="rounded-3xl bg-brand-dark-card/80 border border-white/[0.04] backdrop-blur-sm p-6 md:p-8 card-interactive"
      style={{ animation: 'slideInUp 0.4s ease-out' }}
    >
      <div className="flex flex-col items-center text-center">
        {/* Avatar */}
        <div className="relative mb-5">
          {(callStatus === 'talking' || callStatus === 'calling') && (
            <>
              <div className="absolute inset-0 rounded-full border-2 border-brand-gold/25 animate-pulse-ring" />
              <div className="absolute inset-0 rounded-full border border-brand-gold/15 animate-pulse-ring-slow" />
            </>
          )}
          <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-brand-dark-surface to-brand-dark-deep border border-white/[0.08] flex items-center justify-center">
            <User size={26} className="text-gray-500" />
          </div>
        </div>

        {/* Remote party */}
        <h2 className="text-xl font-semibold text-white mb-0.5 tracking-tight">
          {remoteParty.name || 'Unknown'}
        </h2>
        <p className="text-gray-500 text-sm font-mono mb-3">{remoteParty.number || '—'}</p>

        {/* Status */}
        <span className={`inline-flex items-center gap-1.5 text-xs font-medium mb-5 ${
          callStatus === 'talking' ? 'text-emerald-400' : callStatus === 'ended' ? 'text-gray-500' : 'text-brand-gold'
        }`}>
          <span className={`w-1.5 h-1.5 rounded-full ${
            callStatus === 'talking' ? 'bg-emerald-400' : callStatus === 'ended' ? 'bg-gray-500' : 'bg-brand-gold animate-pulse'
          }`} />
          {callDirection === 'inbound' ? 'Inbound' : 'Outbound'} · {statusLabel}
        </span>

        {/* Timer */}
        {callStatus === 'talking' && (
          <p className="text-3xl font-light text-white tabular-nums mb-6 tracking-widest">
            {formatTime(elapsed)}
          </p>
        )}

        {callStatus === 'calling' && (
          <p className="text-sm text-gray-500 mb-6 animate-pulse">Connecting...</p>
        )}

        {/* Controls */}
        <div className="flex items-center gap-2.5 mb-6">
          <button
            onClick={isMuted ? unmute : mute}
            className={`w-11 h-11 rounded-lg flex items-center justify-center transition-all duration-200 active:scale-[0.92] ${
              isMuted
                ? 'bg-brand-gold/15 text-brand-gold'
                : 'bg-white/[0.06] text-gray-400 hover:text-white hover:bg-white/[0.1]'
            }`}
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <MicOff size={17} /> : <Mic size={17} />}
          </button>

          <button
            onClick={isHeld ? unhold : hold}
            className={`w-11 h-11 rounded-lg flex items-center justify-center transition-all duration-200 active:scale-[0.92] ${
              isHeld
                ? 'bg-brand-gold/15 text-brand-gold'
                : 'bg-white/[0.06] text-gray-400 hover:text-white hover:bg-white/[0.1]'
            }`}
            title={isHeld ? 'Resume' : 'Hold'}
          >
            {isHeld ? <Play size={17} /> : <Pause size={17} />}
          </button>

          <button
            onClick={() => setShowDTMF(!showDTMF)}
            className={`w-11 h-11 rounded-lg flex items-center justify-center transition-all duration-200 active:scale-[0.92] ${
              showDTMF
                ? 'bg-brand-gold/15 text-brand-gold'
                : 'bg-white/[0.06] text-gray-400 hover:text-white hover:bg-white/[0.1]'
            }`}
            title="Keypad"
          >
            <Grid3X3 size={17} />
          </button>
        </div>

        {/* DTMF mini pad */}
        {showDTMF && (
          <div className="grid grid-cols-3 gap-1.5 mb-6 animate-fade-in w-full max-w-[180px]">
            {DTMF_KEYS.map((key) => (
              <button
                key={key}
                onClick={() => sendDTMF(key)}
                className="bg-white/[0.05] hover:bg-white/[0.1] rounded-lg py-2 text-white text-sm font-medium transition-all duration-150 active:scale-[0.9]"
              >
                {key}
              </button>
            ))}
          </div>
        )}

        {/* Hangup */}
        <button
          onClick={hangup}
          className="bg-red-500 hover:bg-red-400 rounded-lg w-12 h-12 flex items-center justify-center shadow-lg shadow-red-500/25 transition-all duration-200 active:scale-[0.9]"
        >
          <PhoneOff size={20} className="text-white" />
        </button>
      </div>
    </div>
  )
}
