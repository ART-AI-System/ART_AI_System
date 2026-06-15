import { ObjectId } from 'mongodb'

export type MessageType = 'text' | 'image' | 'file'

export interface ChatMessageType {
  _id?: ObjectId
  roomId: ObjectId
  senderId: ObjectId
  messageType?: MessageType
  content: string
  fileMetadata?: any
  readBy?: ObjectId[]
  isDeleted?: boolean
  deletedAt?: Date | null
  createdAt?: Date
  updatedAt?: Date
}

export default class ChatMessage {
  _id?: ObjectId
  roomId: ObjectId
  senderId: ObjectId
  messageType: MessageType
  content: string
  fileMetadata?: any
  readBy: ObjectId[]
  isDeleted: boolean
  deletedAt: Date | null
  createdAt: Date
  updatedAt: Date

  constructor(msg: ChatMessageType) {
    const date = new Date()
    this._id = msg._id || new ObjectId()
    this.roomId = msg.roomId
    this.senderId = msg.senderId
    this.messageType = msg.messageType || 'text'
    this.content = msg.content
    this.fileMetadata = msg.fileMetadata
    this.readBy = msg.readBy || []
    this.isDeleted = msg.isDeleted || false
    this.deletedAt = msg.deletedAt || null
    this.createdAt = msg.createdAt || date
    this.updatedAt = msg.updatedAt || date
  }
}
