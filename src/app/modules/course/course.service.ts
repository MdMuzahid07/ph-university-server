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


const deleteCourseFromBD = async (id: string) => {
    const res = CourseModel.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
    return res;
};


export const CourseServices = {
    createCourseIntoDB,
    getAllCoursesFromDB,
    getASingleCourse,
    deleteCourseFromBD
};