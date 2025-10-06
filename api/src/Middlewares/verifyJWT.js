const jwt = require("jsonwebtoken");
require("dotenv").config();

const verifyJWT = (req, res, next) => {
  //////unprotected routes//////
  const unprotectedRoutes = ["/logUser", "/refresh", "/logout"];
  if (unprotectedRoutes.includes(req.url)) {
    next();
    return;
  }
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader?.startsWith("Bearer ")) return res.sendStatus(401);
  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ error: "token is invalid" });
    req.userId = decoded.id;
    req.userRole = decoded.tipo;
    req.companyId = decoded.companyId;
    req.roleId = decoded.roleId;
    next();
  });
};

module.exports = verifyJWT;
