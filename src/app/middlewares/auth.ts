import { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/catchAsync";
import AppError from "../errors/AppError";
import httpStatus from "http-status";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config";
import { TUserRole } from "../modules/user/user.interface";
import UserModel from "../modules/user/user.schema.model";


const auth = (...requiredRoles: TUserRole[]) => {
    return catchAsync(async (req: Request, res: Response, next: NextFunction) => {

        const token = req.headers.authorization;

        // check the token sended from client or not
        if (!token) {
            throw new AppError(httpStatus.UNAUTHORIZED, "you are not valid user");
        };


        // check the token is valid or not
        // invalid token

        const decoded = jwt.verify(token, config.jwt_access_secret as string) as JwtPayload;

        // checking user is authorized for this access
        const { role, userId, iat } = decoded;

        // checking if the user is exists
        const isUserExists = await UserModel.isUserExistsByCustomId(userId);
        // console.log(isUserExists);

        // isUserExistsByCustomId -> a custom statics function
        if (!isUserExists) {
            throw new AppError(httpStatus.NOT_FOUND, "user not found")
        };

        // checking user softly deleted or not
        const isDeleted = isUserExists?.isDeleted;
        if (isDeleted) {
            throw new AppError(httpStatus.FORBIDDEN, "the is user softly deleted, and not found")
        }

        // check the user is blocked or not
        const userStatus = isUserExists?.status;
        if (userStatus === "blocked") {
            throw new AppError(httpStatus.FORBIDDEN, "User is blocked, and not found")
        }


        if (isUserExists.passwordChangedAt && UserModel.isJWTIssuedBeforePasswordChanged(isUserExists?.passwordChangedAt, iat as number)) {
            throw new AppError(httpStatus.UNAUTHORIZED, "you are not a valid user")
        }


        if (requiredRoles && !requiredRoles.includes(role)) {
            throw new AppError(httpStatus.UNAUTHORIZED, "you are not valid user");
        }

        // decoded undefined 
        req.user = decoded as JwtPayload;
        next();


    });
};

export default auth;