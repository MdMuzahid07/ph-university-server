import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import { AuthServices } from "./auth.service";


const loginUser = catchAsync(async (req: Request, res: Response) => {
    const result = await AuthServices.loginUser(req.body);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'user is logged in successfully',
        data: result,
    });
});


const changePassword = catchAsync(async (req: Request, res: Response) => {
    const { ...passwordData } = req.body;
    const result = await AuthServices.changePassword(req?.user, passwordData);


    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'password change successfully',
        data: result,
    });
});


export const AuthController = {
    loginUser,
    changePassword
};