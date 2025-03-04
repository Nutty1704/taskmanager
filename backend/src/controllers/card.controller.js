import { assignUser, formatCard, getHighestOrderCard, unassignUser, verifyCardPermission } from '../lib/db-util/card-util.js';
import { attachUserToLogs, createAuditLog } from '../lib/db-util/audit-util.js';
import { InvalidDataError, NotFoundError } from '../lib/error-util.js';
import { getIO } from '../lib/socket.js';

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

        // Emit event
        getIO().to(boardId).emit('cardCreated', {
            card: card,
            listId
        });

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

            destList.cards.forEach(async ({ _id }, index) => {
                await Card.findOneAndUpdate(
                    { _id, list_id: destList._id },
                    { $set: { position: index } }
                );
            });
        }

        // Emit event
        getIO().to(boardId).emit('cardMoved', {
            moveCardId,
            srcList,
            destList
        });

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

        const formattedCard = await formatCard(card);

        res.status(200).json({ success: true, data: formattedCard });

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

        const formattedCard = await formatCard(card);

        // Emit event
        getIO().to(boardId).emit('cardUpdated', {
            cardId,
            listId,
            updatedFields: formattedCard
        });

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

        const cardDoc = await Card.findById(cardId);

        if (!cardDoc || cardDoc.list_id.toString() !== listId) throw new NotFoundError('Card not found');

        const { _id, ...card } = cardDoc.toObject();

        const newPosition = await getHighestOrderCard(listId) + 1;

        const newCard = new Card({
            list_id: listId,
            title: card.title + ' Copy',
            position: newPosition,
            labels: card.labels.map(l => l),
            ...card
        });

        await newCard.save();

        await List.findByIdAndUpdate(listId, { $push: { cards: newCard._id } });

        await createAuditLog("card", "create", newCard._id, newCard.title, orgId, userId);

        const formattedCard = await formatCard(newCard);

        // Emit event
        getIO().to(boardId).emit('cardCreated', {
            card: formattedCard,
            listId
        });

        res.status(201).json({ success: true, data: formattedCard });
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

        // Emit event
        getIO().to(boardId).emit('cardDeleted', {
            cardId,
            listId
        });

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

        await card.populate('labels');

        // Emit event
        getIO().to(boardId).emit('cardUpdated', {
            cardId,
            listId,
            updatedFields: {
                labels: card.labels
            }
        });

        res.status(200).json({ success: true });
    } catch (error) {
        next(error)
    }
}

export const updateAssignees = async (req, res, next) => {
    try {
        const { orgId } = req.auth;
        const { boardId, listId, cardId, assignees } = req.body;

        if (!boardId || !listId || !cardId || !assignees) throw new InvalidDataError('Missing required fields');

        await verifyCardPermission(orgId, boardId, listId);

        const card = await Card.findById(cardId);

        if (!card) throw new NotFoundError('Card not found');

        const removedAssignees = card.assignedTo?.filter(id => !assignees.includes(id));

        await Promise.all(assignees.map(id => assignUser(id, orgId, card)));
        await Promise.all(removedAssignees.map(id => unassignUser(id, orgId, card)));


        const updatedCard = await Card.findById(cardId);
        const formattedCard = await formatCard(updatedCard);

        // Emit event
        getIO().to(boardId).emit('cardUpdated', {
            cardId,
            listId,
            updatedFields: {
                assignedTo: formattedCard.assignedTo
            }
        });

        return res.status(200).json({ success: true, data: formattedCard });

    } catch (error) {
        next(error)
    }
}