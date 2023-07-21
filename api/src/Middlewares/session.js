const { verifyToken } = require('../utils/jwtHandler')

const checkSession = (req, res, next) => {
	try {
		const authorizationHeader = req.headers.authorization;
		if (!authorizationHeader) {
			return res
				.status(401)
				.json({ error: "No se proporcionó un token de autenticación" });
		}

		const token = authorizationHeader.split(" ")[1];
		if (!token) {
			return res
				.status(401)
				.json({ error: "El token de autenticación es inválido" });
		}

		try {
			const isValidToken = verifyToken(token);
			if (!isValidToken) {
				return res.status(401).json({
					error: "El token de autenticación es inválido o ha expirado",
				});
			}
		} catch (error) {
			return res
				.status(401)
				.json({ error: "El token de autenticación es inválido o ha expirado" });
		}

		next();
	} catch (error) {
		return res.status(500).json({
			error: "Se produjo un error al verificar el token de autenticación",
		});
	}
};

module.exports = {checkSession}
