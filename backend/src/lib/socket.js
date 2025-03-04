import { Server } from 'socket.io';

let io;

export const initializeSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: [process.env.FRONTEND_URL],
            methods: ['GET', 'POST'],
        },
    });

    io.on('connection', (socket) => {
        console.log(`User connected: ${socket.id}`);

        socket.on('joinBoard', (boardId) => {
            socket.join(boardId);
            console.log(`User ${socket.id} joined board ${boardId}`);
        });

        socket.on('leaveBoard', (boardId) => {
            socket.leave(boardId);
            console.log(`User ${socket.id} left board ${boardId}`);
        });

        socket.on('disconnect', () => {
            console.log(`User disconnected: ${socket.id}`);
        });
    });
};

// Export `io` to use it in controllers
export const getIO = () => io;
