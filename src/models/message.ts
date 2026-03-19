// models/message.ts

export interface ChatMessage {
  user_from: number
  user_to: number
  content: string
  created_time: string | null
}
// user_id is i32 number