import { create } from 'zustand';

const useUserStore = create((set) => ({
    starredBoards: [],
    setStarredBoards: (starredBoards) => set({ starredBoards }),
}));

export default useUserStore