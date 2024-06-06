import express from 'express';
import { AdminControllers } from './admin.controllers';
import requestValidator from '../../middlewares/requestValidator';
import { updateAdminValidationSchema } from './admin.validation';

const router = express.Router();

router.get('/', AdminControllers.getAllAdmins);

router.get('/:id', AdminControllers.getSingleAdmin);

router.patch(
    '/:id',
    requestValidator(updateAdminValidationSchema),
    AdminControllers.updateAdmin,
);

router.delete('/:adminId', AdminControllers.deleteAdmin);

export const AdminRoutes = router;