import { useEffect, useState } from 'react';
import { chatSocketService } from '../services/chat.socket';
import { Socket } from 'socket.io-client';

export const useChatSocket = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const s = chatSocketService.connect();
    setSocket(s);
    setIsConnected(s.connected);

    const onConnect = () => setIsConnected(true);
    const onDisconnect = () => setIsConnected(false);

    s.on('connect', onConnect);
    s.on('disconnect', onDisconnect);

    return () => {
      s.off('connect', onConnect);
      s.off('disconnect', onDisconnect);
      // We don't disconnect the socket entirely here, because it's a singleton and other components might use it.
      // If we want to truly disconnect on unmount of the entire app, it would be handled differently.
    };
  }, []);

  return { socket, isConnected };
};
