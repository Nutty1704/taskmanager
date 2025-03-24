import { create } from "zustand";

export const useCardCpModal = create((set) => ({
    isOpen: false,
    card: null,
    onClose: () => set({ isOpen: false, card: null }),
    onOpen: (card) => set({ isOpen: true, card }),
})) 