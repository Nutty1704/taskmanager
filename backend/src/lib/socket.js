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

        socket.on('joinBoard', (boardId) => {
            socket.join(boardId);
        });

        socket.on('leaveBoard', (boardId) => {
            socket.leave(boardId);
        });

        socket.on('joinOrg', (orgId) => {
            socket.join(orgId);
        });

        socket.on('leaveOrg', (orgId) => {
            socket.leave(orgId);
        });

        socket.on('disconnect', () => {
        });
    });
};

// Export `io` to use it in controllers
export const getIO = () => io;
