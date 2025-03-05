import { useEffect, useCallback } from "react";
import socket from "../../lib/socket";
import useCardStore from "../../stores/useCardStore";
import { useQueryClient } from "@tanstack/react-query";
import { useCardModal } from "../useCardModal";
import useListStore from "../../stores/useListStore";

const useCardSocketListeners = (boardId) => {
    const queryClient = useQueryClient();
    const { pushCard, removeCard, updateCard } = useCardStore();
    const { setLists } = useListStore();

    const cardCreatedListener = useCallback(({ card, listId }) => {
        pushCard(card, listId);
    }, [pushCard]);

    const cardDeletedListener = useCallback(({ cardId, listId }) => {
        removeCard(cardId, listId);

        const { isOpen, id, onClose } = useCardModal.getState();

        if (isOpen && id === cardId) {
            onClose();
        };
    }, [removeCard]);

    const cardUpdatedListener = useCallback(({ cardId, listId, updatedFields }) => {
        updateCard(cardId, listId, updatedFields);
        queryClient.setQueryData(['card', listId, cardId], (oldData) => {
            if (!oldData || !oldData.card) return oldData;
            return {
                ...oldData,
                card: {
                    ...oldData.card,
                    ...updatedFields
                }
            }
        });
    }, [queryClient, updateCard]);

    const cardMovedListener = useCallback(({ moveCardId, srcList, destList }) => {
        const lists = useListStore.getState().lists;
        const srcListLocal = lists.find(list => list._id === srcList._id);
        const destListLocal = destList ? lists.find(list => list._id === destList._id) : null;
        const movedCard = srcListLocal.cards.find(card => card._id === moveCardId);
        const positionMap = getCardPosMap(srcList.cards, destList?.cards || []);

        if (!movedCard) return;

        const { isOpen, id, onOpen } = useCardModal.getState();

        if (!destListLocal) {
            srcListLocal.cards.forEach(card => card.position = positionMap[card._id]);
            srcListLocal.cards.sort((a, b) => a.position - b.position);
        } else {
            srcListLocal.cards = srcListLocal.cards.filter(card => card._id !== moveCardId);
            destListLocal.cards.push(movedCard);
            destListLocal.cards.forEach(card => card.position = positionMap[card._id]);
            destListLocal.cards.sort((a, b) => a.position - b.position);

            if (isOpen && id === moveCardId) onOpen(movedCard._id, destList._id);
        }

        setLists([...lists]);
    }, [setLists]);


    useEffect(() => {
        if (!boardId) return;

        socket.on('cardCreated', cardCreatedListener);
        socket.on('cardDeleted', cardDeletedListener);
        socket.on('cardUpdated', cardUpdatedListener);
        socket.on('cardMoved', cardMovedListener);

        return () => {
            socket.off('cardCreated', cardCreatedListener);
            socket.off('cardDeleted', cardDeletedListener);
            socket.off('cardUpdated', cardUpdatedListener);
            socket.off('cardMoved', cardMovedListener);
        };
    }, [boardId, cardCreatedListener, cardDeletedListener, cardUpdatedListener, cardMovedListener]);
};

// Helper function to generate a card position map
const getCardPosMap = (srcListCards, destListCards) => {
    const positionMap = {};

    [...srcListCards, ...destListCards].forEach(card => {
        positionMap[card._id] = card.position;
    });

    return positionMap;
};

export default useCardSocketListeners;
