import React, { useState } from 'react'
import {
  Phone,
  Users,
  Clock,
  PhoneIncoming,
  PhoneOutgoing,
  PhoneMissed,
  BarChart3,
  Headphones,
  Star,
  TrendingUp,
  ChevronDown,
} from 'lucide-react'
import { useLinkus } from '../hooks/useLinkus'
import { CallConfirmModal, CallErrorModal } from './CallConfirmModal'

const AGENT = {
  name: 'Muhammad Qasim',
  role: 'Sales Agent',
  extension: '1000',
  department: 'Gold Sales',
  avatar: 'MQ',
}

const STATS = [
  { label: 'Total Calls', value: '147', icon: Phone, color: 'text-brand-gold' },
  { label: 'Answered', value: '132', icon: PhoneIncoming, color: 'text-emerald-400' },
  { label: 'Outbound', value: '89', icon: PhoneOutgoing, color: 'text-blue-400' },
  { label: 'Missed', value: '15', icon: PhoneMissed, color: 'text-red-400' },
]

const TEAM_MEMBERS = [
  { name: 'Hassan Mirza', ext: '1001', status: 'available' },
  { name: 'Zainab Rafiq', ext: '1002', status: 'on-call' },
  { name: 'Bilal Yousuf', ext: '1003', status: 'away' },
  { name: 'Nadia Kareem', ext: '1004', status: 'available' },
]

const RECENT_QUEUE = [
  { caller: '+964 770 123 4567', wait: '0:32', type: 'Gold Inquiry' },
  { caller: '+964 781 987 6543', wait: '1:15', type: 'Price Check' },
  { caller: '+964 750 555 1234', wait: '0:48', type: 'New Order' },
]

function getStatusDot(status) {
  const colors = {
    available: 'bg-emerald-400',
    'on-call': 'bg-brand-gold',
    away: 'bg-gray-500',
  }
  return colors[status] || 'bg-gray-500'
}

function getStatusLabel(status) {
  const labels = {
    available: 'Available',
    'on-call': 'On Call',
    away: 'Away',
  }
  return labels[status] || status
}

function CollapsibleSection({ icon: Icon, title, children, animDelay = '0s', defaultOpen = false, badge }) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div style={{ animation: `slideInUp 0.3s ease-out ${animDelay} both` }}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-2 mb-3 w-full group"
      >
        <Icon size={13} className="text-gray-500" />
        <h3 className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
          {title}
        </h3>
        {badge && (
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-brand-gold/10 text-brand-gold font-semibold">
            {badge}
          </span>
        )}
        <ChevronDown
          size={13}
          className={`ml-auto text-gray-600 group-hover:text-gray-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      <div
        className={`grid transition-all duration-200 ease-out ${open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
      >
        <div className="overflow-hidden">{children}</div>
      </div>
    </div>
  )
}

