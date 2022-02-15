import dateToRelativeTime from './date-to-relative-time'

interface TimeUnits {
  [key: string]: number
}

const TIME_UNITS: TimeUnits = {
  second: 1000,
  minute: 60000,
  hour: 3600000,
}

const setDateInterval = (element: HTMLElement, createdAt: Date) => {
  const relativeTime = dateToRelativeTime(createdAt)

  element.textContent = relativeTime === '0 seconds ago' ? 'now' : relativeTime

  // Just set interval in seconds and minutes
  const regex = /second/

  const match = relativeTime.match(regex)

  if (!match) return

  const interval = setInterval(() => {
    const updatedCreatedAt = dateToRelativeTime(createdAt)

    element.textContent = updatedCreatedAt

    if (!updatedCreatedAt.match(regex)) clearInterval(interval)
  }, TIME_UNITS[match[0]])

  intervals.push(interval)
}

export default setDateInterval
