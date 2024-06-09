import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { Request, Response } from "express";
import { SemesterRegistrationServices } from "./semester.registration.service";


const createSemesterRegistration = catchAsync(
    async (req: Request, res: Response) => {

        const result = await SemesterRegistrationServices.createSemesterRegistrationIntoDB(req.body);


        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'semester registration is created successfully',
            data: result,
        });
    }
);


const getAllSemesterRegistration = catchAsync(
    async (req: Request, res: Response) => {

        const result = await SemesterRegistrationServices.getAllSemesterRegistrationFromDB(req.query);


        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'semester registration data retrieved successfully',
            data: result,
        });
    }
);


const getSingleSemesterRegistration = catchAsync(
    async (req: Request, res: Response) => {
        const { id } = req.params;

        const result = await SemesterRegistrationServices.getSingleSemesterRegistrationFromDB(id);


        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'semester registration single data retrieved successfully',
            data: result,
        });
    }
);


const updateSemesterRegistration = catchAsync(
    async (req: Request, res: Response) => {
        const { id } = req.params;
        const result = await SemesterRegistrationServices.updateSemesterRegistrationIntoDB(id, req.body);


        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'semester registration data updated successfully',
            data: result,
        });
    }
);

const deleteSemesterRegistration = catchAsync(
    async (req: Request, res: Response) => {
        const { id } = req.params;
        const result =
            await SemesterRegistrationServices.deleteSemesterRegistrationFromDB(id);

        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Semester Registration is updated successfully',
            data: result,
        });
    },
);


export const SemesterRegistrationController = {
    updateSemesterRegistration,
    getSingleSemesterRegistration,
    getAllSemesterRegistration,
    createSemesterRegistration,
    deleteSemesterRegistration
}