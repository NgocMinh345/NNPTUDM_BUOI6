let userModel = require('../schemas/users')
let bcrypt = require('bcrypt')
module.exports = {
    CreateAnUser: async function (username, password, email, role,
        avatarUrl, fullName, status, loginCount
    ) {
        let newUser = new userModel({
            username: username,
            password: password,
            email: email,
            role: role,
            avatarUrl: avatarUrl,
            fullName: fullName,
            status: status,
            loginCount: loginCount
        })
        await newUser.save();
        return newUser;
    },
    QueryByUserNameAndPassword: async function (username, password) {
        let getUser = await userModel.findOne({ username: username });
        if (!getUser) {
            return false;
        }
        return getUser;
    },
    FindUserById: async function (id) {
        return await userModel.findOne({
            _id: id,
            isDeleted:false
        }).populate('role')
    },
    ChangePassword: async function (userId, oldPassword, newPassword) {
        try {
            let user = await userModel.findOne({ _id: userId, isDeleted: false });
            if (!user) {
                return { success: false, message: "Không tìm thấy người dùng" };
            }
            
            // Kiểm tra mật khẩu cũ
            let isPasswordValid = bcrypt.compareSync(oldPassword, user.password);
            if (!isPasswordValid) {
                return { success: false, message: "Mật khẩu cũ không chính xác" };
            }
            
            // Cập nhật mật khẩu mới (schema sẽ tự động hash khi save)
            user.password = newPassword;
            await user.save();
            
            return { success: true, message: "Đổi mật khẩu thành công" };
        } catch (error) {
            return { success: false, message: error.message };
        }
    }
}