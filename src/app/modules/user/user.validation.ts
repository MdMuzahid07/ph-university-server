import { z } from "zod";
import { UserStatus } from "./user.constants";

const UserValidationSchema = z.object({
    password: z.string({
        invalid_type_error: "password must be string",
    }).max(20, { message: "password cannot be more than 20 characters" }).optional(),
});

const ChangeStatusValidationSchema = z.object({
    body: z.object({
        status: z.enum([...UserStatus] as [string, ...string[]])
    })
});

export const UserValidation = {
    UserValidationSchema,
    ChangeStatusValidationSchema
};
