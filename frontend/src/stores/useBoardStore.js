import { create } from 'zustand'

const useBoardStore = create((set) => ({
    boards: [],
    setBoards: (boards) => {
        set({ boards })
    },
    addBoard: (board) => {
        set((state) => ({ boards: [board, ...state.boards] }))
    },
    updateBoard: (board) => {
        set((state) => ({
            boards: state.boards.map((b) => (b._id === board._id ? board : b))
        }))
    }
}));


export default useBoardStore;