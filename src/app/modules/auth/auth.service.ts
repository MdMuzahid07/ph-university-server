import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import UserModel from "../user/user.schema.model";
import { TLoginUser } from "./auth.interface";
import bcrypt from "bcrypt";

const loginUser = async (payload: TLoginUser) => {

    // checking if the user is exists

    const isUserExists = await UserModel.isUserExistsByCustomId(payload?.id);
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

    // checking the password is correct, by comparing hash password(bycript) with use given password


    if (!await UserModel.isPasswordMatched(payload?.password, isUserExists?.password as string)) {
        throw new AppError(httpStatus.FORBIDDEN, "password is incorrect");
    };


    // access granted: send access token, refresh token



    console.log(payload, "++++++++++++++++++");
};


export const AuthServices = {
    loginUser
};