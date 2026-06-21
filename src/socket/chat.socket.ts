import { Server, Socket } from 'socket.io'
import { Server as HttpServer } from 'http'
import { verifyToken } from '~/utils/jwt'
import { config } from 'dotenv'
import { chatService } from '~/services/chat.services'

config()

export const initChatSocket = (httpServer: HttpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: '*' // In production, this should be restricted
    }
  })

  // Middleware for Authentication
  io.use(async (socket: Socket, next) => {
    try {
      const token = socket.handshake.auth?.token || socket.handshake.headers?.authorization?.split(' ')[1]
      if (!token) {
        return next(new Error('Authentication error: Token missing'))
      }
      const decoded = await verifyToken({
        token,
        secretOrPublicKey: process.env.JWT_SECRET_ACCESS_TOKEN as string
      })
      socket.data.userId = decoded.user_id
      next()
    } catch (error) {
      next(new Error('Authentication error: Invalid token'))
    }
  })

  io.on('connection', (socket: Socket) => {
    const userId = socket.data.userId

    console.log(`User connected to chat socket: ${userId}`)

    // Join personal room so user can receive events across all their conversations
    socket.join(userId)

    socket.on('chat:join_room', async ({ roomId }, callback) => {
      try {
        await chatService.getRoom(userId, roomId) // verify membership
        socket.join(roomId)
        if (callback) callback({ status: 'ok' })
      } catch (error: any) {
        if (callback) callback({ status: 'error', message: error.message })
      }
    })

    socket.on('chat:send_message', async ({ roomId, content, messageType, fileMetadata }, callback) => {
      try {
        const rawMsg = await chatService.sendMessage(userId, roomId, { content, messageType, fileMetadata })
        const room = await chatService.getRoom(userId, roomId)

        // Force convert ObjectIds to strings to prevent Socket.io serialization issues on Frontend
        const msg = {
          ...rawMsg,
          _id: rawMsg._id?.toString(),
          roomId: rawMsg.roomId.toString(),
          senderId: rawMsg.senderId.toString(),
          readBy: rawMsg.readBy.map((id: any) => id.toString()),
        }

        // Emit to all members' personal rooms so everyone gets realtime updates
        room.memberIds.forEach((memberId: any) => {
          const mId = memberId.toString()
          io.to(mId).emit('chat:new_message', msg)
          io.to(mId).emit('chat:room_updated', { roomId, lastMessage: content, lastMessageAt: msg.createdAt })
        })
        
        if (callback) callback({ status: 'ok', data: msg })
      } catch (error: any) {
        if (callback) callback({ status: 'error', message: error.message })
      }
    })

    socket.on('chat:typing', async ({ roomId, isTyping }) => {
      try {
        await chatService.getRoom(userId, roomId) // check permission
        socket.to(roomId).emit('chat:typing', { roomId, userId, isTyping })
      } catch (error) {
        // ignore if not allowed
      }
    })

    socket.on('chat:mark_read', async ({ roomId, messageId }) => {
      try {
        await chatService.markRead(userId, messageId)
        socket.to(roomId).emit('chat:message_read', { roomId, messageId, readBy: userId })
      } catch (error) {
        // ignore
      }
    })

    socket.on('disconnect', () => {
      console.log(`User disconnected from chat socket: ${userId}`)
    })
  })
}
