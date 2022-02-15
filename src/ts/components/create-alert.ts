import waitEvent from '../utils/wait-events'

const createAlert = async (message: string) => {
  const alert = document.createElement('p')
  alert.setAttribute('role', 'alert')
  alert.classList.add('alert')
  alert.textContent = message

  document.body.appendChild(alert)

  await waitEvent(alert, 'animationend')

  alert.remove()
}

export default createAlert
