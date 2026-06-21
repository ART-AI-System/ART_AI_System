import { useState, useEffect, useCallback } from 'react';
import { chatService } from '../services/chat.service';
import type { ChatRoom, ChatUser } from '../types/chat';
import { useChatSocket } from './useChatSocket';

export const useConversations = () => {
  const [conversations, setConversations] = useState<ChatRoom[]>([]);
  const [contacts, setContacts] = useState<ChatUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { socket } = useChatSocket();

  const fetchConversations = useCallback(async () => {
    try {
      setLoading(true);
      const [roomsRes, contactsRes] = await Promise.all([
        chatService.getRooms(),
        chatService.getContacts()
      ]);
      setConversations(roomsRes);
      setContacts(contactsRes);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to load conversations');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  useEffect(() => {
    if (!socket) return;

    const handleRoomUpdated = (data: { roomId: string, lastMessage: string, lastMessageAt: string }) => {
      setConversations(prev => {
        const idx = prev.findIndex(r => r._id === data.roomId);
        if (idx > -1) {
          const updatedRoom = { ...prev[idx], lastMessage: data.lastMessage, lastMessageAt: data.lastMessageAt };
          const newConversations = [...prev];
          newConversations.splice(idx, 1);
          newConversations.unshift(updatedRoom);
          return newConversations;
        }
        // If not found, maybe it's a new room. Refetch conversations.
        setTimeout(() => fetchConversations(), 0);
        return prev;
      });
    };

    socket.on('chat:room_updated', handleRoomUpdated);

    return () => {
      socket.off('chat:room_updated', handleRoomUpdated);
    };
  }, [socket]);

  return { conversations, contacts, loading, error, refetch: fetchConversations, setConversations };
};
