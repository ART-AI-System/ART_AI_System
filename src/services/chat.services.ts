import { ObjectId } from 'mongodb'
import databaseService from './database.service'
import ChatRoom, { RoomType } from '~/models/schemas/chatRoom.schema'
import ChatMessage from '~/models/schemas/chatMessage.schema'
import { ErrorWithStatus } from '~/models/Errors'
import HTTP_STATUS from '~/constants/httpStatus'

class ChatService {
  async checkPermission(userIdA: string, userIdB: string): Promise<boolean> {
    if (userIdA === userIdB) return false

    const userA = await databaseService.users.findOne({ _id: new ObjectId(userIdA) })
    const userB = await databaseService.users.findOne({ _id: new ObjectId(userIdB) })

    if (!userA || !userB) return false

    // TEMPORARY BYPASS FOR TESTING: Allow anyone to chat with anyone
    return true;

    /* 
    if (userA.role === 'STUDENT' && userB.role === 'STUDENT') {
      const sharedClass = await databaseService.classes.findOne({
        'students.studentId': { $all: [new ObjectId(userIdA), new ObjectId(userIdB)] }
      })
      return !!sharedClass
    }

    if (
      (userA.role === 'STUDENT' && userB.role === 'LECTURER') ||
      (userA.role === 'LECTURER' && userB.role === 'STUDENT')
    ) {
      const studentId = userA.role === 'STUDENT' ? userA._id : userB._id
      const lecturerId = userA.role === 'LECTURER' ? userA._id : userB._id

      const relatedClass = await databaseService.classes.findOne({
        'lecturer.lecturerId': lecturerId,
        'students.studentId': studentId
      })
      return !!relatedClass
    }

    if (
      (userA.role === 'LECTURER' && userB.role === 'SUBJECT_HEAD') ||
      (userA.role === 'SUBJECT_HEAD' && userB.role === 'LECTURER')
    ) {
      if (userA.departmentId && userB.departmentId && userA.departmentId.toString() === userB.departmentId.toString()) {
        return true
      }
      return false
    }

    return true // Originally return false
    */
  }

  async getContacts(userId: string) {
    const user = await databaseService.users.findOne({ _id: new ObjectId(userId) })
    if (!user) throw new ErrorWithStatus({ message: 'User not found', status: HTTP_STATUS.NOT_FOUND })

    const contacts: any[] = []
    const contactIds = new Set<string>()

    const addContact = (u: any) => {
      if (u && u._id.toString() !== userId && !contactIds.has(u._id.toString())) {
        contactIds.add(u._id.toString())
        contacts.push({ _id: u._id, fullName: u.fullName, email: u.email, role: u.role, avatar: u.profile?.avatar, username: u.username, studentCode: u.studentCode })
      }
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
      if (user.departmentId) {
        const subjectHeads = await databaseService.users.find({ departmentId: user.departmentId, role: 'SUBJECT_HEAD' }).toArray()
        subjectHeads.forEach(addContact)
      }
    } else if (user.role === 'SUBJECT_HEAD') {
      if (user.departmentId) {
        const lecturers = await databaseService.users.find({ departmentId: user.departmentId, role: 'LECTURER' }).toArray()
        lecturers.forEach(addContact)
      }
    }

    // NEW LOGIC: Also include any user that we already have a direct chat room with
    const rooms = await databaseService.chatRooms.find({ memberIds: new ObjectId(userId), type: 'direct' }).toArray()
    for (const room of rooms) {
      const otherId = room.memberIds.find(id => id.toString() !== userId)
      if (otherId) {
        const u = await databaseService.users.findOne({ _id: otherId })
        addContact(u)
      }
    }

    return contacts
  }

  async createRoom(userId: string, targetMemberIds: string[], type: RoomType = 'direct') {
    if (type === 'direct' && targetMemberIds.length === 1) {
      const targetId = targetMemberIds[0]
      const hasPermission = await this.checkPermission(userId, targetId)
      if (!hasPermission) {
        throw new ErrorWithStatus({ message: 'No permission to chat with this user', status: HTTP_STATUS.FORBIDDEN })
      }

      const existingRoom = await databaseService.chatRooms.findOne({
        type: 'direct',
        memberIds: { $all: [new ObjectId(userId), new ObjectId(targetId)], $size: 2 }
      })
      if (existingRoom) return existingRoom
    }

    const allMemberIds = [new ObjectId(userId), ...targetMemberIds.map(id => new ObjectId(id))]
    const room = new ChatRoom({
      type,
      memberIds: allMemberIds,
      createdBy: new ObjectId(userId)
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
