import React from 'react'
import { Toaster } from 'react-hot-toast'
import { AlertTriangle } from 'lucide-react'
import { LinkusProvider } from './sdk/LinkusProvider'
import { RegistrationStatus, DisconnectedBanner } from './components/RegistrationStatus'
import { ContactsTable } from './components/ContactsTable'
import { ActiveCall } from './components/ActiveCall'
import { IncomingCallModal } from './components/IncomingCallModal'
import { CallHistory } from './components/CallHistory'
import { useLinkus } from './hooks/useLinkus'

function MicPermissionBanner() {
  const { micPermission } = useLinkus()

  if (micPermission !== 'denied') return null

  return (
    <div
      className="flex items-center gap-3 px-5 py-3.5 rounded-3xl bg-red-500/8 border border-red-500/20 mb-5"
      style={{ animation: 'slideInUp 0.4s ease-out' }}
    >
      <div className="w-8 h-8 rounded-full bg-red-500/15 flex items-center justify-center flex-shrink-0">
        <AlertTriangle size={15} className="text-red-400" />
      </div>
      <div>
        <p className="text-red-300 font-medium text-sm">Microphone Access Denied</p>
        <p className="text-red-400/60 text-xs mt-0.5">
          Please enable microphone in browser settings and reload.
        </p>
      </div>
    </div>
  )
}

function MainContent() {
  const { callStatus, incomingSession } = useLinkus()

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header
        className="sticky top-0 z-50 backdrop-blur-xl bg-brand-dark/80 border-b border-white/[0.08]"
        style={{ animation: 'slideInUp 0.3s ease-out' }}
      >
        <div className="flex items-center justify-between px-5 py-3 md:px-8">
          <div className="flex items-center gap-3">
            <img
              src="https://crm-prod.baghdadbullionhouse.com/logo.png"
              alt="BBH"
              className="w-9 h-9 rounded-lg object-contain"
            />
            <div className="leading-tight">
              <h1 className="text-[15px] font-semibold text-white tracking-tight">
                BBH Linkus
              </h1>
              <p className="text-[11px] text-gray-500">Softphone</p>
            </div>
          </div>
          <RegistrationStatus />
        </div>
      </header>

      {/* Content */}
      <div className="px-5 py-5 md:px-8 md:py-6">
        <DisconnectedBanner />
        <MicPermissionBanner />

        {/* Active Call */}
        {callStatus !== 'idle' && (
          <div className="mb-5">
            <ActiveCall />
          </div>
        )}

        {/* Contacts Table */}
        <div className="mb-5">
          <ContactsTable />
        </div>

        {/* Call History */}
        <CallHistory />
      </div>

      {/* Incoming call modal */}
      {incomingSession && <IncomingCallModal />}
    </div>
  )
}

export default function App() {
  return (
    <LinkusProvider>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#241010',
            color: '#fff',
            border: '1px solid rgba(222,164,2,0.15)',
            borderRadius: '24px',
            fontSize: '13px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
          },
        }}
      />
      <MainContent />
    </LinkusProvider>
  )
}
