import React, { useState } from 'react'

export default function RashifalEditor({ data, api, onSave }) {
  const [sign, setSign] = useState('0')
  const [draft, setDraft] = useState(null)
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')
  const entries = data.dailyHindiRashifal?.day === data.rashifalDay
    ? data.dailyHindiRashifal.entries
    : {}
  const text = draft ?? entries[sign] ?? ''

  async function publish(event) {
    event.preventDefault()
    setBusy(true)
    setMessage('')
    try {
      const saved = await api('/api/admin/rashifal/' + sign, {
        method: 'PUT',
        body: JSON.stringify({ day: data.rashifalDay, text }),
      })
      onSave(saved)
      setDraft(null)
      setMessage('दैनिक राशिफल प्रकाशित हो गया।')
    } catch (error) {
      setMessage(error.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <form className="editor-form" onSubmit={publish}>
      <h2>हिंदी दैनिक राशिफल</h2>
      <p>{data.rashifalDay} (IST)</p>
      <label className="field">
        राशि
        <select value={sign} disabled={busy} onChange={event => {
          setSign(event.target.value)
          setDraft(null)
          setMessage('')
        }}>
          {data.rashifalSigns?.map((name, index) => <option key={name} value={index}>{name}</option>)}
        </select>
      </label>
      <label className="field">
        राशिफल
        <textarea required maxLength={2000} rows={6} value={text}
          disabled={busy} onChange={event => setDraft(event.target.value)} />
      </label>
      <button className="primary-btn" disabled={busy || !text.trim()}>प्रकाशित करें</button>
      <p role="status">{message}</p>
    </form>
  )
}
