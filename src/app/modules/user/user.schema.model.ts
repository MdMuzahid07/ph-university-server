import { model, Schema } from "mongoose";
import { TUser } from "./user.interface";
import config from "../../config";
import bcrypt from 'bcrypt';


const UserSchema = new Schema<TUser>({
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



// creating user model 

const UserModel = model<TUser>("User", UserSchema);

export default UserModel;
