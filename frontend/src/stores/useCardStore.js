import { create } from 'zustand';
import useListStore from './useListStore';


const useCardStore = create((set, get) => ({
    pushCard: (card, listId) => {
        const list = useListStore.getState().lists.find((list) => list._id === listId);

        if (list) {
            list.cards.push(card);
        }
    }
}) );


export default useCardStore;