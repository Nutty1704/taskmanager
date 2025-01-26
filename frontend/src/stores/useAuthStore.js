import { create } from 'zustand';

const useAuthStore = create((set) => ({
    token: null,
    setToken: (token) => {
        set({ token });
    },
}));

export default useAuthStore