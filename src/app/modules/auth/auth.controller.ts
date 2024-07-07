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
        httpOnly: true,
        sameSite: "none",
        maxAge: 1000 * 60 * 60 * 24 * 365
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

const forgetPassword = catchAsync(async (req, res) => {
    const userId = req.body.id;
    const result = await AuthServices.forgetPassword(userId);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "reset link is generated successfully",
        data: result
    });
});


const resetPassword = catchAsync(async (req, res) => {

    const token = req.headers.authorization;
    const result = await AuthServices.resetPassword(req.body, token as string);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "reset password successfully",
        data: result
    });
});



export const AuthController = {
    loginUser,
    changePassword,
    refreshToken,
    forgetPassword,
    resetPassword
};