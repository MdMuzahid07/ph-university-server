import express from 'express';

import requestValidator from '../../middlewares/requestValidator';
import { FacultyControllers } from './faculty.controller';
import { updateFacultyValidationSchema } from './faculty.validation';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constants';

const router = express.Router();

router.get(
    '/:id',
    auth(USER_ROLE.admin, USER_ROLE.superAdmin, USER_ROLE.faculty),
    FacultyControllers.getSingleFaculty
);

router.patch(
    '/:id',
    auth(USER_ROLE.admin, USER_ROLE.superAdmin),
    requestValidator(updateFacultyValidationSchema),
    FacultyControllers.updateFaculty,
);

router.delete(
    '/:id',
    auth(USER_ROLE.admin, USER_ROLE.superAdmin),
    FacultyControllers.deleteFaculty
);

router.get(
    '/',
    auth(USER_ROLE.admin, USER_ROLE.superAdmin, USER_ROLE.faculty),
    FacultyControllers.getAllFaculties
);

export const FacultyRoutes = router;