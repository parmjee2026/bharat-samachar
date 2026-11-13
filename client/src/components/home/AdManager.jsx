import React, { useState } from 'react'

const emptyAd = { title: '', src: '' }

export default function AdManager({ ads, api, onChange }) {
  const [ad, setAd] = useState(emptyAd)
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')

  async function save(method, item) {
    setBusy(true)
    setMessage('')
    try {
      const endpoint = '/api/admin/ads' + (item.id ? '/' + encodeURIComponent(item.id) : '')
      const updated = await api(endpoint, {
        method,
        body: method === 'DELETE' ? undefined : JSON.stringify(item),
      })
      onChange(updated)
      setAd(emptyAd)
      setMessage(method === 'DELETE' ? 'विज्ञापन हटा दिया गया।' : 'विज्ञापन सेव हो गया।')
    } catch (error) {
      setMessage(error.message)
    } finally {
      setBusy(false)
    }
  }

  function choosePoster(event) {
    const file = event.target.files[0]
    event.target.value = ''
    if (!file) return
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 1024 * 1024) {
      setMessage('1 MB तक की JPG, PNG या WebP फ़ाइल चुनें।')
      return
    }

    setBusy(true)
    setMessage('')
    const reader = new FileReader()
    reader.onload = () => setAd(current => ({ ...current, src: reader.result }))
    reader.onerror = () => setMessage('फ़ोटो पढ़ी नहीं जा सकी। फिर से चुनें।')
    reader.onloadend = () => setBusy(false)
    reader.readAsDataURL(file)
  }

  const hasUpload = ad.src.startsWith('data:image/')

  return (
    <div className="admin-columns">
      <form className="editor-form" onSubmit={event => {
        event.preventDefault()
        save(ad.id ? 'PUT' : 'POST', ad)
      }}>
        <h2>{ad.id ? 'विज्ञापन संपादित करें' : 'विज्ञापन जोड़ें'}</h2>
        <label className="field">
          शीर्षक
          <input required maxLength={120} value={ad.title}
            onChange={event => setAd({ ...ad, title: event.target.value })} />
        </label>
        <label className="field">
          कंप्यूटर से पोस्टर चुनें (JPG, PNG या WebP, अधिकतम 1 MB)
          <input type="file" accept="image/jpeg,image/png,image/webp" disabled={busy} onChange={choosePoster} />
        </label>
        {hasUpload && <img src={ad.src} alt="चुना गया पोस्टर" style={{ maxWidth: '100%', maxHeight: 180 }} />}
        <label className="field">
          या पोस्टर का HTTPS इमेज लिंक
          <input required={!hasUpload} maxLength={2048} value={hasUpload ? '' : ad.src} placeholder="https://example.com/poster.jpg"
            onChange={event => setAd({ ...ad, src: event.target.value })} />
        </label>
        <button className="primary-btn" disabled={busy}>सेव करें</button>
        {ad.id && <button type="button" disabled={busy} onClick={() => setAd(emptyAd)}>रद्द करें</button>}
        <p role="status">{message}</p>
      </form>
      <section className="admin-list">
        <h2>स्लाइडशो के विज्ञापन</h2>
        {!ads.length && <p>अभी कोई विज्ञापन नहीं है।</p>}
        {ads.map(item => (
          <article key={item.id}>
            <h3>{item.title}</h3>
            <button type="button" disabled={busy} onClick={() => setAd(item)}>संपादित करें</button>
            <button type="button" disabled={busy} onClick={() => {
              if (window.confirm('यह विज्ञापन हटाएँ?')) save('DELETE', item)
            }}>हटाएँ</button>
          </article>
        ))}
      </section>
    </div>
  )
}
