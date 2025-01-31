import { ListEndIcon } from "lucide-react";
import apiClient from "./index";

export const createCard = async (data) => {
    try {
        const response = await apiClient.post("/api/card/create", data);

        if (!response.data.success) {
            return { success: false, newCard: null };
        }

        return { success: true, newCard: response.data.data };
    } catch (error) {
        console.error("Error creating card", error);
        return { success: false, newCard: null };
    }
}


export const moveCard = async (boardId, moveCardId, data) => {
    try {
        const { srcList, destList } = data;

        const response = await apiClient.post("/api/card/move", { boardId, moveCardId, srcList, destList });

        return { success: response.data.success };
    } catch (error) {
        console.error("Error moving card", error);
        return { success: false };
    }
}

// Helper function to extract relevant data to move card
export const extractMoveData = (list) => {
    return {
        _id: list._id,
        title: list.title,
        cards: list.cards.map(card => ({ _id: card._id, position: card.position, title: card.title }))
    }
}


export const fetchCard = async (boardId, listId, cardId) => {
    try {
        const repsonse = await apiClient.post('/api/card/get', { boardId, listId, cardId });

        if (!repsonse.data.success) {
            return { success: false, card: null };
        }

        return { success: true, card: repsonse.data.data };
    } catch (error) {
        console.error("Error fetching card", error);
        return { success: false, card: null };
    }
}


export const updateCard = async (data) => {
    try {
        const response = await apiClient.post('/api/card/update', data);

        return { success: response.data.success };
    } catch (error) {
        console.error("Error updating card", error);
        return { success: false };
    }
}