import { nanoid as generateId } from 'nanoid'

const createTextBox = (
  container: HTMLElement,
  type: 'new' | 'edit',
  labelText: string,
  defaultContent: string = ''
) => {
  const containerTextBox = document.createElement('div')
  containerTextBox.classList.add('text-box', `text-box--${type}-comment`)

  const textBox = document.createElement('textarea')
  textBox.name = 'content'
  textBox.setAttribute('aria-required', 'true')
  textBox.setAttribute('aria-label', labelText)
  textBox.contentEditable = 'true'
  textBox.classList.add('text-box__editor')
  textBox.value = defaultContent
  textBox.placeholder = 'Add a comment...'
  containerTextBox.appendChild(textBox)

  const link = document.createElement('a')
  link.classList.add('text-box__link')
  link.href = 'https://guides.github.com/features/mastering-markdown/'
  link.target = '_blank'
  link.rel = 'noopener noreferrer'
  link.textContent = 'Markdown is supported'
  containerTextBox.appendChild(link)

  const image = document.createElement('img')
  image.classList.add('text-box__image')
  image.src = '/assets/images/icon-markdown.svg'
  link.prepend(image)

  container.appendChild(containerTextBox)
}

export default createTextBox
