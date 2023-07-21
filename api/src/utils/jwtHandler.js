const { sign, verify } = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || "token-random";

const generateToken = async (user) => {
	const jwt = sign({ user }, JWT_SECRET, { expiresIn: "6h" });
	return jwt;
};

const verifyToken = (jwt) => {
	const isUser = verify(jwt, JWT_SECRET);
	return isUser;
};

module.exports = { generateToken, verifyToken };