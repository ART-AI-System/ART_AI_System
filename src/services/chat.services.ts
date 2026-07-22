import { ObjectId } from 'mongodb'
import databaseService from './database.service'
import ChatRoom, { RoomType } from '~/models/schemas/chatRoom.schema'
import ChatMessage from '~/models/schemas/chatMessage.schema'
import { ErrorWithStatus } from '~/models/Errors'
import HTTP_STATUS from '~/constants/httpStatus'

class ChatService {
  async checkPermission(userIdA: string, userIdB: string): Promise<boolean> {
    if (!userIdA || !userIdB || userIdA === userIdB) return false
    return true
  }

  async getContacts(userId: string) {
    const userOid = ObjectId.isValid(userId) ? new ObjectId(userId) : null
    const user = userOid ? await databaseService.users.findOne({ _id: userOid }) : null

    const contacts: any[] = []
    const contactIds = new Set<string>()

    const addContact = (u: any) => {
      if (u && u._id.toString() !== userId && !contactIds.has(u._id.toString())) {
        contactIds.add(u._id.toString())
        contacts.push({ _id: u._id, fullName: u.fullName, email: u.email, role: u.role, avatar: u.profile?.avatar, username: u.username, studentCode: u.studentCode })
      }
    }

    if (!user) {
      // Fallback if user profile lookup fails: return all lecturers, subject heads, and admins
      const staff = await databaseService.users.find({ isActive: true }).limit(50).toArray()
      staff.forEach(addContact)
      return contacts
    }

    if (user.role === 'STUDENT') {
      const classes = await databaseService.classes.find({ 'students.studentId': user._id }).toArray()
      for (const cls of classes) {
        if (cls.lecturer?.lecturerId) {
          const lecturer = await databaseService.users.findOne({ _id: cls.lecturer.lecturerId })
          addContact(lecturer)
        }
        for (const student of cls.students || []) {
          const s = await databaseService.users.findOne({ _id: student.studentId })
          addContact(s)
        }
      }
    } else if (user.role === 'LECTURER') {
      const classes = await databaseService.classes.find({ 'lecturer.lecturerId': user._id }).toArray()
      for (const cls of classes) {
        for (const student of cls.students || []) {
          const s = await databaseService.users.findOne({ _id: student.studentId })
          addContact(s)
        }
      }
      // Add Subject Heads & Admins as contacts for Lecturers
      const staff = await databaseService.users.find({ 
        role: { $in: ['SUBJECT_HEAD', 'ADMIN'] },
        isActive: true 
      }).toArray()
      staff.forEach(addContact)
    } else if (user.role === 'SUBJECT_HEAD' || (user.role as any) === 'subject_head' || (user.role as any) === 'headsubject') {
      // Add all Lecturers & Admins as contacts for Subject Head
      const staff = await databaseService.users.find({ 
        role: { $in: ['LECTURER', 'ADMIN', 'SUBJECT_HEAD'] },
        isActive: true 
      }).toArray()
      staff.forEach(addContact)
    } else if (user.role === 'ADMIN') {
      const allUsers = await databaseService.users.find({ isActive: true }).limit(50).toArray()
      allUsers.forEach(addContact)
    }

    // NEW LOGIC: Also include any user that we already have a direct chat room with
    const userOidForRooms = ObjectId.isValid(userId) ? new ObjectId(userId) : new ObjectId()
    const rooms = await databaseService.chatRooms.find({ 
      memberIds: userOidForRooms, 
      type: 'direct' 
    }).toArray()
    for (const room of rooms) {
      const otherId = room.memberIds.find(id => id.toString() !== userId)
      if (otherId) {
        const u = await databaseService.users.findOne({ _id: ObjectId.isValid(otherId.toString()) ? new ObjectId(otherId.toString()) : otherId })
        addContact(u)
      }
    }

    return contacts
  }

  async createRoom(userId: string, targetMemberIds: string[], type: RoomType = 'direct') {
    if (type === 'direct' && targetMemberIds.length === 1) {
      const targetId = targetMemberIds[0]
      const userOidVal = ObjectId.isValid(userId) ? new ObjectId(userId) : new ObjectId()
      const targetOidVal = ObjectId.isValid(targetId) ? new ObjectId(targetId) : new ObjectId()

      const existingRoom = await databaseService.chatRooms.findOne({
        type: 'direct',
        memberIds: { $all: [userOidVal, targetOidVal] }
      })
      if (existingRoom) return existingRoom
    }

    const allMemberIds = [
      ObjectId.isValid(userId) ? new ObjectId(userId) : userId,
      ...targetMemberIds.map(id => ObjectId.isValid(id) ? new ObjectId(id) : id)
    ]
    const room = new ChatRoom({
      type,
      memberIds: allMemberIds as any,
      createdBy: (ObjectId.isValid(userId) ? new ObjectId(userId) : userId) as any
    })

    const result = await databaseService.chatRooms.insertOne(room)
    return { ...room, _id: result.insertedId }
  }

