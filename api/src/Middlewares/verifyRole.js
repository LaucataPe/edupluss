const verifyRoles = (allowedRole) => {
    return (req, res, next) => {
        if (!req?.userRole) return res.sendStatus(401);
        if (req.userRole !== allowedRole) return res.sendStatus(401);
        next();
    }
}
module.exports = verifyRoles