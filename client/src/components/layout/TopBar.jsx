import { useEffect, useState } from 'react'

const formatCurrentDate = (date) =>
  new Intl.DateTimeFormat('hi-IN', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(date)
<TopBar
  city="नई दिल्ली"
  temperature={31}
  weatherLabel="साफ"
  language="hi"
  onLanguageChange={(value) => {
    console.log('Selected language:', value)
  }}
/>
function TopBar({
  city = 'नई दिल्ली',
  temperature = null,
  weatherLabel = '',
  language = 'hi',
  onLanguageChange,
}) {
  const [currentDate, setCurrentDate] = useState(() => new Date())

  useEffect(() => {
    const timer = window.setInterval(() => {
      setCurrentDate(new Date())
    }, 60 * 1000)

    return () => {
      window.clearInterval(timer)
    }
  }, [])

  const handleLanguageChange = (event) => {
    const selectedLanguage = event.target.value

    if (typeof onLanguageChange === 'function') {
      onLanguageChange(selectedLanguage)
    }
  }

  const hasWeather =
    temperature !== null &&
    temperature !== undefined &&
    temperature !== ''

  return (
    <div className="top-bar">
      <div className="container top-bar-inner">
        <div className="top-bar-left">
          <span className="top-bar-live">
            <span
              className="top-bar-live-dot"
              aria-hidden="true"
            />
            LIVE
          </span>

          <time
            className="top-bar-date"
            dateTime={currentDate.toISOString()}
          >
            {formatCurrentDate(currentDate)}
          </time>
        </div>

        <div className="top-bar-right">
          <div
            className="top-bar-weather"
            aria-label={`मौसम, ${city}`}
          >
            <span
              className="top-bar-weather-icon"
              aria-hidden="true"
            >
              ☀
            </span>

            <span className="top-bar-weather-city">
              {city}
            </span>

            {hasWeather && (
              <span className="top-bar-weather-temperature">
                {temperature}°
              </span>
            )}

            {weatherLabel && (
              <span className="top-bar-weather-label">
                {weatherLabel}
              </span>
            )}
          </div>

          <label
            className="top-bar-language"
            aria-label="भाषा चुनें"
          >
            <span
              className="top-bar-language-icon"
              aria-hidden="true"
            >
              🌐
            </span>

            <select
              value={language}
              onChange={handleLanguageChange}
              className="top-bar-language-select"
              aria-label="भाषा"
            >
              <option value="hi">हिन्दी</option>
              <option value="en">English</option>
            </select>
          </label>
        </div>
      </div>
    </div>
  )
}

export default TopBar
