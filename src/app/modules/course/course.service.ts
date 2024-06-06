import QueryBuilder from "../../builder/QueryBuilder";
import { courseSearchableFields } from "./course.constants";
import { TCourse } from "./course.interface";
import CourseModel from "./course.schema.model"

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


    // step-1 - update basic course info
    const updatedBasicCourseInfo = await CourseModel.findByIdAndUpdate(
        id,
        courseRemainingData,
        {
            new: true,
            runValidators: true
        }
    );

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
            }
        );

        // filter out the new course fields

        const newPreRequisites = preRequisiteCourses?.filter(el => el.course && !el.isDeleted);

        const newPreRequisiteCourses = await CourseModel.findByIdAndUpdate(
            id,
            {
                $addToSet: { preRequisiteCourses: { $each: newPreRequisites } }
            }
        )

    };


    const result = await CourseModel.findById(id).populate("preRequisiteCourses.course");

    return result;
};

const deleteCourseFromBD = async (id: string) => {
    const res = CourseModel.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
    return res;
};


export const CourseServices = {
    createCourseIntoDB,
    getAllCoursesFromDB,
    getASingleCourse,
    deleteCourseFromBD,
    courseUpdateInDB
};