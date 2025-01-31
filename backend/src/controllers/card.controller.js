import { getHighestOrderCard, verifyCardPermission } from '../lib/db-util.js';
import { InvalidDataError, NotFoundError } from '../lib/error-util.js';
import Card from '../models/card.model.js';
import List from '../models/list.model.js';


export const createCard = async (req, res, next) => {
    try {
        const { orgId } = req.auth;
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
        const { orgId } = req.auth;
        const { boardId, listId, cardId, title, description } = req.body;

        await verifyCardPermission(orgId, boardId, listId);

        const card = await Card.findById(cardId);

        if (!card || card.list_id.toString() !== listId) throw new NotFoundError('Card not found');

        card.title = title;
        card.description = description;

        await card.save();

        res.status(200).json({ success: true });

    } catch (error) {
        next(error)
    }
}