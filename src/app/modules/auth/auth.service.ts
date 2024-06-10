import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import UserModel from "../user/user.schema.model";
import { TLoginUser } from "./auth.interface";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../../config";
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


    // create token and sent to the client(user)

    const jwtPayload = {
        userId: isUserExists?.id,
        role: isUserExists?.role
    };

    const accessToken = jwt.sign(jwtPayload, config.jwt_access_secret as string, { expiresIn: "10d" });


    return {
        accessToken,
        needPasswordChange: isUserExists?.needsPasswordChange
    }
};



const changePassword = async (userData: JwtPayload, payload: { oldPassword: string, newPassword: string }) => {

    // checking if the user is exists
    const isUserExists2 = await UserModel.isUserExistsByCustomId(userData?.userId);
    // console.log(isUserExists);

    // isUserExistsByCustomId -> a custom statics function
    if (!isUserExists2) {
        throw new AppError(httpStatus.NOT_FOUND, "user not found")
    };

    // checking user softly deleted or not
    const isDeleted = isUserExists2?.isDeleted;
    if (isDeleted) {
        throw new AppError(httpStatus.FORBIDDEN, "the is user softly deleted, and not found")
    }

    // check the user is blocked or not
    const userStatus = isUserExists2?.status;
    if (userStatus === "blocked") {
        throw new AppError(httpStatus.FORBIDDEN, "User is blocked, and not found")
    }

    // checking the password is correct, by comparing hash password(bycript) with use given password
    if (!await UserModel.isPasswordMatched(payload?.oldPassword, isUserExists2?.password as string)) {
        throw new AppError(httpStatus.FORBIDDEN, "password is incorrect");
    };

    // hash new password

    const newHashedPassword = await bcrypt.hash(payload?.newPassword, Number(config.bcrypt_salt_round));



    await UserModel.findOneAndUpdate({ id: userData?.userId, role: userData?.role }, {
        password: newHashedPassword,
        needsPasswordChange: false,
        passwordChangedAt: new Date()
    });

    // after update password not need to return data, just return null
    return null;
};


export const AuthServices = {
    loginUser,
    changePassword
};