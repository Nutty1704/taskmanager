import Checklist from "../models/checklist.model.js";
import { safeGetCard } from "../lib/db-util/card-util.js";
import { InvalidDataError, NotFoundError } from "../lib/error-util.js";
import { safeGetChecklist } from "../lib/db-util/checklist-util.js";


export const createChecklist = async (req, res, next) => {
    try {
        const { orgId } = req.auth;
        const { cardId, listId, boardId, title } = req.body;

        if (!cardId || !listId || !boardId) {
            throw new InvalidDataError('Card Id, List Id and Board Id are required');
        }

        const card = await safeGetCard(cardId, listId, boardId, orgId);

        const newChecklist = new Checklist({
            cardId,
            title
        });

        await newChecklist.save();

        card.checklists.push(newChecklist._id);

        await card.save();

        res.status(201).json({ success: true, data: newChecklist });
    } catch (error) {
        next(error);
    }
}

export const addItem = async (req, res, next) => {
    try {
        const { cardId, checklistId, text, isCompleted = false } = req.body;

        if (!cardId || !text || !checklistId) {
            throw new InvalidDataError('Card Id, Checklist Id and Text are required');
        }

        const checklist = await safeGetChecklist(checklistId, cardId);

        checklist.items.push({
            text,
            isCompleted
        });

        await checklist.save();

        res.status(201).json({ success: true, data: checklist });
    } catch (error) {
        next(error);
    }
}

export const updateItem = async (req, res, next) => {
    try {
        const { cardId, checklistId, itemId, text, isCompleted = false } = req.body;

        if (!cardId || !text || !checklistId || !itemId) {
            throw new InvalidDataError('Card Id, Checklist Id, Item Id and Text are required');
        }

        const checklist = await safeGetChecklist(checklistId, cardId);

        const item = checklist.items.find(item => item._id.toString() === itemId);

        if (!item) throw new NotFoundError('Item not found');

        item.text = text;
        item.isCompleted = isCompleted;

        await checklist.save();

        res.status(200).json({ success: true });
    } catch (error) {
        next(error);
    }
}

export const deleteItem = async (req, res, next) => {
    try {
        const { cardId, checklistId, itemId } = req.body;

        if (!cardId || !checklistId || !itemId) {
            throw new InvalidDataError('Card Id, Checklist Id and Item Id are required');
        }

        const checklist = await safeGetChecklist(checklistId, cardId);

        const item = checklist.items.find(item => item._id.toString() === itemId);

        if (item) {
            checklist.items = checklist.items.filter(item => item._id.toString() !== itemId);
            await checklist.save();
        }

        res.status(200).json({ success: true });
    } catch (error) {
        next(error);
    }
}

export const removeChecklist = async (req, res, next) => {
    try {
        const { orgId } = req.auth;

        const { cardId, listId, boardId, checklistId } = req.body;

        if (!cardId || !listId || !boardId || !checklistId) {
            throw new InvalidDataError('Card Id, List Id, Board Id and Checklist Id are required');
        }

        const checklist = await safeGetChecklist(checklistId, cardId);

        await checklist.deleteOne();

        res.status(200).json({ success: true });
    } catch (error) {
        next(error);
    }
}

export const getChecklists = async (req, res, next) => {
    try {
        const { cardId } = req.params;

        const checklists = await Checklist.find({ cardId });

        res.status(200).json({ success: true, data: checklists });
    } catch (error) {
        next(error);
    }
}

export const updateChecklist = async (req, res, next) => {
    try {
        const { cardId, checklistId, title } = req.body;
        
        if (!cardId || !checklistId || !title) {
            throw new InvalidDataError('Card Id, Checklist Id and Title are required');
        }

        const checklist = await safeGetChecklist(checklistId, cardId);

        checklist.title = title;

        await checklist.save();

        res.status(200).json({ success: true });
    } catch (error) {
        next(error);
    }
}