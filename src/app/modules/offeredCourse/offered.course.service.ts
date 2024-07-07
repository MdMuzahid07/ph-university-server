import httpStatus from 'http-status';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../errors/AppError';
import { TOfferedCourse } from './offered.course.interface';
import { SemesterRegistrationModel } from '../semesterRegistration/semester.registration.schema.model';
import AcademicFacultyModel from '../academicFaculty/academic.faculty.schema.model';
import AcademicDepartmentModel from '../academicDepartment/academic.department.schema.model';
import CourseModel from '../course/course.schema.model';
import { OfferedCourseModel } from './offered.course.schema.model';
import { hasTimeConflict } from './offered.course.utils';
import { Faculty } from '../faculty/faculty.schema.model';
import { StudentModel } from '../student/student.model';


const createOfferedCourseIntoDB = async (payload: TOfferedCourse) => {
    const {
        semesterRegistration,
        academicFaculty,
        academicDepartment,
        course,
        section,
        faculty,
        days,
        startTime,
        endTime,
    } = payload;

    /**
     * Step 1: check if the semester registration id is exists!
     * Step 2: check if the academic faculty id is exists!
     * Step 3: check if the academic department id is exists!
     * Step 4: check if the course id is exists!
     * Step 5: check if the faculty id is exists!
     * Step 6: check if the department is belong to the  faculty
     * Step 7: check if the same offered course same section in same registered semester exists
     * Step 8: get the schedules of the faculties
     * Step 9: check if the faculty is available at that time. If not then throw error
     * Step 10: create the offered course
     */

    //check if the semester registration id is exists!
    const isSemesterRegistrationExits =
        await SemesterRegistrationModel.findById(semesterRegistration);

    if (!isSemesterRegistrationExits) {
        throw new AppError(
            httpStatus.NOT_FOUND,
            'Semester registration not found !',
        );
    }

    const academicSemester = isSemesterRegistrationExits.academicSemester;

    const isAcademicFacultyExits =
        await AcademicFacultyModel.findById(academicFaculty);

    if (!isAcademicFacultyExits) {
        throw new AppError(httpStatus.NOT_FOUND, 'Academic Faculty not found !');
    }

    const isAcademicDepartmentExits =
        await AcademicDepartmentModel.findById(academicDepartment);

    if (!isAcademicDepartmentExits) {
        throw new AppError(httpStatus.NOT_FOUND, 'Academic Department not found !');
    }

    const isCourseExits = await CourseModel.findById(course);

    if (!isCourseExits) {
        throw new AppError(httpStatus.NOT_FOUND, 'Course not found !');
    }

    const isFacultyExits = await Faculty.findById(faculty);

    if (!isFacultyExits) {
        throw new AppError(httpStatus.NOT_FOUND, 'Faculty not found !');
    }

    // check if the department is belong to the  faculty
    const isDepartmentBelongToFaculty = await AcademicDepartmentModel.findOne({
        _id: academicDepartment,
        academicFaculty,
    });

    if (!isDepartmentBelongToFaculty) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            `This ${isAcademicDepartmentExits.name} is not  belong to this ${isAcademicFacultyExits.name}`,
        );
    }

    // check if the same offered course same section in same registered semester exists

    const isSameOfferedCourseExistsWithSameRegisteredSemesterWithSameSection =
        await OfferedCourseModel.findOne({
            semesterRegistration,
            course,
            section,
        });

    if (isSameOfferedCourseExistsWithSameRegisteredSemesterWithSameSection) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            `Offered course with same section is already exist!`,
        );
    }

    // get the schedules of the faculties
    const assignedSchedules = await OfferedCourseModel.find({
        semesterRegistration,
        faculty,
        days: { $in: days },
    }).select('days startTime endTime');

    const newSchedule = {
        days,
        startTime,
        endTime,
    };

    if (hasTimeConflict(assignedSchedules, newSchedule)) {
        throw new AppError(
            httpStatus.CONFLICT,
            `This faculty is not available at that time ! Choose other time or day`,
        );
    }

    const result = await OfferedCourseModel.create({
        ...payload,
        academicSemester,
    });
    return result;
};

const getAllOfferedCoursesFromDB = async (query: Record<string, unknown>) => {
    const offeredCourseQuery = new QueryBuilder(OfferedCourseModel.find(), query)
        .filter()
        .sort()
        .paginate()
        .fields();

    const meta = await offeredCourseQuery.countTotal();
    const result = await offeredCourseQuery.modelQuery;

    return {
        meta,
        result
    };
};

