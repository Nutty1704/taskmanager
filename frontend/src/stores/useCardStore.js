import { create } from 'zustand';
import useListStore from './useListStore';


const useCardStore = create((set) => ({
    pushCard: (card, listId) => {
        const lists = useListStore.getState().lists;

        const newLists = lists.map(list => {
            if (list._id === listId) {
                list.cards.push(card);
            }

            return list;
        });

        useListStore.getState().setLists(newLists);
    },

    removeCard: (cardId, listId) => {
        const lists = useListStore.getState().lists;

        const newLists = lists.map(list => {
            if (list._id === listId) {
                list.cards = list.cards.filter(card => card._id !== cardId);
            }

            return list;
        });

        useListStore.getState().setLists(newLists);
    },

    updateCard: (cardId, listId, updatedFields) => {
        const lists = useListStore.getState().lists;

        const newLists = lists.map(list => {
            if (list._id === listId) {
                list.cards = list.cards.map(card => {
                    if (card._id === cardId) {
                        return { ...card, ...updatedFields };
                    }

                    return card;
                })
            }

            return list;
        });

        useListStore.getState().setLists(newLists);
    },

    removeLabelFromAllCards: (labelId) => {
        const lists = useListStore.getState().lists;

        const newLists = lists.map(list => {
            list.cards = list.cards.map(card => {
                card.labels = card.labels.filter(label => label._id !== labelId);

                return card;
            });

            return list;
        });

        useListStore.getState().setLists(newLists);
    }

}) );


export default useCardStore;