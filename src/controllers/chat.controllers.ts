import { Request, Response } from 'express'
import { chatService } from '~/services/chat.services'

export const getContactsController = async (req: Request, res: Response) => {
  const userId = (req.user?._id as unknown as string).toString()
  const contacts = await chatService.getContacts(userId)
  return res.json({ message: 'Get contacts successfully', result: contacts })
}

export const createRoomController = async (req: Request, res: Response) => {
  const userId = (req.user?._id as unknown as string).toString()
  const { memberIds, type } = req.body
  const result = await chatService.createRoom(userId, memberIds, type)
  return res.json({ message: 'Create room successfully', result })
}

export const getRoomsController = async (req: Request, res: Response) => {
  const userId = (req.user?._id as unknown as string).toString()
  const result = await chatService.getRooms(userId)
  return res.json({ message: 'Get rooms successfully', result })
}

export const getRoomController = async (req: Request, res: Response) => {
  const userId = (req.user?._id as unknown as string).toString()
  const roomId = req.params.roomId as string
  const result = await chatService.getRoom(userId, roomId)
  return res.json({ message: 'Get room successfully', result })
}

export const archiveRoomController = async (req: Request, res: Response) => {
  const userId = (req.user?._id as unknown as string).toString()
  const roomId = req.params.roomId as string
  const result = await chatService.archiveRoom(userId, roomId)
  return res.json(result)
}

export const getMessagesController = async (req: Request, res: Response) => {
  const userId = (req.user?._id as unknown as string).toString()
  const roomId = req.params.roomId as string
  const page = Number(req.query.page) || 1
  const limit = Number(req.query.limit) || 50
  const result = await chatService.getMessages(userId, roomId, page, limit)
  return res.json({ message: 'Get messages successfully', result })
}

export const sendMessageController = async (req: Request, res: Response) => {
  const userId = (req.user?._id as unknown as string).toString()
  const roomId = req.params.roomId as string
  const payload = req.body
  const result = await chatService.sendMessage(userId, roomId, payload)
  return res.json({ message: 'Send message successfully', result })
}

export const markReadController = async (req: Request, res: Response) => {
  const userId = (req.user?._id as unknown as string).toString()
  const messageId = req.params.messageId as string
  const result = await chatService.markRead(userId, messageId)
  return res.json(result)
}

export const deleteMessageController = async (req: Request, res: Response) => {
  const userId = (req.user?._id as unknown as string).toString()
  const messageId = req.params.messageId as string
  const result = await chatService.deleteMessage(userId, messageId)
  return res.json(result)
}

export const searchMessagesController = async (req: Request, res: Response) => {
  const userId = (req.user?._id as unknown as string).toString()
  const q = req.query.q as string
  const page = Number(req.query.page) || 1
  const limit = Number(req.query.limit) || 20
  const result = await chatService.searchMessages(userId, q, page, limit)
  return res.json({ message: 'Search messages successfully', result })
}
