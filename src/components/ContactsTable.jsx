import React, { useState } from 'react'
import { Phone, Plus, X, User, Users, Mail, StickyNote, AlertCircle, Pencil } from 'lucide-react'
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input'
import 'react-phone-number-input/style.css'
import { useLinkus } from '../hooks/useLinkus'

const INITIAL_CONTACTS = [
  { id: 1, name: 'Muhammad Qasim', phone: '+964 770 482 1936', email: 'qasim@bbh.com', notes: '' },
  { id: 2, name: 'Sara Khan', phone: '+964 781 654 2708', email: 'sara@bbh.com', notes: '' },
  { id: 3, name: 'Omar Ali', phone: '+964 750 918 4362', email: '', notes: '' },
]

// Validates international numbers AND short PBX extensions (3-6 digits)
function isValidPhone(value) {
  if (!value) return false
  const digitsOnly = value.replace(/[^0-9]/g, '')
  if (/^\d{3,6}$/.test(digitsOnly) && !value.startsWith('+')) return true 
  return isValidPhoneNumber(value)
}

function validateEmail(email) {
  if (!email) return null
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email) ? null : 'Enter a valid email address'
}

function validateName(name) {
  if (!name) return null
  if (name.length < 2) return 'Too short'
  if (name.length > 50) return 'Max 50 characters'
  return null
}

function validateNotes(notes) {
  if (!notes) return null
  if (notes.length > 200) return 'Max 200 characters'
  return null
}

function getInitials(name) {
  if (!name) return null
  const parts = name.trim().split(/\s+/)
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  return parts[0][0].toUpperCase()
}

function inputClass(hasError) {
  const base = 'w-full bg-brand-dark-deep rounded-lg text-white text-[14px] placeholder:text-gray-500 outline-none transition-colors duration-200'
  if (hasError) {
    return `${base} border border-red-500/50 focus:border-red-400/70 ring-1 ring-red-500/20 focus:ring-red-500/30`
  }
  return `${base} border border-white/[0.10] focus:border-brand-gold/50 ring-0 focus:ring-1 focus:ring-brand-gold/20`
}

