import { useContext } from 'react'
import { LinkusContext } from '../sdk/LinkusProvider'

export function useLinkus() {
  const context = useContext(LinkusContext)
  if (!context) {
    throw new Error('useLinkus must be used within a LinkusProvider')
  }
  return context
}
