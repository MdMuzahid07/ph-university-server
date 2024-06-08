import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { NextFunction, Request, Response } from "express";


const createSemesterRegistration = catchAsync(
    async (req: Request, res: Response) => {

        // const result = 


        // sendResponse(res, {
        //     statusCode: httpStatus.OK,
        //     success: true,
        //     message: 'semester registration is created successfully',
        //     data: result,
        // });
    }
);


const getAllSemesterRegistration = catchAsync(
    async (req: Request, res: Response) => {

        // const result = 


        // sendResponse(res, {
        //     statusCode: httpStatus.OK,
        //     success: true,
        //     message: 'semester registration data retrieved successfully',
        //     data: result,
        // });
    }
);


const getSingleSemesterRegistration = catchAsync(
    async (req: Request, res: Response) => {

        // const result = 


        // sendResponse(res, {
        //     statusCode: httpStatus.OK,
        //     success: true,
        //     message: 'semester registration single data retrieved successfully',
        //     data: result,
        // });
    }
);


const updateSemesterRegistration = catchAsync(
    async (req: Request, res: Response) => {
        const { id } = req.params;
        // const result = 


        // sendResponse(res, {
        //     statusCode: httpStatus.OK,
        //     success: true,
        //     message: 'semester registration data updated successfully',
        //     data: result,
        // });
    }
);

export const SemesterRegistrationController = {
    updateSemesterRegistration,
    getSingleSemesterRegistration,
    getAllSemesterRegistration,
    createSemesterRegistration
}