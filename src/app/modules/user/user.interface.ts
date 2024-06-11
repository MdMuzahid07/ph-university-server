/* eslint-disable no-unused-vars */
import { Model } from "mongoose";
import { USER_ROLE } from "./user.constants";

export interface TUser {
    id: string,
    password: string,
    needsPasswordChange: boolean,
    passwordChangedAt?: Date,
    role: "admin" | "student" | "faculty",
    status: "in-progress" | "blocked",
    isDeleted: boolean,
};



export interface UserModelStatics extends Model<TUser> {
    // myStaticMethod(): number;

    isUserExistsByCustomId(id: string): Promise<TUser>;
    isPasswordMatched(plainTextPassword: string, hashedPassword: string): Promise<boolean>;
    isJWTIssuedBeforePasswordChanged(passwordChangedTimeStamp: Date, jwtIssuedTimeStamp: number): boolean
};


export type TUserRole = keyof typeof USER_ROLE;
