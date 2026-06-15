import { Router } from 'express'
import { wrapRequestHandler } from '~/utils/handlers'
import { requireAuth } from '~/middlewares/auth.middlewares'
import {
  createRoomValidator,
  sendMessageValidator
} from '~/middlewares/chat.middlewares'
import {
  getContactsController,
  createRoomController,
  getRoomsController,
  getRoomController,
  archiveRoomController,
  getMessagesController,
  sendMessageController,
  markReadController,
  deleteMessageController,
  searchMessagesController
} from '~/controllers/chat.controllers'

const chatRouter = Router()

chatRouter.use(requireAuth)

chatRouter.get('/contacts', wrapRequestHandler(getContactsController))

chatRouter.get('/rooms', wrapRequestHandler(getRoomsController))
chatRouter.post('/rooms', createRoomValidator, wrapRequestHandler(createRoomController))
chatRouter.get('/rooms/:roomId', wrapRequestHandler(getRoomController))
chatRouter.patch('/rooms/:roomId/archive', wrapRequestHandler(archiveRoomController))

chatRouter.get('/rooms/:roomId/messages', wrapRequestHandler(getMessagesController))
chatRouter.post('/rooms/:roomId/messages', sendMessageValidator, wrapRequestHandler(sendMessageController))

chatRouter.get('/messages/search', wrapRequestHandler(searchMessagesController))
chatRouter.patch('/messages/:messageId/read', wrapRequestHandler(markReadController))
chatRouter.delete('/messages/:messageId', wrapRequestHandler(deleteMessageController))

export default chatRouter
