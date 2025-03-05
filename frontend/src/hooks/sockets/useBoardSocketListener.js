import { useEffect, useCallback } from "react";
import socket, { joinBoard, cleanupBoard } from "../../lib/socket";
import { useNavigate } from "react-router-dom";
import useBoardStore from "@/src/stores/useBoardStore";
import useCardSocketListeners from "./useCardSocketListener";
import useListSocketListeners from "./useListSocketListener";
import useLabelSocketListeners from "./useLabelSocketListener";
import useChecklistSocketListeners from "./useChecklistSocketListener";

const useBoardSocketListeners = (boardId) => {
    const navigate = useNavigate();
    const { removeBoard, setActive } = useBoardStore();

    // Handles when a board is deleted
    const boardDeletedListener = useCallback(({ orgId }) => {
        removeBoard(boardId);
        navigate("/organization/" + orgId);
    }, [navigate, removeBoard, boardId]);

    const boardUpdatedListener = useCallback(({ board }) => {
        setActive(board);
    }, [setActive, boardId]);

    // Call individual socket listener hooks
    useCardSocketListeners(boardId);
    useListSocketListeners(boardId);
    useLabelSocketListeners(boardId);
    useChecklistSocketListeners(boardId);

    useEffect(() => {
        if (!boardId) return;

        joinBoard(boardId);
        socket.on("boardDeleted", boardDeletedListener);
        socket.on("boardUpdated", boardUpdatedListener);

        return () => {
            cleanupBoard(boardId);
            socket.off("boardDeleted", boardDeletedListener);
            socket.off("boardUpdated", boardUpdatedListener);
        };
    }, [boardId, boardDeletedListener, boardUpdatedListener]);
};

export default useBoardSocketListeners;
