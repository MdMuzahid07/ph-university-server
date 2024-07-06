import express from 'express';
import { AcademicFacultyControllers } from './academic.faculty.controller';
import requestValidator from '../../middlewares/requestValidator';
import { AcademicFacultyValidation } from './academic.faculty.validation';
import { USER_ROLE } from '../user/user.constants';
import auth from '../../middlewares/auth';

const router = express.Router();

router.post("/create-academic-faculty",
    auth(USER_ROLE.superAdmin, USER_ROLE.admin),
    requestValidator(AcademicFacultyValidation.CreateAcademicFacultyValidationSchema), AcademicFacultyControllers.createAcademicFaculty
);

router.get('/', AcademicFacultyControllers.getAllAcademicFaculties);

router.get(
    '/:facultyId',
    AcademicFacultyControllers.getSingleAcademicFaculty,
);

router.patch(
    '/:facultyId',
    requestValidator(
        AcademicFacultyValidation.UpdateAcademicFacultyValidationSchema,
    ),
    AcademicFacultyControllers.updateAcademicFaculty,
);


export const AcademicFacultyRoutes = router;
