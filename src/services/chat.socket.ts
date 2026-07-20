import { io, Socket } from 'socket.io-client';

/**
 * Frontend Socket.IO client service for real-time chat.
 * Connects to the backend via the Vite proxy (/socket.io → localhost:4000).
 */
class ChatSocketService {
  private socket: Socket | null = null;

  connect(): Socket {
    if (this.socket && this.socket.connected) {
      return this.socket;
    }

    const token = localStorage.getItem('access_token');

    this.socket = io('/', {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    this.socket.on('connect', () => {
      console.log('[ChatSocket] Connected:', this.socket?.id);
    });

    this.socket.on('disconnect', (reason) => {
      console.log('[ChatSocket] Disconnected:', reason);
    });

    this.socket.on('connect_error', (err) => {
      console.error('[ChatSocket] Connection error:', err.message);
    });

    return this.socket;
  }

  getSocket(): Socket | null {
    return this.socket;
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

export const chatSocketService = new ChatSocketService();
export const socketService = chatSocketService;
