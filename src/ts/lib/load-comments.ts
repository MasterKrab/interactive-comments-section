import type { Comment } from '../types/comment'
import type User from '../types/user'
import createComment from '../components/create-comment'

const loadComments = (
  container: HTMLElement,
  comments: Comment[],
  currentUser: User
) => {
  const sortedCommentsByScore = comments.sort((a, b) => b.score - a.score)

  const fragment = document.createDocumentFragment()

  sortedCommentsByScore.forEach((comment) => {
    const element = createComment(comment, currentUser)
    fragment.appendChild(element)
  })

  container.textContent = ''

  container.appendChild(fragment)
}

export default loadComments
