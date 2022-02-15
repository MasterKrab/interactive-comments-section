import type { Comment, Reply } from '../types/comment'

interface Result {
  comment: Comment | Reply
  parent: Comment | null
}

const getComment = (data: Comment[], id: number | string): Result | null => {
  for (const comment of data) {
    if (comment.id == id) return { comment, parent: null }

    for (const reply of comment.replies) {
      if (reply.id == id) return { comment: reply, parent: comment }
    }
  }

  return null
}

export default getComment
