import mongoose from "mongoose";
import QueryBuilder from "../../builder/QueryBuilder";
import { courseSearchableFields } from "./course.constants";
import { TCourse, TCourseFaculty } from "./course.interface";
import CourseModel, { CourseFacultyModel } from "./course.schema.model"
import AppError from "../../errors/AppError";
import httpStatus from "http-status";

const createCourseIntoDB = async (payload: TCourse) => {

    const res = await CourseModel.create(payload);

    return res;
};


const getAllCoursesFromDB = async (query: Record<string, unknown>) => {

    const courseQuery = new QueryBuilder(
        CourseModel.find().populate("preRequisiteCourses.course"), query
    )
        .search(courseSearchableFields)
        .filter()
        .sort()
        .paginate()
        .fields()

    const res = await courseQuery.modelQuery;
    return res;
};


const getASingleCourse = async (id: string) => {
    const res = await CourseModel.findById(id).populate("preRequisiteCourses.course");
    return res;
};


const courseUpdateInDB = async (id: string, payload: Partial<TCourse>) => {

    const { preRequisiteCourses, ...courseRemainingData } = payload;

    const session = await mongoose.startSession();

    try {



        session.startTransaction();


        // step-1 - update basic course info
        const updatedBasicCourseInfo = await CourseModel.findByIdAndUpdate(
            id,
            courseRemainingData,
            {
                new: true,
                runValidators: true,
                session
            }
        );


        if (!updatedBasicCourseInfo) {
            throw new AppError(httpStatus.BAD_REQUEST, "Failed to update course")
        };

        // check if there any  pre requisite courses to update

        if (preRequisiteCourses && preRequisiteCourses.length > 0) {
            // filter out the deleted fields
            const deletesPreRequisites = preRequisiteCourses.filter(element => element.course && element.isDeleted).map(el => el.course);

            const deletedPreRequisiteCourses = await CourseModel.findByIdAndUpdate(
                id,
                {
                    $pull: {
                        preRequisiteCourses: { course: { $in: deletesPreRequisites } }
                    }
                },
                {
                    new: true,
                    runValidators: true,
                    session
                }
            );

            if (!deletedPreRequisiteCourses) {
                throw new AppError(httpStatus.BAD_REQUEST, "Failed to update course")
            };

            // filter out the new course fields

            const newPreRequisites = preRequisiteCourses?.filter(el => el.course && !el.isDeleted);

            const newPreRequisiteCourses = await CourseModel.findByIdAndUpdate(
                id,
                {
                    $addToSet: { preRequisiteCourses: { $each: newPreRequisites } }
                },
                {
                    new: true,
                    runValidators: true,
                    session
                }
            );

            if (!newPreRequisiteCourses) {
                throw new AppError(httpStatus.BAD_REQUEST, "Failed to update course")
            };


        };


        const result = await CourseModel.findById(id).populate("preRequisiteCourses.course");


        await session.commitTransaction();
        await session.endSession();

        return result;

    } catch (error) {
        await session.abortTransaction();
        await session.endSession();
        throw new Error(error as string);
    }
};

const deleteCourseFromBD = async (id: string) => {
    const res = CourseModel.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
    return res;
};

const assignFacultiesWithCourseIntoDB = async (id: string, payload: Partial<TCourseFaculty>) => {

    const result = await CourseFacultyModel.findByIdAndUpdate(
        id,
        {
            course: id,
            $addToSet: { faculties: { $each: payload } }
        },
        {
            upsert: true,
            new: true
        }
    );

    return result;
};

export const CourseServices = {
    createCourseIntoDB,
    getAllCoursesFromDB,
    getASingleCourse,
    deleteCourseFromBD,
    courseUpdateInDB,
    assignFacultiesWithCourseIntoDB
};