  async getRooms(userId: string) {
    return await databaseService.chatRooms
      .find({ memberIds: new ObjectId(userId), archivedBy: { $ne: new ObjectId(userId) } })
      .sort({ updatedAt: -1 })
      .toArray()
  }

  async getRoom(userId: string, roomId: string) {
    const room = await databaseService.chatRooms.findOne({ _id: new ObjectId(roomId) })
    if (!room) throw new ErrorWithStatus({ message: 'Room not found', status: HTTP_STATUS.NOT_FOUND })
    if (!room.memberIds.some((id) => id.toString() === userId)) {
      throw new ErrorWithStatus({ message: 'Forbidden access to room', status: HTTP_STATUS.FORBIDDEN })
    }
    return room
  }

  async archiveRoom(userId: string, roomId: string) {
    await this.getRoom(userId, roomId)
    await databaseService.chatRooms.updateOne(
      { _id: new ObjectId(roomId) },
      { $addToSet: { archivedBy: new ObjectId(userId) } }
    )
    return { message: 'Room archived' }
  }

  async sendMessage(userId: string, roomId: string, payload: any) {
    const room = await this.getRoom(userId, roomId)
    const msg = new ChatMessage({
      roomId: new ObjectId(roomId),
      senderId: new ObjectId(userId),
      content: payload.content,
      messageType: payload.messageType,
      fileMetadata: payload.fileMetadata,
      readBy: [new ObjectId(userId)]
    })
    
    await databaseService.chatMessages.insertOne(msg)
    
    await databaseService.chatRooms.updateOne(
      { _id: new ObjectId(roomId) },
      { 
        $set: { lastMessage: payload.content, lastMessageAt: new Date(), updatedAt: new Date() },
        $pullAll: { archivedBy: room.memberIds }
      }
    )
    return msg
  }

  async getMessages(userId: string, roomId: string, page = 1, limit = 50) {
    await this.getRoom(userId, roomId)
    return await databaseService.chatMessages
      .find({ roomId: new ObjectId(roomId), isDeleted: false })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray()
  }

  async markRead(userId: string, messageId: string) {
    const msg = await databaseService.chatMessages.findOne({ _id: new ObjectId(messageId) })
    if (!msg) throw new ErrorWithStatus({ message: 'Message not found', status: HTTP_STATUS.NOT_FOUND })
    
    await this.getRoom(userId, msg.roomId.toString())

    if (!msg.readBy.some(id => id.toString() === userId)) {
      await databaseService.chatMessages.updateOne(
        { _id: new ObjectId(messageId) },
        { $push: { readBy: new ObjectId(userId) } }
      )
    }
    return { message: 'Marked as read' }
  }

  async deleteMessage(userId: string, messageId: string) {
    const msg = await databaseService.chatMessages.findOne({ _id: new ObjectId(messageId) })
    if (!msg) throw new ErrorWithStatus({ message: 'Message not found', status: HTTP_STATUS.NOT_FOUND })
    if (msg.senderId.toString() !== userId) {
      throw new ErrorWithStatus({ message: 'Not allowed to delete others message', status: HTTP_STATUS.FORBIDDEN })
    }
    await databaseService.chatMessages.updateOne(
      { _id: new ObjectId(messageId) },
      { $set: { isDeleted: true, deletedAt: new Date() } }
    )
    return { message: 'Message deleted' }
  }

  async searchMessages(userId: string, q: string, page = 1, limit = 20) {
    const rooms = await databaseService.chatRooms.find({ memberIds: new ObjectId(userId) }).toArray()
    const roomIds = rooms.map(r => r._id)

    return await databaseService.chatMessages
      .find({
        roomId: { $in: roomIds },
        isDeleted: false,
        content: { $regex: q, $options: 'i' }
      })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray()
  }

  async searchGlobalUsers(userId: string, q: string) {
    if (!q || q.trim().length === 0) return []
    const query = q.trim()

    const users = await databaseService.users.find({
      _id: { $ne: new ObjectId(userId) },
      isActive: true,
      $or: [
        { fullName: { $regex: query, $options: 'i' } },
        { username: { $regex: query, $options: 'i' } },
        { studentCode: { $regex: query, $options: 'i' } }
      ]
    }).limit(20).toArray()

    return users.map(u => ({
      _id: u._id,
      fullName: u.fullName,
      email: u.email,
      role: u.role,
      avatar: u.profile?.avatar,
      username: u.username,
      studentCode: u.studentCode
    }))
  }
}

export const chatService = new ChatService()
