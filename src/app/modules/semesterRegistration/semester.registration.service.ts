import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import AcademicSemesterModel from "../academicSemester/academic.semester.schema.model";
import { TSemesterRegistration } from "./semester-registration.interface";
import QueryBuilder from "../../builder/QueryBuilder";
import { SemesterRegistrationModel } from "./semester.registration.schema.model";
import { RegistrationStatus } from "./semester.registration.constants";

const createSemesterRegistrationIntoDB = async (
    payload: TSemesterRegistration,
) => {
    /**
     * Step1: Check if there any registered semester that is already 'UPCOMING'|'ONGOING'
     * Step2: Check if the semester is exist
     * Step3: Check if the semester is already registered!
     * Step4: Create the semester registration
     */

    const academicSemester = payload?.academicSemester;

    //check if there any registered semester that is already 'UPCOMING'|'ONGOING'
    const isThereAnyUpcomingOrOngoingSEmester =
        await SemesterRegistrationModel.findOne({
            $or: [
                { status: RegistrationStatus.UPCOMING },
                { status: RegistrationStatus.ONGOING },
            ],
        });

    if (isThereAnyUpcomingOrOngoingSEmester) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            `There is aready an ${isThereAnyUpcomingOrOngoingSEmester.status} registered semester !`,
        );
    }
    // check if the semester is exist
    const isAcademicSemesterExists =
        await AcademicSemesterModel.findById(academicSemester);

    if (!isAcademicSemesterExists) {
        throw new AppError(
            httpStatus.NOT_FOUND,
            'This academic semester not found !',
        );
    }

    // check if the semester is already registered!
    const isSemesterRegistrationExists = await SemesterRegistrationModel.findOne({
        academicSemester,
    });

    if (isSemesterRegistrationExists) {
        throw new AppError(
            httpStatus.CONFLICT,
            'This semester is already registered!',
        );
    }

    const result = await SemesterRegistrationModel.create(payload);
    return result;
};



const getAllSemesterRegistrationFromDB = async (query: Record<string, unknown>) => {
    const semesterRegistrationQuery = new QueryBuilder(SemesterRegistrationModel.find().populate("academicSemester"), query).filter().sort().paginate().fields();

    const result = await semesterRegistrationQuery.modelQuery;
    return result;
};


const getSingleSemesterRegistrationFromDB = async (id: string) => {
    const result = await SemesterRegistrationModel.findById(id);
    return result;
};



const updateSemesterRegistrationIntoDB = async (id: string, payload: TSemesterRegistration) => {
    /**
     * Step1: Check if the semester is exist
     * Step2: Check if the requested registered semester is exists
     * Step3: If the requested semester registration is ended, we will not update anything
     * Step4: If the requested semester registration is 'UPCOMING', we will let update everything.
     * Step5: If the requested semester registration is 'ONGOING', we will not update anything  except status to 'ENDED'
     * Step6: If the requested semester registration is 'ENDED' , we will not update anything
     *
     * UPCOMING --> ONGOING --> ENDED
     *
     */

    // check if the requested registered semester is exists
    // check if the semester is already registered!
    const isSemesterRegistrationExists = await SemesterRegistrationModel.findById(id);

    if (!isSemesterRegistrationExists) {
        throw new AppError(httpStatus.NOT_FOUND, 'This semester is not found !');
    }

    //if the requested semester registration is ended , we will not update anything
    const currentSemesterStatus = isSemesterRegistrationExists?.status;
    const requestedStatus = payload?.status;

    if (currentSemesterStatus === "ENDED") {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            `This semester is already ${currentSemesterStatus}`,
        );
    }

    // UPCOMING --> ONGOING --> ENDED
    if (
        currentSemesterStatus === "UPCOMING" &&
        requestedStatus === "ENDED"
    ) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            `You can not directly change status from ${currentSemesterStatus} to ${requestedStatus}`,
        );
    }

    if (
        currentSemesterStatus === "ONGOING" &&
        requestedStatus === "UPCOMING"
    ) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            `You can not directly change status from ${currentSemesterStatus} to ${requestedStatus}`,
        );
    }

    const result = await SemesterRegistrationModel.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });

    return result;
};




export const SemesterRegistrationServices = {
    createSemesterRegistrationIntoDB,
    getAllSemesterRegistrationFromDB,
    getSingleSemesterRegistrationFromDB,
    updateSemesterRegistrationIntoDB
}