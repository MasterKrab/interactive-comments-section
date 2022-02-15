import focusableElements from '../utils/focusable-elements'

interface Result {
  element: HTMLElement
  setFocusableElements: () => void
}

const createModal = (): Result => {
  const modal = document.createElement('div')
  modal.classList.add('modal')
  modal.setAttribute('role', 'dialog')
  modal.setAttribute('aria-modal', 'true')

  let firstFocusElement: HTMLElement
  let lastFocusElement: HTMLElement

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Tab') {
      const focus = document.activeElement

      if (focus === firstFocusElement && e.shiftKey) {
        e.preventDefault()
        lastFocusElement!.focus()
      } else if (focus === lastFocusElement && !e.shiftKey) {
        e.preventDefault()
        firstFocusElement!.focus()
      }
    } else if (e.key === 'Escape') {
      modal.remove()
    }
  }

  const setFocusableElements = () => {
    const focusableElementsInNode = modal.querySelectorAll(focusableElements)

    firstFocusElement = focusableElementsInNode[0] as HTMLElement

    lastFocusElement = focusableElementsInNode[
      focusableElementsInNode.length - 1
    ] as HTMLElement

    if (firstFocusElement) {
      firstFocusElement.focus()

      modal.addEventListener('keydown', handleKeyDown)
    }
  }

  return { element: modal, setFocusableElements }
}

export default createModal
