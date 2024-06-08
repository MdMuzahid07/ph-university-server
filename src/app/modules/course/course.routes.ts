import express from 'express';
import requestValidator from '../../middlewares/requestValidator';
import { CourseValidation } from './course.validation';
import { CourseControllers } from './course.controllers';


const router = express.Router();

router.post("/create-course", requestValidator(CourseValidation.createCourseValidationSchema), CourseControllers.createCorse);

router.get('/', CourseControllers.getAllCourses);

router.get(
    '/:id',
    CourseControllers.getSingleCourse,
);

router.delete(
    '/:id',
    CourseControllers.deleteCourse,
);

router.put("/:courseId/assign-faculties", CourseControllers.assignFacultiesWithCourse)

router.patch(
    '/:id',
    requestValidator(
        CourseValidation.updateCreateCourseValidationSchema,
    ),
    CourseControllers.updateCourse,
);


export const CourseRoute = router;
