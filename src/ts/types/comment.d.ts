import type User from './user'

interface Data {
  id: number | string
  content: string
  createdAt: string
  score: number
  voted?: 'upvote' | 'downvote' | null
  user: User
}

export interface Comment extends Data {
  replies: Reply[]
}

export interface Reply extends Data {
  replyingTo: string
}
