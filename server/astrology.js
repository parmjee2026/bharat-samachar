const signs = 'aries taurus gemini cancer leo virgo libra scorpio sagittarius capricorn aquarius pisces'.split(' ')
const timezone = 'Asia/Kolkata'
const clock = new Intl.DateTimeFormat('hi-IN', { timeZone: timezone, hour: '2-digit', minute: '2-digit', hour12: false })
const calendar = new Intl.DateTimeFormat('en-CA', { timeZone: timezone, year: 'numeric', month: '2-digit', day: '2-digit' })
const cache = new Map()
let token
let authorization

async function request(url, options) {
  const response = await fetch(url, { ...options, signal: AbortSignal.timeout(8000) })
  if (!response.ok) throw new Error('Astrology provider returned HTTP ' + response.status)
  return response.json()
}

async function accessToken() {
  if (token?.expires > Date.now()) return token.value
  if (!authorization) {
    authorization = request('https://api.prokerala.com/token', {
      method: 'POST',
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: process.env.PROKERALA_CLIENT_ID,
        client_secret: process.env.PROKERALA_CLIENT_SECRET,
      }),
    }).then(result => {
      if (!result.access_token) throw new Error('Missing provider token')
      token = { value: result.access_token, expires: Date.now() + Math.max(0, result.expires_in - 30) * 1000 }
      return token.value
    }).finally(() => { authorization = undefined })
  }
  return authorization
}

function daily(key, endpoint, params, map) {
  if (!process.env.PROKERALA_CLIENT_ID || !process.env.PROKERALA_CLIENT_SECRET) return null
  const day = calendar.format(new Date())
  const existing = cache.get(key)
  if (existing?.day === day && existing.retryAfter > Date.now()) return existing.result

  const entry = { day, retryAfter: Infinity }
  entry.result = (async () => {
    try {
      const query = new URLSearchParams({ ...params, datetime: day + 'T12:00:00+05:30' })
      const result = await request('https://api.prokerala.com/v2/' + endpoint + '?' + query, {
        headers: { Authorization: 'Bearer ' + await accessToken() },
      })
      if (result.status !== 'ok' || !result.data) throw new Error('Missing provider data')
      return map(result.data)
    } catch {
      entry.retryAfter = Date.now() + 10 * 60 * 1000
      return null
    }
  })()
  cache.set(key, entry)
  return entry.result
}

const time = value => Number.isFinite(Date.parse(value)) ? clock.format(new Date(value)) + ' IST' : undefined

export function delhiPanchang() {
  return daily('delhi', 'astrology/panchang', {
    coordinates: '28.6139,77.2090',
    ayanamsa: '1',
    la: 'hi',
  }, data => ({
    paksha: data.tithi?.[0]?.paksha,
    tithi: data.tithi?.map(item => item.name).join(' / '),
    nakshatra: data.nakshatra?.map(item => item.name).join(' / '),
    yoga: data.yoga?.map(item => item.name).join(' / '),
    karan: data.karana?.map(item => item.name).join(' / '),
    sunrise: time(data.sunrise),
    sunset: time(data.sunset),
    moonrise: time(data.moonrise),
    moonset: time(data.moonset),
  }))
}

export function dailyRashifal(index) {
  const sign = signs[index]
  if (!sign) return null
  return daily(sign, 'horoscope/daily', { sign }, data => data.daily_prediction?.prediction || null)
}
