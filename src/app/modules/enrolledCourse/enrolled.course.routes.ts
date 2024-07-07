import express from 'express';
import auth from '../../middlewares/auth';
import { EnrolledCourseValidations } from './enrolled.course.validation';
import requestValidator from '../../middlewares/requestValidator';
import { EnrolledCourseControllers } from './enrolled.course.controller';
import { USER_ROLE } from '../user/user.constants';


const router = express.Router();

router.post(
    '/create-enrolled-course',
    auth(USER_ROLE.student),
    requestValidator(
        EnrolledCourseValidations.createEnrolledCourseValidationZodSchema,
    ),
    EnrolledCourseControllers.createEnrolledCourse,
);


router.get(
    "/my-enrolled-course",
    auth(USER_ROLE.student),
    EnrolledCourseControllers.getMyEnrolledCourses
)


router.patch(
    '/update-enrolled-course-marks',
    auth(USER_ROLE.faculty, USER_ROLE.admin, USER_ROLE.superAdmin),
    requestValidator(
        EnrolledCourseValidations.updateEnrolledCourseMarksValidationZodSchema,
    ),
    EnrolledCourseControllers.updateEnrolledCourseMarks,
);

export const EnrolledCourseRoutes = router;