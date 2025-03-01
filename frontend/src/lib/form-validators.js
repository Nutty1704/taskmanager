import { z } from 'zod';


export const boardSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters").max(255),
    image: z.string({
        required_error: "Image is required",
        invalid_type_error: "Image is required",
    }),
});


export const boardUpdateSchema = z.object({
    id: z.string(),
    title: z.string().min(3, "Title must be at least 3 characters").max(255),
});


export const getConfirmationSchema = (title) => z.object({
    confirmation: z.string().refine(value => value === title, {
        message: "Title does not match",
    }),
});


export const listSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters").max(255),
    boardId: z.string(),
    id: z.string(),
});


export const cardSchema = z.object({
    title: z.string({
        required_error: "Title is required",
        invalid_type_error: "Title is required",
    }).min(3, "Title must be at least 3 characters"),
    listId: z.string(),
    boardId: z.string(),
    description: z.string({
        required_error: "Description is required",
        invalid_type_error: "Description is required",
    }).min(3, "Description is too short"),
});


export const checklistSchema = z.object({
    title: z.string({
        required_error: "Title is required",
        invalid_type_error: "Title is required",
    }).min(1, "Title cannot be empty"),
});


export const checklistItemSchema = z.object({
    text: z.string({
        required_error: "Title is required",
        invalid_type_error: "Title is required",
    }).min(1, "Title cannot be empty"),
})