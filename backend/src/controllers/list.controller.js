import List from '../models/list.model.js';
import Card from '../models/card.model.js';
import { getHighestOrderList, safeGetList, verifyOrgForBoard } from '../lib/db-util.js';
import { InvalidDataError, NotFoundError } from '../lib/error-util.js';

export const getBoardLists = async (req, res, next) => {
    try {
        const { orgId } = req.auth;
        const { boardId } = req.params;

        await verifyOrgForBoard(orgId, boardId);

        const lists = await List.find({ board_id: boardId })
                        .sort({ position: 1  })
                        .populate({
                            path: 'cards',
                            options: {
                                sort: { position: 1 }
                            }
                        });

        res.status(200).json({ success: true, data: lists });

    } catch (error) {
        next(error);
    }
}


export const createList = async (req, res, next) => {
    try {
        const { orgId } = req.auth;
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

        res.status(201).json({ success: true, data: list });

    } catch (error) {
        next(error);
    }
}


export const updateList = async (req, res, next) => {
    try {
        const { orgId } = req.auth;
        const { boardId } = req.params;
        const { id, title } = req.body;

        if (!title) {
            throw new InvalidDataError("Title is required");
        }

        const list = await safeGetList(orgId, boardId, id);

        list.title = title;

        await list.save();

        res.status(200).json({ success: true, data: list });

    } catch (error) {
        next(error);
    }
}


export const deleteList = async (req, res, next) => {
    try {
        const { orgId } = req.auth;
        const { boardId } = req.params;
        const { id } = req.body;

        if (!id) {
            throw new InvalidDataError("List id is required");
        }

        await safeGetList(orgId, boardId, id);

        await List.findByIdAndDelete(id);

        res.status(200).json({ success: true });
        
    } catch (error) {
        next(error);
    }
}


export const copyList = async (req, res, next) => {
    try {
        const { orgId } = req.auth;
        const { boardId } = req.params;
        const { id } = req.body;

        const list = await safeGetList(orgId, boardId, id);
        const highestPosition = await getHighestOrderList(boardId);

        const newList = new List({
            title: list.title,
            board_id: boardId,
            position: highestPosition + 1
        });

        for (const cardId of list.cards) {
            const card = await Card.findById(cardId);
            if (!card) continue;

            const newCard = new Card({
                title: card.title,
                description: card.description,
                list_id: newList._id,
                position: card.position
            });

            await newCard.save();

            newList.cards.push(newCard._id);
        }

        await newList.save();

        res.status(201).json({ success: true, data: newList });

    } catch (error) {
        next(error);
    }
}