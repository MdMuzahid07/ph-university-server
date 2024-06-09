import express from "express";
import requestValidator from "../../middlewares/requestValidator";
import { AuthValidation } from "./auth.validation";
import { AuthController } from "./auth.controller";


const router = express.Router();

router.post(
    "/login",
    requestValidator(AuthValidation.loginValidationSchema),
    AuthController.loginUser
);


export const AuthRoutes = router;