import express from 'express';
import { AcademicSemesterControllers } from './academic.semester.controller';
import requestValidator from '../../middlewares/requestValidator';
import { AcademicSemesterValidation } from './academic.semester.validation';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constants';

const router = express.Router();

router.post(
    "/create-academic-semester",
    auth(USER_ROLE.admin, USER_ROLE.superAdmin),
    requestValidator(AcademicSemesterValidation.createAcademicSemesterValidationSchema),
    AcademicSemesterControllers.createAcademicSemester
);

router.get(
    '/',
    auth(USER_ROLE.admin, USER_ROLE.student, USER_ROLE.faculty, USER_ROLE.superAdmin),
    AcademicSemesterControllers.getAllAcademicSemesters
);

router.get(
    '/:semesterId',
    auth(USER_ROLE.admin, USER_ROLE.student, USER_ROLE.faculty, USER_ROLE.superAdmin),
    AcademicSemesterControllers.getSingleAcademicSemester,
);

router.patch(
    '/:semesterId',
    auth(USER_ROLE.admin, USER_ROLE.superAdmin)
    ,
    requestValidator(
        AcademicSemesterValidation.updateAcademicSemesterValidationSchema,
    ),
    AcademicSemesterControllers.updateAcademicSemester,
);


export const AcademicSemesterRoutes = router;
