import { z } from "zod";

const UserValidationSchema = z.object({
    password: z.string({
        invalid_type_error: "password must be string",
    }).max(20, { message: "password cannot be more than 20 characters" }).optional(),
});

export const UserValidation = {
    UserValidationSchema
};