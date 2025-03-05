import { useEffect, useCallback } from "react";
import socket from "../../lib/socket";
import useLabelStore from "../../stores/useLabelStore";
import { useQueryClient } from "@tanstack/react-query";
import { useCardModal } from "../useCardModal";
import useCardStore from "@/src/stores/useCardStore";

const useLabelSocketListeners = (boardId) => {
    const queryClient = useQueryClient();
    const { addLabel, updateLabel, deleteLabel } = useLabelStore();
    const { removeLabelFromAllCards } = useCardStore();

    const labelCreatedListener = useCallback(({ label }) => {
        addLabel(label);
    }, [addLabel]);

    const labelUpdatedListener = useCallback(({ label }) => {
        updateLabel(label);

        const { isOpen, id, listId } = useCardModal.getState();

        if (isOpen && id) {
            queryClient.setQueryData(['card', listId, id], (oldData) => {
                return {
                    ...oldData,
                    card: {
                        ...oldData.card,
                        labels: oldData.card.labels.map(l => l._id === label._id ? label : l)
                    }
                }
            });
        }
    }, [updateLabel]);

    const labelDeletedListener = useCallback(({ labelId }) => {
        deleteLabel(labelId);
        removeLabelFromAllCards(labelId);

        const { isOpen, id, listId } = useCardModal.getState();

        if (isOpen && id) {
            queryClient.setQueryData(['card', listId, id], (oldData) => {
                console.log("Old data: ", oldData);
                return {
                    ...oldData,
                    card: {
                        ...oldData.card,
                        labels: oldData.card.labels.filter(l => l._id !== labelId)
                    }
                }
            });
        }
    }, [deleteLabel, removeLabelFromAllCards]);

    useEffect(() => {
        if (!boardId) return;

        socket.on('labelCreated', labelCreatedListener);
        socket.on('labelUpdated', labelUpdatedListener);
        socket.on('labelDeleted', labelDeletedListener);

        return () => {
            socket.off('labelCreated', labelCreatedListener);
            socket.off('labelUpdated', labelUpdatedListener);
            socket.off('labelDeleted', labelDeletedListener);
        };
    }, [boardId, labelCreatedListener, labelUpdatedListener, labelDeletedListener]);
};

export default useLabelSocketListeners;