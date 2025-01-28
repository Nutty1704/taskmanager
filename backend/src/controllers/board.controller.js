import Board from '../models/board.model.js'

export const createBoard = async (req, res) => {
    try {
        const {
            title,
            imageId,
            imageThumbUrl,
            imageFullUrl,
            imageLinkHTML,
            imageUserName
        } = req.body;

        const { orgId } = req.auth;

        if (!title || !imageId || !imageThumbUrl || !imageFullUrl || !imageLinkHTML || !imageUserName) {
            return res.status(400).json({ success: false, message: "Invalid board data" });
        }

        const newBoard = new Board({
            title,
            orgId,
            imageId,
            imageThumbUrl,
            imageFullUrl,
            imageLinkHTML,
            imageUserName
        });

        await newBoard.save();

        res.status(201).json({ success: true, data: newBoard });

    } catch (error) {
        console.log("Error in createBoard controller", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}


export const deleteBoard = async (req, res) => {
    try {
        const { id } = req.body;
        const { orgId } = req.auth;

        if (!id) {
            return res.status(400).json({ success: false, message: "Board id is required" });
        }

        const board = await Board.findById(id);

        if (!board) {
            return res.status(404).json({ success: false, message: "Board not found" });
        }

        if (board.orgId.toString() !== orgId) {
            return res.status(403).json({ success: false, message: "Unauthorized" });
        }

        await Board.findByIdAndDelete(id);

        res.status(200).json({ success: true, message: "Board deleted successfully" });

    } catch (error) {
        console.log("Error in deleteBoard", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}


export const getBoards = async (req, res) => {
    try {
        const { orgId } = req.auth;

        const boards = await Board.find({ orgId }).sort({ createdAt: -1 });

        res.status(200).json({ success: true, data: boards });
    } catch (error) {
        console.log("Error in getBoards controller", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}


export const getBoard = async (req, res) => {
    try {
        const { orgId } = req.auth;
        const { boardId } = req.params;

        const board = await Board.findOne({ _id: boardId, orgId });

        if (!board) {
            return res.status(404).json({ success: false, message: "Board not found" });
        }

        res.status(200).json({ success: true, data: board });
    } catch (error) {
        console.log("Error in getBoard controller", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}


export const updateBoard = async (req, res) => {
    try {
        const { id, title } = req.body;
        const { orgId } = req.auth;

        if (!id || !title) {
            return res.status(400).json({ success: false, message: "Board id and title are required" });
        }

        const board = await Board.findById(id);

        if (!board) {
            return res.status(404).json({ success: false, message: "Board not found" });
        }

        if (board.orgId.toString() !== orgId) {
            return res.status(403).json({ success: false, message: "Unauthorized" });
        }

        board.title = title;

        await board.save();

        res.status(200).json({ success: true, data: board });
    } catch (error) {
        console.log("Error in updateBoard controller", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}