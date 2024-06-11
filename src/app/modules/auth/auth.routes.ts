import express from "express";
import requestValidator from "../../middlewares/requestValidator";
import { AuthValidation } from "./auth.validation";
import { AuthController } from "./auth.controller";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../user/user.constants";


const router = express.Router();

router.post(
    "/login",
    requestValidator(AuthValidation.loginValidationSchema),
    AuthController.loginUser
);


router.post(
    "/change-password",
    auth(USER_ROLE.student, USER_ROLE.admin, USER_ROLE.faculty)
    ,
    requestValidator(AuthValidation.changePasswordValidationSchema),
    AuthController.changePassword
);


router.post(
    "/refresh-token",
    requestValidator(AuthValidation.refreshTokenValidationSchema),
    AuthController.refreshToken
);



export const AuthRoutes = router;