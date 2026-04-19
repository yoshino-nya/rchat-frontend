// models/message.ts

export interface ChatMessage {
  sender_id: number
  session_id: string
  content: string
}
// user_id is i32 number

export interface ChatMessageResponse {
  id: number
  sender_id: number
  content: string
  session_id: string
  created_time: string
  sender_avatar: string
}
