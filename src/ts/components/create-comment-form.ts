import type User from '../types/user'
import createTextBox from './create-text-box'

const createCommentForm = (
  currentUser: User,
  replyingToId?: string,
  replyingToUsername?: string,
  defaultContent?: string
) => {
  const form = document.createElement('form')
  form.classList.add('comment-form')
  replyingToId && form.setAttribute('data-replying-to', replyingToId)
  replyingToUsername &&
    form.setAttribute('data-replying-to-username', replyingToUsername)

  const { username, image } = currentUser
  const { png, webp } = image

  const picture = document.createElement('picture')
  picture.classList.add('comment-form__picture')
  form.appendChild(picture)

  const source = document.createElement('source')
  source.setAttribute('type', 'image/webp')
  source.setAttribute('srcset', webp)
  picture.appendChild(source)

  const img = document.createElement('img')
  img.setAttribute('src', png)
  img.setAttribute('alt', username)
  img.classList.add('comment-form__image')
  picture.appendChild(img)

  createTextBox(
    form,
    'new',
    `Write a ${replyingToId ? 'reply' : 'comment'}`,
    defaultContent
  )

  const button = document.createElement('button')
  button.classList.add('submit-button', 'submit-button--new-comment')
  button.textContent = replyingToId ? 'Reply' : 'Send'
  form.appendChild(button)

  return form
}

export default createCommentForm
