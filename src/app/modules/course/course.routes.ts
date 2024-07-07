import express from 'express';
import requestValidator from '../../middlewares/requestValidator';
import { CourseValidation } from './course.validation';
import { CourseControllers } from './course.controllers';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constants';


const router = express.Router();

router.post(
    "/create-course",
    auth(USER_ROLE.admin, USER_ROLE.superAdmin),
    requestValidator(CourseValidation.createCourseValidationSchema),
    CourseControllers.createCorse
);

router.get('/',
    auth(
        USER_ROLE.admin,
        USER_ROLE.student,
        USER_ROLE.faculty,
        USER_ROLE.superAdmin
    ),
    CourseControllers.getAllCourses);

router.get(
    '/:id',
    auth(
        USER_ROLE.admin,
        USER_ROLE.student,
        USER_ROLE.faculty,
        USER_ROLE.superAdmin
    )
    ,
    CourseControllers.getSingleCourse,
);

router.delete(
    '/:id',
    auth(
        USER_ROLE.admin,
        USER_ROLE.superAdmin
    )
    ,
    CourseControllers.deleteCourse,
);

router.put(
    "/:courseId/assign-faculties",
    auth(
        USER_ROLE.admin,
        USER_ROLE.superAdmin
    ),
    requestValidator(
        CourseValidation.facultiesWithCourseValidationSchema
    ),
    CourseControllers.assignFacultiesWithCourse
);

router.get(
    "/:courseId/get-faculties",
    auth(
        USER_ROLE.admin,
        USER_ROLE.superAdmin,
        USER_ROLE.faculty,
        USER_ROLE.student
    ),
    CourseControllers.getFacultiesWithCourse
);


router.delete(
    "/:courseId/remove-faculties",
    auth(
        USER_ROLE.admin,
        USER_ROLE.superAdmin
    ),
    requestValidator(
        CourseValidation.facultiesWithCourseValidationSchema
    ),
    CourseControllers.deleteFacultiesWithCourse
);


router.patch(
    '/:id',
    auth(
        USER_ROLE.admin,
        USER_ROLE.superAdmin
    ),
    requestValidator(
        CourseValidation.updateCreateCourseValidationSchema,
    ),
    CourseControllers.updateCourse,
);


export const CourseRoute = router;
