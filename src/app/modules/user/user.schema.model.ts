import { model, Schema } from "mongoose";
import { TUser, UserModelStatics } from "./user.interface";
import config from "../../config";
import bcrypt from 'bcrypt';


const UserSchema = new Schema<TUser, UserModelStatics>({
    id: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    needsPasswordChange: {
        type: Boolean,
        default: true
    },
    role: {
        type: String,
        enum: ["admin", "student", "faculty"]
    },
    status: {
        type: String,
        enum: ["in-progress", "blocked"],
        default: "in-progress"
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
},
    {
        timestamps: true
    }
);




UserSchema.pre("save", async function (next) {
    // pre hook will save the data
    const user = this;

    user.password = await bcrypt.hash(user.password, Number(config.bcrypt_salt_round));

    next();
});

// set empty string " " after saving password to DB
UserSchema.post("save", function (doc, next) {
    doc.password = " ";
    next();
});


UserSchema.statics.isUserExistsByCustomId = async function (id: string) {
    return await UserModel.findOne({ id });
};


UserSchema.statics.isPasswordMatched = async function (plainTextPassword, hashedPassword) {
    return await bcrypt.compare(plainTextPassword, hashedPassword);
};





// creating user model 

const UserModel = model<TUser, UserModelStatics>("User", UserSchema);

export default UserModel;
