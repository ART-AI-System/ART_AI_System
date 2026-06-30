import { RoomType } from '~/models/schemas/chatRoom.schema'
import { MessageType } from '~/models/schemas/chatMessage.schema'

export interface CreateRoomReqBody {
  memberIds: string[]
  type?: RoomType
}

export interface SendMessageReqBody {
  content: string
  messageType?: MessageType
  fileMetadata?: any
}

export interface GetMessagesReqQuery {
  page?: string
  limit?: string
}

export interface SearchMessagesReqQuery {
  q: string
  page?: string
  limit?: string
}
