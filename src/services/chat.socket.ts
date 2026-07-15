import { io, Socket } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_API_BASE_URL 
  ? import.meta.env.VITE_API_BASE_URL.replace('/api', '') 
  : 'http://localhost:4000';

class ChatSocketService {
  private socket: Socket | null = null;
  private static instance: ChatSocketService;

  private constructor() {}

  public static getInstance(): ChatSocketService {
    if (!ChatSocketService.instance) {
      ChatSocketService.instance = new ChatSocketService();
    }
    return ChatSocketService.instance;
  }

  public connect(): Socket {
    if (!this.socket) {
      const token = localStorage.getItem('access_token') || localStorage.getItem('accessToken');
      this.socket = io(SOCKET_URL, {
        auth: {
          token
        },
        transports: ['websocket'],
        autoConnect: true,
      });

      this.socket.on('connect', () => {
        console.log('Socket connected:', this.socket?.id);
      });

      this.socket.on('disconnect', (reason) => {
        console.log('Socket disconnected:', reason);
      });

      this.socket.on('connect_error', (error) => {
        console.error('Socket connect_error:', error);
      });
    } else if (!this.socket.connected) {
      // Re-update token just in case
      const token = localStorage.getItem('access_token') || localStorage.getItem('accessToken');
      if (token) {
        this.socket.auth = { token };
      }
      this.socket.connect();
    }
    return this.socket;
  }

  public disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  public getSocket(): Socket | null {
    return this.socket;
  }
}

export const chatSocketService = ChatSocketService.getInstance();
export const socketService = chatSocketService;
