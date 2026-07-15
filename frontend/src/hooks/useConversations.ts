import { useState, useEffect, useCallback } from 'react';
import { chatService } from '../services/chat.service';
import type { ChatRoom, ChatUser } from '../types/chat';
import { useChatSocket } from './useChatSocket';

// Global cache to prevent slow loading on every page visit
let cachedConversations: ChatRoom[] | null = null;
let cachedContacts: ChatUser[] | null = null;

let preloadPromise: Promise<void> | null = null;

export const preloadConversations = async () => {
  if (preloadPromise) return preloadPromise;
  
  preloadPromise = (async () => {
    try {
      const [roomsRes, contactsRes] = await Promise.all([
        chatService.getRooms(),
        chatService.getContacts()
      ]);
      
      cachedConversations = roomsRes;
      cachedContacts = contactsRes;
    } catch (error) {
      console.error('Failed to preload conversations', error);
    } finally {
      preloadPromise = null;
    }
  })();
  
  return preloadPromise;
};

export const useConversations = () => {
  const [conversations, setConversations] = useState<ChatRoom[]>(cachedConversations || []);
  const [contacts, setContacts] = useState<ChatUser[]>(cachedContacts || []);
  const [loading, setLoading] = useState(!cachedConversations || !cachedContacts);
  const [error, setError] = useState<string | null>(null);
  const { socket } = useChatSocket();

  const fetchConversations = useCallback(async () => {
    try {
      if (!cachedConversations || !cachedContacts) setLoading(true);
      await preloadConversations();
      
      if (cachedConversations && cachedContacts) {
        setConversations(cachedConversations);
        setContacts(cachedContacts);
      }
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
          cachedConversations = newConversations;
          return newConversations;
        }
        setTimeout(() => fetchConversations(), 0);
        return prev;
      });
    };

    const handleNewMessage = (msg: any) => {
      handleRoomUpdated({ roomId: msg.roomId, lastMessage: msg.content, lastMessageAt: msg.createdAt });
    };

    socket.on('chat:room_updated', handleRoomUpdated);
    socket.on('chat:new_message', handleNewMessage);

    return () => {
      socket.off('chat:room_updated', handleRoomUpdated);
      socket.off('chat:new_message', handleNewMessage);
    };
  }, [socket, fetchConversations]);

  return { conversations, contacts, loading, error, refetch: fetchConversations, setConversations };
};
