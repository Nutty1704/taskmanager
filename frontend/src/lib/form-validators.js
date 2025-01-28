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