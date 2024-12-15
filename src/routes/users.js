const express = require("express");
const { registerUser, loginUser, getProfile, changePassword } = require("../controllers/users");
const router = express.Router();
const auth = require("../middlewares/auth").isValidToken;


router.post("/register", registerUser);

router.post("/login", loginUser);

router.get("/getProfile", auth, getProfile)

router.post("/updatePassword", auth, changePassword)


module.exports = router