export function ContactsTable() {
  const { makeCall, registerState } = useLinkus()
  const [contacts, setContacts] = useState(INITIAL_CONTACTS)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [editingContact, setEditingContact] = useState(null)
  const [useExtension, setUseExtension] = useState(false)

  // Form state
  const [newName, setNewName] = useState('')
  const [newPhone, setNewPhone] = useState('')
  const [newExtension, setNewExtension] = useState('')
  const [newEmail, setNewEmail] = useState('')
  const [newNotes, setNewNotes] = useState('')
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})

  const isDisabled = registerState !== 'registered'

  function openDrawer() {
    setDrawerOpen(true)
  }

  function closeDrawer() {
    setDrawerOpen(false)
    setEditingContact(null)
    setNewName('')
    setNewPhone('')
    setNewExtension('')
    setNewEmail('')
    setNewNotes('')
    setErrors({})
    setTouched({})
    setUseExtension(false)
  }

  function handleEdit(contact) {
    setEditingContact(contact)
    setNewName(contact.name || '')
    setNewEmail(contact.email || '')
    setNewNotes(contact.notes || '')
    // Determine if this is an extension or international number
    const isExt = /^\d{3,6}$/.test(contact.phone) && !contact.phone.startsWith('+')
    setUseExtension(isExt)
    if (isExt) {
      setNewExtension(contact.phone)
      setNewPhone('')
    } else {
      setNewPhone(contact.phone)
      setNewExtension('')
    }
    setErrors({})
    setTouched({})
    setDrawerOpen(true)
  }

  function getPhoneValue() {
    return useExtension ? newExtension : newPhone
  }

  function validateAll() {
    const newErrors = {}
    const phone = getPhoneValue()

    if (!phone) {
      newErrors.phone = 'Phone number is required'
    } else if (useExtension) {
      if (!/^\d{3,6}$/.test(phone)) newErrors.phone = 'Extension must be 3-6 digits'
    } else {
      if (!isValidPhone(phone)) newErrors.phone = 'Enter a valid phone number'
    }

    const nameErr = validateName(newName)
    if (nameErr) newErrors.name = nameErr

    const emailErr = validateEmail(newEmail)
    if (emailErr) newErrors.email = emailErr

    const notesErr = validateNotes(newNotes)
    if (notesErr) newErrors.notes = notesErr

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  function handleBlur(field) {
    setTouched((prev) => ({ ...prev, [field]: true }))
    const newErrors = { ...errors }

    if (field === 'phone') {
      const phone = getPhoneValue()
      if (!phone) {
        newErrors.phone = 'Phone number is required'
      } else if (useExtension) {
        if (!/^\d{3,6}$/.test(phone)) newErrors.phone = 'Extension must be 3-6 digits'
        else delete newErrors.phone
      } else {
        if (!isValidPhone(phone)) newErrors.phone = 'Enter a valid phone number'
        else delete newErrors.phone
      }
    }
    if (field === 'name') {
      const err = validateName(newName)
      if (err) newErrors.name = err
      else delete newErrors.name
    }
    if (field === 'email') {
      const err = validateEmail(newEmail)
      if (err) newErrors.email = err
      else delete newErrors.email
    }
    if (field === 'notes') {
      const err = validateNotes(newNotes)
      if (err) newErrors.notes = err
      else delete newErrors.notes
    }
    setErrors(newErrors)
  }

  function handleSave() {
    setTouched({ phone: true, name: true, email: true, notes: true })
    if (!validateAll()) return

    if (editingContact) {
      setContacts((prev) =>
        prev.map((c) =>
          c.id === editingContact.id
            ? {
                ...c,
                name: newName.trim(),
                phone: getPhoneValue(),
                email: newEmail.trim(),
                notes: newNotes.trim(),
              }
            : c
        )
      )
    } else {
      setContacts((prev) => [
        ...prev,
        {
          id: Date.now(),
          name: newName.trim(),
          phone: getPhoneValue(),
          email: newEmail.trim(),
          notes: newNotes.trim(),
        },
      ])
    }
    closeDrawer()
  }

  function handleCall(phone) {
    if (isDisabled) return
    makeCall(phone)
  }

  function hasFieldError(field) {
    return touched[field] && errors[field]
  }

  return (
    <>
      <div style={{ animation: 'slideInUp 0.4s ease-out 0.05s both' }}>
        {/* Section header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[13px] font-semibold text-gray-400 uppercase tracking-wider">
            Contacts
          </h2>
          <button
            onClick={openDrawer}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-gold text-brand-dark-deep text-xs font-semibold hover:bg-brand-gold-light transition-all duration-200 active:scale-[0.96] shadow-md shadow-brand-gold/20 hover:shadow-lg hover:shadow-brand-gold/30"
          >
            <Plus size={14} strokeWidth={2.5} />
            New Contact
          </button>
        </div>

        {/* Contact rows */}
        <div className="rounded-3xl bg-brand-dark-card border border-white/[0.08] overflow-hidden backdrop-blur-sm card-interactive border-alive">
          {contacts.map((contact, index) => (
            <div
              key={contact.id}
              className={`group flex items-center gap-4 px-5 py-4 transition-all duration-300 hover:bg-brand-dark-hover hover:pl-6 cursor-default ${
                index !== contacts.length - 1 ? 'border-b border-white/[0.06]' : ''
              }`}
            >
              {/* Avatar with initials */}
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-dark-surface to-brand-dark-deep border border-white/[0.06] flex items-center justify-center flex-shrink-0 group-hover:border-brand-gold/20 transition-colors duration-200">
                {getInitials(contact.name) ? (
                  <span className="text-[11px] font-semibold text-gray-400 group-hover:text-brand-gold-light transition-colors duration-200">
                    {getInitials(contact.name)}
                  </span>
                ) : (
                  <User size={15} className="text-gray-500 group-hover:text-gray-400 transition-colors duration-200" />
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-[14px] text-white font-medium truncate group-hover:text-brand-gold-light transition-colors duration-200">
                  {contact.name || contact.phone}
                </p>
                <div className="flex items-center gap-3 mt-0.5">
                  <p className="text-[12px] text-gray-500 font-mono">{contact.phone}</p>
                  {contact.email && (
                    <p className="text-[11px] text-gray-600 truncate hidden sm:block">{contact.email}</p>
                  )}
                </div>
                {contact.notes && (
                  <p className="text-[11px] text-gray-700 truncate mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 italic">
                    {contact.notes}
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => handleEdit(contact)}
                  className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/[0.04] text-gray-400 hover:text-white hover:bg-white/[0.08] transition-colors duration-200 active:scale-[0.94]"
                  title={`Edit ${contact.name || contact.phone}`}
                >
                  <Pencil size={13} />
                </button>
                <button
                  onClick={() => handleCall(contact.phone)}
                  disabled={isDisabled}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 text-xs font-medium hover:bg-emerald-500/20 transition-colors duration-200 active:scale-[0.94] disabled:opacity-30 disabled:cursor-not-allowed"
                  title={isDisabled ? 'Phone not registered' : `Call ${contact.name || contact.phone}`}
                >
                  <Phone size={12} />
                  Call
                </button>
              </div>
            </div>
          ))}

          {contacts.length === 0 && (
            <div className="px-5 py-12 text-center flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-white/[0.03] flex items-center justify-center mb-3 animate-float">
                <Users size={22} className="text-gray-600 animate-breathe" />
              </div>
              <p className="text-gray-600 text-sm">No contacts yet</p>
              <p className="text-gray-700 text-xs mt-1">Add contacts to quick-dial them</p>
            </div>
          )}
        </div>
      </div>

      {/* Drawer overlay */}
      {drawerOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm animate-fade-in"
          onClick={closeDrawer}
        />
      )}

      {/* Drawer panel */}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-full max-w-lg transform transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] ${
          drawerOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="h-full bg-brand-dark-card border-l border-white/[0.10] shadow-2xl shadow-black/50 flex flex-col">
          {/* Drawer header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-white/[0.06]">
            <div>
              <h2 className="text-[17px] font-semibold text-white">
                {editingContact ? 'Edit Contact' : 'New Contact'}
              </h2>
              <p className="text-[12px] text-gray-600 mt-0.5">
                {editingContact ? 'Update contact details' : 'Only phone number is required'}
              </p>
            </div>
            <button
              onClick={closeDrawer}
              className="w-8 h-8 rounded-lg bg-white/[0.06] flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-200"
            >
              <X size={15} />
            </button>
          </div>

          {/* Drawer body */}
          <div className="flex-1 px-6 py-6 overflow-y-auto">
            <div className="space-y-6">
              {/* --- Identity Section --- */}
              <div>
                <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-3">Identity</p>
                <div>
                  <label className="block text-[13px] font-medium text-gray-300 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    onBlur={() => handleBlur('name')}
                    placeholder="e.g. John Doe"
                    autoFocus
                    className={`${inputClass(hasFieldError('name'))} px-4 py-3`}
                  />
                  {touched.name && errors.name && (
                    <p className="flex items-center gap-1 text-red-400 text-[11px] mt-1.5">
                      <AlertCircle size={10} /> {errors.name}
                    </p>
                  )}
                </div>
              </div>

              {/* --- Contact Details Section --- */}
              <div>
                <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-3">Contact Details</p>
                <div className="space-y-4">
                  {/* Phone - Required */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-[13px] font-medium text-gray-300">
                        Phone Number
                      </label>
                      {/* Extension / International toggle */}
                      <div className="flex items-center gap-1 bg-white/[0.04] rounded-md p-0.5">
                        <button
                          type="button"
                          onClick={() => { setUseExtension(true); setNewPhone(''); }}
                          className={`text-[11px] px-2.5 py-1 rounded transition-all duration-200 ${
                            useExtension ? 'bg-brand-gold/20 text-brand-gold font-semibold' : 'text-gray-500 hover:text-gray-400'
                          }`}
                        >
                          Extension
                        </button>
                        <button
                          type="button"
                          onClick={() => { setUseExtension(false); setNewExtension(''); }}
                          className={`text-[11px] px-2.5 py-1 rounded transition-all duration-200 ${
                            !useExtension ? 'bg-brand-gold/20 text-brand-gold font-semibold' : 'text-gray-500 hover:text-gray-400'
                          }`}
                        >
                          International
                        </button>
                      </div>
                    </div>

                    {useExtension ? (
                      <div className="relative">
                        <Phone size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" />
                        <input
                          type="text"
                          value={newExtension}
                          onChange={(e) => setNewExtension(e.target.value.replace(/[^0-9]/g, ''))}
                          onBlur={() => handleBlur('phone')}
                          placeholder="e.g. 1001"
                          maxLength={6}
                          className={`${inputClass(hasFieldError('phone'))} pl-10 pr-4 py-3 font-mono`}
                        />
                      </div>
                    ) : (
                      <PhoneInput
                        international
                        defaultCountry="IQ"
                        value={newPhone}
                        onChange={(value) => setNewPhone(value || '')}
                        onBlur={() => handleBlur('phone')}
                        className={`phone-input-dark ${hasFieldError('phone') ? 'phone-input-error' : ''}`}
                      />
                    )}
                    {touched.phone && errors.phone && (
                      <p className="flex items-center gap-1 text-red-400 text-[11px] mt-1.5">
                        <AlertCircle size={10} /> {errors.phone}
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-[13px] font-medium text-gray-300 mb-2">
                      Email
                    </label>
                    <div className="relative">
                      <Mail size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" />
                      <input
                        type="email"
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                        onBlur={() => handleBlur('email')}
                        placeholder="email@company.com"
                        className={`${inputClass(hasFieldError('email'))} pl-10 pr-4 py-3`}
                      />
                    </div>
                    {touched.email && errors.email && (
                      <p className="flex items-center gap-1 text-red-400 text-[11px] mt-1.5">
                        <AlertCircle size={10} /> {errors.email}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* --- Additional Section --- */}
              <div>
                <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-3">Additional</p>
                <div>
                  <label className="block text-[13px] font-medium text-gray-300 mb-2">
                    Notes
                  </label>
                  <div className="relative">
                    <StickyNote size={14} className="absolute left-4 top-3.5 text-gray-600" />
                    <textarea
                      value={newNotes}
                      onChange={(e) => setNewNotes(e.target.value)}
                      onBlur={() => handleBlur('notes')}
                      placeholder="Quick note about this contact..."
                      rows={3}
                      className={`${inputClass(hasFieldError('notes'))} pl-10 pr-4 py-3 resize-none`}
                    />
                  </div>
                  {touched.notes && errors.notes && (
                    <p className="flex items-center gap-1 text-red-400 text-[11px] mt-1.5">
                      <AlertCircle size={10} /> {errors.notes}
                    </p>
                  )}
                  {newNotes.length > 0 && (
                    <p className={`text-[10px] mt-1 text-right ${newNotes.length > 180 ? 'text-yellow-500' : 'text-gray-700'}`}>
                      {newNotes.length}/200
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Drawer footer */}
          <div className="px-6 py-5 border-t border-white/[0.04]">
            <div className="flex gap-3">
              <button
                onClick={closeDrawer}
                className="flex-1 px-4 py-2.5 rounded-lg bg-white/[0.05] text-gray-300 text-[14px] font-medium hover:bg-white/[0.08] transition-all duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!getPhoneValue()}
                className="flex-1 px-4 py-2.5 rounded-lg bg-brand-gold text-brand-dark-deep text-[14px] font-semibold hover:bg-brand-gold-light transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed shadow-md shadow-brand-gold/20"
              >
                {editingContact ? 'Update' : 'Save Contact'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
