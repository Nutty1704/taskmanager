import { useEffect, useCallback } from "react";
import useCardStore from "../stores/useCardStore";
import useListStore from "../stores/useListStore";
import socket, { joinBoard, cleanup } from "../lib/socket";

const useSocketListeners = (boardId) => {
    const { pushCard, removeCard, updateCard } = useCardStore();
    const { lists, setLists } = useListStore();

    const cardCreatedListener = useCallback(({ card, listId }) => {
        pushCard(card, listId);
    }, [pushCard]);

    const cardDeletedListener = useCallback(({ cardId, listId }) => {
        removeCard(cardId, listId);
    }, [removeCard]);

    const cardUpdatedListener = useCallback(({ cardId, listId, updatedFields }) => {
        updateCard(cardId, listId, updatedFields);
    }, [updateCard]);

    const cardMovedListener = useCallback(({ moveCardId, srcList, destList }) => {
        const srcListLocal = lists.find(list => list._id === srcList._id);
        const destListLocal = destList ? lists.find(list => list._id === destList._id) : null;

        if (!srcListLocal) return;  // Prevent errors if lists are not yet populated

        const movedCard = srcListLocal.cards.find(card => card._id === moveCardId);
        if (!movedCard) return;

        const positionMap = getCardPosMap(srcList, destList || []);

        if (!destListLocal) {
            srcListLocal.cards.forEach(card => card.position = positionMap[card._id]);
        } else {
            srcListLocal.cards = srcListLocal.cards.filter(card => card._id !== moveCardId);
            destListLocal.cards.push(movedCard);
            destListLocal.cards.forEach(card => card.position = positionMap[card._id]);
        }

        srcListLocal.cards.sort((a, b) => a.position - b.position);
        if (destListLocal) destListLocal.cards.sort((a, b) => a.position - b.position);

        setLists([...lists]);
    }, [lists, setLists]);

    useEffect(() => {
        if (!boardId) return;

        // Join the board room
        joinBoard(boardId);

        // Register event listeners
        socket.on('cardCreated', cardCreatedListener);
        socket.on('cardDeleted', cardDeletedListener);
        socket.on('cardUpdated', cardUpdatedListener);
        socket.on('cardMoved', cardMovedListener);

        // Cleanup on unmount or board change
        return () => {
            cleanup(boardId);  // Leave board room and remove listeners
            socket.off('cardCreated', cardCreatedListener);
            socket.off('cardDeleted', cardDeletedListener);
            socket.off('cardUpdated', cardUpdatedListener);
            socket.off('cardMoved', cardMovedListener);
        };
    }, [boardId, cardCreatedListener, cardDeletedListener, cardUpdatedListener, cardMovedListener]);

};

// Helper function to generate a card position map
const getCardPosMap = (srcList, destList) => {
    const positionMap = {};

    [...srcList.cards, ...destList.cards].forEach(card => {
        positionMap[card._id] = card.position;
    });

    return positionMap;
};

export default useSocketListeners;
