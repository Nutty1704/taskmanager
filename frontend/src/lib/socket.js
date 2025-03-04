import { io } from 'socket.io-client'

const backendURL = import.meta.env.VITE_BACKEND_URL;

const socket = io(backendURL);

export const joinBoard = (boardId) => {
    if (!boardId) return;
    socket.emit('joinBoard', boardId);
}

export const cleanup = (boardId) => {
    socket.emit('leaveBoard', boardId);
}

export default socket;