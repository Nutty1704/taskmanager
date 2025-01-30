import { create } from 'zustand'

const useListStore = create((set, get) => ({
    lists: [],
    setLists: (lists) => {
        set({ lists })
    },
    addList: (list) => {
        set((state) => ({ lists: [...state.lists, list] }))
    },
    removeList: (listId) => {
        set((state) => ({ lists: state.lists.filter((list) => list._id !== listId) }))
        console.log("Lists: ", get().lists);
    }
}));


export default useListStore;