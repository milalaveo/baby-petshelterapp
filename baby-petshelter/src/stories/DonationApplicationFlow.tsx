import { useEffect, useMemo, useState } from 'react'
import './donation-application-flow.css'

type DonationMode = 'monthly' | 'one-time' | 'supplies'
type ApplicantType = 'individual' | 'business'
type Step = 'form' | 'review' | 'submitting' | 'success'

type FormState = {
  applicantType: ApplicantType
  donorName: string
  email: string
  phone: string
  donationMode: DonationMode
  amount: string
  suppliesNote: string
  pickupNeeded: boolean
  pickupAddress: string
  message: string
  consent: boolean
}

const initialForm: FormState = {
  applicantType: 'individual',
  donorName: '',
  email: '',
  phone: '',
  donationMode: 'monthly',
  amount: '',
  suppliesNote: '',
  pickupNeeded: false,
  pickupAddress: '',
  message: '',
  consent: false,
}

function validate(form: FormState) {
  const errors: Partial<Record<keyof FormState, string>> = {}

  if (!form.donorName.trim()) {
    errors.donorName = 'Add the donor name.'
  }

  if (!form.email.trim()) {
    errors.email = 'Add an email address.'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'Enter a valid email address.'
  }

  if (!form.phone.trim()) {
    errors.phone = 'Add a phone number.'
  }

  if (form.donationMode !== 'supplies') {
    if (!form.amount.trim()) {
      errors.amount = 'Set the donation amount.'
    } else if (Number(form.amount) <= 0) {
      errors.amount = 'Amount must be greater than zero.'
    }
  }

  if (form.donationMode === 'supplies' && !form.suppliesNote.trim()) {
    errors.suppliesNote = 'List what the shelter should expect.'
  }

  if (form.pickupNeeded && !form.pickupAddress.trim()) {
    errors.pickupAddress = 'Add the pickup address.'
  }

  if (!form.consent) {
    errors.consent = 'Consent is required before submission.'
  }

  return errors
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null

  return <span className="donation-error">{message}</span>
}

