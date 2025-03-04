import List from '../models/list.model.js';
import Card from '../models/card.model.js';
import { createAuditLog } from '../lib/db-util/audit-util.js';
import { InvalidDataError } from '../lib/error-util.js';
import { fetchListsWithCards, safeGetList, populateLists, safeGetPopulatedList, getHighestOrderList } from '../lib/db-util/list-util.js';
import { verifyOrgForBoard } from '../lib/db-util/board-util.js';

export const getBoardLists = async (req, res, next) => {
    try {
        const { orgId } = req.auth;
        const { boardId } = req.params;

        await verifyOrgForBoard(orgId, boardId);

        let lists = await fetchListsWithCards(boardId);
        lists = await populateLists(lists);

        res.status(200).json({ success: true, data: lists });
    } catch (error) {
        next(error);
    }
};


export const createList = async (req, res, next) => {
    try {
        const { orgId, userId } = req.auth;
        const { boardId } = req.params;

        const { title } = req.body;

        if (!title) {
            throw new InvalidDataError("Title is required");
        }

        await verifyOrgForBoard(orgId, boardId);

        const highestPosition = await getHighestOrderList(boardId);

        const list = new List({
            title,
            board_id: boardId,
            position: highestPosition + 1
        });

        await list.save();

        await createAuditLog("list", "create", list._id, list.title, orgId, userId);

        res.status(201).json({ success: true, data: list });

    } catch (error) {
        next(error);
    }
}


export const updateList = async (req, res, next) => {
    try {
        const { orgId, userId } = req.auth;
        const { boardId } = req.params;
        const { id, title } = req.body;

        if (!title) {
            throw new InvalidDataError("Title is required");
        }

        if (!id) {
            throw new InvalidDataError("List id is required");
        }

        const list = await safeGetPopulatedList(orgId, boardId, id);

        if (list) {
            await List.updateOne({ _id: list._id }, { title });
        }

        list.title = title;

        await createAuditLog("list", "update", list._id, list.title, orgId, userId);

        res.status(200).json({ success: true, data: list });

    } catch (error) {
        next(error);
    }
}


export const deleteList = async (req, res, next) => {
    try {
        const { orgId, userId } = req.auth;
        const { boardId } = req.params;
        const { id } = req.body;

        if (!id) {
            throw new InvalidDataError("List id is required");
        }

        const list = await safeGetList(orgId, boardId, id);

        await list.deleteOne();

        await createAuditLog("list", "delete", list._id, list.title, orgId, userId);

        res.status(200).json({ success: true });
        
    } catch (error) {
        next(error);
    }
}


export const copyList = async (req, res, next) => {
    try {
        const { orgId, userId } = req.auth;
        const { boardId } = req.params;
        const { id } = req.body;

        const list = await safeGetList(orgId, boardId, id);
        const highestPosition = await getHighestOrderList(boardId);

        const newList = new List({
            title: list.title + ' Copy',
            board_id: boardId,
            position: highestPosition + 1
        });

        // TODO: implement a copy card method that would return a deep copy of the card
        for (const cardId of list.cards) {
            const card = await Card.findById(cardId);
            if (!card) continue;

            const newCard = new Card({
                ...card.toObject(),
                list_id: newList._id,
                _id: undefined,
            });

            await newCard.save();

            await createAuditLog("card", "create", newCard._id, newCard.title, orgId, userId);

            newList.cards.push(newCard._id);
        }

        await newList.save();

        const formattedList = await populateLists([newList]);

        await createAuditLog("list", "create", newList._id, newList.title, orgId, userId);

        res.status(201).json({ success: true, data: formattedList[0] });

    } catch (error) {
        console.log("Error in copyList", error);
        next(error);
    }
}


export const updateListPositions = async (req, res, next) => {
    try {
        const { orgId } = req.auth;
        const { boardId } = req.params;
        const { lists } = req.body;

        if (!lists || !Array.isArray(lists)) {
            throw new InvalidDataError("Invalid data");
        }

        await verifyOrgForBoard(orgId, boardId);

        for (const list of lists) {
            await List.findOneAndUpdate({ _id: list._id, board_id: boardId }, { position: list.position });
        }

        res.status(200).json({ success: true });

    } catch (error) {
        next(error);
    }
}