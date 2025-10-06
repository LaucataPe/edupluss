const { sign, verify } = require("jsonwebtoken");
const crypto = require("crypto");

const JWT_SECRET = process.env.JWT_SECRET || "token-random";

const generateAccessToken = (user) => {
  // Only include essential data in token payload
  const payload = {
    id: user.id,
    tipo: user.tipo,
    companyId: user.companyId,
    roleId: user.roleId
  };
  return sign(payload, JWT_SECRET, { expiresIn: "15m" });
};

const generateRefreshToken = () => {
  // Generate a secure random token
  return crypto.randomBytes(64).toString('hex');
};

const verifyToken = (jwt) => {
  const isUser = verify(jwt, JWT_SECRET);
  return isUser;
};

// Legacy support - deprecated
const generateToken = async (user) => {
  return generateAccessToken(user);
};

module.exports = {
  generateToken,
  generateAccessToken,
  generateRefreshToken,
  verifyToken
};
