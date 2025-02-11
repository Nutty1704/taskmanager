import { attachUserToLogs, createAuditLog, getHighestOrderCard, verifyCardPermission } from '../lib/db-util.js';
import { InvalidDataError, NotFoundError } from '../lib/error-util.js';
import AuditLog from '../models/audit-log.model.js';
import Card from '../models/card.model.js';
import Label from '../models/label.model.js';
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
        await card.populate('labels', 'title color');

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
        const {
            boardId, listId, cardId,
            title, description,
            startDate, dueDate,
            isComplete
        } = req.body;

        await verifyCardPermission(orgId, boardId, listId);

        const card = await Card.findById(cardId);
        let logUpdate = false;

        if (!card || card.list_id.toString() !== listId) throw new NotFoundError('Card not found');

        if (title) {
            card.title = title
            logUpdate = true
        };
        if (description) {
            card.description = description;
            logUpdate = true
        };
        if (startDate !== undefined) card.startDate = startDate;
        if (dueDate !== undefined) card.dueDate = dueDate;
        if (isComplete !== undefined) card.isComplete = isComplete;

        await card.save();

        if (logUpdate) {
            await createAuditLog("card", "update", cardId, card.title, orgId, userId);
        }

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
            position: newPosition,
            labels: card.labels.map(l => l)
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
        await Label.deleteMany({ boardId, cardId });

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


export const modifyCardLabel = async (req, res, next) => {
    try {
        const { orgId } = req.auth;
        const { boardId, cardId, labelId, checked, listId } = req.body;

        await verifyCardPermission(orgId, boardId, listId);

        const card = await Card.findById(cardId);

        if (!card) throw new NotFoundError('Card not found');

        const label = await Label.findById(labelId);

        if (!label) throw new NotFoundError('Label not found');

        if (checked) {
            if (!card.labels) card.labels = [];
            if (!card.labels.includes(labelId)) card.labels.push(labelId);
        } else {
            card.labels = card.labels.filter(l => l.toString() !== labelId);
        }

        await card.save();

        res.status(200).json({ success: true });
    } catch (error) {
        next(error)
    }
}