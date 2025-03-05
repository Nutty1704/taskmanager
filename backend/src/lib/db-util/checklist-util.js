import Checklist from "../../models/checklist.model.js";
import { NotFoundError } from "../error-util.js";

/**
 * Retrieves a checklist by its ID, first verifying that the checklist
 * belongs to the given card.
 *
 * @param {string} checklistId - The ID of the checklist to retrieve.
 * @param {string} cardId - The ID of the card the checklist belongs to.
 *
 * @returns {Promise<Checklist>} - The checklist.
 * @throws {NotFoundError} - If the checklist is not found.
 */
export const safeGetChecklist = async (checklistId, cardId) => {
    try {
        const checklist = await Checklist.findById(checklistId);

        if (!checklist || checklist.cardId.toString() !== cardId) {
            throw new NotFoundError('Checklist not found');
        }

        return checklist;
    } catch (error) {
        if (!error.isCustom) {
            console.error("Error in safeGetChecklist", error);
        }
        throw error;
    }
}