import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import { AuthServices } from "./auth.service";
import config from "../../config";


const loginUser = catchAsync(async (req: Request, res: Response) => {
    const result = await AuthServices.loginUser(req.body);
    const { refreshToken, accessToken, needPasswordChange } = result;

    res.cookie("refreshToken", refreshToken, {
        secure: config.NODE_ENV === "production",
        httpOnly: true
    });

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'user is logged in successfully',
        data: {
            accessToken,
            needPasswordChange
        },
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

const refreshToken = catchAsync(async (req, res) => {
    const { refreshToken } = req.cookies;

    const result = await AuthServices.refreshToken(refreshToken);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'access token generate successfully',
        data: result
    });
});


export const AuthController = {
    loginUser,
    changePassword,
    refreshToken
};