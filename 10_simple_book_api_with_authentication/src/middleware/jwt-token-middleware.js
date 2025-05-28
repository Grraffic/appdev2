const jsonwebtoken = require("jsonwebtoken");

const TOKEN_SECRET = process.env.TOKEN_SECRET;

const generateAccesstoke = (username) => {
    return jwt.sign(user)
}