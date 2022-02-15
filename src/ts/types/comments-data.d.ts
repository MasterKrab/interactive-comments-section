import type User from './user'
import type { Comment } from './comment'

interface CommentsData {
  currentUser: User
  comments: Comment[]
}

export default CommentsData
