const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyJWT = (req, res, next) => {
    //////unprotected routes//////
    if(req.url === "/logUser"){
    next()
     return
    }
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader?.startsWith('Bearer ')) return res.sendStatus(401);
    const token = authHeader.split(' ')[1];
    jwt.verify(
        token,
        process.env.JWT_SECRET,
        (err, decoded) => {
            if (err) return res.status(403).json({ error: "token is invalid" });
             req.userId = decoded.user.id;
             req.userRole = decoded.user.tipo;
            next();
        }
    );
}

module.exports = verifyJWT