import User, { BOARD_HISTORY_SIZE} from "../../models/user.model.js";


export const addToHistory = async (userId, orgId, boardId) => {
    try {
        const user = await safeGetUser(userId, orgId);

        user.recentBoards = user.recentBoards?.filter(id => String(id) !== String(boardId)) || [];

        user.recentBoards.unshift(boardId);

        if (user.recentBoards.length > BOARD_HISTORY_SIZE) {
            user.recentBoards = user.recentBoards.slice(0, 7);
        }

        await user.save();
    } catch (error) {
        throw error;
    }
};

/**
 * Safely retrieves a user by user ID and organization ID.
 *
 * @param {string} userId - The ID of the user to retrieve.
 * @param {string} orgId - The ID of the organization the user belongs to.
 * @returns {Promise<User>} - The user object if found.
 * @throws {NotFoundError} - If no user is found with the given IDs.
 * @throws {Error} - If there is an error during the retrieval process.
 */
export const safeGetUser = async (userId, orgId) => {
    try {
        const user = await User.findOne({ userId, orgId });

        if (!user) {
            return await User.create({ userId, orgId });
        };

        return user;
    } catch (error) {
        throw error;
    }
}