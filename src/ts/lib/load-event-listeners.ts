import type User from '../types/user'
import type { Comment, Reply } from '../types/comment'
import getComment from '../utils/get-comment'
import createCommentForm from '../components/create-comment-form'
import { nanoid as generateId } from 'nanoid'
import loadComments from './load-comments'
import { saveStorage } from '../utils/storage'
import createTextBox from '../components/create-text-box'
import createConfirmModal from '../components/create-confirm-modal'
import sleep from '../utils/sleep'
import markdown from '../utils/markdown'
import createAlert from '../components/create-alert'
import waitEvent from '../utils/wait-events'

const loadEventListeners = (
  currentUser: User,
  comments: Comment[],
  commentsElement: HTMLElement
) => {
  const reloadComments = () => {
    saveStorage('comments', comments)
    loadComments(commentsElement, comments, currentUser)
  }

  const removeModal = async (modal: HTMLElement): Promise<void> => {
    modal.classList.remove('modal--active')
    const modalContent = modal.firstElementChild!
    modalContent.classList.remove('confirm-modal--active')

    await waitEvent(modalContent, 'transitionend')

    modal.remove()
    document.body.classList.remove('no-scroll')
  }

  const handleClick = async (e: Event) => {
    const target = e.target as HTMLElement

    if (target.classList.contains('modal')) return removeModal(target)

    if (target.classList.contains('confirm-modal__button--cancel'))
      return removeModal(target.closest('.modal')!)

    if (target.classList.contains('confirm-modal__button--delete')) {
      const commentId = target.getAttribute('data-comment-id')!
      const { comment, parent } = getComment(comments, commentId)!

      if (comment.user.username !== currentUser.username) return

      if (parent) {
        const filterParent = parent.replies.filter(
          (comment: Reply) => comment.id != commentId
        )

        parent.replies = filterParent
      } else {
        const filterComments = comments.filter(
          (comment: Comment) => comment.id != commentId
        )

        comments = filterComments
      }

      await removeModal(target.closest('.modal')!)
      reloadComments()
      return
    }

    const scoreButton = target.closest('.score__button')
    const commentContainer = target.closest('.comment')!
    const commentId = commentContainer?.getAttribute('data-comment-id')!

    if (scoreButton) {
      const { comment } = getComment(comments, commentId)!

      const isUpvote = scoreButton.classList.contains('score__button--upvote')

      if (isUpvote && comment.voted === 'upvote') {
        comment.voted = null
        comment.score--
      } else if (!isUpvote && comment.voted === 'downvote') {
        comment.voted = null
        comment.score++
      } else if (isUpvote && comment.voted === 'downvote') {
        comment.voted = 'upvote'
        comment.score += 2
      } else if (!isUpvote && comment.voted === 'upvote') {
        comment.voted = 'downvote'
        comment.score -= 2
      } else if (!isUpvote) {
        comment.voted = 'downvote'
        comment.score--
      } else {
        comment.voted = 'upvote'
        comment.score++
      }

      reloadComments()
      return
    }

    if (target.classList.contains('comment__button--reply')) {
      const nextSibling = commentContainer.nextElementSibling

      if (nextSibling?.classList.contains('comment-form'))
        return nextSibling.remove()

      const username = commentContainer.getAttribute('data-username')!
      const form = createCommentForm(
        currentUser,
        commentId,
        username,
        `@${username}`
      )

      commentContainer.parentElement!.insertBefore(
        form,
        commentContainer.nextElementSibling
      )

      const textBox = form.content
      textBox.focus()
      return
    }

    if (target.classList.contains('comment__button--edit')) {
      const element = commentContainer.children[2] as HTMLParagraphElement

      if (!element.classList.contains('comment__content')) {
        const parsedMarkdown = commentContainer.getAttribute(
          'data-parsed-markdown'
        )!

        const contentElement = document.createElement('p')
        contentElement.classList.add('comment__content')
        contentElement.innerHTML = parsedMarkdown
        commentContainer.insertBefore(contentElement, element)
        element.remove()
        return
      }

      const parsedMarkdown = element.innerHTML
      commentContainer.setAttribute('data-parsed-markdown', parsedMarkdown)

      const markdown = commentContainer.getAttribute('data-markdown')!
      const replyingTo = commentContainer.getAttribute('data-replying-to')
      const replyingToUsername = commentContainer.getAttribute(
        'data-replying-to-username'
      )

      const form = document.createElement('form')
      form.classList.add('comment__form')
      form.setAttribute('data-comment-id', commentId)
      replyingTo && form.setAttribute('data-replying-to', replyingTo)
      replyingToUsername &&
        form.setAttribute('data-replying-to-username', replyingToUsername)

      const text = replyingTo ? `@${replyingTo} ${markdown}` : markdown

      createTextBox(form, 'edit', 'Edit comment', text)

      const submitButton = document.createElement('button')
      submitButton.classList.add('submit-button', 'submit-button--edit-comment')
      submitButton.textContent = 'Update'
      form.appendChild(submitButton)

      commentContainer.insertBefore(form, element)
      element.remove()
      return
    }

    if (target.classList.contains('comment__button--delete')) {
      const modal = createConfirmModal(commentId)
      target.parentElement!.insertBefore(modal, target.nextElementSibling)
      document.body.classList.add('no-scroll')

      // Wait for the modal to be added to the DOM
      await sleep(0)

      modal.classList.add('modal--active')
      modal.firstElementChild?.classList.add('confirm-modal--active')
    }
  }

  const checkMention = (
    reply: Reply | string,
    replyingTo: string
  ): string | undefined => {
    const mention = `@${replyingTo}`

    if (typeof reply === 'string')
      return reply.startsWith(mention) ? reply.replace(mention, '') : reply

    if (reply.content.startsWith(mention))
      reply.content = reply.content.replace(`${mention} `, '')
  }

  const handleSubmit = (e: Event) => {
    e.preventDefault()

    const form = e.target as HTMLFormElement

    const contentElement = form.content

    const content = contentElement.value

    const parsed = markdown.render(content).slice(3, -5).trim()

    const replyingToUsername = form.getAttribute('data-replying-to-username')

    if (
      !parsed ||
      (replyingToUsername &&
        !(checkMention(parsed, replyingToUsername) as string).trim())
    ) {
      createAlert('You cannot send an empty text')
      contentElement.setAttribute('aria-invalid', 'true')
      return
    }

    contentElement.setAttribute('aria-invalid', 'false')
    form.reset()

    const commentId = form.getAttribute('data-comment-id')

    const replyingToId = form.getAttribute('data-replying-to')!

    if (commentId) {
      const { comment } = getComment(comments, commentId)!

      if (comment.user.username !== currentUser.username) return

      comment.content = content

      replyingToId && checkMention(comment as Reply, replyingToId)

      saveStorage('comments', comments)

      loadComments(commentsElement, comments, currentUser)

      return
    }

    const data = {
      content,
      user: currentUser,
      id: generateId(),
      createdAt: new Date().toISOString(),
      score: 0,
    }

    if (replyingToId) {
      const { comment, parent } = getComment(comments, replyingToId)!
      const replyingTo = comment.user.username

      const reply: Reply = {
        ...data,
        replyingTo,
      }

      checkMention(reply, replyingTo)

      if (parent) {
        ;(parent as Comment).replies.push(reply)
      } else {
        ;(comment as Comment).replies.push(reply)
      }
    } else {
      const comment: Comment = {
        ...data,
        replies: [],
      }

      comments.push(comment)
    }

    saveStorage('comments', comments)

    loadComments(commentsElement, comments, currentUser)
  }

  const { body } = document

  body.addEventListener('click', handleClick)
  body.addEventListener('submit', handleSubmit)
}

export default loadEventListeners
