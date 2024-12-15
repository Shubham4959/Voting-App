const jwt = require("jsonwebtoken");
const config = require('../../config/');
const users = require("../models/users");
const { default: mongoose } = require("mongoose");


const isValidToken = async (req, res, next) => {
  if (req.headers.authorization) {
    const token = req.headers.authorization.split(" ")[1];
    try {
      const decode = await jwt.verify(token, config.jwt.secret);

      const userId = decode.userData._id;
      const user = await users.aggregate([

        {
          '$match': {
            '_id': new mongoose.Types.ObjectId(userId)
          }
        }, {
          '$project': {
            'name': 1,
            'email': 1,
            'phoneNumber': 1,
            'role': 1
          }
        }
      ]);
      if (user.length > 0) {
        req["AuthenticateUser"] = user[0];
        next();
      } else {
        return res.status(401).json({
          status: false,
          msg: "Unauthorized! Please login",
        });
      }
    } catch (error) {
      return res.status(401).json({
        status: false,
        msg: "Unauthorized! Please login",
      });
    }
  } else {
    return res.status(401).json({
      status: false,
      msg: "Unauthorized! Please login",
    });
  }
};

const generateToken = (userData) => {
  return jwt.sign({ userData }, config.jwt.secret, { expiresIn: config.jwt.expiresIn });
}


module.exports = {
  isValidToken,
  generateToken
};
