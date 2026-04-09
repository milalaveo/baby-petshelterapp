import { useEffect, useMemo, useState } from 'react'
import './adoption-home-prototype.css'

type AnimalKind = 'cat' | 'dog'
type VisitStep = 'browse' | 'book' | 'submitting' | 'confirmed'

type Pet = {
  id: string
  kind: AnimalKind
  name: string
  age: string
  breed: string
  city: string
  vibe: string
  note: string
  tag: string
}

type BookingForm = {
  visitorName: string
  email: string
  date: string
  time: string
  note: string
}

const pets: Pet[] = [
  {
    id: 'luna',
    kind: 'cat',
    name: 'Luna',
    age: '2 years',
    breed: 'British shorthair mix',
    city: 'Berlin shelter',
    vibe: 'Quiet and observant',
    note: 'Best for calm apartments and patient first meetings.',
    tag: 'cat',
  },
  {
    id: 'pearl',
    kind: 'cat',
    name: 'Pearl',
    age: '8 months',
    breed: 'Tuxedo kitten',
    city: 'Berlin shelter',
    vibe: 'Curious and playful',
    note: 'Loves window spots and short toy sessions.',
    tag: 'cat',
  },
  {
    id: 'milo',
    kind: 'dog',
    name: 'Milo',
    age: '3 years',
    breed: 'Beagle mix',
    city: 'Berlin shelter',
    vibe: 'Friendly and food-motivated',
    note: 'Good starter dog for adopters who want daily walks.',
    tag: 'dog',
  },
  {
    id: 'freya',
    kind: 'dog',
    name: 'Freya',
    age: '5 years',
    breed: 'Shepherd mix',
    city: 'Berlin shelter',
    vibe: 'Loyal and steady',
    note: 'Prefers adults and structured introductions.',
    tag: 'dog',
  },
]

const initialBooking: BookingForm = {
  visitorName: '',
  email: '',
  date: '',
  time: '11:00',
  note: '',
}

function validateBooking(form: BookingForm) {
  const errors: Partial<Record<keyof BookingForm, string>> = {}

  if (!form.visitorName.trim()) {
    errors.visitorName = 'Enter your name.'
  }

  if (!form.email.trim()) {
    errors.email = 'Enter your email.'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'Enter a valid email.'
  }

  if (!form.date.trim()) {
    errors.date = 'Choose a visit date.'
  }

  if (!form.time.trim()) {
    errors.time = 'Choose a time slot.'
  }

  return errors
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null

  return <span className="adoption-field-error">{message}</span>
}

