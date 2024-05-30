import { NextFunction, Request, Response } from "express";
import { AnyZodObject } from "zod";

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

export default requestValidator;