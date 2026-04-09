import { useState } from 'react'
import './pet-shelter-playground.css'

type PrototypeKind = 'intake' | 'adoption' | 'volunteer'

type PetRecord = {
  id: string
  name: string
  breed: string
  age: string
  note: string
  status: string
  tag: string
}

type CandidateRecord = {
  id: string
  petName: string
  petType: string
  traits: string[]
  energy: string
  badge: string
}

type ShiftRecord = {
  id: string
  title: string
  time: string
  people: string
  need: string
  tone: 'calm' | 'warm' | 'urgent'
}

const intakePets: PetRecord[] = [
  {
    id: 'milo',
    name: 'Milo',
    breed: 'Tabby kitten',
    age: '4 months',
    note: 'Needs quiet crate and hydration check.',
    status: 'Waiting for kennel',
    tag: 'new arrival',
  },
  {
    id: 'marta',
    name: 'Marta',
    breed: 'Mixed senior dog',
    age: '10 years',
    note: 'Medication at 19:00, nervous around noise.',
    status: 'Medical review',
    tag: 'priority',
  },
  {
    id: 'bean',
    name: 'Bean',
    breed: 'Mini lop rabbit',
    age: '2 years',
    note: 'Recovered from transport stress, eating again.',
    status: 'Ready for habitat',
    tag: 'stable',
  },
]

const adoptionCandidates: CandidateRecord[] = [
  {
    id: 'nova',
    petName: 'Nova',
    petType: 'Playful husky mix',
    traits: ['runner', 'smart', 'teen-friendly'],
    energy: 'High energy',
    badge: 'best for active homes',
  },
  {
    id: 'olive',
    petName: 'Olive',
    petType: 'Shy calico cat',
    traits: ['quiet', 'lap naps', 'apartment-ready'],
    energy: 'Low energy',
    badge: 'great first rescue cat',
  },
  {
    id: 'pico',
    petName: 'Pico',
    petType: 'Guinea pig duo',
    traits: ['bonded pair', 'kids 8+', 'gentle'],
    energy: 'Medium energy',
    badge: 'small-space companions',
  },
]

const volunteerShifts: ShiftRecord[] = [
  {
    id: 'laundry',
    title: 'Laundry + bedding reset',
    time: '07:00 - 09:00',
    people: '2 / 4 filled',
    need: 'Need two more hands before intake van arrives.',
    tone: 'urgent',
  },
  {
    id: 'walks',
    title: 'Sunset dog walks',
    time: '18:30 - 20:00',
    people: '5 / 6 filled',
    need: 'One confident leash volunteer needed.',
    tone: 'warm',
  },
  {
    id: 'photos',
    title: 'Adoption photo corner',
    time: '12:00 - 14:00',
    people: '3 / 3 filled',
    need: 'Team is covered, backups can join the waitlist.',
    tone: 'calm',
  },
]

