import { attachUserToLogs, createAuditLog, getHighestOrderCard, verifyCardPermission } from '../lib/db-util.js';
import { InvalidDataError, NotFoundError } from '../lib/error-util.js';
import AuditLog from '../models/audit-log.model.js';
import Card from '../models/card.model.js';
import List from '../models/list.model.js';


export const createCard = async (req, res, next) => {
    try {
        const { orgId, userId } = req.auth;
        const { boardId, listId, title } = req.body;

        await verifyCardPermission(orgId, boardId, listId);

        const newPosition = await getHighestOrderCard(listId);

        const card = new Card({
            list_id: listId,
            title,
            position: newPosition
        });

        await card.save();

        await List.findByIdAndUpdate(listId, { $push: { cards: card._id } });

        await createAuditLog("card", "create", card._id, card.title, orgId, userId);

        res.status(201).json({ success: true, data: card });

    } catch (error) {
        next(error)
    }
}


export const moveCard = async (req, res, next) => {
    try {
        const { orgId } = req.auth;
        const { boardId, moveCardId, srcList, destList } = req.body;

        if (!srcList || !moveCardId) throw new InvalidDataError('Source list and card are required');

        await verifyCardPermission(orgId, boardId, srcList._id);

        srcList.cards.forEach(async ({ _id, position }) => {
            await Card.findOneAndUpdate(
                { _id, list_id: srcList._id },
                { $set: { position } }
            );
        });

        if (destList) {
            await verifyCardPermission(orgId, boardId, destList._id);

            await List.findByIdAndUpdate(srcList._id, { $pull: { cards: moveCardId } });
            await List.findByIdAndUpdate(destList._id, { $push: { cards: moveCardId } });

            await Card.findByIdAndUpdate(moveCardId, { list_id: destList._id });

            destList.cards.forEach(async ({ _id, position }) => {
                await Card.findOneAndUpdate(
                    { _id, list_id: destList._id },
                    { $set: { position: position } }
                );
            });
        }

        res.status(200).json({ success: true });

    } catch (error) {
        next(error)
    }
}


export const getCard = async (req, res, next) => {
    try {
        const { orgId } = req.auth;
        const { boardId, listId, cardId } = req.body;

        await verifyCardPermission(orgId, boardId, listId);

        const card = await Card.findById(cardId);

        if (!card || card.list_id.toString() !== listId) throw new NotFoundError('Card not found');

        await card.populate('list', '_id title');

        const cardObject = card.toObject();
        cardObject.list = card.list;

        res.status(200).json({ success: true, data: cardObject });

    } catch (error) {
        next(error)
    }
}


export const updateCard = async (req, res, next) => {
    try {
        const { orgId, userId } = req.auth;
        const { boardId, listId, cardId, title, description } = req.body;

        await verifyCardPermission(orgId, boardId, listId);

        const card = await Card.findById(cardId);

        if (!card || card.list_id.toString() !== listId) throw new NotFoundError('Card not found');

        if (title) card.title = title;
        if (description) card.description = description;

        await card.save();

        await createAuditLog("card", "update", cardId, card.title, orgId, userId);

        res.status(200).json({ success: true });

    } catch (error) {
        next(error)
    }
}


export const copyCard = async (req, res, next) => {
    try {
        const { orgId, userId } = req.auth;
        const { boardId, listId, cardId } = req.body;

        await verifyCardPermission(orgId, boardId, listId);

        const card = await Card.findById(cardId);

        if (!card || card.list_id.toString() !== listId) throw new NotFoundError('Card not found');

        const newPosition = await getHighestOrderCard(listId) + 1;

        const newCard = new Card({
            list_id: listId,
            title: card.title + ' Copy',
            description: card.description,
            position: newPosition
        });

        await newCard.save();

        await List.findByIdAndUpdate(listId, { $push: { cards: newCard._id } });

        await createAuditLog("card", "create", newCard._id, newCard.title, orgId, userId);

        res.status(201).json({ success: true, data: newCard });
    } catch (error) {
        next(error)
    }
}


export const deleteCard = async (req, res, next) => {
    try {
        const { orgId, userId } = req.auth;
        const { boardId, listId, cardId } = req.body;

        await verifyCardPermission(orgId, boardId, listId);

        const card = await Card.findById(cardId);

        if (!card || card.list_id.toString() !== listId) throw new NotFoundError('Card not found');

        await card.deleteOne();
        await List.findByIdAndUpdate(listId, { $pull: { cards: cardId } });

        await createAuditLog("card", "delete", cardId, card.title, orgId, userId);

        res.status(200).json({ success: true });
    } catch (error) {
        next(error)
    }
}


export const getCardAuditLog = async (req, res, next) => {
    try {
        const { orgId } = req.auth;
        const { cardId } = req.params;

        const cardLog = await AuditLog.find({ entityId: cardId, orgId })
                        .sort({ updatedAt: -1 })
                        .limit(5);
        
        await attachUserToLogs(cardLog);

        return res.status(200).json({ success: true, data: cardLog });
    } catch (error) {
        next(error)
    }
}