export function DonationApplicationFlow() {
  const [form, setForm] = useState<FormState>(initialForm)
  const [step, setStep] = useState<Step>('form')
  const [showErrors, setShowErrors] = useState(false)
  const [draftSavedAt, setDraftSavedAt] = useState('just now')

  const errors = useMemo(() => validate(form), [form])
  const hasErrors = Object.keys(errors).length > 0

  useEffect(() => {
    if (step !== 'submitting') {
      return
    }

    const timeoutId = window.setTimeout(() => {
      setStep('success')
    }, 1400)

    return () => window.clearTimeout(timeoutId)
  }, [step])

  function patchForm<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [key]: value }))
    setDraftSavedAt('a few seconds ago')
  }

  function submitForReview() {
    setShowErrors(true)

    if (hasErrors) {
      setStep('form')
      return
    }

    setStep('review')
  }

  function confirmSubmit() {
    setStep('submitting')
  }

  function resetFlow() {
    setForm(initialForm)
    setStep('form')
    setShowErrors(false)
    setDraftSavedAt('just now')
  }

  const donationLabel =
    form.donationMode === 'supplies'
      ? 'Supply drop'
      : `${form.donationMode === 'monthly' ? 'Monthly' : 'One-time'} donation`

  return (
    <div className="donation-shell">
      <section className="donation-hero">
        <div className="donation-hero-copy">
          <p className="donation-eyebrow">Pet Shelter prototype</p>
          <h1>Donation application flow</h1>
          <p className="donation-lede">
            A clickable front-end-only prototype for donors who want to support the
            shelter with money or supplies. The flow includes draft, validation,
            review, submitting, and success states.
          </p>
        </div>

        <aside className="donation-status-card">
          <div className="donation-status-top">
            <span className={`donation-badge step-${step}`}>{step}</span>
            <span className="donation-draft">Draft saved {draftSavedAt}</span>
          </div>

          <ol className="donation-steps">
            <li className={step === 'form' ? 'active' : ''}>Fill application</li>
            <li className={step === 'review' ? 'active' : ''}>Review details</li>
            <li className={step === 'submitting' ? 'active' : ''}>Submit request</li>
            <li className={step === 'success' ? 'active' : ''}>Done</li>
          </ol>

          <div className="donation-quick-actions">
            <button
              type="button"
              className="ghost-button"
              onClick={() => {
                setForm({
                  applicantType: 'business',
                  donorName: 'Paws & Co Market',
                  email: 'giving@pawsco.example',
                  phone: '+49 30 555 0101',
                  donationMode: 'supplies',
                  amount: '',
                  suppliesNote: '12 blankets, 8 cat carriers, puppy pads',
                  pickupNeeded: true,
                  pickupAddress: 'Neue Schonhauser Str. 12, Berlin',
                  message: 'Pickup after 16:00 works best for our team.',
                  consent: true,
                })
                setShowErrors(false)
                setStep('review')
                setDraftSavedAt('just now')
              }}
            >
              Load ready example
            </button>
            <button type="button" className="ghost-button" onClick={resetFlow}>
              Reset flow
            </button>
          </div>
        </aside>
      </section>

      <section className="donation-layout">
        <div className="donation-form-card">
          {step === 'success' ? (
            <div className="success-state">
              <span className="success-mark">Application sent</span>
              <h2>Donation request received</h2>
              <p>
                The shelter team will contact <strong>{form.donorName || 'the donor'}</strong>{' '}
                at <strong>{form.email || 'the provided email'}</strong> to confirm the next
                step.
              </p>
              <div className="success-summary">
                <p>{donationLabel}</p>
                <p>
                  {form.donationMode === 'supplies'
                    ? form.suppliesNote
                    : `${form.amount || '0'} EUR pledged`}
                </p>
              </div>
              <div className="action-row">
                <button type="button" className="primary-button" onClick={resetFlow}>
                  Start another application
                </button>
                <button
                  type="button"
                  className="ghost-button"
                  onClick={() => setStep('review')}
                >
                  View submitted details
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="card-header">
                <div>
                  <p className="section-label">Application</p>
                  <h2>{step === 'review' ? 'Review before submit' : 'Donor details'}</h2>
                </div>
                {step === 'review' ? (
                  <button
                    type="button"
                    className="ghost-button"
                    onClick={() => setStep('form')}
                  >
                    Edit form
                  </button>
                ) : null}
              </div>

              <div className="form-grid">
                <label className="field field-span-2">
                  <span className="field-label">Applicant type</span>
                  <div className="segmented">
                    {[
                      ['individual', 'Individual'],
                      ['business', 'Business'],
                    ].map(([value, label]) => (
                      <button
                        key={value}
                        type="button"
                        className={form.applicantType === value ? 'active' : ''}
                        onClick={() => patchForm('applicantType', value as ApplicantType)}
                        disabled={step === 'review'}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </label>

                <label className="field">
                  <span className="field-label">Name</span>
                  <input
                    value={form.donorName}
                    onChange={(event) => patchForm('donorName', event.target.value)}
                    placeholder="Jane Foster"
                    disabled={step === 'review'}
                  />
                  <FieldError message={showErrors ? errors.donorName : undefined} />
                </label>

                <label className="field">
                  <span className="field-label">Email</span>
                  <input
                    value={form.email}
                    onChange={(event) => patchForm('email', event.target.value)}
                    placeholder="jane@example.com"
                    disabled={step === 'review'}
                  />
                  <FieldError message={showErrors ? errors.email : undefined} />
                </label>

                <label className="field">
                  <span className="field-label">Phone</span>
                  <input
                    value={form.phone}
                    onChange={(event) => patchForm('phone', event.target.value)}
                    placeholder="+49 30 123 4567"
                    disabled={step === 'review'}
                  />
                  <FieldError message={showErrors ? errors.phone : undefined} />
                </label>

                <label className="field">
                  <span className="field-label">Donation type</span>
                  <select
                    value={form.donationMode}
                    onChange={(event) =>
                      patchForm('donationMode', event.target.value as DonationMode)
                    }
                    disabled={step === 'review'}
                  >
                    <option value="monthly">Monthly donation</option>
                    <option value="one-time">One-time donation</option>
                    <option value="supplies">Supply drop</option>
                  </select>
                </label>

                {form.donationMode === 'supplies' ? (
                  <label className="field field-span-2">
                    <span className="field-label">Supplies list</span>
                    <textarea
                      rows={4}
                      value={form.suppliesNote}
                      onChange={(event) => patchForm('suppliesNote', event.target.value)}
                      placeholder="Food, blankets, medicine storage boxes..."
                      disabled={step === 'review'}
                    />
                    <FieldError message={showErrors ? errors.suppliesNote : undefined} />
                  </label>
                ) : (
                  <label className="field">
                    <span className="field-label">Amount, EUR</span>
                    <input
                      type="number"
                      min="1"
                      value={form.amount}
                      onChange={(event) => patchForm('amount', event.target.value)}
                      placeholder="75"
                      disabled={step === 'review'}
                    />
                    <FieldError message={showErrors ? errors.amount : undefined} />
                  </label>
                )}

                <label className="field field-span-2 checkbox-field">
                  <input
                    type="checkbox"
                    checked={form.pickupNeeded}
                    onChange={(event) => patchForm('pickupNeeded', event.target.checked)}
                    disabled={step === 'review'}
                  />
                  <span>Pickup from donor location is required</span>
                </label>

                {form.pickupNeeded ? (
                  <label className="field field-span-2">
                    <span className="field-label">Pickup address</span>
                    <textarea
                      rows={3}
                      value={form.pickupAddress}
                      onChange={(event) => patchForm('pickupAddress', event.target.value)}
                      placeholder="Street, city, contact instructions"
                      disabled={step === 'review'}
                    />
                    <FieldError message={showErrors ? errors.pickupAddress : undefined} />
                  </label>
                ) : null}

                <label className="field field-span-2">
                  <span className="field-label">Message to shelter</span>
                  <textarea
                    rows={4}
                    value={form.message}
                    onChange={(event) => patchForm('message', event.target.value)}
                    placeholder="Optional context for the shelter team"
                    disabled={step === 'review'}
                  />
                </label>

                <label className="field field-span-2 checkbox-field consent">
                  <input
                    type="checkbox"
                    checked={form.consent}
                    onChange={(event) => patchForm('consent', event.target.checked)}
                    disabled={step === 'review'}
                  />
                  <span>
                    I confirm the shelter may contact me about this donation application.
                  </span>
                  <FieldError message={showErrors ? errors.consent : undefined} />
                </label>
              </div>

              {step === 'submitting' ? (
                <div className="submitting-state">
                  <div className="pulse-dot" />
                  <div>
                    <strong>Submitting application</strong>
                    <p>The prototype is simulating a successful front-end request.</p>
                  </div>
                </div>
              ) : null}

              <div className="action-row">
                {step === 'review' ? (
                  <>
                    <button type="button" className="primary-button" onClick={confirmSubmit}>
                      Submit application
                    </button>
                    <button
                      type="button"
                      className="ghost-button"
                      onClick={() => setStep('form')}
                    >
                      Back to edit
                    </button>
                  </>
                ) : (
                  <>
                    <button type="button" className="primary-button" onClick={submitForReview}>
                      Continue to review
                    </button>
                    <button type="button" className="ghost-button" onClick={resetFlow}>
                      Clear form
                    </button>
                  </>
                )}
              </div>
            </>
          )}
        </div>

        <aside className="donation-summary-card">
          <div className="card-header">
            <div>
              <p className="section-label">Summary</p>
              <h2>What the shelter sees</h2>
            </div>
          </div>

          <dl className="summary-list">
            <div>
              <dt>Donor</dt>
              <dd>{form.donorName || 'Not filled yet'}</dd>
            </div>
            <div>
              <dt>Contact</dt>
              <dd>{form.email || 'Waiting for email'}</dd>
            </div>
            <div>
              <dt>Mode</dt>
              <dd>{donationLabel}</dd>
            </div>
            <div>
              <dt>Value</dt>
              <dd>
                {form.donationMode === 'supplies'
                  ? form.suppliesNote || 'No supplies listed'
                  : `${form.amount || '0'} EUR`}
              </dd>
            </div>
            <div>
              <dt>Pickup</dt>
              <dd>{form.pickupNeeded ? form.pickupAddress || 'Address missing' : 'No pickup'}</dd>
            </div>
          </dl>

          <div className="review-note">
            <strong>Available states</strong>
            <p>
              Try submitting an empty form for validation, complete it for review,
              submit it for a loading state, then land on success.
            </p>
          </div>
        </aside>
      </section>
    </div>
  )
}
