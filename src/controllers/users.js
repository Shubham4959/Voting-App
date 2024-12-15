const bcrypt = require('bcrypt');
const { sendResponse } = require("../helpers/handleResponse");
const { generateToken } = require("../middlewares/auth");
const users = require("../models/users")

const registerUser = async (req, res) => {
    try {
        const hash = bcrypt.hashSync(req.body.password, 10);

        const checkAdmin = await users.findOne({ role: "admin" });
        if (checkAdmin) {
            return sendResponse(res, 400, false, "admin already exist");
        }
        const newUser = await users.create(req.body);
        if (newUser) {
            await users.updateOne({ _id: newUser._id }, { $set: { password: hash } })
            return sendResponse(res, 200, true, "user added succesfully");
        }

        sendResponse(res, 400, false, "failed to add new user");
    } catch (error) {
        if (error.name === "ValidationError") {
            return sendResponse(res, 400, false, error.message);
        }
        console.log(error)
        sendResponse(res, 500, false, "Internal server error.");
    }

}

const loginUser = async (req, res) => {
    try {
        const { aadharCardNumber, password } = req.body;
        const checkUser = await users.findOne({ aadharCardNumber: aadharCardNumber });
        if (!checkUser) {
            return sendResponse(res, 400, false, "wrong credetials")
        }
        const matchHash = bcrypt.compareSync(password, checkUser.password)
        if (!matchHash) {
            return sendResponse(res, 400, false, "wrong credetials")
        }

        const token = generateToken(checkUser);
        return sendResponse(res, 200, true, "Login succesfull", { ...checkUser.toObject(), token });
    } catch (error) {
        console.log('error', error)
        if (error.name === "ValidationError") {
            return sendResponse(res, 400, false, error.message);
        }
        sendResponse(res, 500, false, "Internal server error.");
    }

}

const getProfile = async (req, res) => {
    try {
        const user = req["AuthenticateUser"]
        const checkUser = await users.findById(user._id);
        if (checkUser) {
            return sendResponse(res, 200, true, "user profile found", checkUser);
        }
        sendResponse(res, 400, false, "failed to get profile")
    } catch (error) {
        if (error.name === "ValidationError") {
            return sendResponse(res, 400, false, error.message);
        }
        sendResponse(res, 500, false, "Internal server error.");
    }

}

const changePassword = async (req, res) => {
    try {
        const user = req["AuthenticateUser"];
        const { currentPassword, newPassword } = req.body;
        const checkUser = await users.findById(user._id);
        if (checkUser.password === currentPassword) {
            await users.updateOne({ _id: user._id }, { $set: { password: newPassword } })
            return sendResponse(res, 200, true, "password updated succesfully");
        }
        sendResponse(res, 400, false, "wrong current password")
    } catch (error) {
        if (error.name === "ValidationError") {
            return sendResponse(res, 400, false, error.message);
        }
        sendResponse(res, 500, false, "Internal server error.");
    }

}




module.exports = { registerUser, loginUser, getProfile, changePassword }