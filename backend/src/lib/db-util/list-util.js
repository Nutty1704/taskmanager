import List from "../../models/list.model.js";
import { getUsersForCard } from "../clerk-util.js";
import { verifyOrgForBoard } from "./board-util.js";

import { NotFoundError, UnauthorizedError } from "../error-util.js";


/**
 * Fetches all lists in a given board, along with their cards and labels, sorted by
 * position.
 * @param {string} boardId - The ID of the board
 * @returns {Promise<List[]>} - A promise that resolves to all lists in the board, with
 * their cards and labels populated
 */
export const fetchListsWithCards = async (boardId) => {
    return await List.find({ board_id: boardId })
        .sort({ position: 1 })
        .populate({
            path: 'cards',
            options: { sort: { position: 1 } },
            populate: { path: 'labels' }
        });
};

/**
 * Gets the highest order of a list in a given board
 * @param {string} boardId - The ID of the board
 * @returns {number} - The highest order of a list in the board, or 0 if no lists exist in the board
 */
export const getHighestOrderList = async (boardId) => {
    try {
        const board = await List.find({ board_id: boardId })
            .select("position")
            .sort({ position: -1 })
            .limit(1);

        return board.length ? board[0].position : 0;
    } catch (error) {
        console.log("Error in getHighestOrderList", error)
        return 0;
    }
}

/**
 * Populate lists with cards and labels, and replace user IDs with user objects.
 *
 * @param {List[]} lists - The lists to populate.
 *
 * @returns {Promise<List[]>} - The populated lists.
 */
export const populateLists = async (lists) => {
    const populatedLists = await List.populate(lists, {
        path: 'cards',
        options: {
            sort: { position: 1 }
        },
        populate: {
            path: 'labels checklists'
        }
    });

    const userSet = extractUserSet(populatedLists);
    const userMap = await fetchUserMap(userSet);

    const formattedLists = replaceUserIdsWithObjects(populatedLists, userMap);

    return formattedLists;
};

/**
 * Retrieves a list by its ID, first verifying that the requesting
 * organization has access to the board the list belongs to.
 *
 * @param {string} orgId - The ID of the requesting organization.
 * @param {string} boardId - The ID of the board the list belongs to.
 * @param {string} listId - The ID of the list to retrieve.
 *
 * @returns {Promise<List>} - The list.
 * @throws {NotFoundError} - If the list is not found.
 * @throws {UnauthorizedError} - If the organization does not have access to
 *         the board.
 */
export const safeGetList = async (orgId, boardId, listId) => {
    await verifyOrgForBoard(orgId, boardId);
    const list = await List.findById(listId);

    if (!list) {
        throw new NotFoundError("List not found");
    } else if (list.board_id.toString() !== boardId) {
        throw new UnauthorizedError("Unauthorized");
    }

    return list;
};

/**
 * Retrieves a populated list by its ID, first verifying that the
 * requesting organization has access to the board the list belongs to.
 *
 * @param {string} orgId - The ID of the requesting organization.
 * @param {string} boardId - The ID of the board the list belongs to.
 * @param {string} listId - The ID of the list to retrieve.
 *
 * @returns {Promise<List & {cards: (Card & {labels: Label[]})[]}>} - The
 *          populated list.
 * @throws {NotFoundError} - If the list is not found.
 * @throws {UnauthorizedError} - If the organization does not have access to
 *         the board.
 */
export const safeGetPopulatedList = async (orgId, boardId, listId) => {
    let list = await safeGetList(orgId, boardId, listId);
    list = await list.populate({
        path: 'cards',
        options: { sort: { position: 1 } },
        populate: { path: 'labels' }
    });
    return (await populateLists([list]))[0];
};


// HELPERS

// Extracts a set of user IDs from all cards in the lists
const extractUserSet = (lists) => {
    const userSet = new Set();
    lists.forEach(list => {
        list.cards.forEach(card => {
            if (Array.isArray(card.assignedTo)) {
                card.assignedTo.forEach(userId => userSet.add(userId));
            }
        });
    });
    return userSet;
};

// Fetches users and returns a Map of userId -> user object
const fetchUserMap = async (userSet) => {
    const users = await getUsersForCard(Array.from(userSet));
    return new Map(users.map(user => [user.id, user]));
};

// Replaces user IDs with corresponding user objects in assignedTo field
const replaceUserIdsWithObjects = (lists, userMap) => {
    return lists.map(listDoc => {
        const list = listDoc.toObject();
        list.cards.forEach(card => {
            if (Array.isArray(card.assignedTo)) {
                card.assignedTo = card.assignedTo.map(userId => userMap.get(userId) || null).filter(Boolean);
            }
        });
        return list;
    });
};
