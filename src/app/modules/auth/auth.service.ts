import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import UserModel from "../user/user.schema.model";
import { TLoginUser } from "./auth.interface";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../../config";
import bcrypt from "bcrypt";
import { createToken } from "./auth.utils";

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

    const accessToken = createToken(jwtPayload, config.jwt_access_secret as string, config.jwt_access_expires_in as string);
    const refreshToken = createToken(jwtPayload, config.jwt_refresh_secret as string, config.jwt_refresh_expires_in as string);


    return {
        accessToken,
        refreshToken,
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



    // checking the password is correct, by comparing hash password(bcryipt) with use given password
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


const refreshToken = async (token: string) => {

    // check the token is valid or not
    // invalid token

    const decoded = jwt.verify(token, config.jwt_refresh_secret as string) as JwtPayload;

    // checking user is authorized for this access
    const { userId, iat } = decoded;

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


    // create new token

    const jwtPayload = {
        userId: isUserExists?.id,
        role: isUserExists?.role
    };

    const accessToken = createToken(jwtPayload, config.jwt_access_secret as string, config.jwt_access_expires_in as string);

    return {
        accessToken
    };
};


export const AuthServices = {
    loginUser,
    changePassword,
    refreshToken
};