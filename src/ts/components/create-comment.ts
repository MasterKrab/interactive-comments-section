import type { Comment, Reply } from '../types/comment'
import type User from '../types/user'
import iconPlus from '../icons/icon-plus'
import iconMinus from '../icons/icon-minus'
import markdown from '../utils/markdown'

const createComment = (
  data: Comment | Reply,
  currentUser: User
): HTMLElement => {
  const { id, content, createdAt, score, voted, user } = data

  const { username, image } = user
  const { png, webp } = image

  const li = document.createElement('li')
  li.classList.add('comments__item')

  const section = document.createElement('section')
  section.classList.add('comment')
  section.setAttribute('data-comment-id', id.toString())
  section.setAttribute('data-username', username)
  section.setAttribute('data-markdown', content)

  const replyingTo = (data as Reply)?.replyingTo
  replyingTo && section.setAttribute('data-replying-to', replyingTo)

  const labelStart = replyingTo ? 'Replying to' : 'Comment by'

  const label = `${labelStart} ${replyingTo || username}`

  section.setAttribute('aria-label', label)
  li.appendChild(section)

  const header = document.createElement('header')
  header.classList.add('comment__header')
  section.appendChild(header)

  const picture = document.createElement('picture')
  picture.classList.add('comment__picture')
  header.appendChild(picture)

  const source = document.createElement('source')
  source.setAttribute('type', 'image/webp')
  source.setAttribute('srcset', webp)
  picture.appendChild(source)

  const img = document.createElement('img')
  img.setAttribute('src', png)
  img.setAttribute('alt', username)
  img.classList.add('comment__image')
  picture.appendChild(img)

  const name = document.createElement('p')
  name.classList.add('comment__name')
  name.textContent = username
  header.appendChild(name)

  if (currentUser.username === username) {
    const you = document.createElement('span')
    you.classList.add('comment__you')
    you.textContent = 'you'
    name.appendChild(you)
  }

  const date = document.createElement('time', { is: 'time-ago' })
  date.setAttribute('data-date', createdAt)
  date.classList.add('comment__date')
  header.appendChild(date)

  const buttons = document.createElement('section')
  buttons.classList.add('comment__buttons')
  buttons.setAttribute('aria-label', 'Actions')
  section.appendChild(buttons)

  if (currentUser.username === username) {
    const deleteButton = document.createElement('button')
    deleteButton.classList.add('comment__button', 'comment__button--delete')
    deleteButton.textContent = 'Delete'
    deleteButton.setAttribute('aria-label', `Delete comment by ${username}`)
    buttons.appendChild(deleteButton)

    const editButton = document.createElement('button')
    editButton.classList.add('comment__button', 'comment__button--edit')
    editButton.textContent = 'Edit'
    editButton.setAttribute('aria-label', `Edit comment by ${username}`)
    buttons.appendChild(editButton)
  } else {
    const replyButton = document.createElement('button')
    replyButton.classList.add('comment__button', 'comment__button--reply')
    replyButton.textContent = 'Reply'
    replyButton.setAttribute('aria-label', `Reply to ${username}`)
    buttons.appendChild(replyButton)
  }

  const contentElement = document.createElement('p')
  contentElement.classList.add('comment__content')
  section.appendChild(contentElement)

  if (replyingTo) {
    const replyTo = document.createElement('span')
    replyTo.classList.add('comment__reply-to')
    replyTo.textContent = `@${replyingTo} `
    contentElement.appendChild(replyTo)
  }

  const contentHtml = markdown.render(content)

  contentElement.innerHTML += contentHtml

  const scoreContainer = document.createElement('div')
  scoreContainer.classList.add('score')
  section.appendChild(scoreContainer)

  const createButtonScore = (type: 'upvote' | 'downvote') => {
    const button = document.createElement('button')
    button.classList.add('score__button', `score__button--${type}`)

    type === voted && button.classList.add('score__button--active')

    const label = `${
      type === voted ? 'Remove' : ''
    } ${type} to ${labelStart.toLowerCase()}  ${username}`

    button.setAttribute('aria-label', label)
    button.innerHTML = type === 'upvote' ? iconPlus : iconMinus
    scoreContainer.appendChild(button)
  }

  createButtonScore('upvote')

  const counterScore = document.createElement('p')
  counterScore.classList.add('score__counter')
  counterScore.textContent = score.toString()
  counterScore.setAttribute('aria-label', `${score} votes`)
  scoreContainer.appendChild(counterScore)

  createButtonScore('downvote')

  const replies = (data as Comment)?.replies

  if (replies?.length) {
    const repliesElement = document.createElement('ul')
    repliesElement.classList.add('comments', 'comments--replies')

    li.appendChild(repliesElement)

    const repliesSortedByDate = replies.sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    )

    repliesSortedByDate.forEach((reply) => {
      const element = createComment(reply, currentUser)
      repliesElement.appendChild(element)
    })
  }

  return li
}

export default createComment
