import data from '../../assets/data.json'
import { getStorage } from '../utils/storage'
import createCommentForm from '../components/create-comment-form'
import type CommentsData from '../types/comments-data'
import loadComments from './load-comments'
import loadEventListeners from './load-event-listeners'

const loadPage = () => {
  const { body } = document

  const { currentUser, comments: defaultComments } = data as CommentsData

  const comments = getStorage('comments') || defaultComments

  const commentsElement = document.createElement('ul')
  commentsElement.classList.add('comments')
  body.appendChild(commentsElement)

  const form = createCommentForm(currentUser)
  body.appendChild(form)

  loadComments(commentsElement, comments, currentUser)

  loadEventListeners(currentUser, comments, commentsElement)
}

export default loadPage
