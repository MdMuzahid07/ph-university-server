import express from 'express';
import requestValidator from '../../middlewares/requestValidator';
import { OfferedCourseControllers } from './offered.course.controllers';
import { OfferedCourseValidations } from './offered.course.validation';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constants';


const router = express.Router();

router.get('/',
    auth(USER_ROLE.admin, USER_ROLE.faculty, USER_ROLE.superAdmin),
    OfferedCourseControllers.getAllOfferedCourses);

router.get('/my-offered-courses',
    auth(USER_ROLE.student),
    OfferedCourseControllers.getMyOfferedCourses
);

router.get('/:id',
    auth(USER_ROLE.admin, USER_ROLE.faculty, USER_ROLE.student, USER_ROLE.superAdmin),
    OfferedCourseControllers.getSingleOfferedCourses);

router.post(
    '/create-offered-course',
    auth(USER_ROLE.admin, USER_ROLE.superAdmin),
    requestValidator(OfferedCourseValidations.createOfferedCourseValidationSchema),
    OfferedCourseControllers.createOfferedCourse,
);

router.patch(
    '/:id',
    auth(USER_ROLE.admin, USER_ROLE.superAdmin),
    requestValidator(OfferedCourseValidations.updateOfferedCourseValidationSchema),
    OfferedCourseControllers.updateOfferedCourse,
);

router.delete(
    '/:id',
    auth(USER_ROLE.admin, USER_ROLE.superAdmin),
    OfferedCourseControllers.deleteOfferedCourseFromDB,
);

export const offeredCourseRoutes = router;