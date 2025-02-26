import { clerkClient } from "@clerk/express"

/**
 * Fetches the given list of users from Clerk.
 * @param {string[]} userIds - The IDs of the users to fetch
 * @returns {Promise<User[]>} - The users, or an empty array if there was an error
 */
export const fetchUsersFromClerk = async (userIds) => {
    try {
        if (userIds.length === 0) return [];

        const users = await clerkClient.users.getUserList({
            userId: userIds
        });

        return users.data;
    } catch (error) {
        console.error("Error fetching users from Clerk:", error);
        return [];
    }
};

/**
 * Retrieves a list of users from the given IDs, suitable for display
 * on a card.
 *
 * @param {string[]} userIds - The IDs of the users to retrieve
 * @returns {Promise<User[]>} - The list of users, or an empty array if there was an error
 */
export const getUsersForCard = async (userIds) => {
    try {
        if (!userIds || !userIds.length) return [];

        const users = await fetchUsersFromClerk(userIds);

        return users.map(user => ({
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            imageUrl: user.imageUrl
        }));

    } catch (error) {
        console.log("Error in getUsers", error);
        throw error;
    }
}