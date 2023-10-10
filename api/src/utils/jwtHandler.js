const { sign, verify } = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "token-random";

const generateToken = async (user) => {
  const jwt = sign({ user }, JWT_SECRET, { expiresIn: "6h" });
  return jwt;
};

const verifyToken = (jwt) => {
  const isUser = verify(jwt, JWT_SECRET);
  return isUser;
};

// const verifyJWT = (req, res, next) => {
//   const authHeader = req.headers.authorization || req.headers.Authorization;
//   if (!authHeader?.startsWith('Bearer ')) return res.sendStatus(401);
//   const token = authHeader.split(' ')[1];
//   verify(
//       token,
//       process.env.ACCESS_TOKEN_SECRET,
//       (err, decoded) => {
//           if (err) return res.sendStatus(403); //invalid token
//           req.user = decoded.UserInfo.username;
//           req.roles = decoded.UserInfo.roles;
//           next();
//       }
//   );
// }

module.exports = { generateToken, verifyToken };
