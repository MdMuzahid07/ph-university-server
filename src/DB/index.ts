import config from "../app/config"
import { USER_ROLE } from "../app/modules/user/user.constants"
import UserModel from "../app/modules/user/user.schema.model";


const superUser = {
    id: "0001",
    email: "mdmuzahid.dev@gmail.com",
    password: config.super_admin_password,
    needsPasswordChange: false,
    role: USER_ROLE.superAdmin,
    status: "in-progress",
    isDeleted: false,
};



const seedSuperAdmin = async () => {
    const isSuperAdminExists = await UserModel.findOne({ role: USER_ROLE.superAdmin });

    if (!isSuperAdminExists) {
        await UserModel.create(superUser)
    }

};

export default seedSuperAdmin;