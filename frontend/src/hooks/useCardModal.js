import { create } from 'zustand';

export const useCardModal = create((set) => ({
    id: undefined,
    listId: undefined,
    isOpen: false,
    onOpen: (id, listId) => set({ isOpen: true, id, listId }),
    onClose: () => set({ isOpen: false, id: undefined, listId: undefined }),
}));