import { useEffect, useCallback } from "react";
import socket from "../../lib/socket";
import useListStore from "../../stores/useListStore";
import { useCardModal } from "../useCardModal";
import { useQueryClient } from "@tanstack/react-query";

const useListSocketListeners = (boardId) => {
    const { addList, removeList, setLists } = useListStore();
    const queryClient = useQueryClient();

    const listCreatedListener = useCallback(({ list }) => {
        addList(list);
    }, [addList]);

    const listDeletedListener = useCallback(({ listId }) => {
        removeList(listId);

        const { isOpen, listId: modalListId, onClose } = useCardModal.getState();

        if (isOpen && listId === modalListId) {
            onClose();
        }
    }, [removeList]);

    const listUpdatedListener = useCallback(({ list }) => {
        const lists = useListStore.getState().lists;

        const newLists = lists.map(l => l._id === list._id ? list : l);
        setLists(newLists);

        const { isOpen, id, listId } = useCardModal.getState();

        if (isOpen && listId === list._id) {
            queryClient.setQueryData(['card', listId, id], (oldData) => {
                return {
                    ...oldData,
                    card: {
                        ...oldData.card,
                        list: {
                            ...oldData.card.list,
                            title: list.title
                        }
                    }
                }
            });
        }
    }, [ setLists, queryClient ]);

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

        socket.on('listCreated', listCreatedListener);
        socket.on('listDeleted', listDeletedListener);
        socket.on('listUpdated', listUpdatedListener);
        socket.on('listMoved', listMovedListener);

        return () => {
            socket.off('listCreated', listCreatedListener);
            socket.off('listDeleted', listDeletedListener);
            socket.off('listUpdated', listUpdatedListener);
            socket.off('listMoved', listMovedListener);
        };
    }, [boardId, listCreatedListener, listDeletedListener, listUpdatedListener, listMovedListener]);
};

// Helper function to generate a list position map
const getListsPosMap = (lists) => {
    const positionMap = {};

    lists.forEach(list => {
        positionMap[list._id] = list.position;
    });

    return positionMap;
}

export default useListSocketListeners;
