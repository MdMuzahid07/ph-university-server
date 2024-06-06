import mongoose, { model } from "mongoose";
import { TCourse, TPreRequisiteCourses } from "./course.interface";


const PreRequisiteCourseSchema = new mongoose.Schema<TPreRequisiteCourses>({
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course"
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
});

const CourseSchema = new mongoose.Schema<TCourse>({
    title: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    prefix: {
        type: String,
        required: true,
        trim: true
    },
    code: {
        type: Number,
        required: true
    },
    credits: {
        type: Number,
        trim: true,
        required: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    preRequisiteCourses: [PreRequisiteCourseSchema]
});



const CourseModel = model<TCourse>("Course", CourseSchema);

export default CourseModel;