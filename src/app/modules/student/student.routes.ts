import express from 'express';
import { StudentControllers } from './student.controller';
import requestValidator from '../../middlewares/requestValidator';
import { studentValidations } from './student.validation';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constants';

const router = express.Router();


router.get('/',
    auth(USER_ROLE.admin, USER_ROLE.superAdmin, USER_ROLE.faculty),
    StudentControllers.getAllStudents
);

router.get(
    '/:id',
    auth(USER_ROLE.admin, USER_ROLE.superAdmin, USER_ROLE.faculty),
    StudentControllers.getSingleStudent
);

router.delete('/:id',
    auth(USER_ROLE.admin, USER_ROLE.superAdmin),
    StudentControllers.deleteStudent
);

router.patch(
    '/:id',
    auth(USER_ROLE.admin, USER_ROLE.superAdmin),
    requestValidator(studentValidations.updateStudentValidationSchema),
    StudentControllers.updateStudent
);


export const StudentRoutes = router;
