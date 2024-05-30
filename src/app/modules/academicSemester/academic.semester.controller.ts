import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import { RequestHandler } from "express";
import { AcademicSemesterServices } from "./academic.semester.service";
import catchAsync from "../../utils/catchAsync";

const createAcademicSemester: RequestHandler = catchAsync(async (req, res) => {

    const result = await AcademicSemesterServices.createAcademicSemesterIntoDB(req.body);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Student created successfully",
        data: result
    });
});

export const AcademicSemesterControllers = {
    createAcademicSemester
};