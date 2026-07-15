import { useState, useEffect, useCallback, useRef } from 'react';
import { chatService } from '../services/chat.service';
import type { ChatMessage } from '../types/chat';
import { useChatSocket } from './useChatSocket';
import { useAuth } from '../context/AuthContext';

export const useMessages = (roomId: string | null, options?: { onMessageSent?: (msg: ChatMessage) => void }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const { socket } = useChatSocket();
  const { user } = useAuth();
  
  const messagesRef = useRef(messages);
  messagesRef.current = messages;

  const loadMessages = useCallback(async (pageNum: number = 1, append: boolean = false) => {
    if (!roomId) return;
    try {
      setLoading(true);
      const limit = 10;
      const data = await chatService.getMessages(roomId, pageNum, limit);
      // Backend returns sorted by createdAt DESC (newest first)
      // So we want to reverse them if we append them at the top
      
      const reversedData = [...data].reverse();

      if (data.length < limit) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }

      setMessages(prev => {
        if (!append) return reversedData;
        const existingIds = new Set(prev.map(m => m._id));
        const filteredNew = reversedData.filter(m => !existingIds.has(m._id));
        return [...filteredNew, ...prev];
      });
      setPage(pageNum);
    } catch (err) {
      console.error('Failed to load messages:', err);
    } finally {
      setLoading(false);
    }
  }, [roomId]);

  useEffect(() => {
    if (roomId) {
      setMessages([]);
      setPage(1);
      setHasMore(true);
      loadMessages(1, false);
      
      // Join room via socket
      socket?.emit('chat:join_room', { roomId });
    }
  }, [roomId, loadMessages, socket]);

  useEffect(() => {
    if (!socket || !roomId) return;

    const handleNewMessage = (msg: ChatMessage) => {
      if (msg.roomId === roomId) {
        setMessages(prev => {
          // Prevent duplicates (optimistic update might already added it)
          if (prev.find(m => m._id === msg._id)) return prev;
          return [...prev, msg];
        });
        
        // If it's not our message, mark it as read
        if (msg.senderId !== user?.id) {
          socket.emit('chat:mark_read', { roomId, messageId: msg._id });
        }
      }
    };

    const handleMessageRead = (data: { roomId: string, messageId: string, readBy: string }) => {
      if (data.roomId === roomId) {
        setMessages(prev => prev.map(m => {
          if (m._id === data.messageId && !m.readBy.includes(data.readBy)) {
            return { ...m, readBy: [...m.readBy, data.readBy] };
          }
          return m;
        }));
      }
    };

    socket.on('chat:new_message', handleNewMessage);
    socket.on('chat:message_read', handleMessageRead);

    return () => {
      socket.off('chat:new_message', handleNewMessage);
      socket.off('chat:message_read', handleMessageRead);
    };
  }, [socket, roomId, user?.id]);

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      loadMessages(page + 1, true);
    }
  }, [loading, hasMore, loadMessages, page]);

  const sendMessage = useCallback(async (content: string, overrideRoomId?: string) => {
    const targetRoomId = overrideRoomId || roomId;
    if (!targetRoomId || !user?.id) return;

    // Optimistic Update
    const tempId = `temp_${Date.now()}`;
    const tempMessage: ChatMessage = {
      _id: tempId,
      roomId: targetRoomId,
      senderId: user.id,
      content,
      messageType: 'text',
      isDeleted: false,
      readBy: [user.id],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setMessages(prev => [...prev, tempMessage]);

    try {
      const msg = await chatService.sendMessage(targetRoomId, content);
      setMessages(prev => {
        const alreadyExists = prev.some(m => m._id === msg._id);
        if (alreadyExists) {
          return prev.filter(m => m._id !== tempId);
        }
        return prev.map(m => m._id === tempId ? msg : m);
      });
      options?.onMessageSent?.(msg);
    } catch (err) {
      console.error('Failed to send message:', err);
      // Rollback
      setMessages(prev => prev.filter(m => m._id !== tempId));
    }
  }, [roomId, socket, user]);

  return { messages, loading, hasMore, loadMore, sendMessage, page };
};
