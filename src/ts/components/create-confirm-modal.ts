import createModal from './create-modal'

const createConfirmModal = (id: number | string): HTMLElement => {
  const { element: modal, setFocusableElements } = createModal()

  const container = document.createElement('div')
  container.classList.add('confirm-modal')
  modal.appendChild(container)

  const title = document.createElement('h2')
  title.classList.add('confirm-modal__title')
  title.textContent = 'Delete comment'
  container.appendChild(title)

  const text = document.createElement('p')
  text.classList.add('confirm-modal__text')
  text.textContent =
    "Are you sure you want to delete this comment? This will remove comment and can't be undone."
  container.appendChild(text)

  const buttons = document.createElement('div')
  buttons.classList.add('confirm-modal__buttons')
  container.appendChild(buttons)

  const cancelButton = document.createElement('button')
  cancelButton.classList.add(
    'confirm-modal__button',
    'confirm-modal__button--cancel'
  )
  cancelButton.textContent = 'No, cancel'
  buttons.appendChild(cancelButton)

  const deleteButton = document.createElement('button')
  deleteButton.classList.add(
    'confirm-modal__button',
    'confirm-modal__button--delete'
  )
  deleteButton.setAttribute('data-comment-id', id.toString())
  deleteButton.textContent = 'Yes, delete'
  buttons.appendChild(deleteButton)

  setFocusableElements()

  return modal
}

export default createConfirmModal
