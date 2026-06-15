import { ObjectId } from 'mongodb'

export type RoomType = 'direct' | 'group'

export interface ChatRoomContext {
  classId?: ObjectId
  departmentId?: ObjectId
}

export interface ChatRoomType {
  _id?: ObjectId
  type: RoomType
  memberIds: ObjectId[]
  context?: ChatRoomContext
  lastMessage?: string | null
  lastMessageAt?: Date | null
  archivedBy?: ObjectId[]
  unreadCounts?: Record<string, number>
  createdBy?: ObjectId
  isActive?: boolean
  createdAt?: Date
  updatedAt?: Date
}

export default class ChatRoom {
  _id?: ObjectId
  type: RoomType
  memberIds: ObjectId[]
  context: ChatRoomContext
  lastMessage: string | null
  lastMessageAt: Date | null
  archivedBy: ObjectId[]
  unreadCounts: Record<string, number>
  createdBy?: ObjectId
  isActive: boolean
  createdAt: Date
  updatedAt: Date

  constructor(room: ChatRoomType) {
    const date = new Date()
    this._id = room._id || new ObjectId()
    this.type = room.type
    this.memberIds = room.memberIds
    this.context = room.context || {}
    this.lastMessage = room.lastMessage || null
    this.lastMessageAt = room.lastMessageAt || null
    this.archivedBy = room.archivedBy || []
    this.unreadCounts = room.unreadCounts || {}
    this.createdBy = room.createdBy
    this.isActive = room.isActive !== undefined ? room.isActive : true
    this.createdAt = room.createdAt || date
    this.updatedAt = room.updatedAt || date
  }
}
