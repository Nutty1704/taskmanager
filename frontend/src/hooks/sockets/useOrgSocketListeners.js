import socket, { cleanupOrg, joinOrg } from "@/src/lib/socket";
import useBoardStore from "@/src/stores/useBoardStore";
import { useCallback, useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom";

const useOrgSocketListeners = (orgId) => {
    const { addBoard, updateBoard, removeBoard } = useBoardStore();
    const location = useLocation();
    const navigate = useNavigate();

    const boardCreatedListener = useCallback(({ board }) => {
        addBoard(board);
    }, [addBoard]);

    const boardUpdatedListener = useCallback(({ board }) => {
        updateBoard(board);
    }, [updateBoard]);

    const boardDeletedListener = useCallback(({ boardId }) => {
        removeBoard(boardId);

        if (location.pathname === `/board/${boardId}`) {
            navigate('/');
        }
    }, [removeBoard]);

    useEffect(() => {
        if (!orgId) return;

        // join the org room
        joinOrg(orgId);

        // Setup listeners
        socket.on('boardCreated', boardCreatedListener);
        socket.on('boardUpdated', boardUpdatedListener);
        socket.on('boardDeleted', boardDeletedListener);

        return () => {
            cleanupOrg(orgId);
            socket.off('boardCreated', boardCreatedListener);
            socket.off('boardUpdated', boardUpdatedListener);
            socket.off('boardDeleted', boardDeletedListener);
        }
    }, [orgId])
}

export default useOrgSocketListeners