export function AdoptionHomePrototype() {
  const [filter, setFilter] = useState<AnimalKind | 'all'>('all')
  const [selectedPetId, setSelectedPetId] = useState('luna')
  const [visitStep, setVisitStep] = useState<VisitStep>('browse')
  const [booking, setBooking] = useState<BookingForm>(initialBooking)
  const [showErrors, setShowErrors] = useState(false)

  const visiblePets = useMemo(() => {
    if (filter === 'all') {
      return pets
    }

    return pets.filter((pet) => pet.kind === filter)
  }, [filter])

  const selectedPet =
    visiblePets.find((pet) => pet.id === selectedPetId) ??
    visiblePets[0] ??
    pets.find((pet) => pet.id === selectedPetId) ??
    pets[0]

  const errors = useMemo(() => validateBooking(booking), [booking])
  const hasErrors = Object.keys(errors).length > 0

  useEffect(() => {
    if (visitStep !== 'submitting') {
      return
    }

    const timeoutId = window.setTimeout(() => {
      setVisitStep('confirmed')
    }, 1200)

    return () => window.clearTimeout(timeoutId)
  }, [visitStep])

  function updateBooking<K extends keyof BookingForm>(key: K, value: BookingForm[K]) {
    setBooking((current) => ({ ...current, [key]: value }))
  }

  function startBooking() {
    setVisitStep('book')
    setShowErrors(false)
  }

  function submitBooking() {
    setShowErrors(true)

    if (hasErrors) {
      return
    }

    setVisitStep('submitting')
  }

  function resetBooking() {
    setBooking(initialBooking)
    setShowErrors(false)
    setVisitStep('browse')
  }

  return (
    <div className="adoption-shell">
      <section className="adoption-hero">
        <div className="adoption-hero-copy">
          <p className="adoption-eyebrow">Pet Shelter prototype</p>
          <h1>Find a cat or dog and book a visit</h1>
          <p className="adoption-lede">
            A simple home page prototype for browsing pets that need a new home,
            selecting one animal, and reserving an in-shelter visit.
          </p>
          <div className="adoption-filter-row">
            {[
              ['all', 'All pets'],
              ['cat', 'Cats'],
              ['dog', 'Dogs'],
            ].map(([value, label]) => (
              <button
                key={value}
                type="button"
                className={`filter-pill ${filter === value ? 'active' : ''}`}
                onClick={() => setFilter(value as AnimalKind | 'all')}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <aside className="adoption-hero-panel">
          <span className={`visit-badge step-${visitStep}`}>{visitStep}</span>
          <p className="hero-panel-title">Current selected pet</p>
          <strong>{selectedPet.name}</strong>
          <span>
            {selectedPet.breed} • {selectedPet.age}
          </span>
          <p className="hero-panel-copy">{selectedPet.note}</p>
        </aside>
      </section>

      <section className="adoption-layout">
        <div className="pet-grid-panel">
          <div className="section-top">
            <div>
              <p className="section-label">Homepage</p>
              <h2>Available cats and dogs</h2>
            </div>
            <span className="section-meta">{visiblePets.length} pets visible</span>
          </div>

          <div className="pet-grid">
            {visiblePets.map((pet) => (
              <button
                key={pet.id}
                type="button"
                className={`pet-card ${selectedPet.id === pet.id ? 'selected' : ''}`}
                onClick={() => {
                  setSelectedPetId(pet.id)
                  setVisitStep('browse')
                  setShowErrors(false)
                }}
              >
                <span className="pet-tag">{pet.tag}</span>
                <div className="pet-card-copy">
                  <strong>{pet.name}</strong>
                  <span>
                    {pet.breed} • {pet.age}
                  </span>
                  <span>{pet.city}</span>
                </div>
                <p>{pet.vibe}</p>
              </button>
            ))}
          </div>
        </div>

        <aside className="booking-panel">
          <div className="section-top">
            <div>
              <p className="section-label">Visit flow</p>
              <h2>{selectedPet.name}</h2>
            </div>
            <span className="section-meta">{selectedPet.kind}</span>
          </div>

          <div className="pet-focus-card">
            <p className="focus-title">{selectedPet.vibe}</p>
            <p>{selectedPet.note}</p>
          </div>

          {visitStep === 'browse' ? (
            <div className="booking-state">
              <p className="focus-title">Ready to visit?</p>
              <p>
                Start the booking flow to reserve a meeting with {selectedPet.name} at
                the shelter.
              </p>
              <button type="button" className="primary-cta" onClick={startBooking}>
                Book a visit
              </button>
            </div>
          ) : null}

          {visitStep === 'book' || visitStep === 'submitting' ? (
            <div className="booking-form">
              <label className="booking-field">
                <span>Your name</span>
                <input
                  value={booking.visitorName}
                  onChange={(event) => updateBooking('visitorName', event.target.value)}
                  placeholder="Alex Morgan"
                  disabled={visitStep === 'submitting'}
                />
                <FieldError message={showErrors ? errors.visitorName : undefined} />
              </label>

              <label className="booking-field">
                <span>Email</span>
                <input
                  value={booking.email}
                  onChange={(event) => updateBooking('email', event.target.value)}
                  placeholder="alex@example.com"
                  disabled={visitStep === 'submitting'}
                />
                <FieldError message={showErrors ? errors.email : undefined} />
              </label>

              <div className="booking-split">
                <label className="booking-field">
                  <span>Date</span>
                  <input
                    type="date"
                    value={booking.date}
                    onChange={(event) => updateBooking('date', event.target.value)}
                    disabled={visitStep === 'submitting'}
                  />
                  <FieldError message={showErrors ? errors.date : undefined} />
                </label>

                <label className="booking-field">
                  <span>Time</span>
                  <select
                    value={booking.time}
                    onChange={(event) => updateBooking('time', event.target.value)}
                    disabled={visitStep === 'submitting'}
                  >
                    <option value="11:00">11:00</option>
                    <option value="13:30">13:30</option>
                    <option value="16:00">16:00</option>
                  </select>
                  <FieldError message={showErrors ? errors.time : undefined} />
                </label>
              </div>

              <label className="booking-field">
                <span>Note for the shelter</span>
                <textarea
                  rows={4}
                  value={booking.note}
                  onChange={(event) => updateBooking('note', event.target.value)}
                  placeholder="Tell us if you want to meet only this pet or also similar pets."
                  disabled={visitStep === 'submitting'}
                />
              </label>

              {visitStep === 'submitting' ? (
                <div className="submitting-box">
                  <div className="booking-spinner" />
                  <div>
                    <strong>Sending reservation</strong>
                    <p>The prototype is simulating a successful booking request.</p>
                  </div>
                </div>
              ) : null}

              <div className="booking-actions">
                <button
                  type="button"
                  className="primary-cta"
                  onClick={submitBooking}
                  disabled={visitStep === 'submitting'}
                >
                  Confirm visit
                </button>
                <button
                  type="button"
                  className="secondary-cta"
                  onClick={resetBooking}
                  disabled={visitStep === 'submitting'}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : null}

          {visitStep === 'confirmed' ? (
            <div className="confirmed-box">
              <span className="confirmation-pill">Visit reserved</span>
              <p className="focus-title">
                {selectedPet.name} is booked for a first meeting.
              </p>
              <p>
                We&apos;ll expect <strong>{booking.visitorName || 'the visitor'}</strong> on{' '}
                <strong>{booking.date || 'the selected date'}</strong> at{' '}
                <strong>{booking.time}</strong>.
              </p>
              <div className="booking-actions">
                <button type="button" className="primary-cta" onClick={resetBooking}>
                  Book another visit
                </button>
                <button
                  type="button"
                  className="secondary-cta"
                  onClick={() => setVisitStep('book')}
                >
                  Edit booking
                </button>
              </div>
            </div>
          ) : null}
        </aside>
      </section>
    </div>
  )
}
