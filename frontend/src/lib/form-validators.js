import { z } from 'zod';


export const boardSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters").max(255),
    image: z.string({
        required_error: "Image is required",
        invalid_type_error: "Image is required",
    }),
});