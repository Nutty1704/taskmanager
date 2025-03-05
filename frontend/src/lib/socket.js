import { io } from 'socket.io-client'

const backendURL = import.meta.env.VITE_BACKEND_URL;

const socket = io(backendURL);

export const joinBoard = (boardId) => {
    if (!boardId) return;
    socket.emit('joinBoard', boardId);
}

export const cleanupBoard = (boardId) => {
    socket.emit('leaveBoard', boardId);
}

export const joinOrg = (orgId) => {
    if (!orgId) return;
    socket.emit('joinOrg', orgId);
}

export const cleanupOrg = (orgId) => {
    socket.emit('leaveOrg', orgId);
}

export default socket;