import { create } from "zustand";

const useLabelStore = create((set) => ({
    labels: [],
    setLabels: (labels) => set({ labels }),

    addLabel: (label) => set((state) => ({ labels: [...state.labels, label] })),

    updateLabel: (label) => set((state) => ({
        labels: state.labels.map((l) => (l._id === label._id ? label : l)),
    })),

    deleteLabel: (id) => set((state) => ({
        labels: state.labels.filter((l) => l._id !== id),
    })),
}));

export default useLabelStore;