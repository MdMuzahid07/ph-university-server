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

const getAllAcademicSemesters = catchAsync(async (req, res) => {
    const query = req.query;
    const result = await AcademicSemesterServices.getAllAcademicSemestersFromDB(query);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Academic semesters are retrieved successfully',
        data: result,
    });
});

const getSingleAcademicSemester = catchAsync(async (req, res) => {
    const { semesterId } = req.params;
    const result =
        await AcademicSemesterServices.getSingleAcademicSemesterFromDB(semesterId);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Academic semester is retrieved succesfully',
        data: result,
    });
});

const updateAcademicSemester = catchAsync(async (req, res) => {
    const { semesterId } = req.params;
    const result = await AcademicSemesterServices.updateAcademicSemesterIntoDB(
        semesterId,
        req.body,
    );

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Academic semester is retrieved succesfully',
        data: result,
    });
});


export const AcademicSemesterControllers = {
    createAcademicSemester,
    getAllAcademicSemesters,
    getSingleAcademicSemester,
    updateAcademicSemester
};