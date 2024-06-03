/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prefer-const */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ErrorRequestHandler } from 'express';
import { ZodError, ZodIssue } from 'zod';
import { TErrorSource } from '../interface/error';
import config from '../config';
import handleZodError from '../errors/HandleZodError';
const globalErrorHandler: ErrorRequestHandler = (error, req, res, next) => {

    // setting default values
    let statusCode = error.statusCode || 500;
    let message = error.message || "Something went wrong";


    let errorSources: TErrorSource = [{
        path: "",
        message: "Something went wrong"
    }];


    if (error instanceof ZodError) {

        const simplifiedError = handleZodError(error);

        statusCode = simplifiedError?.statusCode;
        message = simplifiedError?.message;
        errorSources = simplifiedError?.errorSources;
    }


    // ultimate return
    return res.status(statusCode).json({
        success: false,
        message,
        errorSources,
        stack: config.NODE_ENV === "development" ? error?.stack : null
    })
}
export default globalErrorHandler;