const getMyOfferedCoursesFromDB = async (userId: string, query: Record<string, unknown>) => {

    // pagination setup
    const page = Number(query?.page) || 1;
    const limit = Number(query?.limit) || 10;
    const skip = (page - 1) * limit;



    const student = await StudentModel.findOne({ id: userId });

    if (!student) {
        throw new AppError(httpStatus.NOT_FOUND, "user not found");
    }

    // current ongoing semester

    const currentOnGoingRegistrationSemester = await SemesterRegistrationModel.findOne({ status: "ONGOING" });

    if (!currentOnGoingRegistrationSemester) {
        throw new AppError(httpStatus.NOT_FOUND, "there is no ongoing semester registration");
    }


    const aggregationQuery = [
        {
            $match: {
                semesterRegistration: currentOnGoingRegistrationSemester?._id,
                academicFaculty: student.academicFaculty,
                academicDepartment: student.academicDepartment,
            }
        },
        {
            $lookup: {
                from: "courses",
                localField: "course",
                foreignField: "_id",
                as: "course"
            }
        },
        {
            $unwind: "$course"
        },
        {
            $lookup: {
                from: "enrolledCourses",
                let: {
                    currentOnGoingRegistrationSemester: currentOnGoingRegistrationSemester._id,
                    currentStudent: student._id
                },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    {
                                        $eq: [
                                            "$semesterRegistration",
                                            "$$currentOnGoingRegistrationSemester"
                                        ],
                                    },
                                    {
                                        $eq: [
                                            "$student",
                                            "$$currentStudent"
                                        ],
                                    },
                                    {
                                        $eq: [
                                            "$isEnrolled",
                                            true
                                        ],
                                    }
                                ]
                            }
                        }
                    }
                ],
                as: "enrolledCourses"
            }
        },
        {
            $lookup: {
                from: "enrolledCourses",
                let: {
                    currentStudent: student._id
                },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    {
                                        $eq: ["$student", "$$currentStudent"]
                                    },
                                    {
                                        $eq: ["$isCompleted", true]
                                    }
                                ]
                            }
                        }
                    }
                ],
                as: "completedCourses"
            }
        },
        {
            $addFields: {
                completedCourseIds: {
                    $map: {
                        input: "$completedCourses",
                        as: "completed",
                        in: "$$completed.course"
                    }
                }
            }
        },
        {
            $addFields: {

                isPreRequisitesFulFilled: {
                    $or: [
                        {
                            $eq: ["$course.preRequisiteCourses", []]
                        },
                        {
                            $setIsSubset: [
                                "$course.preRequisiteCourses.course",
                                "$completedCourseIds"
                            ]
                        }
                    ]
                },

                isAlreadyEnrolled: {
                    $in: ["course._id", {
                        $map: {
                            input: "$enrolledCourses",
                            as: "enroll",
                            in: "$$enroll.course"
                        }
                    }]
                }
            }
        },
        {
            $match: {
                isAlreadyEnrolled: false,
                isPreRequisitesFulFilled: true
            }
        },

    ]
    const paginationQuery = [
        {
            $skip: skip
        },
        {
            $limit: limit
        }
    ]

    const result = await OfferedCourseModel.aggregate([...aggregationQuery, ...paginationQuery]);

    const total = (await OfferedCourseModel.aggregate(aggregationQuery)).length;
    const totalPage = Math.ceil(result.length / limit);

    return {
        meta: {
            page,
            limit,
            total,
            totalPage
        },
        result
    };
};

const getSingleOfferedCourseFromDB = async (id: string) => {
    const offeredCourse = await OfferedCourseModel.findById(id);

    if (!offeredCourse) {
        throw new AppError(404, 'Offered Course not found');
    }

    return offeredCourse;
};

const updateOfferedCourseIntoDB = async (
    id: string,
    payload: Pick<TOfferedCourse, 'faculty' | 'days' | 'startTime' | 'endTime'>,
) => {
    /**
     * Step 1: check if the offered course exists
     * Step 2: check if the faculty exists
     * Step 3: check if the semester registration status is upcoming
     * Step 4: check if the faculty is available at that time. If not then throw error
     * Step 5: update the offered course
     */
    const { faculty, days, startTime, endTime } = payload;

    const isOfferedCourseExists = await OfferedCourseModel.findById(id);

    if (!isOfferedCourseExists) {
        throw new AppError(httpStatus.NOT_FOUND, 'Offered course not found !');
    }

    const isFacultyExists = await Faculty.findById(faculty);

    if (!isFacultyExists) {
        throw new AppError(httpStatus.NOT_FOUND, 'Faculty not found !');
    }

    const semesterRegistration = isOfferedCourseExists.semesterRegistration;
    // get the schedules of the faculties


    // Checking the status of the semester registration
    const semesterRegistrationStatus =
        await SemesterRegistrationModel.findById(semesterRegistration);

    if (semesterRegistrationStatus?.status !== 'UPCOMING') {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            `You can not update this offered course as it is ${semesterRegistrationStatus?.status}`,
        );
    }

    // check if the faculty is available at that time.
    const assignedSchedules = await OfferedCourseModel.find({
        semesterRegistration,
        faculty,
        days: { $in: days },
    }).select('days startTime endTime');

    const newSchedule = {
        days,
        startTime,
        endTime,
    };

    if (hasTimeConflict(assignedSchedules, newSchedule)) {
        throw new AppError(
            httpStatus.CONFLICT,
            `This faculty is not available at that time ! Choose other time or day`,
        );
    }

    const result = await OfferedCourseModel.findByIdAndUpdate(id, payload, {
        new: true,
    });
    return result;
};

const deleteOfferedCourseFromDB = async (id: string) => {
    /**
     * Step 1: check if the offered course exists
     * Step 2: check if the semester registration status is upcoming
     * Step 3: delete the offered course
     */
    const isOfferedCourseExists = await OfferedCourseModel.findById(id);

    if (!isOfferedCourseExists) {
        throw new AppError(httpStatus.NOT_FOUND, 'Offered Course not found');
    }

    const semesterRegistration = isOfferedCourseExists.semesterRegistration;

    const semesterRegistrationStatus =
        await SemesterRegistrationModel.findById(semesterRegistration).select('status');

    if (semesterRegistrationStatus?.status !== 'UPCOMING') {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            `Offered course can not update ! because the semester ${semesterRegistrationStatus}`,
        );
    }

    const result = await OfferedCourseModel.findByIdAndDelete(id);

    return result;
};



export const OfferedCourseServices = {
    createOfferedCourseIntoDB,
    getAllOfferedCoursesFromDB,
    getSingleOfferedCourseFromDB,
    deleteOfferedCourseFromDB,
    updateOfferedCourseIntoDB,
    getMyOfferedCoursesFromDB
};