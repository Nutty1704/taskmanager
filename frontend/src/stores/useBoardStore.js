import { create } from 'zustand'

const useBoardStore = create((set) => ({
    boards: [],
    activeBoard: null,
    setActive: (board) => {
        set({ activeBoard: board })
    },
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
    },
    removeBoard: (boardId) => {
        set((state) => ({
            boards: state.boards.filter((b) => b._id !== boardId),
        }))
    }
}));


export default useBoardStore;