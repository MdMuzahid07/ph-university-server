import express, { NextFunction, Request, Response } from "express";
import { UserController } from "./user.controller";
import { AnyZodObject } from "zod";
import { studentValidations } from "../student/student.validation";

const router = express.Router();


const requestValidator = (schema: AnyZodObject) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {

            // validation

            // if validation OK, next() 
            await schema.parseAsync(
                {
                    body: req.body
                }
            );

            return next();
        } catch (error) {
            next(error);
        }
    }
};



router.post('/create-student', requestValidator(studentValidations.studentValidationSchema), UserController.createStudent);


export const UserRoutes = router;