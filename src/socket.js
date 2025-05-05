import { io } from 'socket.io-client';

// Use VITE_SOCKET_URL if available, fall back to VITE_BACKEND_URL
const socketUrl = import.meta.env.VITE_SOCKET_URL || import.meta.env.VITE_BACKEND_URL;
console.log('Connecting to socket server at:', socketUrl);

const socket = io(socketUrl, {
    autoConnect: false,
    auth: {
        token: localStorage.getItem("token")
    },
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    transports: ['websocket', 'polling'], // Explicitly specify transports
    withCredentials: false // Since we're using * for CORS or specific origins without credentials
});

// Add more detailed error logging
socket.on('connect', () => {
    console.log('Socket connected successfully with ID:', socket.id);
});

socket.on('disconnect', (reason) => {
    console.log('Socket disconnected:', reason);
    if (reason === 'io server disconnect') {
        // The server has forcefully disconnected the socket
        console.log('Server disconnected the socket. Attempting to reconnect...');
        socket.connect();
    }
});

socket.on('connect_error', (error) => {
    console.error('Socket connection error:', error.message);
    // Log more details about the error
    console.error('Error details:', {
        message: error.message,
        type: error.type,
        description: error.description
    });
    
    setTimeout(() => {
        console.log('Attempting to reconnect...');
        socket.connect();
    }, 5000);
});

// Room management
export const joinTutorRoom = (email) => {
    console.log(`Attempting to join room: ${email}`);
    socket.emit('join_room', { room: email });
};

export const leaveTutorRoom = (email) => {
    console.log(`Leaving room: ${email}`);
    socket.emit('leave_room', { room: email });
};

export default socket;