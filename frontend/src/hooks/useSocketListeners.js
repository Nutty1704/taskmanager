import { useEffect, useCallback } from "react";
import useCardStore from "../stores/useCardStore";
import useListStore from "../stores/useListStore";
import socket, { joinBoard, cleanup } from "../lib/socket";
import { useQueryClient } from "@tanstack/react-query";
import { useCardModal } from "./useCardModal";

const useSocketListeners = (boardId) => {
    const queryClient = useQueryClient();
    const { pushCard, removeCard, updateCard } = useCardStore();
    const { addList, removeList, setLists } = useListStore();

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

    const listCreatedListener = useCallback(({ list }) => {
        addList(list);
    }, [addList]);

    const listDeletedListener = useCallback(({ listId }) => {
        removeList(listId);
    }, [removeList]);

    const listUpdatedListener = useCallback(({ list }) => {
        const lists = useListStore.getState().lists;

        const newLists = lists.map(l => l._id === list._id ? list : l);
        setLists(newLists);
    }, [ setLists ]);

    const listMovedListener = useCallback(({ lists }) => {
        const stateLists = useListStore.getState().lists;
        const positionMap = getListsPosMap(lists);

        console.log("Map: ", positionMap);
        console.log("Before update: ", stateLists);
        stateLists.forEach(l => l.position = positionMap[l._id]);
        const newLists = stateLists.sort((a, b) => a.position - b.position);
        console.log("After update: ", newLists);

        setLists(newLists);
    }, [ setLists ]);
    

    useEffect(() => {
        if (!boardId) return;

        // Join the board room
        joinBoard(boardId);

        // Register event listeners
        socket.on('cardCreated', cardCreatedListener);
        socket.on('cardDeleted', cardDeletedListener);
        socket.on('cardUpdated', cardUpdatedListener);
        socket.on('cardMoved', cardMovedListener);

        socket.on('listCreated', listCreatedListener);
        socket.on('listDeleted', listDeletedListener);
        socket.on('listUpdated', listUpdatedListener);
        socket.on('listMoved', listMovedListener);

        // Cleanup on unmount or board change
        return () => {
            cleanup(boardId);  // Leave board room and remove listeners
            socket.off('cardCreated', cardCreatedListener);
            socket.off('cardDeleted', cardDeletedListener);
            socket.off('cardUpdated', cardUpdatedListener);
            socket.off('cardMoved', cardMovedListener);
            socket.off('listCreated', listCreatedListener);
            socket.off('listDeleted', listDeletedListener);
            socket.off('listUpdated', listUpdatedListener);
            socket.off('listMoved', listMovedListener);
        };
    }, [boardId, cardCreatedListener,
        cardDeletedListener, cardUpdatedListener,
        cardMovedListener, listCreatedListener,
        listDeletedListener]);

};

// Helper function to generate a card position map
const getCardPosMap = (srcListCards, destListCards) => {
    const positionMap = {};

    [...srcListCards, ...destListCards].forEach(card => {
        positionMap[card._id] = card.position;
    });

    return positionMap;
};

const getListsPosMap = (lists) => {
    const positionMap = {};

    lists.forEach(list => {
        positionMap[list._id] = list.position;
    });

    return positionMap;
}

export default useSocketListeners;
