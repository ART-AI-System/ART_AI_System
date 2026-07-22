import { ObjectId } from 'mongodb'
import databaseService from './database.service'
import ChatRoom, { RoomType } from '~/models/schemas/chatRoom.schema'
import ChatMessage from '~/models/schemas/chatMessage.schema'
import { ErrorWithStatus } from '~/models/Errors'
import HTTP_STATUS from '~/constants/httpStatus'

class ChatService {
  async checkPermission(userIdA: string, userIdB: string): Promise<boolean> {
    if (!userIdA || !userIdB || userIdA === userIdB) return false
    const userAOid = ObjectId.isValid(userIdA) ? new ObjectId(userIdA) : null
    const userBOid = ObjectId.isValid(userIdB) ? new ObjectId(userIdB) : null

    const userA = userAOid ? await databaseService.users.findOne({ _id: userAOid }) : null
    const userB = userBOid ? await databaseService.users.findOne({ _id: userBOid }) : null

    if (!userA || !userB) return true // Fallback allow if profile not found

    const roleA = (userA.role as string).toUpperCase()
    const roleB = (userB.role as string).toUpperCase()

    if (roleA === 'SUBJECT_HEAD' || roleA === 'HEADSUBJECT') {
      return roleB === 'LECTURER' || roleB === 'ADMIN'
    }
    if (roleB === 'SUBJECT_HEAD' || roleB === 'HEADSUBJECT') {
      return roleA === 'LECTURER' || roleA === 'ADMIN'
    }
    if (roleA === 'LECTURER') {
      return roleB === 'SUBJECT_HEAD' || roleB === 'HEADSUBJECT' || roleB === 'STUDENT' || roleB === 'ADMIN'
    }
    return true
  }

  async getContacts(userId: string) {
    const userOid = ObjectId.isValid(userId) ? new ObjectId(userId) : null
    const user = userOid ? await databaseService.users.findOne({ _id: userOid }) : null

    const contacts: any[] = []
    const contactIds = new Set<string>()

    const userRole = (user?.role as string || '').toUpperCase()

    const addContact = (u: any) => {
      if (!u || u._id.toString() === userId || contactIds.has(u._id.toString())) return
      const uRole = (u.role as string || '').toUpperCase()

      // Strict role filtering for Headmaster and Lecturer
      if (userRole === 'SUBJECT_HEAD' || userRole === 'HEADSUBJECT') {
        if (uRole !== 'LECTURER') return // Headmaster ONLY allowed to contact Lecturers
      }
      if (userRole === 'LECTURER') {
        if (uRole !== 'SUBJECT_HEAD' && uRole !== 'HEADSUBJECT') return // Lecturer ONLY allowed to contact Headmaster
      }

      contactIds.add(u._id.toString())
      contacts.push({ _id: u._id, fullName: u.fullName, email: u.email, role: u.role, avatar: u.profile?.avatar, username: u.username, studentCode: u.studentCode })
    }

    if (!user) {
      const staff = await databaseService.users.find({ isActive: true }).limit(50).toArray()
      staff.forEach(addContact)
      return contacts
    }

    if (userRole === 'SUBJECT_HEAD' || userRole === 'HEADSUBJECT') {
      // Headmaster ONLY sees Lecturers
      const lecturers = await databaseService.users.find({ 
        role: 'LECTURER',
        isActive: true 
      }).toArray()
      lecturers.forEach(addContact)
    } else if (userRole === 'LECTURER') {
      // Lecturers ONLY see Subject Heads (Headmasters)
      const headmasters = await databaseService.users.find({ 
        role: 'SUBJECT_HEAD',
        isActive: true 
      }).toArray()
      headmasters.forEach(addContact)
    } else if (userRole === 'STUDENT') {
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
    } else if (userRole === 'ADMIN') {
      const allUsers = await databaseService.users.find({ isActive: true }).limit(50).toArray()
      allUsers.forEach(addContact)
    }

    // Also include any user that we already have a direct chat room with (subject to addContact strict role check)
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
    const currentUser = await databaseService.users.findOne({ _id: ObjectId.isValid(userId) ? new ObjectId(userId) : new ObjectId() })
    const userRole = (currentUser?.role as string || '').toUpperCase()

    const rooms = await databaseService.chatRooms
      .find({ memberIds: ObjectId.isValid(userId) ? new ObjectId(userId) : (userId as any), archivedBy: { $ne: ObjectId.isValid(userId) ? new ObjectId(userId) : (userId as any) } })
      .sort({ updatedAt: -1 })
      .toArray()

    if (userRole === 'SUBJECT_HEAD' || userRole === 'HEADSUBJECT') {
      // Filter rooms so Headmaster ONLY sees rooms with LECTURER members
      const validRooms: any[] = []
      for (const room of rooms) {
        if (room.type === 'group') continue
        const otherMemberId = room.memberIds.find(id => id.toString() !== userId)
        if (otherMemberId) {
          const otherUser = await databaseService.users.findOne({ _id: ObjectId.isValid(otherMemberId.toString()) ? new ObjectId(otherMemberId.toString()) : otherMemberId })
          if (otherUser && (otherUser.role as string).toUpperCase() === 'LECTURER') {
            validRooms.push(room)
          }
        }
      }
      return validRooms
    }

    if (userRole === 'LECTURER') {
      // Filter rooms so Lecturer ONLY sees rooms with SUBJECT_HEAD members
      const validRooms: any[] = []
      for (const room of rooms) {
        if (room.type === 'group') continue
        const otherMemberId = room.memberIds.find(id => id.toString() !== userId)
        if (otherMemberId) {
          const otherUser = await databaseService.users.findOne({ _id: ObjectId.isValid(otherMemberId.toString()) ? new ObjectId(otherMemberId.toString()) : otherMemberId })
          const otherRole = (otherUser?.role as string || '').toUpperCase()
          if (otherUser && (otherRole === 'SUBJECT_HEAD' || otherRole === 'HEADSUBJECT')) {
            validRooms.push(room)
          }
        }
      }
      return validRooms
    }

    return rooms
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
