import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import { CourseServices } from "./course.service";
import sendResponse from "../../utils/sendResponse";
import { RequestHandler } from "express";


const createCorse: RequestHandler = catchAsync(async (req, res) => {

    const result = await CourseServices.createCourseIntoDB(req.body);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Course created successfully",
        data: result
    });
});

const getAllCourses = catchAsync(async (req, res) => {

    const result = await CourseServices.getAllCoursesFromDB(req.query);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Courses are retrieved successfully',
        data: result,
    });
});

const getSingleCourse = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result =
        await CourseServices.getASingleCourse(id);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Course retrieved successfully',
        data: result,
    });
});


const deleteCourse = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result =
        await CourseServices.deleteCourseFromBD(id);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Course is deleted successfully',
        data: result,
    });
});


const updateCourse = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await CourseServices.courseUpdateInDB(
        id,
        req.body
    );

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'course is updated successfully',
        data: result,
    });
});

const assignFacultiesWithCourse = catchAsync(async (req, res) => {
    const { courseId } = req.params;
    const { faculties } = req.body;


    const result = await CourseServices.assignFacultiesWithCourseIntoDB(courseId, faculties);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Faculty assign successfully',
        data: result,
    });
});

const deleteFacultiesWithCourse = catchAsync(async (req, res) => {
    const { courseId } = req.params;
    const { faculties } = req.body;


    const result = await CourseServices.removeFacultiesWithCourseFromDB(courseId, faculties);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Faculty deleted successfully',
        data: result,
    });
});


export const CourseControllers = {
    createCorse,
    getAllCourses,
    getSingleCourse,
    deleteCourse,
    updateCourse,
    assignFacultiesWithCourse,
    deleteFacultiesWithCourse
};