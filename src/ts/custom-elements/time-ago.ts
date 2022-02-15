import dateToRelativeTime from '../utils/date-to-relative-time'

interface TimeUnits {
  [key: string]: number
}

const TIME_UNITS: TimeUnits = {
  second: 1000,
  minute: 60000,
  hour: 3600000,
}

class TimeAgo extends HTMLTimeElement {
  interval: NodeJS.Timer | null = null

  connectedCallbak() {
    this.updateValues()
  }

  static get observedAttributes() {
    return ['data-date']
  }

  updateValues() {
    if (!this.hasAttribute('data-date')) return

    const dateString = this.getAttribute('data-date')!
    const date = new Date(dateString)

    this.setAttribute('datetime', dateString)

    const relativeTime = dateToRelativeTime(date)

    this.textContent = relativeTime === '0 seconds ago' ? 'now' : relativeTime

    const regex = /second|minute|hour/

    const match = relativeTime.match(regex)

    if (!match) return

    this.interval = setInterval(() => {
      const updatedCreatedAt = dateToRelativeTime(date)

      this.textContent = updatedCreatedAt

      if (!updatedCreatedAt.match(regex)) this.clearDateInterval()
    }, TIME_UNITS[match[0]])
  }

  clearDateInterval() {
    if (this.interval) {
      clearInterval(this.interval!)
      this.interval = null
    }
  }

  attributeChangedCallback(attributeName: string) {
    if (attributeName === 'data-date') {
      this.clearDateInterval()
      this.updateValues()
    }
  }

  disconnectedCallback() {
    this.clearDateInterval()
  }
}

window.customElements.define('time-ago', TimeAgo, { extends: 'time' })
