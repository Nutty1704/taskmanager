import { getUsersForCard } from '../clerk-util.js';
import { verifyOrgForBoard } from './board-util.js'

import Card from '../../models/card.model.js';
import User from '../../models/user.model.js';
import List from '../../models/list.model.js';
import Label from '../../models/label.model.js';

import { NotFoundError, UnauthorizedError } from '../error-util.js';


/**
 * Assigns a user to a card.
 * @param {string} userId - The ID of the user to assign to the card.
 * @param {string} orgId - The ID of the organization the card is in.
 * @param {Card} card - The card to assign the user to.
 * @returns {Promise<void>}
 */
export const assignUser = async (userId, orgId, card) => {
    if (!card.assignedTo || !card.assignedTo.includes(userId)) {
        await Card.updateOne(
            { _id: card._id, assignedTo: { $exists: false } }, // If it doesn’t exist
            { $set: { assignedTo: [] } } // Initialize as an empty array
        );
        
        await Card.updateOne(
            { _id: card._id },
            { $addToSet: { assignedTo: userId } } // Now safely add the user
        );
        const userExists = await User.exists({ userId, orgId });

        if (!userExists) {
            await User.create({ userId: userId, orgId, cards: [card._id] });
        } else {
            User.updateOne({ userId: userId, orgId }, { $addToSet: { cards: card._id } });
        }
    }
}

/**
 * Formats a card object by populating its associated list and labels,
 * and retrieving the assigned users.
 *
 * @param {Object} card - The card to format.
 * @returns {Object|null} - The formatted card object with populated list, labels, 
 *                          and assigned users, or null if the card is not provided.
 */
export const formatCard = async (card) => {
    if (!card) return null;

    await card.populate('list', '_id title');
    await card.populate('labels', 'title color');
    await card.populate('checklists');

    const cardObject = card.toObject();
    cardObject.list = card.list;
    cardObject.labels = card.labels;
    cardObject.assignedTo = await getUsersForCard(card.assignedTo);

    return cardObject;
};

/**
 * Retrieves all labels associated with a given card in a given board.
 * @param {string} boardId - The ID of the board.
 * @param {string} cardId - The ID of the card.
 * @returns {Promise<Label[]>} - A promise that resolves to an array of labels associated with the card.
 */
export const getCardLabels = async (boardId, cardId) => {
    try {
        const labels = await Label.find({ boardId, cardId });
        return labels;
    } catch (error) {
        console.log("Error in getCardLabels", error);
        throw error;
    }
}

/**
 * Gets the highest order of a card in a given list
 * @param {string} listId - The ID of the list
 * @returns {number} - The highest order of a card in the list, or 0 if no cards exist in the list
 */
export const getHighestOrderCard = async (listId) => {
    try {
        const list = await Card.find({ list_id: listId })
            .select("position")
            .sort({ position: -1 })
            .limit(1);

        return list.length ? list[0].position : 0;
    } catch (error) {
        console.log("Error in getHighestOrderCard", error);
        throw error;
    }
}

export const safeGetCard = async (cardId, listId, boardId, orgId) => {
    try {
        await verifyOrgForBoard(orgId, boardId);

        const card = await Card.findById(cardId);

        if (!card || card.list_id.toString() !== listId) {
            throw new NotFoundError('Card not found');
        }

        return card;
    } catch (error) {
        console.error("Error in safeGetCard", error);
        throw error;
    }
}

/**
 * Removes a user from a card. Removes the card from the user's assigned cards.
 * @param {string} userId - The ID of the user to remove from the card
 * @param {string} orgId - The ID of the organization the card is in
 * @param {Card} card - The card to remove the user from
 * @returns {Promise<void>}
 */
export const unassignUser = async (userId, orgId, card) => {
    await Card.updateOne({ _id: card._id }, { $pull: { assignedTo: userId } });
    await User.updateOne({ userId: userId, orgId }, { $pull: { cards: card._id } });
}

/**
 * Verifies that the requesting organization has access to the given list.
 *
 * @param {string} orgId - The ID of the requesting organization.
 * @param {string} boardId - The ID of the board the list belongs to.
 * @param {string} listId - The ID of the list to verify.
 *
 * @returns {Promise<boolean>} - True if the organization has access, false otherwise.
 * @throws {NotFoundError} - If the list is not found.
 * @throws {UnauthorizedError} - If the organization does not have access to the board.
 */
export const verifyCardPermission = async (orgId, boardId, listId) => {
    try {
        await verifyOrgForBoard(orgId, boardId);

        const list = await List.findById(listId);

        if (!list) {
            throw new NotFoundError("List not found");
        }

        if (list.board_id.toString() !== boardId) {
            throw new UnauthorizedError("Unauthorized");
        }

        return true;
    } catch (error) {
        console.log("Error in verifyCardPermission", error);
        throw error;
    }
}