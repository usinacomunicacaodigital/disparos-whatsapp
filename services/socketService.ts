import { io, Socket } from 'socket.io-client';
import { Message } from '../types';

let socket: Socket;

interface NewMessagePayload {
  contactId: string;
  message: Message;
}

/**
 * Initializes the WebSocket connection.
 * In a real app, the URL would come from an environment variable.
 */
export const initSocket = (): void => {
  // Fix: Explicitly provide the backend server URL to resolve CORS issues.
  // The "xhr poll error" typically happens when the frontend (running on one origin)
  // tries to connect to a backend on a different origin without proper configuration.
  // We assume a local development backend server is running on port 3001.
  // The backend server must also be configured to allow connections from the frontend's origin.
  const SERVER_URL = 'http://localhost:3001';

  socket = io(SERVER_URL, {
    // The `withCredentials` option is important for cross-origin requests
    // that need to send cookies or authentication headers.
    withCredentials: true,
  });

  socket.on('connect', () => {
    console.log('Connected to WebSocket server with ID:', socket.id);
  });

  socket.on('disconnect', () => {
    console.log('Disconnected from WebSocket server.');
  });
  
  socket.on('connect_error', (err) => {
    // This will now provide more specific errors if the backend is down or CORS is still misconfigured on the server.
    console.error('WebSocket connection error:', err.message);
  });
};

/**
 * Disconnects the WebSocket connection.
 */
export const disconnectSocket = (): void => {
  if (socket) {
    socket.disconnect();
  }
};

/**
 * Listens for new messages from the server.
 * @param callback The function to execute when a new message is received.
 */
export const onNewMessage = (callback: (payload: NewMessagePayload) => void): void => {
  if (!socket) return;
  socket.on('newMessage', callback);
};

/**
 * Emits a 'sendMessage' event to the server.
 * @param contactId The ID of the contact to send the message to.
 * @param text The content of the message.
 */
export const sendMessage = (contactId: string, text: string): void => {
  if (!socket) return;
  
  const messagePayload = {
    contactId,
    text,
  };
  
  socket.emit('sendMessage', messagePayload);
};