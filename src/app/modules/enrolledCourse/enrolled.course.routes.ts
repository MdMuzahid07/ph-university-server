import express from 'express';
import auth from '../../middlewares/auth';
import { EnrolledCourseValidations } from './enrolled.course.validation';
import requestValidator from '../../middlewares/requestValidator';
import { EnrolledCourseControllers } from './enrolled.course.controller';


const router = express.Router();

router.post(
    '/create-enrolled-course',
    auth('student'),
    requestValidator(
        EnrolledCourseValidations.createEnrolledCourseValidationZodSchema,
    ),
    EnrolledCourseControllers.createEnrolledCourse,
);

router.patch(
    '/update-enrolled-course-marks',
    auth('faculty'),
    requestValidator(
        EnrolledCourseValidations.updateEnrolledCourseMarksValidationZodSchema,
    ),
    EnrolledCourseControllers.updateEnrolledCourseMarks,
);

export const EnrolledCourseRoutes = router;