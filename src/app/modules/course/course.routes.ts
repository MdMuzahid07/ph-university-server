import express from 'express';
import requestValidator from '../../middlewares/requestValidator';
import { CourseValidation } from './course.validation';
import { CourseControllers } from './course.controllers';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constants';


const router = express.Router();

router.post("/create-course", auth(USER_ROLE.admin), requestValidator(CourseValidation.createCourseValidationSchema), CourseControllers.createCorse);

router.get('/', CourseControllers.getAllCourses);

router.get(
    '/:id',
    auth(
        USER_ROLE.admin,
        USER_ROLE.student,
        USER_ROLE.faculty
    )
    ,
    CourseControllers.getSingleCourse,
);

router.delete(
    '/:id',
    auth(
        USER_ROLE.admin,
    )
    ,
    CourseControllers.deleteCourse,
);

router.put(
    "/:courseId/assign-faculties",
    requestValidator(
        CourseValidation.facultiesWithCourseValidationSchema
    ),
    CourseControllers.assignFacultiesWithCourse
);


router.delete(
    "/:courseId/remove-faculties",
    requestValidator(
        CourseValidation.facultiesWithCourseValidationSchema
    ),
    CourseControllers.deleteFacultiesWithCourse
);


router.patch(
    '/:id',
    requestValidator(
        CourseValidation.updateCreateCourseValidationSchema,
    ),
    auth(
        USER_ROLE.admin,
    ),
    CourseControllers.updateCourse,
);


export const CourseRoute = router;