function IntakePrototype() {
  const [selectedId, setSelectedId] = useState(intakePets[0].id)
  const [assignedKennel, setAssignedKennel] = useState('Quarantine Suite B')
  const [triageState, setTriageState] = useState<'pending' | 'checked-in'>(
    'pending',
  )

  const activePet = intakePets.find((pet) => pet.id === selectedId) ?? intakePets[0]

  return (
    <div className="playground-shell intake-theme">
      <section className="playground-hero">
        <div>
          <p className="eyebrow">Prototype 01</p>
          <h1>Rapid intake board</h1>
          <p className="lede">
            Front desk logs arrivals, picks a kennel, and hands off a pet to the
            medical team in a single surface.
          </p>
        </div>
        <div className="hero-panel">
          <span className={`status-pill ${triageState}`}>
            {triageState === 'pending' ? '3 pets need placement' : 'Handoff ready'}
          </span>
          <button
            className="primary-action"
            type="button"
            onClick={() =>
              setTriageState((current) =>
                current === 'pending' ? 'checked-in' : 'pending',
              )
            }
          >
            {triageState === 'pending' ? 'Mark intake complete' : 'Reopen intake'}
          </button>
        </div>
      </section>

      <section className="prototype-grid">
        <div className="panel">
          <div className="panel-header">
            <h2>Arrivals</h2>
            <span>Click a card to inspect details</span>
          </div>
          <div className="stack">
            {intakePets.map((pet) => (
              <button
                key={pet.id}
                className={`list-card ${selectedId === pet.id ? 'selected' : ''}`}
                type="button"
                onClick={() => setSelectedId(pet.id)}
              >
                <div className="list-card-top">
                  <strong>{pet.name}</strong>
                  <span className="mini-tag">{pet.tag}</span>
                </div>
                <span>{pet.breed}</span>
                <span className="muted">
                  {pet.age} • {pet.status}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="panel detail-panel">
          <div className="panel-header">
            <h2>{activePet.name}</h2>
            <span>{activePet.breed}</span>
          </div>

          <div className="detail-block">
            <p className="metric-label">Arrival note</p>
            <p>{activePet.note}</p>
          </div>

          <div className="detail-block">
            <p className="metric-label">Assign kennel</p>
            <div className="chip-row">
              {['Quarantine Suite B', 'Cat Loft 2', 'Observation Pen 4'].map(
                (kennel) => (
                  <button
                    key={kennel}
                    type="button"
                    className={`chip ${assignedKennel === kennel ? 'active' : ''}`}
                    onClick={() => setAssignedKennel(kennel)}
                  >
                    {kennel}
                  </button>
                ),
              )}
            </div>
          </div>

          <div className="summary-banner">
            <span className="summary-title">Next step</span>
            <p>
              {activePet.name} will move to <strong>{assignedKennel}</strong> and
              appear in the nurse queue after handoff.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

function AdoptionPrototype() {
  const [selectedId, setSelectedId] = useState(adoptionCandidates[1].id)
  const [filter, setFilter] = useState<'all' | 'quiet' | 'active'>('quiet')
  const [meetingBooked, setMeetingBooked] = useState(false)

  const visibleCandidates = adoptionCandidates.filter((candidate) => {
    if (filter === 'all') return true
    if (filter === 'quiet') return candidate.energy === 'Low energy'
    return candidate.energy === 'High energy'
  })

  const activeCandidate =
    visibleCandidates.find((candidate) => candidate.id === selectedId) ??
    visibleCandidates[0] ??
    adoptionCandidates[0]

  return (
    <div className="playground-shell adoption-theme">
      <section className="playground-hero">
        <div>
          <p className="eyebrow">Prototype 02</p>
          <h1>Adoption matchmaker</h1>
          <p className="lede">
            Counselors filter by lifestyle, compare matches, and book a meet and
            greet without leaving the prototype.
          </p>
        </div>
        <div className="hero-panel">
          <span className="status-pill spotlight">
            {meetingBooked ? 'Meet-and-greet booked' : 'Counselor flow'}
          </span>
          <div className="chip-row">
            {[
              ['quiet', 'Quiet home'],
              ['active', 'Active home'],
              ['all', 'Show all'],
            ].map(([value, label]) => (
              <button
                key={value}
                type="button"
                className={`chip ${filter === value ? 'active' : ''}`}
                onClick={() => {
                  setFilter(value as 'all' | 'quiet' | 'active')
                  setMeetingBooked(false)
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="prototype-grid">
        <div className="panel">
          <div className="panel-header">
            <h2>Suggested pets</h2>
            <span>{visibleCandidates.length} match{visibleCandidates.length === 1 ? '' : 'es'}</span>
          </div>
          <div className="stack">
            {visibleCandidates.map((candidate) => (
              <button
                key={candidate.id}
                className={`list-card ${activeCandidate.id === candidate.id ? 'selected' : ''}`}
                type="button"
                onClick={() => {
                  setSelectedId(candidate.id)
                  setMeetingBooked(false)
                }}
              >
                <div className="list-card-top">
                  <strong>{candidate.petName}</strong>
                  <span className="mini-tag">{candidate.energy}</span>
                </div>
                <span>{candidate.petType}</span>
                <span className="muted">{candidate.badge}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="panel detail-panel">
          <div className="panel-header">
            <h2>{activeCandidate.petName}</h2>
            <span>{activeCandidate.petType}</span>
          </div>

          <div className="detail-block">
            <p className="metric-label">Household fit</p>
            <div className="chip-row">
              {activeCandidate.traits.map((trait) => (
                <span key={trait} className="trait-pill">
                  {trait}
                </span>
              ))}
            </div>
          </div>

          <div className="summary-banner">
            <span className="summary-title">Suggested next action</span>
            <p>
              {meetingBooked
                ? `Visit booked for Saturday at 11:30 with ${activeCandidate.petName}.`
                : `Schedule a 20 minute introduction with ${activeCandidate.petName} in the family room.`}
            </p>
          </div>

          <button
            className="primary-action wide"
            type="button"
            onClick={() => setMeetingBooked((current) => !current)}
          >
            {meetingBooked ? 'Cancel booking' : 'Book meet-and-greet'}
          </button>
        </div>
      </section>
    </div>
  )
}

function VolunteerPrototype() {
  const [selectedId, setSelectedId] = useState(volunteerShifts[0].id)
  const [joined, setJoined] = useState<string[]>([])

  const activeShift =
    volunteerShifts.find((shift) => shift.id === selectedId) ?? volunteerShifts[0]

  const joinedCurrent = joined.includes(activeShift.id)

  return (
    <div className="playground-shell volunteer-theme">
      <section className="playground-hero">
        <div>
          <p className="eyebrow">Prototype 03</p>
          <h1>Volunteer shift board</h1>
          <p className="lede">
            Coordinators highlight staffing gaps, and volunteers can join or leave
            a shift with immediate feedback.
          </p>
        </div>
        <div className="hero-panel">
          <span className="status-pill warm">
            {joined.length > 0 ? `${joined.length} shift joined` : 'Open community board'}
          </span>
          <p className="hero-note">Best used as a clickable staffing prototype.</p>
        </div>
      </section>

      <section className="prototype-grid">
        <div className="panel">
          <div className="panel-header">
            <h2>Today&apos;s shifts</h2>
            <span>Independent experiment for volunteer ops</span>
          </div>
          <div className="stack">
            {volunteerShifts.map((shift) => (
              <button
                key={shift.id}
                className={`list-card ${selectedId === shift.id ? 'selected' : ''}`}
                type="button"
                onClick={() => setSelectedId(shift.id)}
              >
                <div className="list-card-top">
                  <strong>{shift.title}</strong>
                  <span className={`mini-tag ${shift.tone}`}>{shift.people}</span>
                </div>
                <span>{shift.time}</span>
                <span className="muted">{shift.need}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="panel detail-panel">
          <div className="panel-header">
            <h2>{activeShift.title}</h2>
            <span>{activeShift.time}</span>
          </div>

          <div className="detail-block">
            <p className="metric-label">Coverage</p>
            <p>{activeShift.people}</p>
          </div>

          <div className="summary-banner">
            <span className="summary-title">Why this matters</span>
            <p>{activeShift.need}</p>
          </div>

          <button
            className="primary-action wide"
            type="button"
            onClick={() =>
              setJoined((current) =>
                current.includes(activeShift.id)
                  ? current.filter((shiftId) => shiftId !== activeShift.id)
                  : [...current, activeShift.id],
              )
            }
          >
            {joinedCurrent ? 'Leave this shift' : 'Join this shift'}
          </button>
        </div>
      </section>
    </div>
  )
}

export function PetShelterPlayground({
  prototype,
}: {
  prototype: PrototypeKind
}) {
  if (prototype === 'intake') {
    return <IntakePrototype />
  }

  if (prototype === 'adoption') {
    return <AdoptionPrototype />
  }

  return <VolunteerPrototype />
}
