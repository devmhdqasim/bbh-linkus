import React, { createContext, useState, useEffect, useRef, useCallback } from 'react'
import { init as linkusInit } from 'ys-webrtc-sdk-core'
import toast from 'react-hot-toast'

export const LinkusContext = createContext(null)

export function LinkusProvider({ children }) {
  const [phone, setPhone] = useState(null)
  const [pbx, setPbx] = useState(null)
  const [registerState, setRegisterState] = useState('unregistered')
  const [currentSession, setCurrentSession] = useState(null)
  const [incomingSession, setIncomingSession] = useState(null)
  const [callStatus, setCallStatus] = useState('idle')
  const [callDirection, setCallDirection] = useState(null)
  const [remoteParty, setRemoteParty] = useState({ name: '', number: '' })
  const [isMuted, setIsMuted] = useState(false)
  const [isHeld, setIsHeld] = useState(false)
  const [callStartTime, setCallStartTime] = useState(null)
  const [micPermission, setMicPermission] = useState('prompt')

  const destroyRef = useRef(null)
  const sessionRef = useRef(null)

  // Check microphone permission
  useEffect(() => {
    if (navigator.permissions) {
      navigator.permissions.query({ name: 'microphone' }).then((result) => {
        setMicPermission(result.state)
        result.onchange = () => setMicPermission(result.state)
      }).catch(() => {
        // permissions API not supported for microphone in some browsers
      })
    }
  }, [])

  // Initialize the SDK
  useEffect(() => {
    const pbxURL = import.meta.env.VITE_PBX_URL
    const username = import.meta.env.VITE_PBX_USERNAME
    const secret = import.meta.env.VITE_PBX_SECRET

    if (!pbxURL || !username || !secret || secret === 'replace_with_sdk_login_signature') {
      console.warn('Linkus SDK: Missing or placeholder credentials in .env.local')
      return
    }

    let cancelled = false

    async function initSDK() {
      try {
        const { phone: phoneOperator, pbx: pbxOperator, destroy } = await linkusInit({
          username,
          secret,
          pbxURL,
          enableLog: true,
        })

        if (cancelled) {
          destroy()
          return
        }

        destroyRef.current = destroy
        setPhone(phoneOperator)
        setPbx(pbxOperator)

        // Listen for registration state
        phoneOperator.on('registered', () => {
          setRegisterState('registered')
          toast.success('SIP Registered')
        })

        phoneOperator.on('unregistered', () => {
          setRegisterState('unregistered')
        })

        phoneOperator.on('registrationFailed', () => {
          setRegisterState('failed')
          toast.error('SIP Registration failed')
        })

        // Listen for incoming/outgoing sessions
        phoneOperator.on('newRTCSession', (session) => {
          const direction = session.status?.communicationType === 'inbound' ? 'inbound' : 'outbound'

          sessionRef.current = session
          setCurrentSession(session)
          setCallDirection(direction)
          setIsMuted(false)
          setIsHeld(false)

          const remote = {
            name: session.status?.callerName || session.status?.name || '',
            number: session.status?.number || session.status?.callerNumber || '',
          }
          setRemoteParty(remote)

          if (direction === 'inbound') {
            setIncomingSession(session)
            setCallStatus('ringing')
          } else {
            setCallStatus('calling')
          }

          // Session events
          session.on('confirmed', () => {
            setCallStatus('talking')
            setCallStartTime(Date.now())
            setIncomingSession(null)
          })

          session.on('progress', () => {
            if (direction === 'outbound') {
              setCallStatus('calling')
            }
          })

          session.on('ended', () => {
            handleCallEnd()
          })

          session.on('failed', () => {
            handleCallEnd()
            toast.error('Call failed')
          })
        })

        phoneOperator.on('startSession', (session) => {
          // Attach remote audio stream
          if (session.remoteStream) {
            const audioEl = document.getElementById('remote-audio')
            if (audioEl) {
              audioEl.srcObject = session.remoteStream
            }
          }

          session.on('updateStream', (stream) => {
            const audioEl = document.getElementById('remote-audio')
            if (audioEl) {
              audioEl.srcObject = stream
            }
          })
        })
      } catch (err) {
        console.error('Linkus SDK init failed:', err?.message || err?.code || err)
        console.error('Full error:', JSON.stringify(err, null, 2))
        toast.error('Failed to initialize phone system')
      }
    }

    initSDK()

    return () => {
      cancelled = true
      if (destroyRef.current) {
        destroyRef.current()
      }
    }
  }, [])

  function handleCallEnd() {
    setCallStatus('ended')
    setIncomingSession(null)
    sessionRef.current = null
    setTimeout(() => {
      setCallStatus('idle')
      setCurrentSession(null)
      setCallDirection(null)
      setRemoteParty({ name: '', number: '' })
      setCallStartTime(null)
      setIsMuted(false)
      setIsHeld(false)
    }, 1500)
  }

  const makeCall = useCallback((number) => {
    if (!phone || registerState !== 'registered') {
      toast.error('Phone not registered')
      return
    }
    if (!number) return
    phone.call(number)
  }, [phone, registerState])

  const answer = useCallback(() => {
    if (sessionRef.current) {
      sessionRef.current.answer()
      setIncomingSession(null)
    }
  }, [])

  const hangup = useCallback(() => {
    if (sessionRef.current) {
      sessionRef.current.hangup()
    }
  }, [])

  const hold = useCallback(() => {
    if (sessionRef.current) {
      sessionRef.current.hold()
      setIsHeld(true)
    }
  }, [])

  const unhold = useCallback(() => {
    if (sessionRef.current) {
      sessionRef.current.unhold()
      setIsHeld(false)
    }
  }, [])

  const mute = useCallback(() => {
    if (sessionRef.current) {
      sessionRef.current.mute()
      setIsMuted(true)
    }
  }, [])

  const unmute = useCallback(() => {
    if (sessionRef.current) {
      sessionRef.current.unmute()
      setIsMuted(false)
    }
  }, [])

  const sendDTMF = useCallback((digit) => {
    if (sessionRef.current) {
      sessionRef.current.dtmf(digit)
    }
  }, [])

  const decline = useCallback(() => {
    if (sessionRef.current) {
      sessionRef.current.hangup()
      setIncomingSession(null)
    }
  }, [])

  const value = {
    phone,
    pbx,
    registerState,
    currentSession,
    incomingSession,
    callStatus,
    callDirection,
    remoteParty,
    isMuted,
    isHeld,
    callStartTime,
    micPermission,
    makeCall,
    answer,
    hangup,
    hold,
    unhold,
    mute,
    unmute,
    sendDTMF,
    decline,
  }

  return (
    <LinkusContext.Provider value={value}>
      {children}
      <audio id="remote-audio" autoPlay style={{ display: 'none' }} />
    </LinkusContext.Provider>
  )
}
