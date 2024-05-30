import { UserService } from "./user.service";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import { RequestHandler } from "express";

const createStudent: RequestHandler = async (req, res, next) => {
    try {
        const { password, student: studentData } = req.body;
        const result = await UserService.createStudentIntoDB(password, studentData);

        // res.status(200).json({
        //     success: true,
        //     message: 'Student is created succesfully',
        //     data: result,
        // });

        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: "Student created successfully",
            data: result
        });

    } catch (error) {
        next(error);
    }
};

export const UserController = {
    createStudent
};