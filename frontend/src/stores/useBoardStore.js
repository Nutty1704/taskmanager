import { create } from 'zustand'

const useBoardStore = create((set) => ({
    boards: [],
    setBoards: (boards) => {
        set({ boards })
    },
    addBoard: (board) => {
        set((state) => ({ boards: [board, ...state.boards] }))
    }
}));


export default useBoardStore;