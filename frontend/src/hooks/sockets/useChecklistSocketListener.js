import { useEffect, useCallback } from "react";
import socket from "@/src/lib/socket";
import { useQueryClient } from "@tanstack/react-query";
import { useCardModal } from "../useCardModal";
import useListStore from "@/src/stores/useListStore";
import useCardStore from "@/src/stores/useCardStore";

const useChecklistSocketListeners = (boardId) => {
    const queryClient = useQueryClient();
    const { updateCard } = useCardStore();

    const checklistCreatedListener = useCallback(({ checklist, cardId, listId }) => {
        const lists = useListStore.getState().lists;
        const list = lists.find(list => list._id === listId);
        const card = list.cards.find(card => card._id === cardId);
        card.checklists.push(checklist);

        updateCard(cardId, listId, { checklists: card.checklists });

        const { isOpen, id } = useCardModal.getState();

        if (isOpen && id === cardId) {
            queryClient.setQueryData(['card-checklists', cardId], (oldData) => {
                return {
                    ...oldData,
                    checklists: [...oldData.checklists, checklist]
                }
            });
        }
    }, [updateCard, queryClient]);

    const checklistDeletedListener = useCallback(({ cardId, listId, checklistId }) => {
        const lists = useListStore.getState().lists;
        const list = lists.find(list => list._id === listId);
        const card = list.cards.find(card => card._id === cardId);
        card.checklists = card.checklists.filter(checklist => checklist._id !== checklistId);

        updateCard(cardId, listId, { checklists: card.checklists });

        const { isOpen, id } = useCardModal.getState();

        if (isOpen && id === cardId) {
            queryClient.setQueryData(['card-checklists', cardId], (oldData) => {
                return {
                    ...oldData,
                    checklists: oldData.checklists.filter(checklist => checklist._id !== checklistId)
                }
            });
        }
    }, [updateCard, queryClient]);

    const checklistUpdatedListener = useCallback(({ cardId, listId, checklist }) => {
        const lists = useListStore.getState().lists;
        const list = lists.find(list => list._id === listId);
        const card = list.cards.find(card => card._id === cardId);
        card.checklists = card.checklists.map(cl => cl._id === checklist._id ? checklist : cl);

        updateCard(cardId, listId, { checklists: card.checklists });

        const { isOpen, id } = useCardModal.getState();

        if (isOpen && id === cardId) {
            queryClient.setQueryData(['card-checklists', cardId], (oldData) => {
                return {
                    ...oldData,
                    checklists: oldData.checklists.map(cl => cl._id === checklist._id ? checklist : cl)
                }
            });
        }
    }, [updateCard, queryClient]);

    useEffect(() => {
        if (!boardId) return;

        socket.on('checklistCreated', checklistCreatedListener);
        socket.on('checklistDeleted', checklistDeletedListener);
        socket.on('checklistUpdated', checklistUpdatedListener);

        return () => {
            socket.off('checklistCreated', checklistCreatedListener);
            socket.off('checklistDeleted', checklistDeletedListener);
            socket.off('checklistUpdated', checklistUpdatedListener);
        };
    }, [boardId, checklistCreatedListener, checklistUpdatedListener, checklistDeletedListener]);
};

export default useChecklistSocketListeners;