export function Sidebar() {
  const { makeCall, registerState } = useLinkus()
  const [callTarget, setCallTarget] = useState(null)
  const [callError, setCallError] = useState(null)

  function requestCall(number) {
    setCallTarget({ name: '', phone: number })
  }

  function confirmCall() {
    if (!callTarget) return
    if (registerState !== 'registered') {
      setCallTarget(null)
      setCallError('not-registered')
      return
    }
    makeCall(callTarget.phone)
    setCallTarget(null)
  }

  return (
    <>
    <aside className="w-72 flex-shrink-0 h-[calc(100vh-57px)] sticky top-[57px] overflow-y-auto border-r border-white/[0.06] bg-brand-dark-card/50 backdrop-blur-sm">
      <div className="p-5 space-y-6">
        {/* Agent Profile Card */}
        <div
          className="rounded-2xl bg-brand-dark-deep/80 border border-white/[0.06] p-4"
          style={{ animation: 'slideInUp 0.3s ease-out' }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-brand-gold/30 to-brand-gold/10 border border-brand-gold/20 flex items-center justify-center">
              <span className="text-sm font-bold text-brand-gold">{AGENT.avatar}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">{AGENT.name}</p>
              <p className="text-[11px] text-brand-gold">{AGENT.role}</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[12px]">
              <span className="text-gray-500">Extension</span>
              <span className="text-gray-300 font-mono">{AGENT.extension}</span>
            </div>
            <div className="flex items-center justify-between text-[12px]">
              <span className="text-gray-500">Department</span>
              <span className="text-gray-300">{AGENT.department}</span>
            </div>
            <div className="flex items-center justify-between text-[12px]">
              <span className="text-gray-500">Status</span>
              <span className="flex items-center gap-1.5 text-emerald-400 text-[12px]">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-50" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
                </span>
                Available
              </span>
            </div>
          </div>
        </div>

        {/* Today's Stats */}
        <div style={{ animation: 'slideInUp 0.3s ease-out 0.05s both' }}>
          <div className="flex items-center gap-2 mb-3">
            <BarChart3 size={13} className="text-gray-500" />
            <h3 className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
              Today's Stats
            </h3>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {STATS.map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl bg-brand-dark-deep/60 border border-white/[0.04] p-3 hover:border-white/[0.08] transition-colors duration-200"
              >
                <div className="flex items-center gap-1.5 mb-1.5">
                  <stat.icon size={12} className={stat.color} />
                  <span className="text-[10px] text-gray-500">{stat.label}</span>
                </div>
                <p className="text-lg font-bold text-white">{stat.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Performance */}
        <div style={{ animation: 'slideInUp 0.3s ease-out 0.1s both' }}>
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp size={13} className="text-gray-500" />
            <h3 className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
              Performance
            </h3>
          </div>
          <div className="rounded-xl bg-brand-dark-deep/60 border border-white/[0.04] p-4 space-y-3">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] text-gray-500">Answer Rate</span>
                <span className="text-[11px] font-semibold text-emerald-400">89.8%</span>
              </div>
              <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                <div className="h-full rounded-full bg-emerald-500/60" style={{ width: '89.8%' }} />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] text-gray-500">Avg. Call Duration</span>
                <span className="text-[11px] font-semibold text-brand-gold">3m 24s</span>
              </div>
              <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                <div className="h-full rounded-full bg-brand-gold/60" style={{ width: '68%' }} />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] text-gray-500">Customer Rating</span>
                <div className="flex items-center gap-1">
                  <Star size={10} className="text-brand-gold fill-brand-gold" />
                  <span className="text-[11px] font-semibold text-brand-gold">4.7</span>
                </div>
              </div>
              <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                <div className="h-full rounded-full bg-brand-gold/60" style={{ width: '94%' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Team (collapsible) */}
        <CollapsibleSection
          icon={Users}
          title="Team"
          animDelay="0.15s"
          defaultOpen={false}
        >
          <div className="rounded-xl bg-brand-dark-deep/60 border border-white/[0.04] overflow-hidden">
            {TEAM_MEMBERS.map((member, i) => (
              <div
                key={member.ext}
                className={`flex items-center gap-3 px-3.5 py-2.5 hover:bg-white/[0.02] transition-colors duration-200 ${
                  i !== TEAM_MEMBERS.length - 1 ? 'border-b border-white/[0.03]' : ''
                }`}
              >
                <div className="relative">
                  <div className="w-7 h-7 rounded-full bg-brand-dark-surface border border-white/[0.06] flex items-center justify-center">
                    <span className="text-[10px] font-semibold text-gray-400">
                      {member.name.split(' ').map((n) => n[0]).join('')}
                    </span>
                  </div>
                  <span
                    className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-brand-dark-deep ${getStatusDot(member.status)}`}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] text-gray-300 font-medium truncate">{member.name}</p>
                  <p className="text-[10px] text-gray-600">Ext. {member.ext}</p>
                </div>
                <span className="text-[10px] text-gray-600">{getStatusLabel(member.status)}</span>
              </div>
            ))}
          </div>
        </CollapsibleSection>

        {/* Queue (collapsible) */}
        <CollapsibleSection
          icon={Headphones}
          title="Queue"
          animDelay="0.2s"
          defaultOpen={false}
          badge={`${RECENT_QUEUE.length} waiting`}
        >
          <div className="rounded-xl bg-brand-dark-deep/60 border border-white/[0.04] overflow-hidden">
            {RECENT_QUEUE.map((item, i) => (
              <div
                key={i}
                className={`flex items-center gap-3 px-3.5 py-2.5 hover:bg-white/[0.02] transition-colors duration-200 ${
                  i !== RECENT_QUEUE.length - 1 ? 'border-b border-white/[0.03]' : ''
                }`}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-[12px] text-gray-300 font-mono">{item.caller}</span>
                    <span className="text-[10px] text-gray-600">{item.wait}</span>
                  </div>
                  <span className="text-[10px] text-gray-500">{item.type}</span>
                </div>
                <button
                  onClick={() => requestCall(item.caller)}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 text-[10px] font-medium hover:bg-emerald-500/20 transition-colors duration-200 active:scale-[0.94] flex-shrink-0"
                  title={`Pick up ${item.caller}`}
                >
                  <Phone size={10} />
                  Call
                </button>
              </div>
            ))}
          </div>
        </CollapsibleSection>
      </div>
    </aside>

    {/* Call confirmation modal */}
    {callTarget && (
      <CallConfirmModal
        name={callTarget.name}
        number={callTarget.phone}
        onConfirm={confirmCall}
        onClose={() => setCallTarget(null)}
      />
    )}

    {/* Call error modal */}
    {callError && (
      <CallErrorModal
        errorType={callError}
        onClose={() => setCallError(null)}
      />
    )}
    </>
  )
}
