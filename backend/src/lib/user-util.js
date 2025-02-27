import User from "../models/user.model.js";
import { NotFoundError } from "./error-util.js";

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

        if (!user) throw new NotFoundError("User not found");

        return user;
    } catch (error) {
        throw error;
    }
}